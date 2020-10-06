import jsrmvi from 'jsrmvi'

export function filter(searchText, fields = []) {
  if (!searchText) return true;
  const s = jsrmvi.removeVI(searchText);
  let res = false;
  fields.forEach(f => {
    if (!f) return
    const p = jsrmvi.removeVI(f);
    if (p.indexOf(s) > -1) {
      res = true;
    }
  })
  return res;
}
