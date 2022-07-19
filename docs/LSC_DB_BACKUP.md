# DBのバックアップ・リストア設定

## バックアップ方法

下記を実行することで、DynamoDBテーブルのバックアッププランを作成します。  
バックアッププラン内容は`deploy/backup/db.yaml`をご確認ください。

```bash
$ ./lsc.sh db-backup deploy
```

プラン作成から最長24時間後、[AWS Backupボールト](https://ap-northeast-1.console.aws.amazon.com/backup/home?region=ap-northeast-1#backupvaults)にてバックアップ内容を確認できます。

## リストア方法

バックアップを復元する手順は以下をご確認ください。  
**対象テーブルを削除してからリストアが完了するまでに全サービスが利用できなくなりますので、あらかじめメンテナンス時間を設けてください**。

### メンテナンス切り替え運用例

* LINE OA
    * セグメント配信によるメンテナンス告知
        * メンテナンス時間があり一定時間サービスが利用できなくなる旨を、セグメント配信の全体配信で告知します。
    * メンテナンス用のリッチメニュー切り替え
        * メンテナンス用のリッチメニュー画像を追加し、デフォルトに設定します。
            * [メンテナンス用のサンプル画像](./images/line-oam-richmenu-maintenance.jpeg)
    * Messaging API設定
        * 「[LINE Official Account Manager](https://manager.line.biz/)」の設定→応答設定→詳細設定で、「Webhook」を**オフ**に設定します。

* 管理画面
    * 管理者は管理画面の利用者のメールアドレスへメンテナンスの周知を行います。

### リストア手順

1. [DynamoDB](https://ap-northeast-1.console.aws.amazon.com/dynamodb/home?region=ap-northeast-1#tables:)のリストア対象のテーブルを削除します。
    * 削除前に対象テーブル名とテーブルに付与されているタグを控えます。
2. [AWS Backup](https://ap-northeast-1.console.aws.amazon.com/backup/home?region=ap-northeast-1#dashboard)で、バックアップボールトに保存されている対象テーブルの復旧ポイントを選択し、1.で控えておいたテーブル名を入力してリストアします。20分〜最長1時間程度かかる可能性があります。
3. リストアが完了したら、1.で控えておいた削除前テーブルと同じタグを設定します。
    * タグの設定はリストアされないため手動で再設定する必要があります。

**リストア後、メンテナンスの設定は元に戻してください**。
