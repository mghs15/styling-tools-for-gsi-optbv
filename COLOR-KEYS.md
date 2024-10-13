# 色キーの一覧

[styling-tools-for-gsi-optbv](https://github.com/mghs15/styling-tools-for-gsi-optbv) で利用している色キーの一覧。

|元の色             | 役割毎のキー名               |`source-layer` 条件|属性値名条件|役割        |備考
|:--                |:--                           |:--           |:--          |:--             | :--|
|`rgb(255,255,255)` | `-text-white-halo-`          |              |`text-halo-*`|文字の縁取りの色|元が白の文字色
|`rgb(0,0,255)`     | `-water-main-vivid-`         |              |`text-*`     |水面系統（濃）  |水域関係の文字色
|`rgb(60,50,181)`   | `-water-main-vivid-`         |              |`text-*`     |                |水域関係の文字色
|`rgb(20,90,255)`   | `-water-main-vivid-`         |              |`text-*`     |水面系統（薄）  |水域関係の文字色
|`rgb(190,210,255)` | `-water-main-main-`          |              |`text-*`     |                |水域関係の文字色（水面と同じ色
|`rgb(200,160,60)`  | `-landform-main-main-`       |              |`text-*`     |等高線・地形    |等高線関係の文字色
|`rgb(19,97,69)`    | `-text-green-main-`          |              |`text-*`     |文字色（元緑）  |元が緑の文字色（駅名、路線名等
|`rgb(160,160,160)` | `-text-gray-main-`           |              |`text-*`     |文字色（元灰）  |元が灰色の文字色
|`rgb(80,80,80)`    | `-text-gray-main-`           |              |`text-*`     |文字色（元濃灰）|元が濃い灰色の文字色
|`rgb(0,0,0)`       | `-text-black-main-`          |              |`text-*`     |文字色（元黒）  |元が黒色の文字色
|`rgb(255,255,255)` | `-text-white-main-`          |              |`text-*`     |文字色（元白）  |元が白の文字色
|`rgb(255,255,255)` | `-background-base-main-`     |              |             |背景            |背景
|`rgb(255,230,190)` | `-building-normal-main-`     |              |             |普通建物        |普通建物
|`rgb(255,187,153)` | `-building-middle-main-`     |              |             |堅ろう建物      |堅ろう建物
|`rgb(255,119,51)`  | `-building-high-main-`       |              |             |高層建物        |高層建物
|`rgb(255,135,75)`  | `-building-normal-outline-`  |              |             |建物外周線      |建物外周線
|`rgb(100,195,115)` | `-road-expressway-main-`     |              |             |高速道路        |高速道路
|`rgb(235,130,120)` | `-road-highway-main-`        |              |             |国道            |国道
|`rgb(255,255,0)`   | `-road-prefectural-main-`    |              |             |県道            |県道
|`rgb(255,255,255)` | `-road-normal-main-`         |RdCL          |             |その他の道路    |その他の道路
|`rgb(200,200,200)` | `-road-edge-`                |RdCL          |             |道路の枠線      |道路の枠線
|`rgb(173,173,173)` | `-road-edge-`                |RdCL          |             |                |道路の枠線
|`rgb(100,100,100)` | `-road-edge-`                |RdCL          |             |                |道路の枠線
|`rgb(0,0,0)`       | `-road-edge-`                |RdCL          |             |                |道路の枠線
|`rgb(0,155,191)`   | `-railway-subway-main-`      |              |             |地下鉄          |地下鉄
|`rgb(100,0,0)`     | `-railway-normal-main-`      |              |             |鉄道            |鉄道
|`rgb(255,255,255)` | `-railway-station-main-`     |RailCL        |             |                |鉄道（駅の白い部分）
|`rgb(173,173,173)` | `-railway-normal-main-`      |RailCL        |             |                |鉄道
|`rgb(100,100,100)` | `-railway-normal-main-`      |RailCL        |             |                |鉄道
|`rgb(0,0,0)`       | `-railway-normal-main-`      |RailCL        |             |                |鉄道
|`rgb(255,255,255)` | `-railway-normal-blank-`     |RailCL        |             |鉄道（白い部分） |JRの白黒表現の白の部分
|`rgb(190,210,255)` | `-water-main-main-`          |              |             |水域面          |水域
|`rgb(20,90,255)`   | `-water-main-vivid-`         |              |             |水涯線          |水涯線
|`rgb(0,176,236)`   | `-water-main-vivid-`         |              |             |                |水涯線(小ZL海岸線)
|`rgb(200,160,60)`  | `-landform-main-main-`       |              |             |等高線・地形    |砂礫地
|`rgb(235,242,235)` | `-landform-main-main-`       |              |             |                |砂礫地
|`rgb(200,250,230)` | `-wetland-main-main-`        |              |             |湿地            |湿地
|`rgb(217,217,217)` | `-water-main-vivid-`         |              |             |水域面          |万年雪
|`rgb(68,0,128)`    | `-border-muni-main-`         |              |             |国境・行政界    |市区町村界（紫）等
|`rgb(34,24,21)`    | `-border-muni-main-`         |              |             |                |行政区画界線国の所属界
|`rgb(231,39,65)`   | `-line-gray-`                |              |             |その他          |航路
|`rgb(150,150,150)` | `-line-gray-`                |              |             |                |特定地区界等
|`rgb(100,100,100)` | `-line-gray-`                |              |             |                |送電線等
|`rgb(200,200,200)` | `-line-gray-`                |              |             |                |ダム(面)等

