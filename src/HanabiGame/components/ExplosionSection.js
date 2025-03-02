import React from "react";
import explosion from "HanabiGame/assets/explosion.png";
import styles from "HanabiGame/components/TimeTokensSection.module.css";

const Explosion = ({ explosionCount }) => {
  let images = Array.from({ length: explosionCount }).map((_) => {
    return (
      <img className={styles.timeToken} src={explosion} alt="token image" />
    );
  });
  return <div className={styles.section}>{images}</div>;
};

export default Explosion;
