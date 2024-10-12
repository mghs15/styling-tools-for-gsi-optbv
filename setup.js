const child_process = require('child_process');

const list = [
  ["basic", "2d", "basic"], 
  ["dark", "2d", "dark"], 
  ["dark2", "2d", "dark2"], 
  //["mono", "2d", "mono"], 
  ["mono2", "2d", "mono2"], 
  ["blueprint", "2d", "blueprint"],  
  ["radar", "2d", "radar"], 
  ["railway", "railmuni2d", "railway"], 
  ["muni", "railmuni2d", "muni"], 
  ["chisui", "railmuni2d", "chisui"], 
  ["basic", "3d", "fx-basic"], 
  ["dark", "3d", "fx-dark"], 
  ["dark2", "3d", "fx-dark2"], 
  //["mono", "3d", "fx-mono"], 
  ["mono2", "3d", "fx-mono2"], 
  ["blueprint", "3d", "fx-blueprint"],  
  ["radar", "3d", "fx-radar"], 
  ["railway", "railmuni3d", "fx-railway"], 
  ["muni", "railmuni3d", "fx-muni"], 
  ["chisui", "railmuni3d", "fx-chisui"], 
  ["dark2", "railmuni2d", "darkrail"], 
  ["dark2", "railmuni3d", "fx-darkrail"], 
];

list.forEach( s => {
  console.log(s);
  child_process.exec(`node convert2.js ./src/color-${s[0]}.csv ./src/layerinfo-${s[1]}.csv ./docs/${s[2]}.json`);
});

