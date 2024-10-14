const fs = require('fs');

/*************************************************/
/*入力ファイル関係                               */
/*************************************************/

const style = require('./template.json');

const layers = style.layers;

const colorinfoFile = process.argv[2] || "";
const layerinfoFile = process.argv[3] || "";
const outputFileName = process.argv[4] || "style.json";


const colorinfoText = fs.readFileSync(colorinfoFile, "utf-8");
const colorSets = { style: {} };
const colorinfoTextLines = colorinfoText.split("\n");
for(let i in colorinfoTextLines){
  const line = colorinfoTextLines[i]
  if(i < 1) continue;
  if(!line) continue;
  const [name, colorKey, type, r, g, b] = line.split(",");
  if(!colorKey) continue;
  colorSets.style[colorKey] = [+r, +g, +b];
};


const layerinfoText = fs.readFileSync(layerinfoFile, "utf-8");
const layerinfo = {};
const layerinfoTextLines = layerinfoText.split("\n");
for(let i in layerinfoTextLines){
  const line = layerinfoTextLines[i]
  if(i < 1) continue;
  if(!line) continue;
  const [number, layerId, visibility, zIndex] = line.split(",");
  layerinfo[layerId] = {
    "layerNumber": +number,
    "visibility": visibility, 
    "zIndex": +zIndex
  };
};

//console.log(colorSets.style);
//console.log(layerinfo);


/*************************************************/
/*統計情報関係                                   */
/*************************************************/

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
const calcsl = function(max, min) {
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

const rgb2hsl = function(r, g, b, a = 1) {
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
const parsecolor = function(txt){
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
    
    // チェック用
    if(colorInfo == "-road-all-back-"){
      console.log(info);
    }
    
    
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

const mode = "style"; // 読み込んだ設定は colorSets.style に固定
colorSet = colorSets.style;

const changeColor = (arr, info={}) => {
  
  const hsla = rgb2hsl(arr[1], arr[2], arr[3], arr[4]);
  
  let h = hsla[0];
  let s = hsla[1];
  let l = hsla[2];
  let a = hsla[3]
  
  // 必要な処理があれば追加
  /*
  //モノクロ（水面・地形等）
  h = 200;
  if( s > 0 ) s = 10;
  if( s > 0 && info["prop-name"].match("text-color") ) s = 30;
  if( l < 50 && l > 0 && !info["prop-name"].match("text-color")) l = l + (50 - l);
  if( l < 100 && l > 0 && !info["prop-name"].match("text-color")) l = l + (100 - l) * 0.5;
  
  if(info && info.colorInfo && info.colorInfo.match(/-background-base-main-/)){
    h = 0; s = 100; l = 100;
  }else if(info && info.colorInfo && info.colorInfo.match(/-water-main-vivid-/)){
    h = 222; s = 100; l = 50;
  }else if(info && info.colorInfo && info.colorInfo.match(/-water-main-/)){
    h = 210; s = 100; l = 75;
  }else if(info && info.colorInfo && info.colorInfo.match(/-landform-main-main-/)){
    h = 120; s = 100; l = 30;
  }else if(info && info.colorInfo && info.colorInfo.match(/-border-muni-main-/)){
    h = 230; s = 50; l = 30;
  }
  
  return(["hsla", h, s + "%", l + "%", a]);
  */
  
  const divNum = 1;
  
  let r = Math.floor(arr[1]/divNum)*divNum;
  let g = Math.floor(arr[2]/divNum)*divNum;
  let b = Math.floor(arr[3]/divNum)*divNum;
  
  return(["rgba", r, g, b, a]);
  
}

const additionalChange = (layer) => {
  
  // 何か追加でスタイル変更が必要であれば、ここへ記述する。
  
  if(!layer["source-layer"]) return layer;
  
  /*
  if(layer["source-layer"] == "AdmBdry"){
    if(mode != "muni" && layer.id == "行政区画界線（強調）"){
      layer.layout["visibility"] = "none";
    }
    return layer;
  }
  */
  
  if(layer["source-layer"] != "RailCL"){
    return layer;
  }
  
  if(outputFileName.match("rail")){
    if(layer.id.match("鉄道中心線地下トンネル")){
      layer.paint["line-dasharray"] = [2, 2];
      if(!layer.layout) layer.layout = {};
      layer.layout["line-cap"] = "butt";
    }
    /*
    if(layer.id.match("鉄道中心線橋ククリ白")){
      layer.paint["line-color"] = "-background-base-main-";
    }
    */
  }
  
  return layer;
  
}

/*************************************************/
/*メイン                                         */
/*************************************************/

const stockLayers = [];

//テキスト形式を配列へ
layers.forEach( layer => {
  
  if(layerinfo[layer.id]){
    const info = layerinfo[layer.id];
    if(!layer.metadata) layer.metadata = {};
    layer.metadata.layerNumber = info.layerNumber;
    layer.metadata.zIndex = info.zIndex;
    if(!layer.layout) layer.layout = {};
    layer.layout.visibility = info.visibility;
  }
  
  // 追加の変更を適用
  layer = additionalChange(layer);
  
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
    // 非表示レイヤはリリースしない。
  }else{
    // リリースするレイヤセットへ追加
    stockLayers.push(layer);
  }
  
});
  
// レイヤの順番変更
stockLayers.sort((a, b) => {
  const one = 1; // 順番を逆転できるように変数として準備
  
  const aZ = a.metadata.zIndex || 0;
  const bZ = b.metadata.zIndex || 0;
  const aN = a.metadata.layerNumber || 9999;
  const bN = b.metadata.layerNumber || 9999;
  
  // zIndex の方を layerNumber より優先
  if(aZ < bZ) return -one;
  if(aZ > bZ) return one;
  if(aZ == bZ) {
    if(aN < bN) return -one;
    if(aN > bN) return one;
    if(aN == bN) return 0;
  }
  return 0;
});
  
style.layers = stockLayers;

console.log(tmp);
//console.log(tmp2);
//console.log(layers);

console.log(`layer count: ${style.layers.length}`);

const resstring = JSON.stringify(style);
fs.writeFileSync(outputFileName, resstring);

