# AWSリソースのモジュール間参照について

## 目次

  - [1. モジュール間参照について](#1-モジュール間参照について)
    - [システム構成図](#システム構成図)
    - [モジュール間参照の設定例](#モジュール間参照の設定例)
  - [2. モジュール構築順について](#2-モジュール構築順について)
  - [3. モジュール間参照設定時のエラーパターン](#3-モジュール間参照設定時のエラーパターン)
    - [環境構築エラーにならないパターン](#環境構築エラーにならないパターン)
    - [環境構築エラーが発生するパターン](#環境構築エラーが発生するパターン)


## 1. モジュール間参照について

「LINE SMART CITY GovTechプログラム」における一部のAWSリソースは、他モジュールに存在するリソースを参照しています。  


### システム構成図

モジュール間参照は、システム構成図の色付き点線矢印にて示しています。  
※ 点線の色は、依存先リソースが存在するモジュールの背景色です

![システム構成図](./images/lsc_features.png)

### モジュール間参照の設定例

`/deploy`配下のYAMLファイルで、他モジュールにあるリソースへの参照が定義されている場合、モジュール間参照となります。

- 例) deploy/bi/dynamic.yaml (biモジュールの動的リソースの設定ファイル)
```yaml
Resources:
  # ~~~~~~~~~~ 中略 ~~~~~~~~~~~~~~~~~
  BILogFunction:
    Type: AWS::Serverless::Function
    Properties:
      Environment:
        Variables:
          TABLE_BI_LOGS:
            Fn::ImportValue:
              !Sub '${SecretsManagerSecretId}-TableBILogs'
          TABLE_SURVEY_LOGS:
            Fn::ImportValue:
              !Sub '${SecretsManagerSecretId}-TableSurveyLogs' # biモジュールからsurveyモジュールへの参照
          TABLE_SURVEY_CONFIGS:
            Fn::ImportValue:
              !Sub '${SecretsManagerSecretId}-TableSurveyConfigs' # biモジュールからsurveyモジュールへの参照
          TABLE_SURVEY_RESULTS:
            Fn::ImportValue:
              !Sub '${SecretsManagerSecretId}-TableSurveyResults' # biモジュールからsurveyモジュールへの参照
          TABLE_DISTRIBUTION_LOGS:
            Fn::ImportValue:
              !Sub "${SecretsManagerSecretId}-DistributionLogsTable" # biモジュールからdistributionモジュールへの参照
          TABLE_SEGMENT_DELIVERY:
            Fn::ImportValue:
              !Sub "${SecretsManagerSecretId}-TableSegmentDelivery" # biモジュールからdistributionモジュールへの参照
          TABLE_CHATBOT_SCENARIO_LOGS:
            Fn::ImportValue:
              !Sub '${SecretsManagerSecretId}-TableScenarioLogs' # biモジュールからscenarioモジュールへの参照
          BI_LOG_BUCKET:
            Fn::ImportValue:
              !Sub '${SecretsManagerSecretId}-BILogsBucket'
```




## 2. モジュール構築順について

環境構築時、あるリソースから依存されるリソースは、依存するリソースよりも先にデプロイされている必要があります。  
[環境構築スクリプト](./LSC_COMMANDS.md)では、各モジュール間参照の参照状態を考慮し、以下の順番でモジュールをデプロイしています。

※ 各モジュールの詳細については、[モジュール一覧](./LSC_COMMANDS.md#モジュール一覧)を参照ください。


1. bi (静的リソース)
2. platform (静的リソース)
3. survey (静的リソース)
4. survey (動的リソース)
5. distribution (静的リソース)
6. distribution (動的リソース)
7. platform (動的リソース)
8. bosai (静的リソース)
9. bosai (動的リソース)
10. scenario (静的リソース)
11. scenario (動的リソース)
12. bi (動的リソース)



## 3. モジュール間参照設定時のエラーパターン

上記のモジュール構築順において、__構築順の早いリソースが、構築順の遅いリソースに対して参照する場合、環境構築エラーが発生します。__


### 環境構築エラーにならないパターン

以下のように、構築順の早いリソース（先に構築されたリソース）に対してモジュール間参照を設定する事は可能です。

- 例) deploy/survey/dynamic.yaml (surveyモジュールの動的リソース)
```yaml
Resources:
  # ~~~~~~~~~~ 中略 ~~~~~~~~~~~~~~
  SearchFunction:
    Type: AWS::Serverless::Function
    Properties:
      # ~~~~~~~~~~ 中略 ~~~~~~~~~~~~~~

      Policies:
        - arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
        - !Ref InvokeFunctionAllPolicy
        - DynamoDBCrudPolicy:
            TableName:
              Fn::ImportValue:
                !Sub '${SecretsManagerSecretId}-TableSurveyResults'
        - DynamoDBCrudPolicy:
            TableName:
              Fn::ImportValue:
                !Sub '${SecretsManagerSecretId}-TableSurveyResults'
+       - DynamoDBCrudPolicy:                                             # platformモジュールの静的リソースに対する参照を追加
+           TableName:                                                    #     platformモジュールの静的リソースは、
+             Fn::ImportValue:                                            #     surveyモジュールの動的リソースよりも先に構築されるため、問題なし
+               !Sub '${SecretsManagerSecretId}-TableAdminDatabase'
      Environment:
        Variables:
          LOG_LEVEL: 'info'
          DEPLOY_ENV: !Sub '${SecretsManagerSecretId}'
          TABLE_SURVEY_CONFIGS:
            Fn::ImportValue:
              !Sub '${SecretsManagerSecretId}-TableSurveyConfigs'
          TABLE_SURVEY_RESULTS:
            Fn::ImportValue:
              !Sub '${SecretsManagerSecretId}-TableSurveyResults'
          S3_BUCKET_NAME:
            Fn::ImportValue:
              !Sub '${SecretsManagerSecretId}-survey-StorageBucket'
+         TABLE_ADMIN_DATABASE:                                           # platformモジュールの静的リソースに対する参照を追加
+           Fn::ImportValue:
+             !Sub '${SecretsManagerSecretId}-TableAdminDatabase'
```

### 環境構築エラーが発生するパターン

以下のように、構築順の遅いリソース（後で構築されるリソース）に対してモジュール間参照を設定すると、構築エラーが発生します。

- 例) deploy/survey/dynamic.yaml (surveyモジュールの動的リソース)
```yaml
Resources:
  # ~~~~~~~~~~ 中略 ~~~~~~~~~~~~~~
  SearchFunction:
    Type: AWS::Serverless::Function
    Properties:
      # ~~~~~~~~~~ 中略 ~~~~~~~~~~~~~~

      Policies:
        - arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
        - !Ref InvokeFunctionAllPolicy
        - DynamoDBCrudPolicy:
            TableName:
              Fn::ImportValue:
                !Sub '${SecretsManagerSecretId}-TableSurveyResults'
        - DynamoDBCrudPolicy:
            TableName:
              Fn::ImportValue:
                !Sub '${SecretsManagerSecretId}-TableSurveyResults'
+       - DynamoDBCrudPolicy:                                             # distributionモジュールの静的リソースに対する参照を追加
+           TableName:                                                    #     distributionモジュールの静的リソースは、
+             Fn::ImportValue:                                            #     surveyモジュールの動的リソースよりも後に構築されるため、構築エラーが発生する
+               !Sub '${SecretsManagerSecretId}-TableDistributionResources'
      Environment:
        Variables:
          LOG_LEVEL: 'info'
          DEPLOY_ENV: !Sub '${SecretsManagerSecretId}'
          TABLE_SURVEY_CONFIGS:
            Fn::ImportValue:
              !Sub '${SecretsManagerSecretId}-TableSurveyConfigs'
          TABLE_SURVEY_RESULTS:
            Fn::ImportValue:
              !Sub '${SecretsManagerSecretId}-TableSurveyResults'
          S3_BUCKET_NAME:
            Fn::ImportValue:
              !Sub '${SecretsManagerSecretId}-survey-StorageBucket'
+         TABLE_DISTRIBUTION_RESOURCE:                                   # distributionモジュールの静的リソースに対する参照を追加
+           Fn::ImportValue:
+             !Sub '${SecretsManagerSecretId}-TableDistributionResources'
```