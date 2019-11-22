function isNotEmptyArr(arr){
    return arr && Array.isArray(arr) && arr.length > 0;
}

function isEmptyArr(arr){
  if (arr) {
    let newArr = arr;
    if (!Array.isArray(newArr)) {
      newArr = Array.from(arr);
    }

    return Array.isArray(newArr) && newArr.length == 0;
  }
  return false;
}

// eslint-disable-next-line import/prefer-default-export
export {isNotEmptyArr, isEmptyArr}
