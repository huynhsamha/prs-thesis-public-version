import { removeVietnamese } from './converter';

export function defaultSortMethod(a, b, desc) {
  // force null and undefined to the bottom
  a = a === null || a === undefined ? '' : a;
  b = b === null || b === undefined ? '' : b;
  // force any string values to lowercase
  a = typeof a === 'string' ? removeVietnamese(a).toLowerCase() : a;
  b = typeof b === 'string' ? removeVietnamese(b).toLowerCase() : b;
  // Return either 1 or -1 to indicate a sort priority
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  // returning 0, undefined or any falsey value will use subsequent sorts or
  // the index as a tiebreaker
  return 0;
}

export function defaultFilterMethod(filter, row, column) {
  const id = filter.pivotId || filter.id;
  if (!row[id] || row[id] === undefined) return true;
  let dt = removeVietnamese(String(row[id])).toLowerCase();
  let text = removeVietnamese(String(filter.value)).toLowerCase();
  return dt.indexOf(text) > -1;
}

export const filterSelectAntd = (input, option) => {
  const { title, surveyOrQuiz, quickOrFull } = option.props['data-filter'];
  input = removeVietnamese(String(input)).toLowerCase();
  let text = removeVietnamese(
    String('' + title + ' ' + surveyOrQuiz + ' ' + quickOrFull)
  ).toLowerCase();
  return text.indexOf(input) >= 0;
};
