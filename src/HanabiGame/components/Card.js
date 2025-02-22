import React from "react";
import styles from "HanabiGame/components/Card.module.css";

const Card = ({ color, number }) => {
  return (
    <div className={styles.card} style={{ background: `${color}` }}>
      {number}
    </div>
  );
};

export default Card;
