export const removeFields = (obj, fields = []) => {
  const m = new Set(fields);
  for (let prop in obj) {
    if (m.has(prop)) delete obj[prop];
    else if (typeof obj[prop] === 'object') removeFields(obj[prop], fields);
  }
};

export const simpleClone = json => {
  return JSON.parse(JSON.stringify(json || {}));
};
