# LINE SMART CITY GovTechプログラム：マイグレーション

LINE SMART CITY GovTechプログラムの最新バージョンへのバージョンアップ方法について記載します。バージョンアップ毎の影響については、「[LINE SMART CITY GovTechプログラム：マイグレーション - 影響範囲](./LSC_MIGRATIONS_IMPACT.md)」をご参照ください。

## 目次

- [1. バージョンアップの最短ルート](#1-バージョンアップの最短ルート)
- [2. 事前準備](#2-事前準備)
- [3. バージョンアップ手順](#3-バージョンアップ手順)
    - [1.21.2 → 1.22.1](#1212--1221)
    - [1.20.1 → 1.21.2](#1201--1212)
    - [1.19.0 → 1.20.1](#1190--1201)
    - [1.18.2 → 1.19.0](#1182--1190)

## 1. バージョンアップの最短ルート
* 1.21.2 → 1.22.1
    * Node.js： v16.x.x、npm：7.x.x、SAM CLI：1.49.0以上
* 1.20.1 → 1.21.2
    * Node.js： v14.x.x、npm：7.x.x、SAM CLI：1.0.0以上
* 1.18.2 → 1.19.0 → 1.20.1
    * Node.js： v14.x.x、npm：6.x.x、SAM CLI：1.0.0以上
    * 削除予定のライブラリを含むため、`replace-lsc-npm.sh` によるライブラリパス置換が必要です。

### 備考
* 上記のバージョンアップについて、動作検証を行っています。
* GitHubの[Issue](https://github.com/linefukuoka/line-smart-city/issues)の回答について、LINE SMART CITY GovTechプログラムの最新バージョンが対象になります。旧バージョンに関するお問い合わせは回答の対象外となりますので、ご了承ください。  
* 以下の条件を満たした時点で動作保証の対象外となりますので、ご了承ください。
    * 利用している言語（Node.js、Pythonなど）がサポート切れになった場合
    * AWS Lambdaの言語サポートがなくなった場合
    * 利用しているライブラリがサポート切れなどで利用できなくなった場合
    * 連携しているシステムがサポート切れになった場合

## 2. 事前準備
### 2-1. ライブラリの取得

```
# リポジトリのクローン
$ git clone git@github.com:linefukuoka/line-smart-city.git

# ブランチを変更
$ git checkout -b libraries origin/libraries

librariesブランチに含まれるファイルは以下の通りです。

$ tree
.
├── libraries（LINE SMART CITY GovTechプログラム用ライブラリファイル）
│   ├── lsc-distribution-mail-processor-0.4.4.tgz
│   ├── lsc-dynamodb-patterns-0.1.2.tgz
│   ├── lsc-dynamodb-patterns-0.2.4.tgz
│   ├── lsc-dynamodb-patterns-0.3.11.tgz
│   ├── lsc-dynamodb-patterns-0.4.0.tgz
│   ├── lsc-dynamodb-patterns-0.4.1.tgz
│   ├── lsc-lambda-common-0.3.1.tgz
│   ├── lsc-lambda-common-0.4.4.tgz
│   ├── lsc-lambda-common-0.5.32.tgz
│   ├── lsc-lambda-common-0.5.34.tgz
│   ├── lsc-lambda-common-0.5.38.tgz
│   └── lsc-lambda-dev-support-0.2.7.tgz
└── replace-lsc-npm.sh（ライブラリパスの置換用シェル）
```

### 2-2. ライブラリの配置
* `replace-lsc-npm.sh` をバージョンアップしたいline-smart-city直下に配置
* `replace-lsc-npm.sh` の `LIBRARIES_PATH` のPATH にLINE SMART CITY GovTechプログラム用ライブラリファイル（libraries ディレクトリ内のライブラリ）を配置

#### 参考
* replace-lsc-npm.sh

    ```bash
    # ライブラリ配置パス（必要に応じて置き換えてください）
    LIBRARIES_PATH="~\/Documents\/libraries"
    ```

## 3. バージョンアップ手順
### 1.21.2 → 1.22.1
* LINE SMART CITY GovTechプログラムのバージョン：1.21.2
* 事前にNode.jsとnpm、SAM CLIのバージョンを合わせてください。
* 決済機能を利用する場合、 「[決済機能の設定手順](./LSC_PAYMENT_SETTINGS.md)」をご参照ください。

```bash
$ node -v
v14.4.0
$ npm -v
7.24.2
$ sam --version
SAM CLI, version 1.49.0
 
# 1.22.1をチェックアウト
$ git remote -v
origin  git@github.com:linefukuoka/line-smart-city.git (fetch)
origin  git@github.com:linefukuoka/line-smart-city.git (push)
$ git fetch origin main
$ git reset --hard origin/main
$ git checkout -f -b tags/1.22.1 refs/tags/1.22.1
 
# バージョンアップ
$ ./lsc.sh deploy
```

### 1.20.1 → 1.21.2
* LINE SMART CITY GovTechプログラムのバージョン：1.20.1
* 事前にNode.jsとnpmのバージョンを合わせてください。

```bash
$ node -v
v14.4.0
$ npm -v
7.24.2
 
# 1.21.2をチェックアウト
$ git remote -v
origin  git@github.com:linefukuoka/line-smart-city.git (fetch)
origin  git@github.com:linefukuoka/line-smart-city.git (push)
$ git fetch origin main
$ git reset --hard origin/main
$ git checkout -f -b tags/1.21.2 refs/tags/1.21.2
 
# バージョンアップ
$ ./lsc.sh deploy
```

### 1.19.0 → 1.20.1
* LINE SMART CITY GovTechプログラムのバージョン：1.19.0
* 事前にNode.jsとnpmのバージョンを合わせてください。

```bash
$ node -v
v14.4.0
$ npm -v
6.14.17
 
# 1.20.1をチェックアウト
$ git remote -v
origin  git@github.com:linefukuoka/line-smart-city.git (fetch)
origin  git@github.com:linefukuoka/line-smart-city.git (push)
$ git fetch origin main
$ git reset --hard origin/main
$ git checkout -f -b tags/1.20.1 refs/tags/1.20.1
 
# ライブラリパスを置換
$ sh ./replace-lsc-npm.sh
 
# バージョンアップ
$ ./lsc.sh deploy
```
### 1.18.2 → 1.19.0
* LINE SMART CITY GovTechプログラムのバージョン：1.18.2
* 事前にNode.jsとnpmのバージョンを合わせてください。

```bash
$ node -v
v14.4.0
 $ npm -v
6.14.17

# 1.19.0をチェックアウト
$ git remote -v
origin  git@github.com:linefukuoka/line-smart-city.git (fetch)
origin  git@github.com:linefukuoka/line-smart-city.git (push)
$ git fetch origin main
$ git reset --hard origin/main
$ git checkout -f -b tags/1.19.0 refs/tags/1.19.0

# ライブラリパスを置換
$ sh ./replace-lsc-npm.sh

# バージョンアップ
$ ./lsc.sh deploy
```

## 備考
### 全環境の更新コマンド 「./lsc.sh deploy」 について
* シークレットのキー及びバージョン値の更新後、環境を全て更新します。
* 時間がかかりますので、一部だけ更新する場合は個別に行ってください（「[モジュール単位の更新](./LSC_COMMANDS.md#モジュール単位の更新)」参照）
* オプションコマンドを付与して初期構築した場合は、環境更新時も初期構築時と同じオプションを付与するようにしてください。
