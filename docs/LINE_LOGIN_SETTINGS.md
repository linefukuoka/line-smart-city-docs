# LINE Developers チャネル設定(LINEログイン)

## 目次
  - [1. スタック作成前の設定](#1-スタック作成前の設定)
    - [1-1. LINE DevelopersでProviderを選択](#1-1-line-developersでproviderを選択)
    - [1-2. LINEログイン チャネルを作成](#1-2-lineログイン-チャネルを作成)
    - [1-3. Secrets Manager設定項目を控える](#1-3-secrets-manager設定項目を控える)
  - [2. スタック作成後の設定](#2-スタック作成後の設定)
    - [2-1. LIFFの設定変更](#2-1-liffの設定変更)

## 1. スタック作成前の設定
先ずは1-1.〜1-3.の手順を行ってください。

### 1-1. LINE DevelopersでProviderを選択
[LINE Developers](https://developers.line.biz/ja/)にログインします  
※ 「ビジネスアカウントでログイン」を選択

* プロバイダーの選択
    * トップより [LINE Developers チャネル設定(Messaging API)](./LINE_MESSAGING_API_SETTINGS.md#1-line-developersでproviderを作成)で作成したプロバイダーを選択します

### 1-2. LINEログイン チャネルを作成
* チャネルの作成
    * 新規チャネル作成より、LINE Loginを選択
    * 以下項目を入力

    | 項目 | 説明 | 入力内容 | 例 |
    |---|---|---|---|
    | チャネル名 | 作成するチャネルの名前 | 任意。チャネル名には、「LINE」またはそれに類する文字列は含められません。 | XX市 (アンケート) |
    | チャネル説明 | 作成するチャネルの説明 | 任意 | XX市 (アンケート) |
    | アプリタイプ | 提供するアプリタイプ | 「Web app」にチェックを入れる | |
    | メールアドレス | メールアドレス | 自分のメールアドレス | |
    
    * 各利用規約に同意し、作成ボタンをクリック
    * 補足
        * チャネルアイコン、プライバシーポリシーURL、サービス利用規約URLは任意で入力する
    
* LIFFアプリケーションの作成
    * LIFFのタブをクリック
    * 追加ボタンをクリック
    * 以下項目を入力

    | 項目 | 説明 | 入力内容 | 例 |
    |---|---|---|---|
    | LIFFアプリ名 | LIFFアプリの名前 | 任意 | アンケート |
    | サイズ | LIFFアプリのサイズ | Full |  |
    | エンドポイントURL | エンドポイントのURL | 任意 | `https://dummy` などを設定して後で変更する |
    | Scopes | LIFFアプリの動作に必要なスコープ | 「openid、profile、chat_message.write」の3つにチェック<br>※「chat_message.write」は、View allをタップすると表示されます |  |
    | ボットリンク機能 | LINE公式アカウントを友達として追加する際の表示オプション<br />参考：[LINEログインしたときにLINE公式アカウントを友だち追加する（ボットリンク）](https://developers.line.biz/ja/docs/line-login/link-a-bot/) | 設定不要 |  |
    
    * 追加ボタンを押す

### 1-3. Secrets Manager設定項目を控える

* Secrets Managerの設定に必要な項目を控えておきます（後ほど利用するため）
    * チャネルID
        * 上記で作成したMessaging APIのチャネル基本設定画面にある「チャネルID」
    * チャネルシークレット
        * 上記で作成したMessaging APIのチャネル基本設定画面にある「チャネルシークレット」
    * LIFF ID
        * 上記で作成したLIFFアプリケーションの「LIFF ID」

## 2. スタック作成後の設定
下記は、[初期構築](../README.md#2-初期構築)の後に行ってください。

### 2-1. LIFFの設定変更
* 作成したLINE Loginチャネルにアクセスし、下記の設定を行います。
    * 作成したLIFFの`Endpoint URL`
        * 「LIFF」タブにあるLIFFの詳細設定 → `Endpoint URL`に下記を入力
            *  `deploy/secrets_manager/環境名.json` にある `VUE_APP_LIFF_WEB_URL` の値 + `/login`
            * 入力例：`https://liff.lsc.line-smartcity.com/login`
