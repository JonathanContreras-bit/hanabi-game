import React from "react";
import styles from "HanabiGame/components/PlayersSection.module.css";
import Player from "HanabiGame/components/Player";

const PlayersSection = ({ players, playerTurn }) => {
  return (
    <div className={styles.playersSection}>
      {players.map((player, index) => (
        <Player
          key={player.name}
          name={player.name}
          cards={player.cards}
          _myturn={playerTurn === index}
        />
      ))}
    </div>
  );
};

export default PlayersSection;
