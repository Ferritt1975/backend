console.log('Loading event');
var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();

exports.handler = function(event, context) {
    console.log("Request received:\n", JSON.stringify(event));
    console.log("Context received:\n", JSON.stringify(context));

    var tableName = "lists";
    var datetime = new Date().getTime().toString();

    dynamodb.putItem({
            "TableName": tableName,
            "Item": {
                "id": {
                    "N": datetime
                },
                "name": {
                    "S": event.name
                },
                "note": {
                    "S": event.note
                }
            }
        }, function(err, data) {
            if (err) {
                context.fail('ERROR: Dynamo failed: ' + err);
            } else {
                console.log('Dynamo Success: ' + JSON.stringify(data, null, '  '));
                context.succeed('SUCCESS');
            }
        });
}
