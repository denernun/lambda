import * as cdk from 'aws-cdk-lib';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export class AppStack extends cdk.Stack {
  readonly helloHandler: cdk.aws_lambda_nodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

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
    });
  }
}
