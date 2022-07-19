# IPアドレスアクセス制限
AWS WAFのIP setsを適用することによりIPアドレスのアクセス制限をすることができます。

- [AWS WAFの設定](#aws-wafの設定)
    - [IP Setの作成](#ip-setの作成)
    - [Web ACL の設定](#web-acl-の設定)
        - [Web ACL details の設定](#web-acl-details-の設定)
        - [Add my own rules and rule groups の設定](#add-my-own-rules-and-rule-groups-の設定)
        - [IP Set の設定](#ip-set-の設定)
        - [Add rules and rule groups の設定](#add-rules-and-rule-groups-の設定)
        - [Configure metrics](#configure-metrics)
- [CloudFrontの設定](#cloudfrontの設定)
    - [対象のCloudFrontの選択](#対象のcloudfrontの選択)
    - [Distributionの編集](#distributionの編集)

## AWS WAFの設定
### IP Setの作成
アクセス対象とするIPアドレスをIP addressに入力します。

![](./images/waf-ip-set-1.png)

### Web ACL の設定
Web ACLsをクリックします。

![](./images/waf-acl-1.png)
#### Web ACL details の設定
CloudFront Distributionを選択します。

![](./images/waf-acl-2.png)
#### Add my own rules and rule groups の設定
プルダウンメニューからAdd my own rules and rule groupsを選択します。

![](./images/waf-acl-3.png)
#### IP Set の設定
Rule typeからIP setを選択します。

![](./images/waf-acl-4.png)
#### Add rules and rule groups の設定
Default web ACL actionとしてBlockを選択します。

![](./images/waf-acl-5.png)

#### Configure metrics
必要に応じてCloudWatch metricsを設定します。

![](./images/waf-acl-6.png)

## CloudFrontの設定
### 対象のCloudFrontの選択
comment欄に `[環境名]-platform-static distribution`と記されているCloudFrontを選択します。

![](./images/waf-cnt-list.png)
### Distributionの編集
AWS WAF Web ACLで作成したACLを選択します。

![](./images/waf-cnt-acl.png)