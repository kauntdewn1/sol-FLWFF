import React from "react";
import PropTypes from "prop-types";
import { formatDate, getRelativeTime } from "../../utils/dateUtils";

/**
 * Converts the Date and displays it.
 *
 * @param date
 * @returns {JSX.Element}
 * @constructor
 */
const PublishedAt = ({ date }) => {
  return (
    <time dateTime={date} title={formatDate(date)}>
      {getRelativeTime(date)}
    </time>
  );
};

PublishedAt.propTypes = {
  date: PropTypes.string.isRequired,
};

export default PublishedAt;
