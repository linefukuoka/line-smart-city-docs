## 環境変数

| シークレットキー                               | 内容                                                                                          | 備考                                                             | シークレット値の例                                          |
|:---------------------------------------------|:---------------------------------------------------------------------------------------------|:-----------------------------------------------------------------|:-----------------------------------------------------------------|
| LINEMESSAGING_CHANNEL_ID                     | LINE MessagingAPIのチャネルID                                                                  |                                                                 | `1234567890`                             |
| SB_LINEMESSAGING_CHANNEL_ID | 同上(シナリオ確認用)                                                                            |                                                                 | `1234567891`                                          |
| LINEMESSAGING_CHANNEL_SECRET                 | LINE MessagingAPIのチャネルシークレット                                                          | LINE developersで値変更したらこちらも変更が必要                      | `123abcde (中略) 012345`           |
| SB_LINEMESSAGING_CHANNEL_SECRET | 同上(シナリオ確認用)                                                                            | LINE developersで値変更したらこちらも変更が必要                      | `123abcde (中略) 012345`                     |
| LINEMESSAGING_CHANNEL_ACCESS_TOKEN           | LINE MessagingAPIのチャネルアクセストークン                                                      | LINE developersで値変更したらこちらも変更が必要                      | `AB9Cd3efg (中略) 1O/abCD=` |
| SB_LINEMESSAGING_CHANNEL_ACCESS_TOKEN | 同上(シナリオ確認用)                                                                            | LINE developersで値変更したらこちらも変更が必要                      | `AB9Cd3efg (中略) 1O/abCD=`                                    |
| VUE_APP_LIFF_ID | LINEログインチャネルで作成したLIFFのID |  | `1234567895-xxxxxxxx` |
| SURVEY_LINELOGIN_CHANNEL_ID | LINEログインのチャネルID                                                                        |                                                                 | `1234567895`                                |
| SURVEY_LINELOGIN_CHANNEL_SECRET | LINEログインのチャネルシークレット                                                                |                                                                 | `123abcde (中略) 012345`                                       |
| VUE_APP_AMPLIFY_AUTH_USER_POOL_ID            | cognito認証のuser-pool-id                                                                     | `./lsc.sh`により自動で設定される | `ap-northeast-1_AbcdEfghI`                                    |
| VUE_APP_AMPLIFY_AUTH_USER_POOL_<br />WEB_CLIENT_ID | cognito認証のweb-clientID                                                                     | `./lsc.sh`により自動で設定される | `ab1cdefgidjkmbsadjismxy0z`                       |
| VUE_APP_AMPLIFY_ADMIN_API_ENDPOINT_URL | 管理画面APIのエンドポイントURL | `./lsc.sh`により自動で設定される | `https://abcdefghi.execute-api.ap-northeast-1.amazonaws.com/Prod` |
| VUE_APP_CQ_API_ENDPOINT_URL | BI APIのエンドポイントURL | `./lsc.sh`により自動で設定される | `https://abcdefghi.execute-api.ap-northeast-1.amazonaws.com/Prod` |
| VUE_APP_AMPLIFY_SCENARIO_API_ENDPOINT_URL | シナリオAPIのエンドポイントURL | `./lsc.sh`により自動で設定される | `https://abcdefghi.execute-api.ap-northeast-1.amazonaws.com/Prod` |
| SAM_BUCKET_NAME | AWS SAMのデプロイ時に必要なS3バケット名 | `./lsc.sh sam createBucket`コマンドで設定可能 | `lsc-fukuoka-dev-sam-1600958645` |
| ADMIN_WEB_BUCKET | 管理画面フロントエンドアプリのソースがアップロードされるS3バケット名 | `./lsc.sh`により自動で設定される | `lsc-fukuoka-dev-platform-static-adminwebbucket-abcd1234xyz` |
| ADMIN_RESOURCES_BUCKET | 管理画面のリソースファイル用S3バケット名 | `./lsc.sh`により自動で設定される | `lsc-fukuoka-dev-platform-stat-adminresourcesbucket-abcd1234xyz` |
| BUCKET_CHATBOT_IMPORTED_RESOURCES | シナリオのリソースファイル用S3バケット名 | `./lsc.sh`により自動で設定される | `lsc-fukuoka-dev-scenario-chatbotimportedresources-abcd1234xyz` |
| SURVEY_FORMS_BUCKET | LIFFアプリのソースがアップロードされるS3バケット名 | `./lsc.sh`により自動で設定される | `lsc-fukuoka-dev-survey-static-liffformsbucket-abcd1234xyz` |
| AWS_CLOUDFRONT_OAI_ID | CloudFront オリジンアクセスアイデンティティのID | `./lsc.sh`により自動で設定される | `EG123XYZ56789` |
| SCENARIO_CLOUDFRONT_DOMAIN_NAME | シナリオ内のリソースファイル読み込みで利用されるCloudFrontのドメイン | `./lsc.sh`により自動で設定される | `abc1e23xxx.cloudfront.net` |
| VUE_APP_SCENARIO_CLOUDFRONT_<br />DOMAIN_NAME | 同上 (Vue.js用) | 同上 | `abc1e23xxx.cloudfront.net` |
| VUE_APP_DISTRIBUTION_RESOURCES_<br />CLOUDFRONT_DOMAIN_NAME | セグメント配信で、画像の配信時に利用されるCloudFrontのドメイン | `./lsc.sh`により自動で設定される | `abc1e23xxx.cloudfront.net` |
| SES_REGION                                   | Amazon SESを利用するリージョン                                                  | `us-west-2`を固定値で設定                                            | `us-west-2`                                                      |
| EMAIL_CHATBOT_DAMAGE_REPORT1                 | チャットボット被害レポート機能のメール送信先。                                                      |                                                                 | `damage-report-1@example.com`                         |
| EMAIL_CHATBOT_DAMAGE_REPORT2                 | チャットボット被害レポート機能のメール送信先。                                                      |                                                                 | `damage-report-2@example.com`          |
| EMAIL_CHATBOT_DAMAGE_REPORT3                 | チャットボット被害レポート機能のメール送信先。                                                      |                                                                 | `damage-report-3@example.com`          |
| EMAIL_CHATBOT_DAMAGE_REPORT4                 | チャットボット被害レポート機能のメール送信先。                                                      |                                                                 | `damage-report-4@example.com`          |
| BI_LOG_COLLECTION_SCHEDULE | 各モジュールのログを収集するスケジュールをcron形式で設定 | | デフォルト値: `cron(0 15 * * ? *)` |
| DISTRIBUTION_MSG_CHANNEL_ACCESS_TOKEN        | 配信モジュールで利用するLINE MessagingAPIのチャネルアクセストークン |                                                                  | `AB9Cd3efg (中略) 1O/abCD=`                                   |
| DISTRIBUTION_MSG_CHANNEL_SECRET              | (配信モジュールで利用) LINE MessagingAPIのチャネルシークレット |                                                                  | `123abcde (中略) 012345`                                      |
| DISTRIBUTION_EMAIL_WHITELIST              | (配信モジュールで利用) メール送信先のホワイトリスト（カンマ区切りで複数設定が可能）    |                                                                  | `xxx@example.com,yyy@example.com`                                               |
| DISTRIBUTION_TRIGGER_EMAIL | (配信モジュールの外部配信で利用) 受信メールアドレス | 入力しなかった場合、初回デプロイ時にデフォルト値`receive-mail@環境名.ルートドメイン`が設定される<br />**カスタムドメインを有効にしていない場合は外部配信機能は利用できません** | `receive-mail@example.com` |
| DISTRIBUTION_RESOURCES_BUCKET | 配信用画像がアップロードされるS3バケット名 | `./lsc.sh`により自動で設定される | `lsc-fukuoka-dev-distribution-distributionresources-u123abcdefg` |
| GENERAL_APP_VERSION              | バーション情報                                      |                                                                  | 1.0.0                                                        |
| DNS_DOMAIN | (カスタムドメイン有効時に利用) ルートドメイン | | `example.com` |
| CERTIFICATE_ARN | (カスタムドメイン有効時に利用) 発行したACMのARN | `./lsc.sh`により自動で設定される | `arn:aws:acm:us-east-1:000000000000:certificate/abcdefgh-xxxx-xxxx-xxxx-xxxxxx123456` |
| DNS_HOSTED_ZONE_ID | (カスタムドメイン有効時に利用) Route53のホストゾーンID | | `ABXXXXXXXXXXXXXXXXXX` |
| SLACK_WEBHOOK_URL | Slack AppのWebhook URL | AWS Lambdaのエラー通知に利用 | `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX` |
| AWS_SES_EMAIL_DOMAIN | AWS SESサービスに登録されている有効なメールドメイン。 損傷報告のメールを送信するために使用されます。|　| `環境名.line-smartcity.com` |
| ACCESS_LOG_BUCKET | 他のS3バケットのアクセスログを保管するためのバケット名 |　| `環境名-logs-0123456789` |
| CHATBOT_TRASH_SEPARATION_FUZZY_SEARCH | ゴミ分別シナリオのあいまい検索を有効または無効にします（本番チャネル） |　| 1 -> 有効 0 -> 無効 |
| SB_CHATBOT_TRASH_SEPARATION_FUZZY_SEARCH | ゴミ分別シナリオのあいまい検索を有効または無効にします（サンドボックスチャネル） |　| 1 -> 有効 0 -> 無効 |
| VUE_APP_MEMBERS_TAB | 会員帳票機能を有効・無効を切り替え | デフォルトは無効 | 1 -> 有効、0 -> 無効 |

