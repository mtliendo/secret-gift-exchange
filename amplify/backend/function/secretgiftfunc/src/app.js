const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const AWS = require('aws-sdk')
const app = express()

const sns = new AWS.SNS()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', '*')
	next()
})
//instead of sandbox, list by topic: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html#listSubscriptionsByTopic-property
app.get('/list-sandbox-users', async function (req, res) {
	const numbers = await sns
		.listSMSSandboxPhoneNumbers()
		.promise()
		.catch((e) => console.log(e))

	console.log('the numbers', numbers)
	const verifiedNumbers = numbers.PhoneNumbers.filter(
		(number) => number.Status === 'Verified'
	).map((numberItem) => ({ phoneNumber: numberItem.PhoneNumber, alias: '' }))
	res.json({ verifiedNumbers })
})

app.post('/publish-messages', async function (req, res) {
	console.log('the request body.budget', req.body.giftBudget)
	console.log('the request body.phoneData', req.body.phoneNumberData)

	//shuffle the phone numbers: https://lodash.com/docs/#shuffle

	//the last person in the shuffled array is assigned the first person. Everyone else takes the person at index +1

	//call this method for each iteration:
	await sns
		.publish({
			TopicArn: process.env.SNS_TOPIC_ARN,
			Message: `Your person is SOMEONE. Your budget is $${req.body.giftBudget}`,
			MessageAttributes: {
				project: {
					DataType: 'String.Array',
					StringValue: JSON.stringify(['secret-gift']),
				},
				sms: {
					DataType: 'String.Array',
					StringValue: JSON.stringify([
						req.body.phoneNumberData[0].phoneNumber,
					]),
				},
			},
		})
		.promise()
		.catch((e) => console.log(e))
	res.json({ success: 'post call succeed!', url: req.url, body: req.body })
})

app.listen(3000, function () {
	console.log('App started')
})

module.exports = app
