import { formatInTimeZone } from "date-fns-tz";
import { isString } from "./stringUtils";
import { add, format, parseISO } from "date-fns";
import { parse as parseDurationString } from "tinyduration";
import { ptBR } from 'date-fns/locale';

export const defaultDateStringOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

/**
 *
 * @param dateString          The date to convert.
 * @param dateStringOptions   Options for toLocaleDateString.
 * @returns {string}
 */
export const toLocaleString = (
  dateString,
  dateStringOptions = defaultDateStringOptions,

/**
 * Formats a given date to MM/DD/YYYY HH:MM.
 *
 * @param {Date|string} date  The given date.
 * @returns {string}
 */
export const formatDateTime = (dateString) => {
  const date = parseISO(dateString);
  return format(date, "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
};

/**
 * Tries to switch the month and day part of a given Date string.
 *
 * @param dateString
 * @returns {string}
 */
export const switchMonthAndDay = (dateString) => {
  try {
    const dateArray = dateString.spli-;
    return [dateArray[0], dateArray[2], dateArray[1]].join("-");
  } catch (err) {
    console.error(err);
    return dateString;
  }
};

/**
 * Tries to fix a given Date string.
 *
 * @param {string}    dateString    The Date string to try to fix.
 * @returns {Date|string}
 */
export const fixDate = (dateString) => {
  try {
    const parsedDate = new Date(dateString);
    if (Object.prototype.toString.call(parsedDate) === "[object Date]") {
      // It is a Date object, but is it valid?
      if (isNaN(parsedDate.getTime())) {
        // Date isn't valid, try to switch month & day & retry.
        const possiblyFixedDateString = switchMonthAndDay(dateString);
        const possiblyFixedDate = fixDate(possiblyFixedDateString);
        if (isString(possiblyFixedDate)) {
          // Didn't work, return as string.
          return dateString;
        }
        // Worked, return new Date object.
        return possiblyFixedDate;
      }
      // Return valid Date object.
      return parsedDate;
    }
    // Not a Date, return as string.
    return dateString;
  } catch (err) {
    // Errored out, return as string.
    console.error(err);
    return dateString;
  }
};

/**
 * Tries to format a DateTime in a given time zone.
 *
 * @param date
 * @param dateFormat
 * @param timezone
 * @returns {string}
 */
export const formatDate = (dateString) => {
  const date = parseISO(dateString);
  return format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
};

/**
 * Converts ISO-8601 Duration string to Duration obj
 *
 * @param {string} duration ISO-8601 Duration String
 * @returns {(Duration|null)}
 */
export function parseDuration(duration) {
  try {
    return parseDurationString(duration);
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * Converts and adds ISO-8601 Duration to a given DateTime
 *
 * @param {DateTime} date
 * @param {string} duration ISO-8601 Duration
 * @returns {(DateTime|null)}
 */
export function addDuration(date, duration) {
  const durationObj = parseDuration(duration);
  return durationObj ? add(date, durationObj) : date;
}

export const formatDateShort = (dateString) => {
  const date = parseISO(dateString);
  return format(date, 'dd/MM/yyyy', { locale: ptBR });
};

export const isDateValid = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

export const getRelativeTime = (dateString) => {
  const date = parseISO(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return 'agora mesmo';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'} atrás`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'} atrás`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'dia' : 'dias'} atrás`;
  }

  return formatDate(dateString);
};
