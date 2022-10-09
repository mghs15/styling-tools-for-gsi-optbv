const child_process = require('child_process');

const list = ["basic", "dark", "dark2", "mono", "mono2", "blueprint", "radar"];

list.forEach( s => {
  console.log(`${s}`);
  child_process.exec(`node convert.js ${s}`);
});

