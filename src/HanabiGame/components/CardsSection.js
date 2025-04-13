import React from "react";
import styles from "HanabiGame/components/CardsSection.module.css";
import CardRow from "HanabiGame/components/CardRow";

// Section Types
// 0 --> played cards
// 1 --> discarded cards

const getSectionHeader = (sectionType) => {
  switch (sectionType) {
    case 0:
      return "Played Cards";
    case 1:
      return "Discarded Cards";
    default:
      return "";
  }
};

const CardsSection = ({ playedCardsStacks, sectionType }) => {
  return (
    <div className={styles.playSection}>
      {getSectionHeader(sectionType)}
      {playedCardsStacks.map((colorStack) => (
        <CardRow key={colorStack[0].color} cards={colorStack} />
      ))}
    </div>
  );
};

export default CardsSection;
