import React, { useState } from "react";
import CardRow from "HanabiGame/components/CardRow";
import PlayersSection from "HanabiGame/components/PlayersSection";
import styles from "HanabiGame/components/Gameboard.module.css";
import TimeTokensSection from "HanabiGame/components/TimeTokensSection";
import ExplosionSection from "HanabiGame/components/ExplosionSection";
import CardsSection from "HanabiGame/components/CardsSection";

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
const defaultUnknownCardColor = ""; // TODO: remove this, not useful
const numberFrequencies = {
  1: 3,
  2: 2,
  3: 2,
  4: 2,
  5: 1,
};
const numbers = Object.keys(numberFrequencies).map((numStr) =>
  parseInt(numStr)
);
numbers.sort();
const playWithRainbowInd = false;
const timeTokensNum = 8;
const playerNames = ["Jonny", "Marcel", "Dakota"];
//#endregion

// #region Stateless functions/constants
const maxNumber = numbers.at(-1);
const failingIndex = -1;

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
    numbers.forEach((number) => {
      const numberFrequency = numberFrequencies[number];
      for (let i = 1; i <= numberFrequency; i++) {
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

const getPopulatedStacks = (nestedStacks) =>
  nestedStacks.filter((stack) => stack.length);

const getImmediatelyPlayableNumbers = (playedCards) => {
  const nextPlayableNumbers = Object.values(playedCards).map((colorStack) =>
    colorStack.length ? colorStack.at(-1).number + 1 : 1
  );
  return nextPlayableNumbers;
};

const communicateIdk = () => {
  console.log("I don't know what to do here...");
};

const getLongestNestedArrayIndex = (twoDimArr) => {
  const nestedArrLengths = twoDimArr.map((nestedArr) => nestedArr.length);
  let maxLength = failingIndex;
  nestedArrLengths.forEach((nestedArrLength) => {
    if (nestedArrLength && nestedArrLength > maxLength) {
      maxLength = nestedArrLength;
    }
  });

  // if (maxLength !== failingIndex) {
  return nestedArrLengths.findIndex((length) => length === maxLength);
  // }
};

const cardsLogicallyEqual = (card1, card2) => {
  return card1.color === card2.color && card1.number === card2.number;
};

const getNonConflictingCardProperty = (
  cardStack,
  allCardsInPlayerHand,
  property
) => {
  return cardStack
    .map((card) => card[property])
    .find((prop) =>
      allCardsInPlayerHand
        .filter((card) => card[property] === prop)
        .every((matchingPropCardInHand) =>
          cardStack.some((card) =>
            cardsLogicallyEqual(card, matchingPropCardInHand)
          )
        )
    );
};

const getSensibleInfoToShare = (
  unknownPlayableCardsInPlayerHand,
  allCardsInPlayerHand
) => {
  const nonConflictingPlayableNumber = getNonConflictingCardProperty(
    unknownPlayableCardsInPlayerHand,
    allCardsInPlayerHand,
    "number"
  );
  if (nonConflictingPlayableNumber) {
    return nonConflictingPlayableNumber;
  } else {
    const nonConflictingPlayableColor = getNonConflictingCardProperty(
      unknownPlayableCardsInPlayerHand,
      allCardsInPlayerHand,
      "color"
    );
    if (nonConflictingPlayableColor) {
      return nonConflictingPlayableColor;
    }
  }
  return unknownPlayableCardsInPlayerHand[0].number;
};

const computeDecision = (
  myCards,
  orderedOtherPlayers,
  playedCards,
  discardedCards
) => {
  const myBelievedNumbers = myCards
    .filter((card) => card.believedNumber)
    .map((card) => card.believedNumber);

  if (myBelievedNumbers.length) {
    const immediatelyPlayableNumbers = getImmediatelyPlayableNumbers(
      playedCards
    );

    const somePlayableNumber = myBelievedNumbers.find((myNum) =>
      immediatelyPlayableNumbers.some(
        (immediatelyPlayableNumber) => immediatelyPlayableNumber === myNum
      )
    );

    if (somePlayableNumber) {
      console.log(`I should play any ${somePlayableNumber} that I have`);
    } else {
      communicateIdk();
    }
  } else {
    const orderedOtherPlayersPlayableUnknownCards = orderedOtherPlayers.map(
      (otherPlayer) => {
        return otherPlayer.cards
          .filter((card) => {
            if (playedCards[card.color].length) {
              return playedCards[card.color].at(-1).number === card.number - 1;
            } else {
              return card.number === 1;
            }
          })
          .filter((card) => !(card.believedNumber || card.believedColor));
      }
    );

    const indexOfOtherPlayerWithMostPlayableCards = getLongestNestedArrayIndex(
      orderedOtherPlayersPlayableUnknownCards
    );

    if (indexOfOtherPlayerWithMostPlayableCards !== failingIndex) {
      console.log(
        `I'm going to tell ${
          orderedOtherPlayers[indexOfOtherPlayerWithMostPlayableCards].name
        } about their ${getSensibleInfoToShare(
          orderedOtherPlayersPlayableUnknownCards[
            indexOfOtherPlayerWithMostPlayableCards
          ],
          orderedOtherPlayers[indexOfOtherPlayerWithMostPlayableCards].cards
        )}s`
      );
    } else {
      communicateIdk();
    }
  }
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

  const decrementTimeTokens = () => {
    setTimeTokensCount((prev) => prev - 1);
  };

  const incrementTimeTokens = () => {
    setTimeTokensCount((prev) => (prev === timeTokensNum ? prev : prev + 1));
  };

  const nextPlayerTurn = () => {
    setPlayerTurn((prev) => (prev === players.length - 1 ? 0 : prev + 1));
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
    const [[cardToPlay], remainingCards] = extractCardFromPlayer(
      playerIndex,
      cardToPlayId
    );

    const lastNumberInPlayedStack =
      playedCards[cardToPlay.color].length > 0
        ? playedCards[cardToPlay.color].at(-1).number
        : 0;
    if (lastNumberInPlayedStack === cardToPlay.number - 1) {
      // PLAY THE CARD
      setPlayedCards((prevPlayedCardsObj) => {
        return {
          ...prevPlayedCardsObj,
          [cardToPlay.color]: [
            ...prevPlayedCardsObj[cardToPlay.color],
            cardToPlay,
          ],
        };
      });

      // DROP CARD FROM PLAYER HAND
      setPlayerIndexCards(playerIndex, remainingCards);

      // DRAW NEW CARD FOR PLAYER
      drawCardForPlayer(playerIndex);

      if (cardToPlay.number === maxNumber) {
        incrementTimeTokens();
      }
    } else {
      // INVALID NON-PLAYABLE CARD :(
      setExplosionCount((prev) => prev + 1);
    }
    nextPlayerTurn();
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
          cardToDiscard,
        ],
      };
    });

    // DROP CARD FROM PLAYER HAND
    setPlayerIndexCards(playerIndex, remainingCards);

    // DRAW NEW CARD FOR PLAYER
    drawCardForPlayer(playerIndex);

    incrementTimeTokens();
    nextPlayerTurn();
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
    decrementTimeTokens();
    nextPlayerTurn();
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
        numbers={Object.keys(numberFrequencies).map((numStr) =>
          parseInt(numStr)
        )}
        timeTokenCount={timeTokenCount}
      />
      <button hidden={playerTurn >= 0} onClick={handleStart}>
        Start
      </button>
      <CardsSection
        playedCardsStacks={getPopulatedStacks(Object.values(playedCards))}
        sectionType={0}
      />
      <CardsSection
        playedCardsStacks={getPopulatedStacks(Object.values(discardedCards))}
        sectionType={1}
      />
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
        getPopulatedStacks(_allCards).map((stack) => {
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
