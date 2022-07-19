# Slackのエラー通知設定

AWS Lambdaで発生したエラーをSlackに通知するための設定を行います。

1. SlackでIncoming Webhook設定を行います。設定方法は[こちら](https://api.slack.com/messaging/webhooks#getting-started)をご確認ください。

2. `deploy/secrets_manager/環境名.json` を開き、シークレットキー`SLACK_WEBHOOK_URL`に作成したSlack AppのWebhook URLを設定します。
    * 例: `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX`

3. 下記を実行してシークレット更新します。

```bash
$ ./lsc.sh secrets update
```

4. 下記を実行してSlack通知用Lambdaをデプロイします。

```bash
$ ./deploy/log_notification/deploy.sh
```

* `deploy/log_notification/filter_pattern.txt`では、サブスクリプションフィルターパターンが設定されています。パターンを編集することで、Slackへ通知される条件を変更できます。
    * パターン構文の詳細は[こちら](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html)をご参照ください。
