import { HttpMethod } from 'aws-cdk-lib/aws-events';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  try {
    if (event.resource === '/hello') {
      if (event.httpMethod === HttpMethod.GET) {
        console.log('GET Hello World');
        await Promise.resolve(1);
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: 'GET Hello World',
          }),
        };
      }
      if (event.httpMethod === HttpMethod.POST) {
        console.log('POST Hello World');
        await Promise.resolve(1);
        return {
          statusCode: 201,
          body: JSON.stringify({
            message: 'POST Hello World',
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
