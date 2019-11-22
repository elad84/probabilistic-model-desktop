function isDefined(element) {
  return element !== void 0 && element !== null;
}

function isNotBlank(str) {
  return isDefined(str) && str.trim() !== '';
}

function isBlank(str) {
  return !isDefined(str) || str.trim() === '';
}

export {isNotBlank, isBlank}
