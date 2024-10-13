# styling-tools-for-gsi-optbv
地理院の最適化ベクトルタイルのスタイリング用のツール

[最適化ベクトルタイル](https://github.com/gsi-cyberjapan/optimal_bvmap)のスタイリング用ツールです。
上記レポジトリで公開されている std.json をもとに、オリジナルカラーのスタイルを生成します。

解説記事（Qiita）→ https://qiita.com/mg_kudo/items/2560f663d657c3ce1125

![サンプル](./sample.png)
## 2D
極力元のスタイルの構造を活かしています。

[basic](https://mghs15.github.io/styling-tools-for-gsi-optbv/index.html?style=basic)
/ [dark](https://mghs15.github.io/styling-tools-for-gsi-optbv/index.html?style=dark)
/ [dark2](https://mghs15.github.io/styling-tools-for-gsi-optbv/index.html?style=dark2)
/ [mono](https://mghs15.github.io/styling-tools-for-gsi-optbv/index.html?style=mono)
/ [mono2](https://mghs15.github.io/styling-tools-for-gsi-optbv/index.html?style=mono2)
/ [blueprint](https://mghs15.github.io/styling-tools-for-gsi-optbv/index.html?style=blueprint)
/ [radar](https://mghs15.github.io/styling-tools-for-gsi-optbv/index.html?style=radar)
/ [railway](https://mghs15.github.io/styling-tools-for-gsi-optbv/index.html?style=railway)
/ [muni](https://mghs15.github.io/styling-tools-for-gsi-optbv/index.html?style=muni)
/ [chisui](https://mghs15.github.io/styling-tools-for-gsi-optbv/index.html?style=chisui)
/ [darkrail](https://mghs15.github.io/styling-tools-for-gsi-optbv/index.html?style=darkrail)

## 3D 風
元のスタイルの構造を多少加工。個人的な感覚では見やすくしています。

[fx-basic](https://mghs15.github.io/styling-tools-for-gsi-optbv/index.html?style=fx-basic)
/ [fx-dark](https://mghs15.github.io/styling-tools-for-gsi-optbv/index.html?style=fx-dark)
/ [fx-dark2](https://mghs15.github.io/styling-tools-for-gsi-optbv/index.html?style=fx-dark2)
/ [fx-mono](https://mghs15.github.io/styling-tools-for-gsi-optbv/index.html?style=fx-mono)
/ [fx-mono2](https://mghs15.github.io/styling-tools-for-gsi-optbv/index.html?style=fx-mono2)
/ [fx-blueprint](https://mghs15.github.io/styling-tools-for-gsi-optbv/index.html?style=fx-blueprint)
/ [fx-radar](https://mghs15.github.io/styling-tools-for-gsi-optbv/index.html?style=fx-radar)
/ [fx-railway](https://mghs15.github.io/styling-tools-for-gsi-optbv/index.html?style=fx-railway)
/ [fx-muni](https://mghs15.github.io/styling-tools-for-gsi-optbv/index.html?style=fx-muni)
/ [fx-chisui](https://mghs15.github.io/styling-tools-for-gsi-optbv/index.html?style=fx-chisui)
/ [fx-darkrail](https://mghs15.github.io/styling-tools-for-gsi-optbv/index.html?style=fx-darkrail)

## 派生元レポジトリ
以下のレポジトリでの成果をベースにしています。参考文献等もご参照ください。
* https://github.com/mghs15/simple-style-tools
* https://github.com/mghs15/style-color-change-on-web

## 使い方
### 1. `makeTemplate.js`
もとになる `std.json` からひな型となる `template.json` を作成する。
  * 地図デザインで使われている色を、地物のカテゴリごとに分類する。
  * 分類した色を文字列（色キー名）として `template.json` に埋め込む（`template.json` そのものは Mapbox GL JS で利用できない。）。
  * 追加レイヤ `additionalLayers.json`（鉄道駅、行政界強調用レイヤ、`fill-extrusion` による建物 3D レイヤ）の統合。
### 2.1. `convert.js`
作成した `template.json` の文字列を使いたい配色セットで置き換える。
  * 配色セットは、今のところ、`convert.js` にハードコードされている。
  * 配色セットの中から、どの配色にするかについては、１つ目の引数に渡す。
  * 主な関数は２つ
    * `convertColor()`
      * 文字列（`rgb(r,g,b)`、`hsl(h,s%,l%)`）、色キー名の場合：文字列は配列形式（`["rgba", r, g, b, a]` 等）へ変換・キー名の場合はカラーセットから目的の rgb を配列形式を取得→ `changeColor()` に渡す→配列からテキスト形式（`rgba(r,g,b,a)` 等）に変換して返す。
      * 配列：再帰的に処理を行う。最後にとりまとめた結果を配列で返す。
      * その他：そのままの値を返す。
    * `changeColor()`
      * モノクロ系統については、色の変換を行う。
      * `["rgba", r, g, b, a]`、`["hsla", h, "s%", "l%", a]` の配列を返す。
      * 内部的に rgb と hsl の変換が入る。
  * 色以外にも、線幅や破線のデザイン等を変更。
  * 引数に何らかの文字を渡すと、建物の 3D と 2D 表現を切り替え。
  * スタイルによっては、レイヤの順番を変更（例：`railway` スタイル）。
### 2.2. `convert2.js`
`convert.js` の配色セット及びレイヤの非表示・順序設定を外部ファイル化したのもの。
  * 引数は、`配色ファイルパス`、`レイヤの非表示・順序設定ファイルパス`、`出力ファイルパス`
    ```
    node convert2.js ./src/color-basic.csv ./src/layerinfo-2d.csv ./docs/basic.json
    ```
  * 配色ファイル
    * CSV ファイル
    * フィールドは以下の通り
      * colorset-name: カラーセット名（いまのところ不使用）
      * color-key: 色キー名
      * type: `rgb` で固定（いまのところ不使用）
      * R: 赤
      * G: 緑
      * B: 青
  * レイヤの非表示・順序設定ファイル
    * CSV ファイル
    * フィールドは以下の通り
      * number: レイヤのデフォルト順。大きい方が優先度が高い
      * layer-id: スタイルレイヤの id
      * visibility: レイヤの表示（`visible`）・非表示（`none`）のいずれか
      * z-index: レイヤの順序。大きい方が優先度が高い
  * 色以外の、線幅や破線のデザイン等については、`convert.js` 内にハードコードが必要（いまのところ未設定）。
### 3. `setup.js`
スタイル一式を `docs` フォルダへ出力する。
  * 内部では、`convert2.js` を呼び、`template.json` を指定されたスタイル一式へ変換する。
  * `convert2.js` 用の引数は、配列として、変数 `list` にハードコード。

## 色キーの一覧

[色キーの一覧](./COLOR-KEYS.md)

## 変更履歴
主なもののみ記載
### 2024/10/12
* 色やレイヤの設定を外部ファイル化した `convert2.js` を追加し、`setup.js` での利用ツールを `convert2.js` へ変更。
* `dark2.json` のレイヤ順を変更し、鉄道の優先度を挙げた `darkrail.json` を追加。
* `convert2.js` の使用に伴い、既存スタイルの一部デザインを変更。
### 2024/05/26
* 地形・水域等を強調したスタイル（[chisui](https://mghs15.github.io/styling-tools-for-gsi-optbv/index.html?style=chisui)）を追加。
### 2023/12/31
* 自治体の境界（`AdmBndr` レイヤ）を強調したスタイル（[muni](https://mghs15.github.io/styling-tools-for-gsi-optbv/index.html?style=muni)）を追加。
### 2023/09/01
* 国土地理院最適化ベクトルタイルの [PMTiles 版の公開とファイルシステム版の公開終了予告](https://github.com/gsi-cyberjapan/optimal_bvmap)に伴い、本レポジトリで作成されるスタイルも PMTiles 版へ移行（サンプルも PMTiles 版へ変更）。
### 2023/06/17
* `makeTemplate.js` で作成される `template.json` には、その後の処理で必要な可能性のあるレイヤをすべて含めることとした（`template.json` には、重複するレイヤが混在することになるので、`convert.js` でスタイルに応じて適切にフィルタリングする）。
* 色以外の調整（線幅やレイヤ順等）処理を `makeTemplate.js` から `convert.js` へ移動。
### 2023/03/25
* 駅の色用のキー名を追加。
* 駅部分の色、道路の枠線の色を変更。
