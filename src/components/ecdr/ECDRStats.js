import React from "react";
import classNames from "classnames";
import Link from "../../utils/Link";
import { FormattedNumber } from "../SolFormattedMessage";
import styles from "./ECDRStats.module.scss";
import ClipboardIcon from "../../../public/src/img/ecdr/clipboard.inline.svg";

const StatCard = ({ value, description = "", note = "", className }) => (
  <div className={classNames("text-center", styles["ecdr-stats__card"])}>
    <div
      className={classNames(
        "my-4",
        styles["ecdr-stats__card--title"],
        className,
      )}
    >
      {typeof value == "number" ? <FormattedNumber value={value} /> : value}
    </div>
    <p className={styles["ecdr-stats__card--description"]}>{description}</p>
    <p className={styles["ecdr-stats__card--note"]}>{note}</p>
  </div>
);

const ECDRStats = () => {
  return (
    <div className={classNames("mt-4 container", styles["ecdr-stats__container"])}>
      <h2>ECDR Stats</h2>
      <p>Statistics content goes here.</p>
    </div>
  );
};

export default ECDRStats;
