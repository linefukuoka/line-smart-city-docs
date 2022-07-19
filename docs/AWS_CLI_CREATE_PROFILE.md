# AWSのプロファイル作成

以下の手順でAWSのプロファイルを作成してください。

1. [AWS マネジメントコンソール](https://aws.amazon.com/jp/console/)にアクセスする。
   
    * AWSアカウントをお持ちでない場合は、AWSアカウントを作成してください。
2. IAMユーザーを作成する
    * 推奨
        * デプロイ可能なIAMユーザーは、最小人員に権限を付与する
        * 3ヵ月など周期的に権限整理を行い、不要になった権限を都度削除する
    * アクセス権限は例です。ご利用する環境に応じて調整ください。
    * DevelopmentPartnerPolicy（=PowerUserAccess + Role・Policy操作 + (Billing).deny） を作成する。
      ```json
      {
          "Version": "2012-10-17",
          "Statement": [
              {
                  "Effect": "Allow",
                  "NotAction": [
                      "iam:*",
                      "organizations:*",
                      "account:*"
                  ],
                  "Resource": "*"
              },
              {
                  "Effect": "Allow",
                  "Action": [
                      "iam:AttachRolePolicy",
                      "iam:DetachRolePolicy",
                      "iam:CreateRole",
                      "iam:PutRolePolicy",
                      "iam:GetRole",
                      "iam:GetRolePolicy",
                      "iam:UpdateRole",
                      "iam:UpdateRoleDescription",
                      "iam:PassRole",
                      "iam:DeleteRole",
                      "iam:DeleteRolePolicy",
                      "iam:CreateServiceLinkedRole",
                      "iam:DeleteServiceLinkedRole",
                      "iam:ListRoles",
                      "iam:ListRolePolicies",
                      "iam:ListAttachedRolePolicies",
                      "iam:CreatePolicy",
                      "iam:CreatePolicyVersion",
                      "iam:DeletePolicy",
                      "iam:DeletePolicyVersion",
                      "iam:GetPolicy",
                      "iam:GetPolicyVersion",
                      "iam:ListPolicies",
                      "iam:ListPolicyVersions",
                      "iam:SetDefaultPolicyVersion",
                      "organizations:DescribeOrganization",
                      "account:ListRegions"
                  ],
                  "Resource": "*"
              },
              {
                  "Effect": "Deny",
                  "Action": [
                      "aws-portal:*Billing",
                      "aws-portal:*Usage",
                      "aws-portal:*PaymentMethods",
                      "budgets:ViewBudget",
                      "budgets:ModifyBudget",
                      "cur:*",
                      "purchase-orders:*PurchaseOrders"
                  ],
                  "Resource": "*"
              }
          ]
      }
      ```
    * DevelopmentPartnerPolicyを付与したDevelopmentPartnerグループを作成する。
    * DevelopmentPartnerグループに追加したIAMユーザーを作成する。
    * ユーザーの「認証情報」より「アクセスキーの作成」を行う。
    * ユーザーの「アクセスキー ID」と「シークレットアクセスキー」は、プロファイル作成時に利用します。
3. AWS CLIを利用してプロファイルを作成する。
   
    * ここでは、プロファイル名を開発環境が`lsc-fukuoka-dev`、ステージング環境が`lsc-fukuoka-stg`、本番環境が `lsc-fukuoka` としています。

```bash
$ aws configure --profile lsc-fukuoka-dev    // プロファイル名
AWS Access Key ID: XXXXXXXXXX                // アクセスキー ID
AWS Secret Access Key: XXXXXXXXXX            // シークレットアクセスキー
Default region name: ap-northeast-1          // リージョン
Default output format:
```