# styling-tools-for-gsi-optbv
地理院の最適化ベクトルタイルのスタイリング用のツール

[最適化ベクトルタイル](https://github.com/gsi-cyberjapan/optimal_bvmap)のスタイリング用ツールです。
上記レポジトリで公開されている std.json をもとに、オリジナルカラーのスタイルを生成します。

![サンプル](./sample.png)
* https://mghs15.github.io/styling-tools-for-gsi-optbv/index.html?style=basic
* https://mghs15.github.io/styling-tools-for-gsi-optbv/index.html?style=dark2
* https://mghs15.github.io/styling-tools-for-gsi-optbv/index.html?style=mono2

以下のレポジトリでの成果をベースにしています。

https://github.com/mghs15/simple-style-tools

## 使い方
1. `makeTemplate.js`でもとになる`std.json`からひな型となる`template.json`を作成する。
  * 地図デザインで使われている色を、地物のカテゴリごとに分類する。
  * 分類した色を文字列として`template.json`に埋め込む（`template.json`そのものをMapbox GL JSで利用できない。）。
  * 一部色以外にも、線の太さ等を変更している。
2. `convert.js`で`template.json`の文字列を使いたい配色セットで置き換える。
  * 配色セットは、今のところ、`convert.js` にハードコードされている。
  * 配色セットの中から、どの配色にするかについても、変数 `mode` としてハードコードされている。

