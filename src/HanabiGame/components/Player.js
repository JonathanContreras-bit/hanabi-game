import React, { useState } from "react";
import styles from "HanabiGame/components/Player.module.css";
import CardRow from "HanabiGame/components/CardRow";
import ActionButtons from "HanabiGame/components/ActionButtons";

const Player = ({
  name,
  cards,
  _myturn,
  handlePlayCard,
  handleDiscardCard,
  isCommunicatingInd,
  toggleCommunicatingState,
  colors,
  numbers,
  handleInfoSelection,
  timeTokenCount,
}) => {
  const [isPlayingInd, setIsPlayingInd] = useState(false);
  const [isDiscardingInd, setIsDiscardingInd] = useState(false);

  const togglePlayingState = () => {
    setIsPlayingInd((prev) => !prev);
  };

  const toggleDiscardingState = () => {
    setIsDiscardingInd((prev) => !prev);
  };

  const handleSelectCard = (cardId) => {
    if (isPlayingInd) {
      handlePlayCard(cardId);
      togglePlayingState();
    } else if (isDiscardingInd) {
      handleDiscardCard(cardId);
      toggleDiscardingState();
    } else {
      console.log("UNSUPPORTED ACTION");
    }
  };

  const choosingCardInd = isPlayingInd || isDiscardingInd;

  return (
    <div className={styles.player}>
      <p style={{ color: _myturn && "red" }}>{name}</p>
      <CardRow
        cards={cards}
        _myturn={_myturn}
        choosingCardInd={choosingCardInd}
        selectCard={handleSelectCard}
        isDiscardingInd={isDiscardingInd}
      />
      {(_myturn || (!_myturn && isCommunicatingInd)) && (
        <ActionButtons
          _myturn={_myturn}
          isPlayingInd={isPlayingInd}
          isDiscardingInd={isDiscardingInd}
          isCommunicatingInd={isCommunicatingInd}
          togglePlayingState={togglePlayingState}
          toggleDiscardingState={toggleDiscardingState}
          toggleCommunicatingState={toggleCommunicatingState}
          colors={colors}
          numbers={numbers}
          handleInfoSelection={handleInfoSelection}
          timeTokenCount={timeTokenCount}
        />
      )}
    </div>
  );
};

export default Player;
