const fs = require('fs');
const path = require('path');

const data = [];

for (let i = 1611000; i <= 1612000; i++) {
  data.push(`${i}@hcmut.eedu.vn`);
}

fs.writeFileSync(path.join(__dirname, './db/audiences.txt'), data.join('\n'));
