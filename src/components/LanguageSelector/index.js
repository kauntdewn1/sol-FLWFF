import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./LanguageSelector.module.scss";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className={styles.languageSelector}>
      <button
        className={`${styles.languageButton} ${
          i18n.language === "en" ? styles.active : ""
        }`}
        onClick={() => changeLanguage("en")}
      >
        EN
      </button>
      <button
        className={`${styles.languageButton} ${
          i18n.language === "pt" ? styles.active : ""
        }`}
        onClick={() => changeLanguage("pt")}
      >
        PT
      </button>
    </div>
  );
};

export default LanguageSelector; 