const fs = require('fs');

const style = require('./std.json');

const layers = style.layers;

const tmp = {
  "r": {}, "g": {}, "b": {}, "m": {}
};
const tmp2 = {};
const tmp3 = {};
const tmp4 = {};

const collectColorInfo = (colorInfo, info={})=>{
  if(Array.isArray(colorInfo)){
    colorInfo.forEach( colorInfoElement => {
      collectColorInfo(colorInfoElement);
    });
  }else if(typeof(colorInfo)=="string" && ( colorInfo.match(/^rgb/) || colorInfo.match(/^hsl/))){
    
    const ct = classifyColor(colorInfo);
    
    const identifier = (info.metadata) ? info.metadata.path || info.id : info.id;
    
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

  const colStr = parseColor(colorInfo);
  const cr = colStr[1];
  const cg = colStr[2];
  const cb = colStr[3];
  
  const ct = (cb == cr && cb == cg) ? "m" : (cr >= cg && cr >= cb) ? "r" : (cg >= cr && cg >= cb) ? "g" : "b";
  
  return ct;
}

/*************************************************/
/*"rgba(r,g,b,a)"などのパース                    */
/*************************************************/
const parseColor = function(txt){
  let length;
  let type;
  let col;
  
  if( (txt.indexOf("rgba") == 0) || (txt.indexOf("hsla") == 0) ){
    length = txt.length - 1;
    type= txt.slice(0, 4);
    txt = txt.slice(5,length );
    col = txt.split(",");
  }else{
    length = txt.length - 1;
    type= txt.slice(0, 3) + "a";
    txt = txt.slice(4,length );
    col = txt.split(",");
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
  if(Array.isArray(colorInfo)){
    colorInfo.forEach( colorInfoElement => {
      arr.push(convertColor(colorInfoElement, [], info));
    });
    return arr;
  }else if(typeof(colorInfo)=="string" && ( colorInfo.match(/^rgb/) || colorInfo.match(/^hsl/))){
    
    //修正
    let colorInfo2
    const carr = parseColor(colorInfo);
    const colorKey = "rgb(${carr[1]},${carr[2]},${carr[3]})";
    const opacity = carr[4];
  
    if(info["prop-name"].match("text-halo") ){
      // 文字の縁取り（基本的に白と想定）
      colorInfo2 = "-text-white-halo-" + "#" + opacity;
    }else if(info["prop-name"].match("text")){
      // 文字の色
      colorInfo2 = setupColor(colorInfo, "text");
    }else if(info["source-layer"] == "RdCL"){
      // 道路
      // * 白 -> 市町村道（-road-normal-main-）
      // * 灰 -> 道路の枠線（-road-edge-）
      // * その他 -> 色に応じてキーを振り分け
      if(colorInfo.match(/\(255,255,255/)){ 
        colorInfo2 = "-road-normal-main-" + "#" + opacity;
      }else if(colorInfo.match(/\(173,173,173/)){
        colorInfo2 = "-road-edge-" + "#" + opacity;
      }else if(colorInfo.match(/\(100,100,100/)){
        colorInfo2 = "-road-edge-" + "#" + opacity;
      }else if(colorInfo.match(/\(200,200,200/)){
        colorInfo2 = "-road-edge-" + "#" + opacity;
      }else if(colorInfo.match(/\(0,0,0/)){     
        colorInfo2 = "-road-edge-" + "#" + opacity;
      }else{
        colorInfo2 = setupColor(colorInfo);
      }
    }else if(info["source-layer"] == "RailCL"){
      // 鉄道
      // * 白 -> 旗竿部分か駅の部分かに分類
      // * 灰 -> 鉄道全般（-railway-normal-main-）
      // * その他 -> 色に応じてキーを振り分け
      if(colorInfo.match(/\(255,255,255/) && info.id.match("鉄道中心線旗竿")){
        // 旗竿部分の白色
        colorInfo2 = "-railway-normal-blank-" + "#" + opacity;
      }else if(colorInfo.match(/\(255,255,255/)){
        //旗竿以外の白色（基本的に「駅部分」の白を想定）
        // colorInfo2 = "-railway-normal-main-" + "#" + opacity;
        colorInfo2 = "-railway-station-main-" + "#" + opacity;
      }else if(colorInfo.match(/\(173,173,173/)){
        colorInfo2 = "-railway-normal-main-" + "#" + opacity;
      }else if(colorInfo.match(/\(100,100,100/)){
        colorInfo2 = "-railway-normal-main-" + "#" + opacity;
      }else if(colorInfo.match(/\(0,0,0/)){
        colorInfo2 = "-railway-normal-main-" + "#" + opacity;
      }else{
        colorInfo2 = setupColor(colorInfo);
      }
    }else{ 
      // その他の地物は色に応じてキーを振り分け
      colorInfo2 = setupColor(colorInfo);
    }
    
    if(tmp3[colorInfo2]){
      tmp3[colorInfo2] += 1;
    }else{
      tmp3[colorInfo2] = 1;
    }
    
    if(tmp4[colorInfo]){
      tmp4[colorInfo] += 1;
    }else{
      tmp4[colorInfo] = 1;
    }
    
    //console.log(colorInfo2);
    
    const identifier = (info.metadata) ? info.metadata.path || info.id : info.id;
    if( colorInfo2.match(/^rgb/) || colorInfo2.match(/^hsl/) ){
      if(tmp2[colorInfo2]){
        tmp2[colorInfo2].push( identifier );
      }else{
        tmp2[colorInfo2] = [ identifier ];
      }
    }
    
    return(colorInfo2); 
    
  }else if(typeof(colorInfo)=="string" && colorInfo.match(/^-/)){
    return(colorInfo);
  }else{
    return(colorInfo);
  }
  
}


const textColorSetOrg = {
  
  'rgb(0,0,255)': '-water-main-vivid-',
  'rgb(60,50,181)': '-water-main-vivid-',
  
  'rgb(20,90,255)': '-water-main-vivid-', //水涯線
  'rgb(190,210,255)': '-water-main-main-', //水域
  'rgb(200,160,60)': '-landform-main-main-', //等高線
  
  'rgb(19,97,69)': '-text-green-main-', //〇文字色 e.g. station
  
  'rgb(160,160,160)': '-text-gray-main-', //〇文字色
  'rgb(80,80,80)': '-text-gray-main-', //〇文字色
  
  'rgb(0,0,0)': '-text-black-main-', //〇文字色
  
  'rgb(255,255,255)': '-text-white-main-', //〇文字色
  
}


const colorSetOrg = {

  'rgb(255,255,255)': '-background-base-main-', 
  
  'rgb(255,230,190)': '-building-normal-main-', //●建物-普通
  'rgb(255,187,153)': '-building-middle-main-', //●建物-堅ろう
  'rgb(255,119,51)': '-building-high-main-', //●建物-高層
  'rgb(255,135,75)': '-building-normal-outline-', //●建物
  'rgb(255,135,75)': '-building-normal-outline-', //●建物

  'rgb(100,195,115)': '-road-expressway-main-', //☆★高速道路
  'rgb(235,130,120)': '-road-highway-main-', //☆★国道
  'rgb(255,255,0)': '-road-prefectural-main-', //☆★県道
  
  //'rgb(0,0,255)': '-railway-shinkansen-main-', //鉄道-通常-新幹線
  'rgb(100,0,0)': '-railway-normal-main-', //ZL17 軌道
  'rgb(0,155,191)': '-railway-subway-main-', //★鉄道-地下鉄
  
  'rgb(190,210,255)': '-water-main-main-', //★水域
  'rgb(20,90,255)': '-water-main-vivid-', //水涯線
  'rgb(0,176,236)': '-water-main-vivid-', //水涯線(小ZL海岸線)
  
  'rgb(200,160,60)': '-landform-main-main-', //砂礫地
  'rgb(200,250,230)': '-wetland-main-main-', //湿地
  'rgb(217,217,217)': '-water-main-vivid-', //万年雪
  'rgb(235,242,235)': '-landform-main-main-', //砂礫地
  
  'rgb(68,0,128)': '-border-muni-main-', //●市区町村界（紫）
  'rgb(34,24,21)': '-border-muni-main-', //●行政区画界線国の所属界
  'rgb(231,39,65)': '-line-gray-', //ZL6-8 航路-航路
  'rgb(150,150,150)' : '-line-gray-', //特定地区界、その他の境界
  
  'rgb(100,100,100)' : '-line-gray-', //送電線
  'rgb(200,200,200)': '-line-gray-', //ダム(面)

  //100,100,100 200,200,200 の調査
  //おそらく道路外周線、鉄道など
  //0,0,0も同上か


}


const setupColor = (txt, type = "") => {
  
  const carr = parseColor(txt);
  const colorKey = `rgb(${carr[1]},${carr[2]},${carr[3]})`;
  const opacity = carr[4];
  
  const key = (type == "text") ? textColorSetOrg[colorKey] || "-text-gray-main-" : colorSetOrg[colorKey] || "--none-other--";
  
  if(!key.match("-none-")){
    return key + "#" + opacity;
  }else{
    return txt;
  }
  
}

const changeColor = (arr, info={}) => {
  
  const mode = "_d";
  
  
  const divNum = 1;
  
  let r = Math.floor(arr[1]/divNum)*divNum;
  let g = Math.floor(arr[2]/divNum)*divNum;
  let b = Math.floor(arr[3]/divNum)*divNum;
  
  return(["rgba", r, g, b, a]);
  
}
/*************************************************/
/*色以外の処理                                   */
/*************************************************/
const boundaryLayerConvert = (layer) => {
  if(!layer["source-layer"] || layer["source-layer"] != "AdmBdry"){
    return layer;
  }
  
  if(layer.type == "line" && layer.id.match("行政区画界線地方界")){
    layer.paint["line-dasharray"] = [ 10, 2, 1, 2 ];
  }
  
  if(layer.paint["line-dasharray"]){
    layer.paint["line-dasharray"] = layer.paint["line-dasharray"].map( x => x/2);
    layer.layout["line-join"] = "round";
  }
  
  return layer;
}

const roadLayerConvert = (layer) => {
  if(!layer["source-layer"] || layer["source-layer"] != "RdCL"){
    return layer;
  }
  
  if(layer.type == "line" && !layer.id.match("ククリ")){
    if(!layer.layout) layer.layout = {};
    layer.layout["line-cap"] = "round";
  }
  
  /*
  if(layer.id.match("道路中心線色1")){
    layer.paint["line-dasharray"] = [4, 4];
  }
  */
  
  
  return layer;
}

const railLayerConvert = (layer) => {
  if(!layer["source-layer"] || layer["source-layer"] != "RailCL"){
    return layer;
  }
  
  
  if(layer.type == "line"){
    if(!layer.layout) layer.layout = {};
    //駅レイヤを別途追加する場合は不要
    layer.layout["line-cap"] = "round";
  }
  
  if(layer.id.match("鉄道中心線地下トンネル")){
    //layer.paint["line-dasharray"] = [2, 2];
    layer.paint["line-opacity"] = [ "case", 
      [ "==", [ "get", "vt_sngldbl" ], "駅部分" ], 1, 
      [ "case", 
        [ "==", [ "get", "vt_railstate" ], "雪覆い" ], 0.75,
        [ "==", [ "get", "vt_rtcode" ], "地下鉄" ], 0.5,
      0.3 ] 
    ];
  }
  
  // width 設定（駅、複線、単線）
  let wSta = 3;
  let wDbl = 2;
  let wSgl = 1
  
  // ZL 拡大時の拡幅
  let switchZL1 = 13;
  let switchZL2 = 15;
  let _w = 2; // 変化させる width
  
  if(layer.id.match("鉄道中心線地下トンネルククリ")){
    layer.layout.visibility = "none";
  }
  
  if(layer.id.match("鉄道中心線駅ククリ")){
    layer.layout.visibility = "none";
  }
  
  if(layer.id.match(/鉄道.*ククリ/)){
    //layer.layout.visibility = "none";
  }
  
  if(layer.id.match(/鉄道.*ククリ白/)){
    layer.layout.visibility = "none";
  }
  
  if(layer.id.match("鉄道中心線旗竿")){
    //layer.layout.visibility = "none";
    //旗竿は、filter でJR線のみが対象となる
    //layer.minzoom = 11;
  }
  
  if(layer.id.match(/鉄道.*ククリ黒/)){
    wSta += 1; wDbl += 1; wSgl += 1; 
    layer.paint["line-width"] = 1;
    layer.paint["line-gap-width"] = [
      "interpolate",
      [ "linear" ],
      [ "zoom" ],
      switchZL1,["case",
        [ "==", [ "get", "vt_sngldbl" ], "駅部分"], wSta + 2,
        [ "==", [ "get", "vt_sngldbl" ], "複線以上"], wDbl + 2,
        wSgl + 2
      ],
      switchZL2,["case",
        [ "==", [ "get", "vt_sngldbl" ], "駅部分"], wSta + _w + 2,
        [ "==", [ "get", "vt_sngldbl" ], "複線以上"], wDbl + _w + 2,
        wSgl + _w + 2
      ]
    ];
    layer.layout["line-cap"] = "butt";
    
    return layer;
  }
  
  const outlineWidth = layer.id.match(/旗竿/) ? 1 : 0;
  
  layer.paint["line-width"] = [
    "interpolate",
    [ "linear" ],
    [ "zoom" ],
    switchZL1,["case",
      [ "==", [ "get", "vt_sngldbl" ], "駅部分"], wSta - outlineWidth,
      [ "==", [ "get", "vt_sngldbl" ], "複線以上"], wDbl - outlineWidth,
      wSgl - outlineWidth
    ],
    switchZL2,["case",
      [ "==", [ "get", "vt_sngldbl" ], "駅部分"], wSta + _w - outlineWidth + 2, // 大縮尺の駅の幅は広めに
      [ "==", [ "get", "vt_sngldbl" ], "複線以上"], wDbl + _w - outlineWidth,
      wSgl + _w - outlineWidth
    ]
  ];
  
  return layer;
  
}

const buildingLayerConvert = (layer) => {
  
  //順番を注記群の直前に持ってくる処理が必要
  if(!layer["source-layer"] || (layer["source-layer"] != "BldA" && layer["source-layer"] != "StrctArea")){
    return layer;
  }
  
  if(layer.type != "fill"){
    if(!layer.layout) layer.layout = {};
    layer.layout.visibility = "none";
    return layer;
  }
  
  
  //レイヤ順そのままでfill-extrusionとすると、ラインデータとの表示の重なりがおかしくなる。
  layer.type = "fill-extrusion";
  if(!layer.paint) layer.paint = {};
  layer.paint["fill-extrusion-color"] = JSON.parse(JSON.stringify(layer.paint["fill-color"]));
  layer.paint["fill-extrusion-height"] = ["match",
    ["get", "vt_code"],
    3103, 100,
    3113, 100,
    3102, 40,
    3112, 40,
    10
  ];
  layer.paint["fill-extrusion-opacity"] = 0.8;
  
  for(name in layer.paint){
    if(!name.match(/extrusion/)) delete layer.paint[name];
  }
  
  for(name in layer.layout){
    if(!name.match(/extrusion/) && name != "visivility") delete layer.layout[name];
  }
  
  return layer;
  
}


/*************************************************/
/*メイン                                         */
/*************************************************/

const stockLayers = [];

const stock = {
  "isFinishedFlag": false
};

//テキスト形式を配列へ
layers.forEach( layer => {
  if(layer.paint){
    for( name in layer.paint){
      if(name.match("color")){
        const colorInfo = layer.paint[name];
        collectColorInfo(colorInfo, { ...layer, "prop-name": name}); // 分析
        layer.paint[name] = convertColor(colorInfo, [], { ...layer, "prop-name": name});
        //console.log(layer.paint[name]);
      }
    
    }
  }
  
  //追加レイヤには適用しない
  if(layer.metadata && layer.metadata.additional){
    return;
  }
  
  //色以外の調整
  layer = boundaryLayerConvert(layer);
  layer = roadLayerConvert(layer);
  layer = railLayerConvert(layer);
  
  stockLayers.push(layer);
  
  //追加レイヤ対応(2)
  //スタイルレイヤの追加
  if(!stock.isFinishedFlag && layer.id == "送電線破線"){
    console.log(`added addtional layers`);
    stock.isFinishedFlag = true;
    const additionalLayers = require("./additionalLayers.json");
    additionalLayers.forEach( additionalLayer => {
      stockLayers.push(additionalLayer);
    });
  }
  
});

style.layers = stockLayers;

//console.log(tmp); //色ごとのレイヤ数（重複あり）
//console.log(tmp2); //色ごとのレイヤリスト（重複あり）
/*console.log(layers);*/

//console.log(Object.keys(tmp3).sort()); //色リスト（変換後）
//console.log(Object.keys(tmp4).sort()); //色リスト（変換前）

console.log(tmp3);

console.log(`layer count: ${style.layers.length}`);

const resstring = JSON.stringify(style, null, 4);
fs.writeFileSync("template.json", resstring);

