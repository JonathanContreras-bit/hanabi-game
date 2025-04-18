import React from "react";
import styles from "HanabiGame/components/ActionButtons.module.css";

const ActionButtons = ({
  _myturn,
  isPlayingInd,
  isDiscardingInd,
  isCommunicatingInd,
  togglePlayingState,
  toggleDiscardingState,
  toggleCommunicatingState,
  colors,
  numbers,
  handleInfoSelection,
  timeTokenCount,
}) => {
  const choosingCardInd = isPlayingInd || isDiscardingInd;

  const handleBackButton = () => {
    if (isPlayingInd) {
      togglePlayingState();
    } else if (isDiscardingInd) {
      toggleDiscardingState();
    } else if (isCommunicatingInd) {
      toggleCommunicatingState();
    }
  };

  if (_myturn) {
    if (!(choosingCardInd || isCommunicatingInd)) {
      return (
        <div className={styles.actions}>
          <button onClick={togglePlayingState}>Play</button>
          <button onClick={toggleDiscardingState}>Discard</button>
          {timeTokenCount > 0 && (
            <button onClick={toggleCommunicatingState}>Communicate</button>
          )}
        </div>
      );
    } else {
      return <button onClick={handleBackButton}>Back</button>;
    }
  }

  if (isCommunicatingInd) {
    return (
      <div className={styles.gridContainer}>
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => {
              handleInfoSelection({ color });
            }}
            style={{ width: "100%" }}
          >
            {color}
          </button>
        ))}
        {numbers.map((number) => (
          <button
            key={number}
            onClick={() => {
              handleInfoSelection({ number });
            }}
            style={{ width: "100%" }}
          >
            {number}
          </button>
        ))}
      </div>
    );
  }
};

export default ActionButtons;
