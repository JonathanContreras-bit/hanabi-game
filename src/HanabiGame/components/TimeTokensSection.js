import React from "react";
import timeToken from "HanabiGame/assets/timeToken.png";
import styles from "HanabiGame/components/TimeTokensSection.module.css";

const TimeTokensSection = ({ timeTokenCount }) => {
  let images = Array.from({ length: timeTokenCount }).map((_, index) => {
    return (
      <img
        key={index}
        className={styles.timeToken}
        src={timeToken}
        alt="token image"
      />
    );
  });
  return <div className={styles.section}>{images}</div>;
};

export default TimeTokensSection;
