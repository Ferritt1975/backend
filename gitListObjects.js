console.log('Loading event');
var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

exports.handler = function(event, context) {
    var tableName = "lists";
    dynamodb.scan({
        TableName : tableName
    }, function(err, data) {
        if (err) {
            context.done('error','reading dynamodb failed: '+err);
        }
        context.done(null, data.Items);
    });
};
