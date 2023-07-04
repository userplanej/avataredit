import moment from 'moment';

// Functions related to date.

/**
 * Returns a date from a string.
 * 
 * @param {*} string Date in string format. Ex: 2022-01-01.
 * @param {*} format Format of date. Ex: YYYY-MM-DD.
 * @returns The date in specified format.
 */
export const formatDateFromString = (string, format) => {
  return moment(string, moment.ISO_8601, true).utc().format(format);
}

/**
 * Returns the current date.
 * 
 * @returns Today's date
 */
export const getToday = () => {
  return moment();
}

/**
 * Returns the time elapsed between the specified date and current date.
 * 
 * @param {*} date Starting date.
 * @returns Time elapsed in seconds/minutes/hours/days/months/years. 
 */
export const getTimeElapsedSinceDate = (date) => {
  const today = getToday();
  const todayOffset = today.utcOffset();
  let todayDate = today;
  if (todayOffset > 0) {
    todayDate = today.subtract(todayOffset, 'm');
  } else {
    todayDate = today.add(todayOffset, 'm');
  }

  const past = moment(formatDateFromString(date, 'YYYY-MM-DDTHH:mm:ss+00:00'));
  const offset = past.utcOffset();
  let dateFrom = past;
  if (offset > 0) {
    dateFrom = past.subtract(offset, 'm');
  } else {
    dateFrom = past.add(offset, 'm');
  }
  
  const duration = moment.duration(todayDate.diff(dateFrom));
  
  let years = duration.asYears();
  if (years >= 1) {
    years = Math.round(years);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }

  let months = duration.asMonths();
  if (months >= 1) {
    months = Math.round(months);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }

  let days = duration.asDays();
  if (days >= 1) {
    days = Math.round(days);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }

  let hours = duration.asHours();
  if (hours >= 1) {
    hours = Math.round(hours);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }

  let minutes = duration.asMinutes();
  if (minutes >= 1) {
    minutes = Math.round(minutes);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }

  let seconds = duration.asSeconds();
  seconds = Math.abs(Math.round(seconds));
  return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
}