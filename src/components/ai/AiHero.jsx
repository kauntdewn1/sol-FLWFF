import React from "react";
import styles from "./AiHero.module.scss";
import { Trans } from "react-i18next";
import classNames from "classnames";
import Image from "next/image";
import Button from "@/components/shared/Button";
import bgSmall from "../../../assets/ai/hero-bg-small.png";
import bgLarge from "../../../assets/ai/hero-bg-large.png";

const AiHero = () => {
  return (
    <section className={styles.hero}>
      <div className="container-xl">
        <h1 className={styles["hero__title"]}>
          <Trans
            i18nKey="ai.hero.title"
            components={{
              colored: <span className={styles["hero__title--colored"]} />,
            }}
          />
        </h1>
        <div className={classNames("w-lg-75", styles["hero__points"])}>
          <p className="mb-0">Build AI applications on Solana</p>
        </div>
      </div>
    </section>
  );
};

export default AiHero;
