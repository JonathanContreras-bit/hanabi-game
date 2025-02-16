import React from "react";
import styles from "HanabiGame/components/Player.module.css";
import CardRow from "./CardRow";

const Player = ({ name, cards }) => {
  return (
    <div className={styles.player}>
      <p>{name}</p>
      <CardRow cards={cards} />
    </div>
  );
};

export default Player;
