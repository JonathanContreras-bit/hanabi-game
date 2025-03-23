import React from "react";
import styles from "HanabiGame/components/Player.module.css";
import CardRow from "./CardRow";

const Player = ({ name, cards, _myturn }) => {
  return (
    <div className={styles.player}>
      <p style={{ color: _myturn && "red" }}>{name}</p>
      <CardRow cards={cards} _myturn={_myturn} />
      {_myturn && (
        <div className={styles.actions}>
          <button>Play</button>
          <button>Discard</button>
          <button>Communicate</button>
        </div>
      )}
    </div>
  );
};

export default Player;
