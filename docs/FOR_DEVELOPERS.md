# 開発者向け情報

## 目次
- [1. 事前準備](#1-事前準備)
- [2. 構築手順](#2-構築手順)
    - [2-1. LINE連携](#2-1-line連携)
    - [2-2. 実行](#2-2実行)
    - [2-3. 管理画面](#2-3-管理画面)
- [3. その他の設定](#3-その他の設定)
    - [3-1. セキュリティ設定](#3-1-セキュリティ設定)
    - [3-2. Slackのエラー通知設定](#3-2-slackのエラー通知設定)
    - [3-3. DBのバックアップ・リストア設定](#3-3-dbのバックアップリストア設定)
    - [3-4. カレンダー機能の分類ID削除について](#3-4-カレンダー機能の分類ID削除について)
- [4. バージョンアップについて](#4-バージョンアップについて)
- [5. ソースコードの開発について](#5-ソースコードの開発について)
- [6. 開発用コマンド一覧](#6-開発用コマンド一覧)

## 1. 事前準備
### 1-1. 実行環境

#### 推奨スペック

- メモリ割り当て : 7GB以上
    - 4GB程度またはそれ以下の場合、環境構築に失敗する可能性がございます

#### アプリケーション

以下のアプリケーションを、開発を行うローカル環境へインストールします。

| アプリケーション名 | 必須バージョン | 備考 |
|---|---|---|
| [Node.js](https://nodejs.org/ja/download/) | 14.x, 15.x | [npm バージョン7](https://docs.npmjs.com/cli/v7)以降の利用を推奨 |
| [Python](https://www.python.jp/install/install.html) | 3.8 | 複数バージョンを管理する場合、[pyenv](https://github.com/pyenv/pyenv) / [pyenv-win](https://github.com/pyenv-win/pyenv-win) の利用を推奨 |
| [AWS CLI](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/install-cliv2.html) | 2.0以上 ||
| [SAM CLI](https://docs.aws.amazon.com/ja_jp/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) | 1.0以上 ||

* Macの場合は `ターミナル`、Windowsの場合は [WSL 2](https://docs.microsoft.com/ja-jp/windows/wsl/) を立ち上げて作業を行ってください。
* pip ([macOS](https://www.python.jp/install/macos/pip.html) / [Windows](https://www.python.jp/install/windows/pip.html)) で必要なパッケージをインストールしてください。
```bash
$ pip install wheel setuptools
```

#### 推奨ブラウザ

管理画面の動作保証環境は、Chrome(最新版)のみとなります。


### 1-2. リポジトリのクローン

```
$ git clone git@github.com:linefukuoka/line-smart-city.git
```

### 1-3. AWSのプロファイル作成

「[AWSのプロファイル作成](./docs/AWS_CLI_CREATE_PROFILE.md)」をご参照ください。

## 2. 構築手順

### 2-1. LINE連携

#### 1. LINE Developersのチャネル作成

下記の手順に従って、LINE Developersの設定を行ってください。

* LINE Developers チャネル設定(Messaging API)
   * [スタック作成前の設定](./docs/LINE_MESSAGING_API_SETTINGS.md#1-スタック作成前の設定)
* LINE Developers チャネル設定(LINEログイン)
   * [スタック作成前の設定](./docs/LINE_LOGIN_SETTINGS.md#1-スタック作成前の設定)

なお、LINE DevelopersのMessaging APIチャネルから受信したMessaging APIイベントのうち、特定のイベントを任意の連携システムに転送することができます。詳細は [LINE Messaging API転送機能](./docs/LSC_FORWARD_MESSAGING_API_WEBHOOK.md) を参照ください。

#### 2. 設定情報の反映

「LINE SMART CITY GovTechプログラム」では、設定情報の管理に [AWS Secrets Manager](https://aws.amazon.com/jp/secrets-manager/)を利用しています。  
プロファイル名、環境名 (= AWSプロファイル名 + 開発者名など固有の値) はそれぞれ各自の環境に合った値に変更してください。

※ 環境名はカスタムドメイン設定を行う際、サブドメインに利用されます。  
例: `https://admin.環境名.line-smartcity.com`

**設定例**

| 用途 | プロファイル名 | 環境名 | 備考 |
|---|---|---|---|
| 本番 | lsc-fukuoka | lsc-fukuoka-prod | |
| ステージング | lsc-fukuoka-stg | lsc-fukuoka-stg | |
| 開発 | lsc-fukuoka-dev | lsc-fukuoka-dev-tanaka<br>lsc-fukuoka-dev-suzuki | |

1. シークレット作成  
   [環境構築スクリプト（`lsc.sh`）](./docs/LSC_COMMANDS.md#1-環境構築スクリプトについて)を使って、シークレットを作成します。
   
```bash
$ ./lsc.sh -e 環境名 -p プロファイル名 secrets create
```

2. シークレット修正

`deploy/secrets_manager/環境名.json` を開き、下記のキーを編集します。

| No | LINE OA | シークレットキー | 内容 | 備考 |
|:---|:---|:---|:---|:---|
| 1 | 本番/ステージング/開発 | LINEMESSAGING_CHANNEL_ACCESS_TOKEN | LINE Messaging APIのチャネルアクセストークン | |
| 2 | 本番/ステージング/開発 | LINEMESSAGING_CHANNEL_ID | LINE Messaging APIのチャネルID | |
| 3 | 本番/ステージング/開発 | LINEMESSAGING_CHANNEL_SECRET | LINE Messaging APIのチャネルシークレット | |
| 4 | サンドボックス | SB_LINEMESSAGING_CHANNEL_ACCESS_TOKEN | LINE Messaging APIのチャネルアクセストークン | ステージング/開発の場合、1と同じ値 |
| 5 | サンドボックス | SB_LINEMESSAGING_CHANNEL_ID | LINE Messaging APIのチャネルID | ステージング/開発の場合、2と同じ値 |
| 6 | サンドボックス | SB_LINEMESSAGING_CHANNEL_SECRET | LINE Messaging APIのチャネルシークレット | ステージング/開発の場合、3と同じ値 |
| 7 | 共通 | VUE_APP_LIFF_ID | LIFF アプリケーションのLIFF ID | |
| 8 | 共通 | SURVEY_LINELOGIN_CHANNEL_ID | LINEログインのチャネルID | |
| 9 | 共通 | SURVEY_LINELOGIN_CHANNEL_SECRET | LINEログインのチャネルシークレット | |
| 10 | 共通 | DISTRIBUTION_MSG_CHANNEL_ACCESS_TOKEN | LINE Messaging APIのチャネルアクセストークン | 1と同じ値 |
| 11 | 共通 | DISTRIBUTION_MSG_CHANNEL_SECRET | LINE Messaging APIのチャネルシークレット | 3と同じ値 |
| 12 | 共通 | DISTRIBUTION_TRIGGER_EMAIL | セグメント配信で利用する受信メールアドレス。「任意の文字 + `@環境名.ルートドメイン (example.com など)`」を入力 | 入力例：`mail@lsc-fukuoka-dev.line-smartcity.com`<br />入力しなかった場合、デプロイ時にデフォルト値`receive-mail@環境名.ルートドメイン`が設定されます<br />**カスタムドメインを有効にしていない場合は外部配信機能は利用できません** |
| 13 | 共通 | VUE_APP_MEMBERS_TAB | 会員帳票機能の有効・無効を切り替え | 有効にする場合`1`に変更 |

* 参考：Secrets Managerで設定している値の詳細は、「[環境変数](./docs/LSC_ENVIRONMENT_VARIABLES.md)」を確認してください。

3. シークレット反映  
jsonを編集後、下記を実行してシークレット更新します。
```bash
$ ./lsc.sh secrets update
```

### 2-2.実行

#### 1. AWS設定

カスタムドメインやメール連携の初期設定のため、Amazon Route53（以下、「Route53」）やAmazon SES （以下、「SES」）の設定を行います。[AWS設定](./docs/AWS_SETTINGS.md) をご参照ください。

#### 2. 初期構築
下記のコマンドを実行することで、AWS環境のデプロイを行います。
* 所要時間は約40〜50分です

```bash
$ ./lsc.sh deploy
```

* 下記オプションを使用することで、スタック削除保護を有効化します。（本番環境では有効化を推奨）
  
    * ```bash
      $ ./lsc.sh deploy --enable-termination-protection
      ```
    
* SAMのビルド途中でPython関係のエラーが出る場合は、[Docker](https://www.docker.com/products/docker-desktop)をインストールして起動し、`--useContainer`オプションを付けて実行してください。
  
    *  ```bash
       $ ./lsc.sh deploy --useContainer
       ```

* Lambdaのデプロイ途中でメモリ制限エラー `'MemorySize' value failed to satisfy constraint: Member must have value less than or equal to 3008` が発生した場合、`--work-around-lambda-memory-limit`オプションを付けて実行してください。

    *  ```bash
       $ ./lsc.sh deploy --work-around-lambda-memory-limit
       ```
    * メモリサイズを変更してデプロイする場合のシステム影響については、[--work-around-lambda-memory-limitオプション適用時の注意点](./docs/LSC_COMMANDS.md#--work-around-lambda-memory-limitオプション適用時の注意点)を参照ください。

* オプションの詳細は「[開発用コマンド一覧](./docs/LSC_COMMANDS.md#3-コマンド即座に実行)」をご確認ください。


#### 3. LINE Developersのチャネル設定変更
LINE Developersに戻り、下記の手順に従ってチャネルの設定を行ってください。

* [LINE Developers チャネル設定(Messaging API) > スタック作成後の設定](./docs/LINE_MESSAGING_API_SETTINGS.md#2-スタック作成後の設定)
* [LINE Developers チャネル設定(LINEログイン) > スタック作成後の設定](./docs/LINE_LOGIN_SETTINGS.md#2-スタック作成後の設定)

チャネルの設定完了後、下記コマンドを実行してLIFFアプリのビルド、デプロイを行います。

```bash
# LIFFのビルド、デプロイ
$ ./lsc.sh survey liff refresh
```

#### 4. SESの受信メールアドレス設定

* AWSコンソールにてSESを開いてメールアドレス設定を実施してください。
    * [SESの受信メールアドレス設定](./docs/AWS_SES_RECEIVING_EMAIL_SETTINGS.md)

### 2-3. 管理画面

#### 1. 管理画面のユーザー作成
管理画面の認証で使用するユーザーを作成します。下記を実行します。

```bash
$ ./lsc.sh users
```

* `select what to do` とメニューが出るので「Add」を選択します。
* `Input username` で、ログインするユーザー名を入力します。
    * 最低5文字以上
* `Input mail address` でメールアドレスを入力します（次のステップで設定したパスワードが送られてきます）
* `Input password` では、パスワードを英数字8文字以上で入力します。
* `Select Groups` でユーザーに追加するグループを選択します。
    * 上下キーで移動してスペースキーでグループ名を選択します。
    * デフォルトでは `Administrator:admins` が選択されています。（1.6.2以下のバージョンでは`admins` です）
    * 古いグループ名 `admins`, `members`, `guests`, `operators`, `develop` が存在する場合がありますが、非推奨のため選択しないようお願いします。
    * `Select Groups`の選択が完了後、Enterキーで確定します。
    * グループ名は「所属チーム名:付与権限」で構成されます。
    * 「所属チーム名」は業務における所属組織をイメージした要素です。（例：総務課、営業第一課、経理 など）
        * `Administrator`は管理者チームです。新規チームについては管理画面より追加ください。
    * 「付与権限」には以下の種類があります。
        * admins：すべての操作が可能
        * members：全体に影響を与える操作（システム設定、シナリオ切替、リッチメニュー切替）やユーザ管理等の操作以外
        * operators：外部委託を想定した操作権限を付与（帳票の登録内容閲覧や編集・カレンダーの予約枠数の閲覧など）
        * guests：基本的に読み取り権限のみ

#### 2. 管理画面へのアクセス

* AWSコンソールからCloudFormationにアクセスし、スタック名（環境名 + `-platform-static`）の出力タブにある`CloudFrontURL`にアクセスすると管理画面が見れます
* 「管理画面のユーザー作成」で作成したユーザー名・パスワードでログインします。
![CloudFrontURL 場所](./docs/images/cfn-output-admin-url.png)

#### 3. シナリオ設定
LINE公式アカウントを利用できる状態にするため、シナリオ設定を行います。  
シナリオ設定については、「[管理画面 | シナリオ設定](./docs/LSC_ADMIN_SCENARIO_SETTINGS.md)」をご参照ください。

#### 4. 損傷報告先メールアドレスの設定
損傷報告先メールアドレスを設定します。

* 管理画面にログインする
* メニューより「システム設定 > AWS設定」を選択
* 以下項目を入力

| No | LINE OA | シークレットキー | 内容 | 備考 |
|:---|:---|:---|:---|:---|
| 1 | 共通 | EMAIL_CHATBOT_DAMAGE_REPORT1 | 損傷報告メールアドレス1 | シナリオ設定 「ノーマルカテゴリボタン」の「アクション1」完了時の送信先メールアドレス |
| 2 | 共通 | EMAIL_CHATBOT_DAMAGE_REPORT2 | 損傷報告メールアドレス2 | シナリオ設定 「ノーマルカテゴリボタン」の「アクション2」完了時の送信先メールアドレス |
| 3 | 共通 | EMAIL_CHATBOT_DAMAGE_REPORT3 | 損傷報告メールアドレス3 | シナリオ設定 「ノーマルカテゴリボタン」の「アクション3」完了時の送信先メールアドレス |
| 4 | 共通 | EMAIL_CHATBOT_DAMAGE_REPORT4 | 損傷報告メールアドレス4 | シナリオ設定 「ノーマルカテゴリボタン」の「アクション4」完了時の送信先メールアドレス |

* 「保存」ボタンをクリックして、損傷報告先メールアドレスを保存する

#### 損傷報告先メールアドレスの利用箇所
* EMAIL_CHATBOT_DAMAGE_REPORT1〜4は、シナリオ設定 「ノーマルカテゴリボタン」のアクション1〜4で利用されます。

##### 例）
シナリオ設定 > サンドボックス > 編集 > 「トーク名：損傷報告」

![シナリオ設定 損傷報告](./docs/images/lsc-scenario-damage-report.png)

## 3. その他の設定

### 3-1. セキュリティ設定

* 管理画面
    * パスワードのポリシーを変更する
        * 管理画面にログインする
        * メニューより「ユーザ設定 > ポリシー設定」を選択
        * パスワードのポリシーを変更する

* AWS
    * IPアドレス制限
        * AWSコンソールにてAWS WAFを開いてIPアドレス制限を実施してください。
            * [IPアドレス制限](./docs/AWS_WAF_IPSET.md)
    * Amazon Cognitoのセキュリティ設定
        * 管理画面ログインやLIFFのログインで利用されるAmazon Cognitoのセキュリティ設定です。
            * [Amazon Cognitoのセキュリティ設定](./docs/AWS_COGNITO_SECURITY_SETTINGS.md)
    * DynamoDBのセキュリティ設定
        * カスタマーマネージドキーを使用したAWS DynamoDBの暗号化
            * [環境構築スクリプトのセキュリティオプション](./docs/LSC_SECURITY_OPTIONS.md)


### 3-2. Slackのエラー通知設定

「[Slackのエラー通知設定](./docs/LSC_SLACK_NOTIFICATION.md)」をご参照ください。

### 3-3. DBのバックアップ・リストア設定

「[DBのバックアップ・リストア設定](./docs/LSC_DB_BACKUP.md)」をご参照ください。


### 3-4. カレンダー機能の分類ID削除について

「[カレンダー機能の分類ID削除について](./docs/LSC_ADMIN_DELETE_CALENDAR_CATEGORY.md)」をご参照ください。

## 4. バージョンアップについて

数世代前の旧バージョンから最新版にバージョンアップする場合、  
事前に「[LINE SMART CITY GovTechプログラム：マイグレーション](./docs/LSC_MIGRATIONS.md)」をご参照ください。

### 1. リモートリポジトリの変更内容を取り込む

```
$ git remote -v
origin	git@github.com:linefukuoka/line-smart-city.git (fetch)
origin	git@github.com:linefukuoka/line-smart-city.git (push)

$ git fetch origin main
$ git pull 
```

* 既存の環境を**1.8.2以下のバージョンから1.9.0以上にアップデートした場合、以下のDB移行コマンドを実行**してください。
    * 実行しない場合、予約可能期間が正しく設定できませんので、必ず実行をお願い致します

```
$ ./lsc.sh migrate v1.9.0
```

* 1.8.1以下のバージョンからバージョンアップした後、`commands/`以下の不要なファイルがGitに残りますので、以下のコマンドで削除を行ってください。

```
$ git status -s | awk '{print $2}' | xargs rm -fdr
```

#### バージョン1.8.1以下の場合
`./lsc.sh build`の実行が必要です。

```
$ git remote -v
origin	git@github.com:linefukuoka/line-smart-city.git (fetch)
origin	git@github.com:linefukuoka/line-smart-city.git (push)

$ git fetch origin main
$ git pull 

#lsc.shのビルド
$ ./lsc.sh build
```

#### バージョン1.1.2以下の場合

```
$ git remote -v
origin	git@github.com:linefukuoka/line-smart-city.git (fetch)
origin	git@github.com:linefukuoka/line-smart-city.git (push)

$ git fetch origin main
$ git reset --hard origin/main

#lsc.shのビルド
$ ./lsc.sh build
```

### 2. 全環境の更新

下記を実行することで、シークレットのキー及びバージョン値の更新後、環境を全て更新します。

* **1.10.0以降のバージョンから、lsc.shではNode.js v12以下は利用できなくなりました。[1-1. 実行環境](#1-1-実行環境)のバージョンにアップデートしてください**
* 時間がかかりますので、一部だけ更新する場合は個別に行ってください（「[モジュール単位の更新](./docs/LSC_COMMANDS.md#モジュール単位の更新)」参照）

* オプションコマンドを付与して初期構築した場合は、環境更新時も初期構築時と同じオプションを付与するようにしてください。

```bash
$ ./lsc.sh deploy
```

## 5. ソースコードの開発について

### 5-1. 依存モジュールのインストール

各パッケージの初期化、及び依存モジュールをインストールするため以下のコマンドを実行します

```
npm install
npm run bootstrap
```

### 5-2. 命名規則やコードのフォーマット
* 命名規則
    * モジュール名（フォルダやファイル名）はハイフンケースとします
    * 目的が不明確な名前の付け方を極力避けるようにします
        * 例えば、`common` や `general` というモジュール名にすると用途が広すぎるので、管理がしづらくなります
* ソースコードのフォーマット (JavaScript)
    * 関数名や変数名は、キャメルケースで書いてください（例: `someFunction()`, `someConst`）
    * クラス名はアッパーキャメルケースで書いてください。但し略称などの場合はアッパーケースも可とします
        * 例：`SampleClass`, `SAMConfig` など

### 5-3. copyrightヘッダの追加
* すべてのソースファイルは、次のcopyrightヘッダーで始まる必要があります。

```
/*
 * Copyright $today.year LINE Fukuoka Corporation
 *
 * LINE Corporation licenses this file to you under the Apache License,
 * version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at:
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
```

## 6. 開発用コマンド一覧
「[開発用コマンド一覧](./docs/LSC_COMMANDS.md)」をご参照ください。

