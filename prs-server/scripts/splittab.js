const fs = require('fs');
const path = require('path');

const merge = [];
const mergeOutput = path.join(__dirname, './tmp/csvtab/all.csv');

const gen = (name, xx, gv) => {

  const input = path.join(__dirname, `./tmp/${name}.txt`);
  const output = path.join(__dirname, `./tmp/csvtab/${name}.csv`);

  const s = fs.readFileSync(input).toString();

  const e = {};
  const g = s.split('\n').filter(u => !!u)
    .filter((u) => {
      if (e[u]) return false;
      e[u] = true;
      return true;
    });

  console.log(g.length);
  console.log(g);

  const o = g.map((t, i) => {
    const yy = i < 9 ? `0${i + 1}` : (i + 1);
    const gc = `30${xx}`;
    const code = `30${xx}${yy}`;
    return `${t}\t${code}`;
  });

  merge.push(...o);

  fs.writeFileSync(output, o.join('\n'));

};

gen('thang', '01', 'Thầy Thắng');
gen('vuong', '02', 'Thầy Vương');
gen('thuan', '03', 'Thầy Thuận');
gen('tho', '04', 'Thầy Thơ');
gen('trung', '05', 'Thầy Trung');
gen('demo', '06', 'Demo');

fs.writeFileSync(mergeOutput, merge.join('\n'));
