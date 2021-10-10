const aws = require("aws-sdk");
const ddb = new aws.DynamoDB();

const tableName = process.env.USERTABLE;

exports.handler = async (event) => {
  // event event.request.userAttributes.sub
  // insert code to be executed by your lambda trigger

  if (!event?.request?.userAttributes?.sub){
    console.log("Now sub procided");
    return;
  }

  const now = new Date();
  const timestamp = now.getTime();

  const userItem = { 
    __typename: { S: 'User' },
    _lastChangedAt: { N: timestamp.toString() },
    _version: { N: "1" },
    updatedAt: { S: now.toISOString() },
    createdAt: { S: now.toISOString() },
    id : { S: event.request.userAttributes.sub },
    name: { S: event.request.userAttributes.email } ,
  }

  const params = {
    Item: userItem,
    TableName: tableName
  };

  // save a new user to DynamoDB

  try { 
    await ddb.putItem(params).promise();
    console.log("success")
  } catch (e) {
    console.log(e)
  }
};
