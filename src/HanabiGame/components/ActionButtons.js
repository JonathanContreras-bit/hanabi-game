import React from "react";
import styles from "HanabiGame/components/ActionButtons.module.css";

const ActionButtons = ({
  choosingCardInd,
  isCommunicatingInd,
  togglePlayingState,
  toggleDiscardingState,
  toggleCommunicatingState,
  colors,
  numbers,
  handleInfoSelection,
}) => {
  if (!(choosingCardInd || isCommunicatingInd)) {
    return (
      <div className={styles.actions}>
        <button onClick={togglePlayingState}>Play</button>
        <button onClick={toggleDiscardingState}>Discard</button>
        <button onClick={toggleCommunicatingState}>Communicate</button>
      </div>
    );
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
