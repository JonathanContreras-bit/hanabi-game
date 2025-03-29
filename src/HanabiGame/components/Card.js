import React from "react";
import styles from "HanabiGame/components/Card.module.css";

const Card = ({ color, number, inActionInd }) => {
  return (
    <div
      className={inActionInd ? styles.actionableCard : styles.card}
      style={{ background: `${color}` }}
    >
      {number}
    </div>
  );
};

export default Card;
