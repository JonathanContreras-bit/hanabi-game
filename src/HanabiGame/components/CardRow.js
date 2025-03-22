import React from "react";
import styles from "HanabiGame/components/CardRow.module.css";
import Card from "HanabiGame/components/Card";

const CardRow = ({ cards, _myturn }) => {
  return (
    <div className={styles.row}>
      {cards.map((card) => (
        <Card
          key={card.id}
          color={!_myturn ? card.color : card.believedColor}
          number={
            !_myturn
              ? card.number
              : card.believedNumber > 0 && card.believedNumber
          }
        />
      ))}
    </div>
  );
};

export default CardRow;
