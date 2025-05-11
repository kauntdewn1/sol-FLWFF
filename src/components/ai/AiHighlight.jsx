import React from "react";
import classNames from "classnames";
import Image from "next/image";
import Button from "../shared/Button";
import styles from "./AiHighlight.module.scss";

const AiHighlight = ({ title, description, image }) => {
  return (
    <section className={styles.highlight}>
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
      </div>
      {image && (
        <div className={styles.image}>
          <img src={image} alt={title} />
        </div>
      )}
    </section>
  );
};

export default AiHighlight;
