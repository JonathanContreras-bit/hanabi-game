import React, { useState } from "react";
import CardRow from "HanabiGame/components/CardRow";
import Player from "HanabiGame/components/Player";
import styles from "HanabiGame/components/Gameboard.module.css";
import TimeTokensSection from "HanabiGame/components/TimeTokensSection";
import ExplosionSection from "HanabiGame/components/ExplosionSection";

// #region GAME CONFIGS
const cardColors = {
  RED: "RED",
  YELLOW: "YELLOW",
  GREEN: "GREEN",
  BLUE: "BLUE",
  WHITE: "WHITE",
  // RAINBOW:
  // "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)",
};
const numberFrequencies = {
  1: 3,
  2: 2,
  3: 2,
  4: 2,
  5: 1,
};
const playWithRainbowInd = false;
const timeTokensNum = 8;
const playerNames = ["Jonny", "Marcel", "Elisa"];
//#endregion

// #region Stateless functions
const createCard = (inpColor, inpNumber, freqI) => {
  return {
    id: `${inpColor}-${inpNumber}-${freqI}`,
    color: inpColor,
    number: inpNumber,
  };
};
const createPlayer = (inpName, inpCards) => {
  return { name: inpName, cards: inpCards };
};

const visualizeAllCards = () =>
  Object.values(cardColors).map((color) => {
    const colorCardStack = [];
    Object.entries(numberFrequencies).forEach(([number, frequency]) => {
      for (let i = 1; i <= frequency; i++) {
        colorCardStack.push(createCard(color, number, i));
      }
    });
    return colorCardStack;
  });

const initializePlayers = (inpPlayerNames) =>
  inpPlayerNames.map((name) => createPlayer(name, []));

const shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
    [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
  }
  return arr;
};
//#endregion

const Gameboard = () => {
  //#region component state
  const [_allCards, set_allCards] = useState(visualizeAllCards());
  const [_debugMode, set_debugMode] = useState(false);
  const [players, setPlayers] = useState(initializePlayers(playerNames));
  const [drawStack, setDrawStack] = useState(shuffleArray(_allCards.flat()));
  const [playerTurn, setPlayerTurn] = useState(-1);
  const [timeTokenCount, setTimeTokensCount] = useState(timeTokensNum);
  const [explosionCount, setExplosionCount] = useState(0);
  //#endregion

  //#region state-changing helper functions
  const drawNCards = (n) => {
    const widthdrawnCards = drawStack.slice(-n);
    // remove from DrawStack
    setDrawStack((prevDrawStack) => prevDrawStack.slice(0, -n));
    // remove from temp visual aid
    set_allCards((prev) =>
      prev.map((prevStack) =>
        prevStack.filter(
          (card) =>
            !widthdrawnCards.some(
              (widthdrawnCard) => widthdrawnCard.id === card.id
            )
        )
      )
    );
    return widthdrawnCards;
  };

  const nextPlayerTurn = () => {
    setPlayerTurn((prev) => (prev % 3) + 1);
  };

  const handleStart = () => {
    const cardsPerPlayer = players.length < 4 ? 5 : 4;

    const drawnCards = drawNCards(players.length * cardsPerPlayer);
    setPlayers((prevPlayers) => {
      let i = 0;
      return prevPlayers.map((prevPlayer) => {
        return {
          ...prevPlayer,
          cards: drawnCards.slice(i, (i += cardsPerPlayer)),
        };
      });
    });
    nextPlayerTurn();
  };
  //#endregion

  return (
    <div>
      <div className={styles.playersSection}>
        {players.map((player, index) => (
          <Player
            name={player.name}
            cards={player.cards}
            _myturn={playerTurn === index}
          />
        ))}
      </div>
      <button hidden={playerTurn >= 0} onClick={handleStart}>
        Start
      </button>
      <TimeTokensSection timeTokenCount={timeTokenCount} />
      <ExplosionSection explosionCount={explosionCount} />
      {_debugMode &&
        _allCards.map((stack) => {
          return <CardRow cards={stack} />;
        })}
      <button
        onClick={() => {
          set_debugMode((prev) => !prev);
        }}
      >
        Toggle Debug Mode
      </button>
    </div>
  );
};

export default Gameboard;
