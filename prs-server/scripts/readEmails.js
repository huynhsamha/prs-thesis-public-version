const fs = require('fs');
const path = require('path');

const data = fs.readFileSync(path.join(__dirname, './db/audiences.txt'), { encoding: 'utf-8' }).toString();
const emails = data.split('\n').filter(t => !!t).map(t => t.trim()).filter(t => !!t);

emails.forEach((e) => {
  console.log(`> ${e}`);
});
