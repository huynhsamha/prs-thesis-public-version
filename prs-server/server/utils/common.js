const isNullData = function (data) {
  return !data;
};

const isNull = function (...args) {
  const data = [...args];
  for (let i = 0; i < data.length; i++) {
    if (isNullData(data[i])) {
      return true;
    }
  }
  return false;
};

module.exports = {
  isNull
};
