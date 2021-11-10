import * as cdk from '@aws-cdk/core'
import * as sns from '@aws-cdk/aws-sns'

export class cdkStack extends cdk.Stack {
	constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props)

		/* Do not remove - Amplify CLI automatically injects the current deployment environment in this input paramater */
		new cdk.CfnParameter(this, 'env', {
			type: 'String',
			description: 'Current Amplify CLI env name',
		})

		new sns.Topic(this, 'secretgift-topic')
	}
}
