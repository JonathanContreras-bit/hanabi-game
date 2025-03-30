import React, { useState } from "react";
import CardRow from "HanabiGame/components/CardRow";
import PlayersSection from "HanabiGame/components/PlayersSection";
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
  //   "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)",
};
const defaultUnknownCardColor = "grey";
const numberFrequencies = {
  1: 3,
  2: 2,
  3: 2,
  4: 2,
  5: 1,
};
const playWithRainbowInd = false;
const timeTokensNum = 8;
const playerNames = ["Jonny", "Marcel", "Dakota"];
//#endregion

// #region Stateless functions
const createCard = (inpColor, inpNumber, freqI) => {
  return {
    id: `${inpColor}-${inpNumber}-${freqI}`,
    color: inpColor,
    number: inpNumber,
    believedColor: defaultUnknownCardColor,
    believedNumber: 0,
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

const initializePlayedCards = () =>
  Object.values(cardColors).reduce((acc, value) => {
    acc[value] = [];
    return acc;
  }, {});

const initializeDiscardedCards = () =>
  Object.keys(numberFrequencies).reduce((acc, number) => {
    acc[number] = [];
    return acc;
  }, {});

const computeDecision = (
  myCards,
  orderedOtherPlayersCards,
  playedCards,
  discardedCards
) => {
  const believedInformationInHand = myCards.map((card) => {
    let believedCardColor = "";
    let believedCardNumber = "";

    if (card.believedColor !== defaultUnknownCardColor) {
      const { believedColor } = card;
      believedCardColor = believedColor;
    }
    if (card.believedNumber) {
      const { believedNumber } = card;
      believedCardNumber = believedNumber;
    }
    return believedCardColor || believedCardNumber
      ? { believedCardColor, believedCardNumber }
      : {};
  });
  console.log(
    `What do I know about my hand? ${JSON.stringify(believedInformationInHand)}`
  );
};

const throwNotImplementedException = () => {
  throw new Error(
    "NotImplementedException: This functionality is not yet implemented."
  );
};
//#endregion

const Gameboard = () => {
  //#region component state
  const [_allCards, set_allCards] = useState(() => visualizeAllCards());
  const [_debugMode, set_debugMode] = useState(false);
  const [players, setPlayers] = useState(() => initializePlayers(playerNames));
  const [drawStack, setDrawStack] = useState(() =>
    shuffleArray(_allCards.flat())
  );
  const [playerTurn, setPlayerTurn] = useState(-1);
  const [timeTokenCount, setTimeTokensCount] = useState(timeTokensNum);
  const [explosionCount, setExplosionCount] = useState(0);
  const [playedCards, setPlayedCards] = useState(() => initializePlayedCards());
  const [discardedCards, setDiscardedCards] = useState(() =>
    initializeDiscardedCards()
  );
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

  const drawCardForPlayer = (playerIndex) => {
    const [drawnCard] = drawNCards(1);
    setPlayers((prevPlayers) =>
      prevPlayers.map((player, index) => {
        if (index === playerIndex) {
          return { ...player, cards: [...player.cards, drawnCard] };
        }
        return player;
      })
    );
  };

  const playCard = (playerIndex, cardToPlayId) => {
    console.log("confirmed attempted to play card");
    const [[cardToPlay], remainingCards] = extractCardFromPlayer(
      playerIndex,
      cardToPlayId
    );

    const lastNumberInPlayedStack =
      playedCards[cardToPlay.color].length > 0
        ? playedCards[cardToPlay.color].at(-1)
        : 0;
    if (lastNumberInPlayedStack === cardToPlay.number - 1) {
      // PLAY THE CARD
      setPlayedCards((prevPlayedCardsObj) => {
        return {
          ...prevPlayedCardsObj,
          [cardToPlay.color]: [
            ...prevPlayedCardsObj[cardToPlay.color],
            cardToPlay.number,
          ],
        };
      });

      // DROP CARD FROM PLAYER HAND
      setPlayerIndexCards(playerIndex, remainingCards);

      // DRAW NEW CARD FOR PLAYER
      drawCardForPlayer(playerIndex);
    } else {
      // INVALID NON-PLAYABLE CARD :(
      setExplosionCount((prev) => prev + 1);
    }
  };

  const extractCardFromPlayer = (playerIndex, cardToMatchId) => {
    // return type --> [[matchingCard], remainingCardsArray]
    return players[playerIndex].cards.reduce(
      ([match, notMatch], card) => {
        if (card.id === cardToMatchId) {
          match.push(card);
        } else {
          notMatch.push(card);
        }
        return [match, notMatch];
      },
      [[], []] // Initialize the two arrays
    );
  };

  const discardCard = (playerIndex, cardToDiscardId) => {
    const [[cardToDiscard], remainingCards] = extractCardFromPlayer(
      playerIndex,
      cardToDiscardId
    );

    // UPDATE DISCARD PILE
    setDiscardedCards((prevDiscardedObj) => {
      return {
        ...prevDiscardedObj,
        [cardToDiscard.number]: [
          ...prevDiscardedObj[cardToDiscard.number],
          cardToDiscard.color,
        ],
      };
    });

    // DROP CARD FROM PLAYER HAND
    setPlayerIndexCards(playerIndex, remainingCards);

    // DRAW NEW CARD FOR PLAYER
    drawCardForPlayer(playerIndex);
  };

  const setPlayerIndexCards = (playerIndex, playersCards) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player, index) =>
        index === playerIndex ? { ...player, cards: playersCards } : player
      )
    );
  };

  const handleCommunicateInfo = (playerIndex, informationObj) => {
    if (informationObj.hasOwnProperty("color")) {
      setPlayers((prevPlayers) =>
        prevPlayers.map((prevPlayer, index) => {
          if (playerIndex === index) {
            const informedCards = prevPlayer.cards.map((card) =>
              card.color === informationObj.color
                ? { ...card, believedColor: informationObj.color }
                : card
            );
            return { ...prevPlayer, cards: informedCards };
          }
          return prevPlayer;
        })
      );
    } else if (informationObj.hasOwnProperty("number")) {
      setPlayers((prevPlayers) =>
        prevPlayers.map((prevPlayer, index) => {
          if (playerIndex === index) {
            const informedCards = prevPlayer.cards.map((card) =>
              card.number === informationObj.number
                ? { ...card, believedNumber: informationObj.number }
                : card
            );
            return { ...prevPlayer, cards: informedCards };
          }
          return prevPlayer;
        })
      );
    }
  };
  //#endregion

  return (
    <div className={styles.gameboard}>
      <PlayersSection
        players={players}
        playerTurn={playerTurn}
        handlePlayCard={playCard}
        handleDiscardCard={discardCard}
        handleCommunicateInfo={handleCommunicateInfo}
        colors={Object.values(cardColors)}
        numbers={Object.keys(numberFrequencies)}
      />
      <button hidden={playerTurn >= 0} onClick={handleStart}>
        Start
      </button>
      <button
        hidden={playerTurn < 0}
        onClick={() => {
          computeDecision(
            players[playerTurn].cards,
            [...players.slice(playerTurn + 1), ...players.slice(0, playerTurn)],
            playedCards,
            discardedCards
          );
        }}
      >
        Compute Decision
      </button>
      <TimeTokensSection timeTokenCount={timeTokenCount} />
      <ExplosionSection explosionCount={explosionCount} />
      {_debugMode &&
        _allCards.map((stack) => {
          return <CardRow key={stack[0].color} cards={stack} _myturn={false} />;
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
