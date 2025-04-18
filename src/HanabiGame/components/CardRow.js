import React from "react";
import styles from "HanabiGame/components/CardRow.module.css";
import Card from "HanabiGame/components/Card";

const getAnnotations = (believedColor, believedNumber) => {
  const rtnStr = `${believedColor ? "*" : ""}${believedNumber > 0 ? "#" : ""}`;
  return rtnStr;
};

const CardRow = ({
  cards,
  _myturn,
  choosingCardInd,
  selectCard,
  isDiscardingInd,
}) => {
  return (
    <div className={styles.row}>
      {cards.map((card) => (
        <Card
          key={card.id}
          color={
            !_myturn
              ? card.color
              : card.believedColor
              ? card.believedColor
              : "grey"
          }
          number={
            !_myturn
              ? card.number
              : card.believedNumber > 0 && card.believedNumber
          }
          choosingCardInd={choosingCardInd}
          handleSelectCard={() => {
            selectCard(card.id);
          }}
          annotations={
            !_myturn
              ? getAnnotations(card.believedColor, card.believedNumber)
              : ""
          }
        />
      ))}
    </div>
  );
};

export default CardRow;
