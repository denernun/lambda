import { HttpMethod } from 'aws-cdk-lib/aws-events';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  const lambdaRequestId = context.awsRequestId;
  const apiRequestId = event.requestContext.requestId;

  console.log(`API Request ID: ${apiRequestId} - Lambda Request ID: ${lambdaRequestId}`);

  try {
    if (event.resource === '/status') {
      if (event.httpMethod === HttpMethod.GET) {
        console.log('GET /status');
        await Promise.resolve(1);
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: 'GET /status',
          }),
        };
      }
    }
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'resource not found',
      }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers: {},
      body: JSON.stringify(error, null, 2),
    };
  }
}
