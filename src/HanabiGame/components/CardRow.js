import React from "react";
import styles from "HanabiGame/components/CardRow.module.css";
import Card from "HanabiGame/components/Card";

const CardRow = ({ cards }) => {
  return (
    <div className={styles.row}>
      {cards.map((card) => (
        <Card color={card.color} number={card.number} />
      ))}
    </div>
  );
};

export default CardRow;
