import React from "react";
import styles from "HanabiGame/components/Card.module.css";

const Card = ({
  color,
  number,
  choosingCardInd,
  handleSelectCard,
  annotations,
}) => {
  return (
    <div
      className={choosingCardInd ? styles.actionableCard : styles.card}
      style={{ background: `${color}` }}
      onClick={handleSelectCard}
    >
      {number}
      <p>{annotations}</p>
    </div>
  );
};

export default Card;
