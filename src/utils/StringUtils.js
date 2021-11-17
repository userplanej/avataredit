export const getStringShortcut = (string, maxChar) => {
  let stringShortcut = string.substring(0, maxChar);
  if (string.length > maxChar - 1) {
    stringShortcut = stringShortcut.trimEnd().concat('', '...');
  }
  return stringShortcut;
}