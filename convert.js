const fs = require('fs');

const style = require('./template.json');

const layers = style.layers;

const tmp = {
  "r": {}, "g": {}, "b": {}, "m": {}
};
const tmp2 = {
  "r": {}, "g": {}, "b": {}, "m": {}
};

const collectColorInfo = (colorInfo)=>{
  if(Array.isArray(colorInfo)){
    colorInfo.forEach( colorInfoElement => {
      collectColorInfo(colorInfoElement);
    });
  }else if(typeof(colorInfo)=="string" && ( colorInfo.match(/^rgb/) || colorInfo.match(/^hsl/))){
    
    const ct = classifyColor(colorInfo);
    
    if(tmp[ct][colorInfo]){
      tmp[ct][colorInfo] += 1;
    }else{
      tmp[ct][colorInfo] = 1;
    }
    return colorInfo;
  }
}

const classifyColor = (colorInfo) => {
  //colorInfoはString

  const colStr = parsecolor(colorInfo);
  const cr = colStr[1];
  const cg = colStr[2];
  const cb = colStr[3];
  
  const ct = (cb == cr && cb == cg) ? "m" : (cr >= cg && cr >= cb) ? "r" : (cg >= cr && cg >= cb) ? "g" : "b";
  
  return ct;
}


/*************************************************/
/*RGB→HSLの変換関係設定                         */
/*************************************************/
var calcsl = function(max, min) {
    let L = (max + min)/(2*255);
    let total = max + min;
    let S=(max - min)/255;
    if((total <= 0) || (total >= 510)){
        S = 0;
    }else if(total < 255){
        S = (max-min)/(total);
    }else{
        S = (max-min)/(255*2-total);
    }
    let SL = {"s" : S, "l" : L};
    return SL;
}

var rgb2hsl = function(r, g, b, a = 1) {
    let max=0; let middle=0; let min = 0; 
    let h=0; let s=0; let l=0; 
    if((r == g) && (r == b)){
        max = r; middle=b; min = g; 
        h = 0;
        let sl = calcsl(max, min);
        s = sl.s;
        l = sl.l;
    }else if((r <= g) && (r < b)){
        min = r;
        if(g < b){
            middle=g; max = b; 
        }else{ 
            middle=b; max = g; 
        }
        h = 60*((b-g)/(max-min))+180;
        let sl = calcsl(max, min);
        s = sl.s;
        l = sl.l;
    }else if((g <= b) && (g < r)){
        min = g; 
        if(r < b){
            middle=r; max = b; 
        }else{ 
            middle=b; max = r; 
        } 
        h = 60*((r-b)/(max-min))+300;
        let sl = calcsl(max, min);
        s = sl.s;
        l = sl.l;
    }else{
        min = b; 
        if(g < r){
            middle=g; max = r; 
        }else{ 
            middle=r; max = g; 
        }
        h = 60*((g-r)/(max-min))+60;
        let sl = calcsl(max, min);
        s = sl.s;
        l = sl.l;
    }
    
    if(h > 360){
        h = h - 360;
    }else if(h < 0){
        h = h + 360;
    }
    
    const hsl = [ Math.floor(h), Math.floor(s*100), Math.floor(l*100), a ];
    return hsl;
}

/*************************************************/
/*HSL→RGBの変換関係設定                         */
/*************************************************/
const hsl2rgb = function(h, s, l, a = 1) {

    const max = l + (s * (1 - Math.abs((2 * l) - 1)) / 2);
    const min = l - (s * (1 - Math.abs((2 * l) - 1)) / 2);

    let rgb;
    const i = parseInt(h / 60);

    switch (i) {
      case 0:
      case 6:
        rgb = [max, min + (max - min) * (h / 60), min];
        break;
      case 1:
        rgb = [min + (max - min) * ((120 - h) / 60), max, min];
        break;
      case 2:
        rgb = [min, max, min + (max - min) * ((h - 120) / 60)];
        break;
      case 3:
        rgb = [min, min + (max - min) * ((240 - h) / 60), max];
        break;
      case 4:
        rgb = [min + (max - min) * ((h - 240) / 60), min, max];
        break;
      case 5:
        rgb = [max, min, min + (max - min) * ((360 - h) / 60)];
        break;
    }
    
    return [Math.round(rgb[0] * 255), Math.round(rgb[1] * 255), Math.round(rgb[2] * 255), a] ;
    
  }


/*************************************************/
/*"rgba(r,g,b,a)"などのパース                    */
/*************************************************/
var parsecolor = function(txt){
  if( (txt.indexOf("rgba") == 0) || (txt.indexOf("hsla") == 0) ){
    var length = txt.length - 1;
    var type= txt.slice(0, 4);
    txt = txt.slice(5,length );
    var col = txt.split(",");
  }else{
    var length = txt.length - 1;
    var type= txt.slice(0, 3) + "a";
    txt = txt.slice(4,length );
    var col = txt.split(",");
    col.push(1);
  }
  const color = [];
  color.push( type );
  color.push( parseInt(col[0]) );
  color.push( parseInt(col[1]) );
  color.push( parseInt(col[2]) );
  color.push( Number(col[3]) );
  return color;
}

const addArrEle = (arr, ele) => {
  const n = arr.length;
  if(Array.isArray(arr[n-1])){
    addArrEle(arr[n-1],ele);
  }else{
    arr.push(ele);
  }
}

const convertColor = (colorInfo, arr=[], info={}) => {
  //colorInfoが配列か色情報文字列（例：'-background-base-main-'）かどうかで分岐
  if(Array.isArray(colorInfo)){
    colorInfo.forEach( colorInfoElement => {
      arr.push(convertColor(colorInfoElement, [], info));
    });
    return arr;
  }else if(typeof(colorInfo)=="string" && ( colorInfo.match(/^rgb/) || colorInfo.match(/^hsl/) || colorInfo.match(/^-/))){
    
    //修正
    let colArr1;
    if(colorInfo.match(/^rgb/) || colorInfo.match(/^hsl/)){
      //テキスト形式を配列へ
      colArr1 = parsecolor(colorInfo);
    }else{
      //console.log(colorInfo);
      info.colorInfo = colorInfo;
      
      const arrColorOpacity = colorInfo.split("#");
      const colorKey = arrColorOpacity[0];
      const opacity = arrColorOpacity[1];
      
      const colSetArr = colorSet[colorKey] || colorSet["default"] || [255, 255, 255];
      colArr1 = ["rgba", ...colSetArr, opacity];
    }
    
    colArr = changeColor(colArr1, info);
    
    //色の変更
    const colTxt = `${colArr[0]}(${colArr[1]},${colArr[2]},${colArr[3]},${colArr[4]})`;
    
    const ct = classifyColor(colTxt);
    
    if(tmp2[ct][colTxt]){
      tmp2[ct][colTxt] += 1;
    }else{
      tmp2[ct][colTxt] = 1;
    }
    
    return(colTxt);
    
  }else{
    return(colorInfo);
  }
  
}

const colorSets = {
  
  "basic" : {
    'default': [ 255, 255, 240 ],
    
    '-background-base-main-': [ 255, 255, 240 ],
    
    '-railway-normal-main-': [ 100, 100, 100 ],
    '-railway-shinkansen-main-': [ 0, 0, 255 ],
    '-railway-all-back-': [ 255, 255, 240 ],
    '-railway-subway-main-': [ 0, 0, 255 ],
    '-railway-normal-blank-': [ 255, 255, 255 ],
    
    '-road-major-main-': [ 240, 200, 120 ],
    '-road-normal-main-': [ 240, 240, 240 ],
    '-road-highway-main-': [ 255, 190, 190 ],
    '-road-prefectural-main-': [ 255, 210, 110 ],
    '-road-expressway-main-': [ 0, 150, 0 ],
    '-road-all-back-': [ 220, 220, 220 ],
    '-road-edge-': [ 230, 230, 230],
    
    '-building-normal-main-': [ 230, 230, 230 ],
    '-building-middle-main-': [ 220, 220, 220 ],
    '-building-high-main-': [ 210, 210, 210 ],
    '-building-normal-outline-': [ 200, 200, 200],
    
    '-wetland-main-main-': [ 235, 242, 235 ],
    '-landform-main-main-': [ 230, 230, 170 ],
    
    '-water-main-main-': [ 190, 210, 255 ],
    '-water-main-vivid-': [ 20, 90, 255],
    '-water-main-blank-': [ 255, 255, 255 ],
    
    '-border-muni-main-': [ 200, 145, 255 ],
    
    '-text-gray-main-': [ 100, 100, 100 ],
    '-text-black-main-': [ 50, 50, 50 ],
    '-text-green-main-': [ 20, 100, 70 ],
    '-text-blue-main-': [ 0, 0, 150 ],
    '-text-white-main-': [ 255, 255, 255 ],
    '-text-white-halo-': [ 255, 255, 255 ],
    
    '-line-gray-': [ 120, 120, 120 ],
  },
  
  "dark": {
    'default': [ 30, 30, 30 ],
    
    '-background-base-main-': [ 30, 30, 30 ],
    
    '-railway-normal-main-': [ 180, 180, 180 ],
    '-railway-shinkansen-main-': [ 255, 255, 255 ],
    '-railway-all-back-': [ 30, 30, 30 ],
    '-railway-subway-main-': [ 180, 180, 180 ],
    '-railway-normal-blank-': [ 50, 50, 50 ],
    
    '-road-major-main-': [ 60, 60, 60 ],
    '-road-normal-main-': [ 40, 40, 40 ],
    '-road-highway-main-': [ 80, 80, 80 ],
    '-road-prefectural-main-': [ 60, 60, 60 ],
    '-road-expressway-main-': [ 150, 150, 150 ],
    '-road-all-back-': [ 30, 30, 30 ],
    '-road-edge-': [ 35, 35, 35 ],
    
    '-building-normal-main-': [ 20, 20, 20 ],
    '-building-middle-main-': [ 40, 40, 40 ],
    '-building-high-main-': [ 100, 100, 100 ],
    '-building-normal-outline-': [ 10, 10, 10 ],
    
    '-wetland-main-main-': [ 60, 60, 60 ],
    '-landform-main-main-': [ 50, 50, 50 ],
    
    '-water-main-main-': [ 0, 0, 0 ],
    '-water-main-vivid-': [ 80, 80, 80 ],
    '-water-main-blank-': [ 0, 0, 0 ],
    
    '-border-muni-main-': [ 180, 180, 180 ],
    
    '-text-gray-main-': [ 150, 150, 150 ],
    '-text-black-main-': [ 200, 200, 200 ],
    '-text-green-main-': [ 230, 230, 230 ],
    '-text-blue-main-': [ 200, 200, 200 ],
    '-text-white-main-': [ 255, 255, 255 ],
    '-text-white-halo-': [ 50, 50, 50 ],
    
    '-line-gray-': [ 80, 80, 80 ],
  },
  
  "dark2": {
    'default': [ 30, 30, 30 ],
    
    '-background-base-main-': [ 30, 30, 30 ],
    
    '-railway-normal-main-': [ 79, 226, 255 ],
    '-railway-shinkansen-main-': [ 255, 255, 255 ],
    '-railway-all-back-': [ 30, 30, 30 ],
    '-railway-subway-main-': [ 161, 218, 230 ],
    '-railway-normal-blank-': [ 50, 50, 50 ],
    
    '-road-major-main-': [ 60, 60, 60 ],
    '-road-normal-main-': [ 40, 40, 40 ],
    '-road-highway-main-': [ 80, 90, 100 ],
    '-road-prefectural-main-': [ 60, 60, 60 ],
    '-road-expressway-main-': [ 100, 110, 120 ],
    '-road-all-back-': [ 30, 30, 30 ],
    '-road-edge-': [ 35, 35, 35 ],
    
    '-building-normal-main-': [ 20, 25, 30 ],
    '-building-middle-main-': [ 40, 45, 50 ],
    '-building-high-main-': [ 50, 55, 80 ],
    '-building-normal-outline-': [ 20, 20, 30 ],
    
    '-wetland-main-main-': [ 100, 100, 100 ],
    '-landform-main-main-': [ 50, 50, 50 ],
    
    '-water-main-main-': [ 0, 0, 0 ],
    '-water-main-vivid-': [ 80, 80, 80 ],
    '-water-main-blank-': [ 0, 0, 0 ],
    
    '-border-muni-main-': [ 180, 180, 180 ],
    
    '-text-gray-main-': [ 150, 150, 150 ],
    '-text-black-main-': [ 200, 200, 200 ],
    '-text-green-main-': [ 200, 230, 255 ],
    '-text-blue-main-': [ 200, 200, 255 ],
    '-text-white-main-': [ 255, 255, 255 ],
    '-text-white-halo-': [ 50, 50, 50 ],
    
    '-line-gray-': [ 80, 90, 100 ],
  },
  
  "blueprint": {
    'default': [ 0, 160, 255 ],
    
    '-background-base-main-': [ 0, 160, 255 ],
    
    '-railway-normal-main-': [ 255, 255, 255 ],
    '-railway-shinkansen-main-': [ 255, 255, 255 ],
    '-railway-all-back-': [ 0, 160, 255 ],
    '-railway-subway-main-': [ 255, 255, 255 ],
    '-railway-normal-blank-': [ 51, 180, 255 ],
    
    '-road-major-main-': [ 0, 160, 255 ],
    '-road-normal-main-': [ 0, 160, 255 ],
    '-road-highway-main-': [ 0, 160, 255  ],
    '-road-prefectural-main-': [ 0, 160, 255 ],
    '-road-expressway-main-': [ 51, 180, 255 ],
    '-road-all-back-': [ 255, 255, 255 ],
    '-road-edge-': [ 255, 255, 255 ],
    
    '-building-normal-main-': [ 51, 180, 255 ],
    '-building-middle-main-': [ 51, 180, 255 ],
    '-building-high-main-': [ 51, 180, 255 ],
    '-building-normal-outline-': [ 255, 255, 255 ],
    
    '-wetland-main-main-': [ 255, 255, 255 ],
    '-landform-main-main-': [ 255, 255, 255 ],
    
    '-water-main-main-': [ 210, 240, 255 ],
    '-water-main-vivid-': [ 255, 255, 255 ],
    '-water-main-blank-': [ 255, 255, 255 ],
    
    '-border-muni-main-': [ 255, 255, 255 ],
    
    '-text-gray-main-': [ 255, 255, 255 ],
    '-text-black-main-': [ 255, 255, 255 ],
    '-text-green-main-': [ 255, 255, 255 ],
    '-text-blue-main-': [ 255, 255, 255 ],
    '-text-white-main-': [ 255, 255, 255 ],
    '-text-white-halo-': [ 0, 160, 255 ],
    
    '-line-gray-': [ 255, 255, 255 ],
  },
  
  "radar": {
    'default': [ 0, 0, 0 ],
    
    '-background-base-main-': [ 0, 0, 0 ],
    
    '-railway-normal-main-': [ 0, 255, 100 ],
    '-railway-shinkansen-main-': [ 0, 255, 100 ],
    '-railway-all-back-': [ 0, 0, 0 ],
    '-railway-subway-main-': [ 0, 255, 100 ],
    '-railway-normal-blank-': [ 0, 25, 10 ],
    
    '-road-major-main-': [ 0, 0, 0 ],
    '-road-normal-main-': [ 0, 0, 0 ],
    '-road-highway-main-': [ 0, 0, 0 ],
    '-road-prefectural-main-': [ 0, 0, 0 ],
    '-road-expressway-main-': [ 0, 0, 0 ],
    '-road-all-back-': [ 0, 255, 100  ],
    '-road-edge-': [ 0, 255, 100  ],
    
    '-building-normal-main-': [ 0, 255, 100 ],
    '-building-middle-main-': [ 0, 255, 100 ],
    '-building-high-main-': [ 0, 255, 100 ],
    
    '-wetland-main-main-': [ 0, 255, 100 ],
    '-landform-main-main-': [ 0, 255, 100 ],
    
    '-water-main-main-': [ 30, 30, 30 ],
    '-water-main-vivid-': [ 0, 255, 100 ],
    '-water-main-blank-': [ 0, 255, 100 ],
    
    '-border-muni-main-': [ 0, 255, 100 ],
    
    '-text-gray-main-': [ 0, 255, 100 ],
    '-text-black-main-': [ 0, 255, 100 ],
    '-text-green-main-': [ 0, 255, 100 ],
    '-text-blue-main-': [ 0, 255, 100 ],
    '-text-white-main-': [ 0, 255, 100 ],
    '-text-white-halo-': [ 0, 0, 0 ],
    
    '-line-gray-': [ 0, 255, 100 ],
  }
  
}

const mode = process.argv[2] || "basic";
colorSet = colorSets[mode] || colorSets["basic"];

const changeColor = (arr, info={}) => {
  
  const hsla = rgb2hsl(arr[1], arr[2], arr[3], arr[4]);
  
  let h = hsla[0];
  let s = hsla[1];
  let l = hsla[2];
  let a = hsla[3]
  
  
  if(mode == "mono"){
  //モノクロ
    if( s > 0 ) s = 1;
    if( l < 50 && l > 0 && !info["prop-name"].match("text-color")) l = l + (50 - l);
    return(["hsla", h, s + "%", l + "%", a]);
  
  }else if(mode == "mono2"){
  //モノクロ風（少し色付き）
    h = 200;
    if( s > 0 ) s = 10;
    if( s > 0 && info["prop-name"].match("text-color") ) s = 30;
    if( l < 50 && l > 0 && !info["prop-name"].match("text-color")) l = l + (50 - l);
    return(["hsla", h, s + "%", l + "%", a]);
  
  }else if(mode == "mono3"){
  //モノクロ（水域の色調整）
    if( s > 0 ) s = 1;
    if( l < 50 && l > 0 && !info["prop-name"].match("text-color")) l = l + (50 - l);
    
    if(info && info.colorInfo && info.colorInfo == "-water-main-main-"){
       h = 210; s = 50; l = 90;
    }
    
    return(["hsla", h, s + "%", l + "%", a]);
  
  }else{
    
    const divNum = 1;
    
    let r = Math.floor(arr[1]/divNum)*divNum;
    let g = Math.floor(arr[2]/divNum)*divNum;
    let b = Math.floor(arr[3]/divNum)*divNum;
    
    return(["rgba", r, g, b, a]);
  }
  
}

/*************************************************/
/*メイン                                         */
/*************************************************/

const stockLayers = [];

//テキスト形式を配列へ
layers.forEach( layer => {
  if(layer.visibility && layer.visibility == "none") return;
  if(layer.paint){
    for( name in layer.paint){
      if(name.match("color")){
        const colorInfo = layer.paint[name];
        collectColorInfo(colorInfo); // 分析
        layer.paint[name] = convertColor(colorInfo, [], { ...layer, "prop-name": name});
        //console.log(layer.paint[name]);
      }
    }
  }
  
  if(layer.layout && layer.layout.visibility == "none"){
    
  }else{
    stockLayers.push(layer);
  }
  
});

style.layers = stockLayers;

console.log(tmp);
//console.log(tmp2);
//console.log(layers);

console.log(`layer count: ${style.layers.length}`);

const prefix = process.argv[3] || "";

const resstring = JSON.stringify(style);
fs.writeFileSync(`./docs/${prefix}${mode}.json`, resstring);

