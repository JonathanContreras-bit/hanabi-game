import React from "react";
import styles from "HanabiGame/components/Player.module.css";
import CardRow from "./CardRow";

const Player = ({ name, cards, _myturn }) => {
  return (
    <div className={styles.player}>
      <p style={{ color: _myturn && "red" }}>{name}</p>
      <CardRow cards={cards} _myturn={_myturn} />
    </div>
  );
};

export default Player;
