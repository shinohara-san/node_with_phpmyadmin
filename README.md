# Node.js with phpmyadmin

[Youtube](https://www.youtube.com/watch?v=f5kye3ESXE8&list=WL&index=10&t=934s)

## メモ

### app.js
- XAMPP起動
- htdocs内にファイルを置く
- 変数poolでphpmyadminとの接続
- 以降のapp.〇〇(get, post, delete, put)でsql文を実行
- まずpool.getConnectionでdbに接続している

 ### POSTMAN
 - METHODを選択
 - localhost:5000の後ろに必要に応じてid
 - 書き込む動作についてはBody、raw、JSONを選択すること

### formでmethodをdeleteやputにしたいとき
 - [こちら](http://portaltan.hatenablog.com/entry/2015/07/22/122031)
