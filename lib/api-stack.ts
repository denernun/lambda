import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { HttpMethod } from 'aws-cdk-lib/aws-events';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

interface ApiProps extends cdk.AppProps {
  readonly helloHandler: lambdaNodejs.NodejsFunction;
  readonly statusHandler: lambdaNodejs.NodejsFunction;
}

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiProps) {
    super(scope, id, props);

    const logGroup = new logs.LogGroup(this, 'LogGroup', {
      logGroupName: '/aws/lambda/HelloFunction',
      retention: logs.RetentionDays.ONE_MONTH,
    });

    const api = new apigateway.RestApi(this, 'HelloApi', {
      restApiName: 'HelloApi',
      description: 'This service serves a hello world message.',
      cloudWatchRole: true,
      deployOptions: {
        accessLogDestination: new apigateway.LogGroupLogDestination(logGroup),
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

    // status
    const statusIntegration = new apigateway.LambdaIntegration(props.statusHandler);

    const statusResource = api.root.addResource('status');
    statusResource.addMethod(HttpMethod.GET, statusIntegration);

    // hello
    const helloIntegration = new apigateway.LambdaIntegration(props.helloHandler);

    const helloResource = api.root.addResource('hello');
    helloResource.addMethod(HttpMethod.GET, helloIntegration);
    helloResource.addMethod(HttpMethod.POST, helloIntegration);

    const helloIdResource = helloResource.addResource('{id}');
    helloIdResource.addMethod(HttpMethod.GET, helloIntegration);
    helloIdResource.addMethod(HttpMethod.PUT, helloIntegration);
    helloIdResource.addMethod(HttpMethod.DELETE, helloIntegration);
  }
}
