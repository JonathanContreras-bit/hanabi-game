import React from "react";
import styles from "HanabiGame/components/PlayersSection.module.css";
import Player from "HanabiGame/components/Player";

const PlayersSection = ({
  players,
  playerTurn,
  handlePlayCard,
  handleDiscardCard,
}) => {
  return (
    <div className={styles.playersSection}>
      {players.map((player, index) => (
        <Player
          key={player.name}
          name={player.name}
          cards={player.cards}
          _myturn={playerTurn === index}
          handlePlayCard={(cardId) => {
            handlePlayCard(index, cardId);
          }}
          handleDiscardCard={(cardId) => {
            handleDiscardCard(index, cardId);
          }}
        />
      ))}
    </div>
  );
};

export default PlayersSection;
