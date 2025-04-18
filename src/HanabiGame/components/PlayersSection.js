import React, { useState } from "react";
import styles from "HanabiGame/components/PlayersSection.module.css";
import Player from "HanabiGame/components/Player";

const PlayersSection = ({
  players,
  playerTurn,
  handlePlayCard,
  handleDiscardCard,
  handleCommunicateInfo,
  colors,
  numbers,
}) => {
  const [isCommunicatingInd, setIsCommunicatingInd] = useState(false);

  const toggleCommunicatingState = () => {
    setIsCommunicatingInd((prev) => !prev);
  };

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
          isCommunicatingInd={isCommunicatingInd}
          toggleCommunicatingState={toggleCommunicatingState}
          colors={colors}
          numbers={numbers}
          handleInfoSelection={(informationObj) => {
            handleCommunicateInfo(index, informationObj);
            toggleCommunicatingState();
          }}
        />
      ))}
    </div>
  );
};

export default PlayersSection;
