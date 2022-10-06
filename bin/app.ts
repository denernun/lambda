#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
// HelloApiStack
import { ApiStack } from '../lib/api-stack';
// HelloAppStack
import { AppStack } from '../lib/app-stack';

const app = new cdk.App();

const env: cdk.Environment = {
  account: '295754215784',
  region: 'sa-east-1',
};

// helloAppStack
const appStack = new AppStack(app, 'AppStack', {
  env,
});

// helloApiStack
const apiStack = new ApiStack(app, 'ApiStack', {
  helloHandler: appStack.helloHandler,
});

apiStack.addDependency(appStack);
