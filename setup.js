const child_process = require('child_process');

const list = ["basic", "dark", "dark2", "mono", "mono2", "blueprint", "radar", "railway", "muni", "chisui"];

const prefix = process.argv[2] || "";

list.forEach( s => {
  console.log(`${prefix}${s}`);
  child_process.exec(`node convert.js ${s} ${prefix}`);
});

