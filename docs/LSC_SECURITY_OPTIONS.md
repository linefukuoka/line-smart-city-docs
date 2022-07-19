# 環境構築スクリプトのセキュリティオプション
## 目次

- [環境構築スクリプトのセキュリティオプション](#環境構築スクリプトのセキュリティオプションについて)
- [料金](#料金)
- [--kms-encryptオプションの対象リソース](#--kms-encryptオプションの対象リソース)
  - [AWS DynamoDB](#aws-dynamodb)
  - [Amazon SQS](#amazon-sqs)
  - [Amazon SNS](#amazon-sns)
- [--xray-trace オプションの対象リソース](#--xray-trace-オプションの対象リソース)
  - [AWS Lambda(東京リージョン)](#aws-lambda東京リージョン)
- [環境構築スクリプトではKMSを利用した暗号化が適用されないリソース(個別に設定が必要なリソース)](#環境構築スクリプトではkmsを利用した暗号化が適用されないリソース個別に設定が必要なリソース)
  - [AWS CloudTrail](#aws-cloudtrail)
  - [AWS Secret Manager](#aws-secret-manager)


## 環境構築スクリプトのセキュリティオプションについて

セキュリティに関するオプションとして以下のオプションを用意しています。

- `--kms-encrypt [true or false]`： AWS KMSを利用した暗号化の有無を設定します。有効な値は、`true`, `false`、オプション未指定時のデフォルトは`false`です。
- `--xray-trace [true or false]`： AWS X-Rayによるトレースを設定します。有効な値は、`true`, `false`、オプション未指定時のデフォルトは`false`です。

```
## AWS KMSを利用した暗号化を適用
$ ./lsc.sh deploy --kms-encrypt true

## AWS X-Rayを利用
$ ./lsc.sh deploy --xray-trace true
```


## 料金

- AWS KMS
    - [AWS Key Management Service の料金](https://aws.amazon.com/jp/kms/pricing/)を参照ください
- AWS X-Ray
    - [AWS X-Ray の料金](https://aws.amazon.com/jp/xray/pricing/)を参照ください


## --kms-encryptオプションの対象リソース

### AWS DynamoDB 

AWSが所有するCMK（Customer Master Key）ではなく、AWS KMSで管理するカスタマーマネージドキーにより暗号化します。

### Amazon SQS

保管中 (Amazon SQS データセンターのディスクに格納されている間) のメッセージ内のデータを、AWS KMSで管理するカスタマーマネージドキーにより暗号化します。  
なお、転送時 (Amazon SQS から送受信されるとき) は、--kms-encryptオプションの有無に関わらず、デフォルトで暗号化されます。


### Amazon SNS

保管時（Amazon SNS データセンター内のディスクに格納されているとき）のデータを、AWS KMSで管理するカスタマーマネージドキーにより暗号化します。  
なお、転送時 (Amazon SNS との間でデータを送受信するとき) は、--kms-encryptオプションの有無に関わらず、デフォルトで暗号化されます。


## --xray-trace オプションの対象リソース


### AWS Lambda(東京リージョン)

すべてのLambda関数に対して、AWS X-Rayによるトレースを有効化します。


## 環境構築スクリプトではKMSを利用した暗号化が適用されないリソース(個別に設定が必要なリソース)

### AWS CloudTrail

CloudTrailログファイルを、AWS KMSで管理するカスタマーマネージドキーにより暗号化することができます。  
具体的な設定手順は、[AWS KMS で管理されたキー (SSE-KMS) による CloudTrail ログファイルの暗号化](https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/encrypting-cloudtrail-log-files-with-aws-kms.html)を参照ください。


### AWS Secret Manager

AWS Secrets Managerで管理するすべてのシークレット値の全バージョンを、AWS KMSで管理するカスタマーマネージドキーにより暗号化することができます。  
具体的な設定手順は、[シークレット暗号化と復号](https://docs.aws.amazon.com/ja_jp/secretsmanager/latest/userguide/security-encryption.html)を参照ください。