#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { ApiStack } from '../lib/api-stack';
import { AppStack } from '../lib/app-stack';

const app = new cdk.App();

const env: cdk.Environment = {
  account: '295754215784',
  region: 'sa-east-1',
};

// StatusAppStack
// HelloAppStack
const appStack = new AppStack(app, 'AppStack', {
  env,
});

// StatusApiStack
// HelloApiStack
const apiStack = new ApiStack(app, 'ApiStack', {
  statusHandler: appStack.statusHandler,
  helloHandler: appStack.helloHandler,
});

apiStack.addDependency(appStack);
