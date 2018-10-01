# connect-api-express
An Express website that shows how to use the Amazon Connect API to interact with a Connect instance.

## Install and Configuration
Assuming you already have Node and NPM installed:
1. Clone this repo
2. Run "npm install"
3. Update the values in instanceConfig.js with your Connect instance id and Queue ARN's
4. Run "node index.js" and navigate to http://localhost:3000

## API methods covered
The website demonstrates using:
1. listUsers
2. describeUser
3. updateContactAttributes
4. getCurrentMetricData

For a full reference to the Connect API see: https://docs.aws.amazon.com/connect/latest/APIReference/Welcome.html

For a reference for the AWS JavaScript SDK, including Connect see: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Connect.html
