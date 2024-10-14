# 色キーの一覧

[styling-tools-for-gsi-optbv](https://github.com/mghs15/styling-tools-for-gsi-optbv) で利用している色キーの一覧。

| 役割毎のキー名               |元の色             |`source-layer` 条件|属性値名条件|`id` 条件|説明|
|:--                           |:--                |:--           |:--          |:--          | :--|
| `-background-base-main-`     |`rgb(255,255,255)` |              |             ||背景|
||`rgb(255,255,255)` |RailCL        ||"ククリ白"|鉄道高架枠線内（ククリ白）|
| `-border-muni-main-`         |`rgb(68,0,128)`    |              |             ||市区町村界（紫）等|
||`rgb(34,24,21)`    |              |             ||行政区画界線国の所属界|
| `-building-high-main-`       |`rgb(255,119,51)`  |              |             ||高層建物|
| `-building-middle-main-`     |`rgb(255,187,153)` |              |             ||堅ろう建物|
| `-building-normal-main-`     |`rgb(255,230,190)` |              |             ||普通建物|
| `-building-normal-outline-`  |`rgb(255,135,75)`  |              |             ||建物外周線|
| `-landform-main-main-`       |`rgb(200,160,60)`  |              |`text-*`     ||等高線関係の文字色|
||`rgb(200,160,60)`  |              |             ||等高線・地形|
||`rgb(235,242,235)` |              |             ||砂礫地|
| `-line-gray-`                |`rgb(231,39,65)`   |              |             ||航路|
||`rgb(150,150,150)` |              |             ||特定地区界等|
||`rgb(100,100,100)` |              |             ||送電線等|
||`rgb(200,200,200)` |              |             ||ダム(面)等|
| `-railway-normal-blank-`     |`rgb(255,255,255)` |RailCL        |             |"鉄道中心線旗竿"|JR 旗竿（白黒）の白の部分|
| `-railway-normal-main-`      |`rgb(100,0,0)`     |              |             ||鉄道|
||`rgb(173,173,173)` |RailCL        |             ||鉄道|
||`rgb(100,100,100)` |RailCL        |             ||鉄道|
||`rgb(0,0,0)`       |RailCL        |             ||鉄道|
| `-railway-station-main-`     |`rgb(255,255,255)` |RailCL        |             ||鉄道駅|
| `-railway-subway-main-`      |`rgb(0,155,191)`   |              |             ||地下鉄|
| `-road-edge-`                |`rgb(200,200,200)` |RdCL          |             ||道路の枠線|
||`rgb(173,173,173)` |RdCL          |             ||道路の枠線|
||`rgb(100,100,100)` |RdCL          |             ||道路の枠線|
||`rgb(0,0,0)`       |RdCL          |             ||道路の枠線|
| `-road-expressway-main-`     |`rgb(100,195,115)` |              |             ||高速道路|
| `-road-highway-main-`        |`rgb(235,130,120)` |              |             ||国道|
| `-road-normal-main-`         |`rgb(255,255,255)` |RdCL          |             ||その他の道路|
| `-road-prefectural-main-`    |`rgb(255,255,0)`   |              |             ||県道|
| `-text-black-main-`          |`rgb(0,0,0)`       |              |`text-*`     ||元が黒色の文字色|
| `-text-gray-main-`           |`rgb(160,160,160)` |              |`text-*`     ||元が灰色の文字色|
||`rgb(80,80,80)`    |              |`text-*`     ||元が濃い灰色の文字色|
| `-text-green-main-`          |`rgb(19,97,69)`    |              |`text-*`     ||元が緑の文字色（駅名、路線名等）|
| `-text-white-halo-`          |`rgb(255,255,255)` |              |`text-halo-*`||文字の縁取りの色|
| `-text-white-main-`          |`rgb(255,255,255)` |              |`text-*`     ||元が白の文字色|
| `-water-main-main-`          |`rgb(190,210,255)` |              |`text-*`     ||水域関係の文字色（水面と同じ色|
||`rgb(190,210,255)` |              |             ||水域|
| `-water-main-vivid-`         |`rgb(0,0,255)`     |              |`text-*`     ||水域関係の文字色|
||`rgb(60,50,181)`   |              |`text-*`     ||水域関係の文字色|
||`rgb(20,90,255)`   |              |`text-*`     ||水域関係の文字色|
||`rgb(20,90,255)`   |              |             ||水涯線|
||`rgb(0,176,236)`   |              |             ||水涯線(小ZL海岸線)|
||`rgb(217,217,217)` |              |             ||万年雪|
| `-wetland-main-main-`        |`rgb(200,250,230)` |              |             ||湿地|


## 利用していないキー名

準備はしているが、現在利用していない色キー
* `-railway-shinkansen-main-`: 新幹線用
* `-railway-all-back-`: 鉄道の縁取り用
* `-road-major-main-`: 主要道路用
* `-road-all-back-`: 道路の縁取り用
* `-water-main-blank-`: 水域関係の縁取り用
* `-text-blue-main-`: 水域関係の注記用

see also [issue #1](https://github.com/mghs15/styling-tools-for-gsi-optbv/issues/1)

