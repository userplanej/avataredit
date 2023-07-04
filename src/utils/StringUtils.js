/**
 * Trim the string by the specified number of characters.
 * 
 * @param {*} string String to trim.
 * @param {*} maxChar Number of characters to keep.
 * @returns Returns the trimmed string.
 */
export const getStringShortcut = (string, maxChar) => {
  let stringShortcut = string.substring(0, maxChar);
  if (string.length > maxChar - 1) {
    stringShortcut = stringShortcut.trimEnd().concat('', '...');
  }
  return stringShortcut;
}