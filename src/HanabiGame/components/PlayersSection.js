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
  const [informationObj, setInformationObj] = useState({});

  const toggleCommunicatingState = () => {
    setIsCommunicatingInd((prev) => !prev);
  };

  const handleInfoSelection = (informationObject) => {
    setInformationObj(informationObject);
  };

  const handlePlayerSelection = (selectedPlayerIndex) => {
    handleCommunicateInfo(selectedPlayerIndex, informationObj);
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
          handlePlayerSelection={() => {
            handlePlayerSelection(index);
          }}
          handleInfoSelection={handleInfoSelection}
        />
      ))}
    </div>
  );
};

export default PlayersSection;
