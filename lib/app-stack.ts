import * as cdk from 'aws-cdk-lib';
import * as dynadb from 'aws-cdk-lib/aws-dynamodb';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as secret from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export class AppStack extends cdk.Stack {
  readonly secret: secret.Secret;
  readonly helloDb: dynadb.Table;
  readonly helloHandler: cdk.aws_lambda_nodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.secret = new secret.Secret(this, 'HelloSecret', {
      secretName: 'hello',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      generateSecretString: {
        secretStringTemplate: JSON.stringify({
          environment: 'production',
          username: 'admin',
        }),
        generateStringKey: 'password',
        excludePunctuation: true,
        includeSpace: false,
        passwordLength: 20,
      },
    });

    this.helloDb = new dynadb.Table(this, 'HelloDb', {
      tableName: 'hello',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      partitionKey: {
        name: 'id',
        type: dynadb.AttributeType.STRING,
      },
      billingMode: dynadb.BillingMode.PROVISIONED,
      readCapacity: 1,
      writeCapacity: 1,
    });

    this.helloHandler = new lambdaNodejs.NodejsFunction(this, 'HelloFunction', {
      functionName: 'HelloFunction',
      entry: 'lambda/hello.ts',
      handler: 'handler',
      memorySize: 128,
      timeout: cdk.Duration.seconds(5),
      bundling: {
        minify: true,
        sourceMap: false,
      },
      environment: {
        TABLE_NAME: this.helloDb.tableName,
      },
    });
    this.helloDb.grantReadWriteData(this.helloHandler);
  }
}
