import React from "react";
import Card from "HanabiGame/components/Card";
import CardRow from "./CardRow";

// GAME CONFIGS
const cardColors = {
  RED: "RED",
  YELLOW: "YELLOW",
  GREEN: "GREEN",
  BLUE: "BLUE",
  WHITE: "WHITE",
};
const highestCardNumber = 5;
const playWithRainbowInd = false;

const allCards = Object.values(cardColors).map((color) => {
  const colorCardStack = [];
  for (let i = 1; i <= highestCardNumber; i++) {
    colorCardStack.push({ color: color, number: i });
  }
  return colorCardStack;
});

const organizedCards = { ...cardColors };
Object.keys(organizedCards).forEach((cardColor) => {
  organizedCards[cardColor] = Array.from(
    { length: highestCardNumber },
    (_, i) => i + 1
  );
});

const Gameboard = () => {
  return allCards.map((stack) => {
    return <CardRow cards={stack} />;
  });
};

export default Gameboard;
