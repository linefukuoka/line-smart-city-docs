# 決済機能の設定手順
決済機能を利用する場合、以下の通り設定してください。
決済モジュールではNAT Gateway、Elastic IPを利用する為AWSアカウントの使用料が追加で発生します。(目安 : 月額約4000円)

## 目次
  - [1. 固定IPアドレスの発行](#1-固定IPアドレスの発行)
  - [2. SoftBankPaymentServiceに決済機能の利用申請](#2-SoftBankPaymentServiceに決済機能の利用申請)
  - [3. シークレット修正](#3-シークレット修正)

## 1. 固定IPアドレスの発行
### 1-1. `--usePayment`オプションを付与してデプロイ
* `--usePayment`オプションを付与してデプロイをします。
* 所要時間は約40〜50分です

```bash
$ ./lsc.sh deploy --usePayment
```

### 1-2. 固定IPアドレスの確認
* `deploy/secrets_manager/環境名.json` を開き、`PAYMENT_GATEWAY_STATIC_IP`の値が設定されていることを確認します。

## 2. SoftBankPaymentServiceに決済機能の利用申請
* SoftBankPaymentServiceについては、[SoftBankPaymentServiceのページ](https://www.sbpayment.jp/)を確認してください。
* 下記の項目を確認してSoftBankPaymentServiceに決済機能の利用申請をします。
  * 購入要求時にハッシュチェックをしない設定をして欲しい旨を伝える。
  * 利用したい支払方法として「クレジットカード」「LINE Pay」「PayPay」から1つ以上選択(複数種類可)して申請する。
  * 課金タイプは「都度課金」かつ「自動売上」で申請する。
  * 「システム設定」という項目で、「接続方式」を「リンク型+API型」で申請する。
* 申請後に下記の値が払い出されるので、各環境変数に設定をします。
  * マーチャントID
  * リンク型決済APIのエンドポイント
  * API型決済APIのエンドポイント
  * API型決済APIの呼び出しに必要なベーシック認証ID
  * API型決済APIの呼び出しに必要なベーシック認証パスワード
  * 決済APIの呼び出しに利用する暗号化キー

## 3. シークレット修正
### 3-1. シークレット修正
`deploy/secrets_manager/環境名.json` を開き、下記のキーを編集します。
詳細は、[決済機能を利用する場合の環境変数](#決済機能を利用する場合の環境変数)をご参照ください。

  * `VUE_APP_USE_PAYMENT`(1の場合、決済機能が有効)
  * `VUE_APP_PAYMENT_MERCHANT_ID`
  * `VUE_APP_PAYMENT_LINK_TYPE_ENDPOINT_URL`
  * `PAYMENT_API_TYPE_ENDPOINT_URL`
  * `PAYMENT_API_AUTH_ID`
  * `PAYMENT_API_AUTH_PASS`
  * `VUE_APP_PAYMENT_API_KEY`

### 3-2. シークレット反映  
jsonを編集後、下記を実行してシークレット更新します。
```bash
$ ./lsc.sh secrets update
```

## 4. 関連スタックの更新
下記のコマンドで決済機能に関連するスタックを更新します。
* platformスタック更新
```bash
$ ./lsc.sh platform fresh
```

* surveyスタック更新
```bash
$ ./lsc.sh survey fresh
```

* paymentスタック更新
```bash
$ ./lsc.sh payment fresh
```

## 決済機能を利用する場合の環境変数
| シークレットキー                               | 内容                                                                                          | 備考                                                             | シークレット値の例                                          |
|:---------------------------------------------|:---------------------------------------------------------------------------------------------|:-----------------------------------------------------------------|:-----------------------------------------------------------------|
| VUE_APP_USE_PAYMENT| 決済機能を有効・無効を切り替えます。 | デフォルトは無効。決済スタックのデプロイ・削除時に自動で更新される値のため、手動で変更はしないでください。 | 1 -> 有効 0 -> 無効 |
| VUE_APP_PAYMENT_MERCHANT_ID | SoftBankPaymentServiceから発行されたマーチャントIDを入力します。  | | `000` |
| VUE_APP_PAYMENT_LINK_TYPE_ENDPOINT_URL | SoftBankPaymentServiceから発行されたリンク型決済APIのエンドポイント。 | ※本番環境・テスト環境を切り替える際はこの値を変更してください。 | 本番環境：`SoftBankPaymentServiceから発行された本番環境用URL` <br> テスト環境：`SoftBankPaymentServiceから発行された試験環境用URL` |
| PAYMENT_API_TYPE_ENDPOINT_URL | SoftBankPaymentServiceから発行されたAPI型決済APIのエンドポイント。 | ※本番環境・テスト環境を切り替える際はこの値を変更してください。 | 本番環境：`SoftBankPaymentServiceから発行された本番環境用URL` <br> テスト環境：`SoftBankPaymentServiceから発行された試験環境用URL` |
| PAYMENT_API_AUTH_ID | SoftBankPaymentServiceから発行されたAPI型決済APIの呼び出しに必要なベーシック認証ID。  | | `00000` |
| PAYMENT_API_AUTH_PASS | SoftBankPaymentServiceから発行されたAPI型決済APIの呼び出しに必要なベーシック認証パスワード。 | | `XXXXXXXX` |
| VUE_APP_PAYMENT_API_KEY | SoftBankPaymentServiceから発行された決済APIの呼び出しに利用する暗号化キー。 | | `XXXXXXXX` |
| PAYMENT_GATEWAY_STATIC_IP | SoftBankPaymentServiceの決済APIへリクエストをするLambdaにアタッチされた固定IPアドレス。 | ※決済スタックのデプロイ時に自動で書き込みがされる値のため、手動では変更しないでください。また、SoftBankPaymentServiceへ利用申請時、接続元IPアドレスはこの値で申請をしてください。 | `192.0.2.1` |