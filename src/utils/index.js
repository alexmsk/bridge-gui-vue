import crypto from 'crypto';

export const sha256 = function (i) {
  return crypto.createHash('sha256').update(i).digest('hex');
};

/**
 * Gets items from localStorage
 * @param {String} item - name of item to retrieve
 * @returns {String}
 */
export const fromLocalStorage = function (item) {
  if (window && window.localStorage) {
    return window.localStorage.getItem(item);
  }
  return '';
};

export const getAverage = function (sum, numItems) {
  if (!sum) {
    return 0;
  }

  const avg = sum / numItems;

  return avg;
};

export const getSum = function (arr, field) {
  if (!arr || Array.isArray(arr) && arr.length <= 0) {
    return 0;
  }

  const sum = arr.reduce((acc, i) => {
    const add = typeof i[field] === 'undefined' ? 0 : i[field];
    return acc + add;
  }, 0);

  return sum;
};

/**
 * Prettifies the amount printed in billing history.
 * Returns either a string that lets the user know that the amount that
 * has been used is than 0.01 GB or rounds the amount to two decimal
 * places.
 * @param {Number} num - number in bytes or GB
 * @param {String} type - optional - undefined or 'bytes'
 */
export function roundToGBAmount (num, type) {
  const GB = 1000000000;

  const numInGB = type === 'bytes' ? num / GB : num;
  const modNum = setToTwoDecimalPlaces(numInGB);

  // Checks to see if the amount is less than one cent
  if (modNum.indexOf('0.00') === 0) {
    const lessThanOneCent = '< 0.01';
    return lessThanOneCent;
  }
  return `${modNum}`;
};

export function setToTwoDecimalPlaces (num) {
  const roundedToTwoPlaces = Math.round(num * 100) / 100;
  const setToTwoPlaces = roundedToTwoPlaces.toFixed(2);

  return setToTwoPlaces;
};

export function promoCodes (code) {
  switch (code) {
    case 'referral-recipient':
    case 'referral-sender':
      return 'Referral';

    case 'storj-event':
      return 'Storj';

    default:
      return 'Storj';
  }
};
