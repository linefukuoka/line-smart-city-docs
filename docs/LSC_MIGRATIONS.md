# LINE SMART CITY GovTechプログラム：マイグレーション

各バージョンの影響範囲と、通常のバージョンアップ方法ではアップデートできない場合の対処方法を記載します。

## 目次

- [1. バージョンアップ時に影響のあるファイル](#1-バージョンアップ時に影響のあるファイル)
- [2. 影響レベルの記載について](#2-影響レベルの記載について)
- [3. バージョンごとのデプロイ関連の差分](#3-バージョンごとのデプロイ関連の差分)
    - [1.19.0 → 1.20.x](#1190--120x)
    - [1.18.x → 1.19.0](#118x--1190)
    - [1.17.x → 1.18.x](#117x--118x)
    - [1.16.x → 1.17.x](#116x--117x)
    - [1.11.x → 1.12.0](#111x--1120)
    - [1.10.x → 1.11.x](#110x--111x)
    - [1.9.x → 1.10.x](#19x--110x)
    - [1.8.x → 1.9.x](#18x--19x)
    - [1.7.x → 1.8.x](#17x--18x)
    - [1.6.x → 1.7.x](#16x--17x)
    - [1.5.0 → 1.6.x](#150--16x)
    - [1.4.x → 1.5.0](#14x--150)
    - [1.3.x → 1.4.x](#13x--14x)
    - [1.2.x → 1.3.x](#12x--13x)
    - [1.1.x → 1.2.x](#11x--12x)

## 1. バージョンアップ時に影響のあるファイル
バージョンアップ時に主に影響がある修正ファイルは以下の通りです。

* CloudFormation、SAMテンプレート差分
* CLIツールやマイグレーションのコードの差分
## 2. 影響レベルの記載について
既存の環境をバージョンアップする際に、インフラ部分にどの程度影響があるのかを示します。

影響レベル「0」のバージョンを飛ばしてアップデートしても問題ありませんが、影響レベル「1」以上のバージョンではマイナーバージョンの更新であっても飛ばすことができない場合があります。

例えば、1.3.0→1.6.2に更新する場合、影響レベルが「1」のバージョンごとのアップデートになるため、1.3.0→1.4.3→1.6.2と2段階でアップデートを行う必要があります。

理由としては、 「1.3.x → 1.4.x」と「1.5.0 → 1.6.x」の影響レベルが「1」であり、それぞれ同じSurveyResultsテーブルのGlobal secondary index（以下、「GSI」）が追加されているため、一気に1.3.0→1.6.2に更新しようとするとデプロイに失敗するためです。

| 影響レベル | 説明                                                         |
| ---------- | ------------------------------------------------------------ |
| 0          | 通常のバージョンアップ手順以外に必要な対処がない場合       |
| 1          | DynamoDBのGSIが追加された場合                                |
| 2          | 以下のいずれかに該当する場合<br />・設定変更が必要<br>・通常のバージョンアップ手順とは別で `./lsc.sh`の実行が必要 |

## 3. バージョンごとのデプロイ関連の差分

## 1.19.0 → 1.20.x

* 影響レベル：1

#### 主な変更点

* リマインド配信関連テーブル(`TableReservationReminderItems`, `TableReservationReminderStatus`)を削除 (v1.20.0)
    * Lambda(`AdminFunction`)からの参照は1.19.0にて削除。1.20.0ではテーブルの実態を削除
    * [差分はこちら](https://github.com/linefukuoka/line-smart-city/compare/1.19.0...1.20.0#diff-b0a6e1f8f7269566deb2d58db299b84f99e68df2e1961a88dc92af797f1ae8c3)
* Lambdaのメモリ制限エラー `'MemorySize' value failed to satisfy constraint: Member must have value less than or equal to 3008` が発生した場合、3GBを超えているLambda関数を3GBに置き換えてデプロイするオプション(`--work-around-lambda-memory-limit`)を追加 (v1.20.0)
    * [差分はこちら](https://github.com/linefukuoka/line-smart-city/compare/1.19.0...1.20.0#diff-c55cdad16646f0760bf9b18975204331a874178c589128d14e2c326fac16062d)

[v1.20.0の差分はこちら](https://github.com/linefukuoka/line-smart-city/compare/1.19.0...1.20.0)

#### 必要な対処

* リマインド配信関連テーブル削除時のエラー回避のため、1.20.0以降へバージョンアップする場合は、一度1.19.0にバージョンアップした後で実行するようにしてください

## 1.18.x → 1.19.0

* 影響レベル：0

#### 主な変更点

* Lambda(`AdminFunction`)から、リマインド配信関連テーブル(`TableReservationReminderItems`, `TableReservationReminderStatus`)への参照を削除 (v1.19.0)
    * テーブル自体の削除は、1.20.0にて実施
    * [差分はこちら](https://github.com/linefukuoka/line-smart-city/compare/1.18.2...1.19.0#diff-5f1483ddc6d8db73392a8474a2a8d3c3b9f9634d3bbad6ca976a86e42a53b414)
* 外部WebHook転送機能のため、Lambda(`WebhookForwardFunction`, `WebhookForwardFunctionSandbox`)を追加 (v1.19.0)
    * [差分はこちら](https://github.com/linefukuoka/line-smart-city/compare/1.18.2...1.19.0#diff-5ec4c2bc66eca7028ed3699063a91f6f31677be8030f1b4b473c6223ea4c5cc1)

[v1.19.0の差分はこちら](https://github.com/linefukuoka/line-smart-city/compare/1.18.2...1.19.0)

## 1.17.x → 1.18.x

* 影響レベル：0

#### 主な変更点

* 帳票内のアイテムに画像が挿入できる機能を追加 (v1.18.0)

[v1.18.0の差分はこちら](https://github.com/linefukuoka/line-smart-city/compare/1.17.1...1.18.0)


## 1.16.x → 1.17.x

* 影響レベル：0

#### 主な変更点

* 生年月日や日付選択アイテムを起点にリマインド配信を実施する「日付リマインド配信」機能を追加
* 予約リマインド配信機能で、帳票に対して配信設定を紐付けられるように機能改修

[v1.17.0の差分はこちら](https://github.com/linefukuoka/line-smart-city/compare/1.16.2...1.17.0)

#### 必要な対処

日付リマインド配信機能及び、予約リマインド配信機能の開発に伴い、1.16.2以前に設定された予約リマインド配信の配信設定が無効になるため、1.17.0バージョンアップ後に予約リマンド配信の再設定が必要になります。  
1.17.0バージョンアップ実施前に、設定情報をバックアップしておくことを推奨します。  
なお、バージョンアップ後に過去の設定情報を確認する場合は、[1.16.2以前の予約リマンド配信設定の確認方法](./LSC_RESERVATION_REMINDER_SETTING.md)を参照してください。

## 1.11.x → 1.12.0

* 影響レベル：0

#### 主な変更点

* SAM(Lambda)のビルド時、Typescriptのコードを再帰的に探索するように修正
* CognitoのIDトークン・アクセストークン有効期限を5分に変更
* 統計機能における過去の集計値の不一致のための補正コードを追加

[v1.12.0の差分はこちら](https://github.com/linefukuoka/line-smart-city/compare/1.11.1...1.12.0)

#### 必要な対処

統計機能の集計値補正スクリプトの[実行手順はこちら](../scripts/bi/bi_data_correction/README.md)を参照してください。


## 1.10.x → 1.11.x

* 影響レベル：0

#### 主な変更点

* 帳票テーブルのマイグレーション処理の追加 (v1.11.0)
    * [差分はこちら](https://github.com/linefukuoka/line-smart-city/compare/1.10.1...1.11.1#diff-767a43d447bf1af43aba9e699f20c358d4fd4bc15411d5d439d1d244786f8dfa)

## 1.9.x → 1.10.x

* 影響レベル：**1**

#### 主な変更点

* 環境名の重複によりバケットが作成できない事象の解消 (v1.10.0)
    * 対象バケット名：`環境名-logs`、`環境名-distribution-resources`
    * 警告：v1.10.0のみ、古いバケットから新しいバケットへ全オブジェクトがコピーされるため、通常のバージョンアップより時間がかかります (目安60〜90分)
    * [差分はこちら](https://github.com/linefukuoka/line-smart-city/compare/1.9.1...1.10.1#diff-d7dbe4d811efc1a7e2da41f1bb63c153cba8d30e4557d3c81f1136e9cb1bfbba)
* 帳票関連テーブル(`SurveyConfigs`, `LineUsers`)にGSIの追加 (v1.10.0)
    * [差分はこちら](https://github.com/linefukuoka/line-smart-city/compare/1.9.1...1.10.1#diff-b0a6e1f8f7269566deb2d58db299b84f99e68df2e1961a88dc92af797f1ae8c3)
* テーブルの追加(`SurveyResultsHistory`) (v1.10.0)
    * [差分はこちら](https://github.com/linefukuoka/line-smart-city/compare/1.9.1...1.10.1#diff-b0a6e1f8f7269566deb2d58db299b84f99e68df2e1961a88dc92af797f1ae8c3)

#### 必要な対処

バージョンアップ完了後、以下の古い固定値のバケットは削除してください


* `環境名-logs`
* `環境名-distribution-resources`

## 1.8.x → 1.9.x

* 影響レベル：**1**

#### 主な変更点

* 帳票関連テーブル(`SurveyConfig`)にGSIの追加 (v1.9.1)
    * [差分はこちら](https://github.com/linefukuoka/line-smart-city/compare/1.8.3...1.9.1#diff-b0a6e1f8f7269566deb2d58db299b84f99e68df2e1961a88dc92af797f1ae8c3R52)
* Lambda (`ActionLogsCollectorFunction`)の追加 (v1.9.0)
    * [差分はこちら](https://github.com/linefukuoka/line-smart-city/compare/1.8.3...1.9.0#diff-5f1483ddc6d8db73392a8474a2a8d3c3b9f9634d3bbad6ca976a86e42a53b414R376)
* 帳票関連テーブル(`SurveyResults`, `MemberResults`)にGSIの追加 (v1.9.0)
    * [差分はこちら](https://github.com/linefukuoka/line-smart-city/compare/1.8.3...1.9.0#diff-b0a6e1f8f7269566deb2d58db299b84f99e68df2e1961a88dc92af797f1ae8c3)

## 1.7.x → 1.8.x

* 影響レベル：**1**

#### 主な変更点

* commands: ビルドされたファイルをGit管理に追加 (v1.8.2)
    * バージョンアップ時に`./lsc.sh build`コマンドの実行が不要となります
    * v1.8.2では`setup`コマンドが利用できないバグがあるため、v1.8.3を利用してください
* 各DynamoDBテーブルに論理名・スタック名のタグを追加 (v1.8.2)
    * [差分はこちら](https://github.com/linefukuoka/line-smart-city/compare/1.7.1...1.8.3#diff-6059182eda0195ab1e079a6c00d43b2a24467bb30c766eabe810c82d22da2e98)
* テーブル`TableAdminDatabase`に属性・GSIの追加 (v1.8.0)
    * [差分はこちら](https://github.com/linefukuoka/line-smart-city/compare/1.7.1...1.8.1#diff-c1ef100d7d2aee918ca7c2630cdba1be49167da5a46cfee3c07259add418f3dc)

## 1.6.x → 1.7.x

* 影響レベル：0

#### 主な変更点

* LIFFの予約トランザクション管理用テーブル`LineUsers`の追加 (v1.7.0)
    * [差分はこちら](https://github.com/linefukuoka/line-smart-city/compare/1.6.3...1.7.1#diff-b0a6e1f8f7269566deb2d58db299b84f99e68df2e1961a88dc92af797f1ae8c3)

## 1.5.0 → 1.6.x

* 影響レベル：**1**

#### 主な変更点

* Lambda(`AdminFunction`)のメモリサイズを6144MBに引き上げ (v1.6.2)
    * [差分はこちら](https://github.com/linefukuoka/line-smart-city/compare/1.5.0...1.6.3#diff-5f1483ddc6d8db73392a8474a2a8d3c3b9f9634d3bbad6ca976a86e42a53b414)
* バケット(`BosaiBucket`)のパブリックアクセスをオフに修正 (v1.6.1)
    * [差分はこちら](https://github.com/linefukuoka/line-smart-city/compare/1.5.0...1.6.3#diff-51e26b66ead5edebf86432a970a8721da7cbaaf0faed588270cbe1d7cfa05372)
* LIFFの認証でCognito利用を切り替える環境変数`VUE_APP_UNUSED_COGNITO`を削除し、Cognitoを利用しないように変更 (v1.6.1)
    * [差分はこちら](https://github.com/linefukuoka/line-smart-city/compare/1.5.0...1.6.3#diff-391ae9be2f8a682704533106e1baa212d6c728d1c37f90c737b9991001ea6a17)
* 帳票結果テーブル(`SurveyResults`)にGSIの追加 (v1.6.1)
    * [差分はこちら](https://github.com/linefukuoka/line-smart-city/compare/1.6.0...1.6.1#diff-b0a6e1f8f7269566deb2d58db299b84f99e68df2e1961a88dc92af797f1ae8c3)
* 会員帳票用のテーブル追加 (この時点ではまだ会員帳票機能は利用できません) (v1.6.0)
    * [差分はこちら](https://github.com/linefukuoka/line-smart-city/compare/1.5.0...1.6.3#diff-b0a6e1f8f7269566deb2d58db299b84f99e68df2e1961a88dc92af797f1ae8c3)

## 1.4.x → 1.5.0

* 影響レベル：0

#### 主な変更点

* Lambda(`BiApiFunction`)のタイムアウト時間を15分に引き上げ
    * [差分はこちら](https://github.com/linefukuoka/line-smart-city/compare/1.4.3...1.5.0#diff-aab884e020de11efe127ac5ad69d13bcd28f7905de5d288217d706f99d763cd0)

## 1.3.x → 1.4.x

* 影響レベル：**1**

#### 主な変更点

* 一部Lambdaのタイムアウト時間を15分に引き上げ (v1.4.1)
    * [差分はこちら](https://github.com/linefukuoka/line-smart-city/commit/3ba3d2b63adfdeeec5b1f3cd12a18cd66edad206#diff-d9adf1b0bb5d1f4e9f4f85ac528abc3549eed66afd5544704c94060693fccc35)
* 新規環境を構築する際に、デフォルトでCognitoを利用しない設定に変更 (v1.4.0)
    * [差分はこちら](https://github.com/linefukuoka/line-smart-city/compare/1.3.7...1.4.0#diff-f4a9748e7bd06063b5540034e3a04919289e02d506acaace0cf6da45eebeb917)
* 帳票結果テーブル(`SurveyResults`)に属性・GSIの追加 (v1.4.0)
    * [差分はこちら](https://github.com/linefukuoka/line-smart-city/compare/1.3.7...1.4.0#diff-b0a6e1f8f7269566deb2d58db299b84f99e68df2e1961a88dc92af797f1ae8c3)
* 新しい権限グループの追加 (v1.4.0)
    * [差分はこちら](https://github.com/linefukuoka/line-smart-city/compare/1.3.7...1.4.0#diff-5f1483ddc6d8db73392a8474a2a8d3c3b9f9634d3bbad6ca976a86e42a53b414)

## 1.2.x → 1.3.x

* 影響レベル：0

#### 主な変更点

* Lambdaのタイムアウト時間を5分に引き上げ (v1.3.7)
    * [対象ファイルはこちら](https://github.com/linefukuoka/line-smart-city/commit/9251004597e0dcc86cccd3e3689ea3cd0f8cc93b#diff-aab884e020de11efe127ac5ad69d13bcd28f7905de5d288217d706f99d763cd0)
* `./lsc.sh secrets merge`, `./lsc.sh secrets update`実行で最新バージョン情報を反映されるように修正 (v1.3.6)
    * [差分はこちら](https://github.com/linefukuoka/line-smart-city/commit/3a55fbc0931ef9d11c7d2030675681ee549b86c7#diff-8f7daeee51e6d2ab84017c7981c127da9acc925cc7ccad79579e695222d7acee)
* LIFFの認証にCognitoを利用するかしないかを切り替える設定の追加 (v1.3.5)
    * シークレット `VUE_APP_UNUSED_COGNITO` を変更して切り替え
    * [差分はこちら](https://github.com/linefukuoka/line-smart-city/compare/1.3.4...1.3.5#diff-1b800896a19eb4d8b31339f56094744d548de133d630b002d1e040d325fd5b6b)
* モジュールごとに分かれていたCloudFront OAIを統一 (v1.3.3)

| 追加スタック名             | ファイル                        |
| -------------------------- | ------------------------------- |
| `環境名-security-identity` | `deploy/security/identity.yaml` |

* ACM証明書用スタックの追加 (v1.3.3)

| 追加スタック名 | ファイル                   |
| -------------- | -------------------------- |
| `環境名-acm`   | `deploy/security/acm.yaml` |

* Slack通知用スタック(deploy/log_notification)にLambdaのタイムアウト時間の通知を追加 (v1.3.0)
    * [差分はこちら](https://github.com/linefukuoka/line-smart-city/commit/dc5280c24c83e52d3d4e3c4a5d1ff64561c04071#diff-6b15a023ca947753e8b308121887078a54cafba1108941d4c7ca8de2037557c7)

#### 必要な対処

* Slack通知機能を利用している場合、以下を実行してSlack通知用スタックを更新してください。

```bash
$ deploy/log_notification/deploy.sh
```

## 1.1.x → 1.2.x

* 影響レベル：0

#### 主な変更点

* `./lsc.sh build`コマンドの追加 (v1.2.1)
* 防災モジュール用スタック・コマンドの追加 (v1.2.0)

| 追加スタック名         | ファイル                    |
| ---------------------- | --------------------------- |
| `環境名-bosai-static`  | `deploy/bosai/static.yaml`  |
| `環境名-bosai-dynamic` | `deploy/bosai/dynamic.yaml` |

* S3バケットの暗号化・アクセスログの有効化 (v1.1.7)
    * [差分はこちら](https://github.com/linefukuoka/line-smart-city/commit/27bc227087ada990efdbdca81b033e6524eb68be#diff-3669823c2a114997761a3a852f049762f5ebe41b2ce782ccd35c5b41cbbbce4e)
* `環境名-logs` という名前のバケットを追加 (v1.1.7)
    * [差分はこちら](https://github.com/linefukuoka/line-smart-city/commit/27bc227087ada990efdbdca81b033e6524eb68be#diff-08d9abf2a76a4ca28b2e60ed251d605961a867a4780702f1fe7bed91d20e91d1R41)
* カスタムドメイン用シークレット`DNS_DOMAIN`を追加 (v1.1.2)

#### 必要な対処

* カスタムドメインを利用する場合、シークレット`DNS_DOMAIN`にルートドメインを設定し、`./lsc.sh secrets update`を実行してください。

