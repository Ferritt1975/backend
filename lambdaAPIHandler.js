'use strict';
console.log('Loading function');

let doc = require('dynamodb-doc');
let dynamo = new doc.DynamoDB();

/**
 * Provide an event that contains the following keys:
 *
 *   - operation: one of the operations in the switch statement below
 *   - tableName: required for operations that interact with DynamoDB
 *   - payload: a parameter to pass to the operation being performed
 */
exports.handler = (event, context, callback) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    if (event.tableName)
        event.payload.TableName = event.tableName;

    const operation = event.operation;

    switch (operation) {
        case 'create':
            dynamo.putItem(event.payload, function(err, data) {
                if (err) {
                    context.fail('ERROR: Dynamo failed: ' + err);
                } else {
                    console.log('Dynamo Success: ' + JSON.stringify(data, null, '  '));
                    context.succeed('SUCCESS');
                }
            });
            break;
        case 'read':
            dynamo.scan(event.payload, function(err, data) {
                if (err) {
                    context.fail('ERROR: Dynamo failed: ' + err);
                } else {
                    console.log('Dynamo Success: ' + JSON.stringify(data, null, '  '));
                    context.succeed(data);
                }
            });
            break;
        case 'update':
            event.payload.Item.version += 1;
            dynamo.putItem(event.payload, function(err, data) {
                if (err) {
                    context.fail('ERROR: Dynamo failed: ' + err);
                } else {
                    console.log('Dynamo Success: ' + JSON.stringify(data, null, '  '));
                    context.succeed('SUCCESS');
                }
            });
            break;
        case 'delete':
            dynamo.deleteItem(event.payload, function(err, data) {
                if (err) {
                    context.fail('ERROR: Dynamo failed: ' + err);
                } else {
                    console.log('Dynamo Success: ' + JSON.stringify(data, null, '  '));
                    context.succeed('SUCCESS');
                }
            });
            break;
        case 'list':
            dynamo.scan(event.payload, callback);
            break;
        case 'echo':
            callback(null, event.payload);
            break;
        case 'ping':
            callback(null, 'pong');
            break;
        default:
            callback(new Error(`Unrecognized operation "${operation}"`));
    }
};
