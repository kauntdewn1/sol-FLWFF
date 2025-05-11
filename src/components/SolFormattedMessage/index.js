import React from "react";

const SolFormattedMessage = ({ value }) => {
  try {
    return <>{value}</>;
  } catch (error) {
    console.error(error);
    return <>{value}</>;
  }
};

const humanFriendlyNumbers = {
  1: "",
  1e3: "K",
  1e6: "M",
  1e9: "G",
  1e12: "T",
  1e15: "P",
  1e18: "E",
};

/**
 * Format a number down and adds the above extensions.
 *
 * @param {number}                value
 * @param {number}                digits          How many digits to display after the floating point, defaults to 1.
 * @param {number}                startDividing   When to start dividing, default to 1e4, divides by 1e3.
 * @param {NumberFormatOptions}   options
 * @return {`${*}${*}`|`${*}${*}`}
 */
export const formatNumberHumanFriendly = (
  value,
  digits = 1,
  startDividing = 1e4,
  options = {}
) => {
  let dividend;
  switch (true) {
    case value >= 1e18:
      dividend = 1e18;
      break;
    case value >= 1e15:
      dividend = 1e15;
      break;
    case value >= 1e12:
      dividend = 1e12;
      break;
    case value >= 1e9:
      dividend = 1e9;
      break;
    case value >= 1e6:
      dividend = 1e6;
      break;
    case value >= startDividing:
      dividend = 1e3;
      break;
    default:
      dividend = 1;
  }
  const dividedDown = (value / dividend).toFixed(digits);
  return `${dividedDown}${humanFriendlyNumbers[dividend]}`;
};

export default SolFormattedMessage;
