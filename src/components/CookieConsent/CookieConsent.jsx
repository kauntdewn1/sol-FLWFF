"use client";

import React, { useEffect, useState } from "react";
import Button from "../shared/Button";
import classNames from "classnames";
import styles from "./CookieConsent.module.scss";

// Get localstorage with expiry date
const getLocalStorage = function (key, defaultValue) {
  const now = new Date().getTime();
  let sticky = null;

  try {
    sticky = JSON.parse(localStorage.getItem(key));
  } catch (error) {
    console.error(error);
  }

  if (sticky !== null && sticky !== "undefined") {
    // remove stored consent value based on the expiration date
    if (now > sticky.timeToExpire) {
      localStorage.removeItem(key);
    }
    return sticky.value;
  }

  return defaultValue;
};

// Set localstorage with expiry date
const setLocalStorage = function (key, value) {
  const now = new Date().getTime();
  const timeToExpire = 15778476000; //6months

  const obj = { value, timeToExpire: now + timeToExpire };
  localStorage.setItem(key, JSON.stringify(obj));
};

const CookieConsent = () => {
  const [cookieConsent, setCookieConsent] = useState("");

  useEffect(() => {
    const storedConsent = localStorage.getItem("cookieConsent");
    if (storedConsent) {
      setCookieConsent(storedConsent);
    }
  }, [setCookieConsent]);

  useEffect(() => {
    if (typeof window.gtag !== "undefined" && cookieConsent !== "") {
      window.gtag("consent", "update", {
        analytics_storage: cookieConsent === "accepted" ? "granted" : "denied",
      });
    }
  }, [cookieConsent]);

  const acceptCookies = () => {
    setCookieConsent("accepted");
    localStorage.setItem("cookieConsent", "accepted");
  };

  const declineCookies = () => {
    setCookieConsent("declined");
    localStorage.setItem("cookieConsent", "declined");
  };

  if (cookieConsent !== "") {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p>
          Utilizamos cookies para melhorar sua experiência. Ao continuar navegando,
          você concorda com nossa política de cookies.
        </p>
        <div className={styles.buttons}>
          <button onClick={acceptCookies} className={styles.accept}>
            Aceitar
          </button>
          <button onClick={declineCookies} className={styles.decline}>
            Recusar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
