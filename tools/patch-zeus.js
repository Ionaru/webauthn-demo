const fs = require('node:fs');

const path = 'apps/client/src/app/zeus/index.ts';
const data = fs.readFileSync(path).toString().split('\n');
data.splice(0, 0, '// @ts-nocheck');
const text = data.join('\n');

fs.writeFile(path, text, 'utf-8', (err) => {
  if (err) {
    throw err;
  }
  console.log('Zeus Patched.');
});
