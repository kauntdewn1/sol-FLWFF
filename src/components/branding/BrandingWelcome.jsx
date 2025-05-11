import React from "react";
import styles from "./BrandingWelcome.module.scss";

const BrandingWelcome = () => {
  return (
    <section className={styles.welcome}>
      <div className="container">
        <h1>Welcome to Solana Branding</h1>
        <p>
          Explore our branding guidelines and resources.
        </p>
      </div>
    </section>
  );
};

export default BrandingWelcome;
