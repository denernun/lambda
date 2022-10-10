import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { HttpMethod } from 'aws-cdk-lib/aws-events';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

interface ApiProps extends cdk.AppProps {
  readonly helloHandler: lambdaNodejs.NodejsFunction;
}

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiProps) {
    super(scope, id, props);

    const logHello = new logs.LogGroup(this, 'LogHello', {
      logGroupName: `/aws/lambda/HelloFunction/${new Date().getTime()}`,
      retention: logs.RetentionDays.ONE_DAY,
    });
    logHello.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    const apiHello = new apigateway.RestApi(this, 'HelloApi', {
      restApiName: 'Hello Api',
      cloudWatchRole: true,
      deployOptions: {
        accessLogDestination: new apigateway.LogGroupLogDestination(logHello),
        accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields({
          httpMethod: true,
          ip: true,
          protocol: true,
          requestTime: true,
          resourcePath: true,
          responseLength: true,
          status: true,
          caller: true,
          user: true,
        }),
      },
    });

    const helloIntegration = new apigateway.LambdaIntegration(props.helloHandler);

    // status
    const statusResource = apiHello.root.addResource('status');
    statusResource.addMethod(HttpMethod.GET, helloIntegration);

    // hello
    const helloResource = apiHello.root.addResource('hello');
    helloResource.addMethod(HttpMethod.GET, helloIntegration);
    helloResource.addMethod(HttpMethod.POST, helloIntegration);
    const helloIdResource = helloResource.addResource('{id}');
    helloIdResource.addMethod(HttpMethod.GET, helloIntegration);
    helloIdResource.addMethod(HttpMethod.PUT, helloIntegration);
    helloIdResource.addMethod(HttpMethod.DELETE, helloIntegration);
  }
}
