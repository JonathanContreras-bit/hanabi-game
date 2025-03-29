import React, { useState } from "react";
import styles from "HanabiGame/components/Player.module.css";
import CardRow from "./CardRow";

const Player = ({
  name,
  cards,
  _myturn,
  handlePlayCard,
  handleDiscardCard,
}) => {
  const [isPlayingInd, setIsPlayingInd] = useState(false);
  const [isDiscardingInd, setIsDiscardingInd] = useState(false);

  return (
    <div className={styles.player}>
      <p style={{ color: _myturn && "red" }}>{name}</p>
      <CardRow
        cards={cards}
        _myturn={_myturn}
        inActionInd={isPlayingInd || isDiscardingInd}
        selectCard={(cardId) => {
          if (isPlayingInd) {
            handlePlayCard(cardId);
          } else if (isDiscardingInd) {
            handleDiscardCard(cardId);
          } else {
            console.log("UNSUPPORTED ACTION");
          }
        }}
      />
      {_myturn && (
        <div className={styles.actions}>
          <button
            onClick={() => {
              console.log("select card to play");
            }}
          >
            Play
          </button>
          <button
            onClick={() => {
              console.log("select card to discard");
            }}
          >
            Discard
          </button>
          <button
            onClick={() => {
              console.log("select player to communicate to");
              console.log("select information type to communicate");
            }}
          >
            Communicate
          </button>
        </div>
      )}
    </div>
  );
};

export default Player;
