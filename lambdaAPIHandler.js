'use strict';
console.log('Loading function');

let doc = require('dynamodb-doc');
let dynamo = new doc.DynamoDB();
var taskTable = 'tasks';
var listTable = 'lists';

exports.handler = (event, context, callback) => {

    var datetime = new Date().getTime().toString();
    var operation = event.operation;
    var payload;
    if (event.payload) {
        payload = JSON.parse(JSON.stringify(event.payload));
    }

    switch (operation) {
        case 'putListObject':
            dynamo.putItem({
                TableName: listTable,
                Item: {
                    id: Number(datetime),
                    name: payload.name,
                    note: payload.note
                }
            }, function(err, data) {
                if (err) {
                    context.fail('ERROR: Dynamo failed: ' + err);
                } else {
                    console.log('Dynamo Success: ' + JSON.stringify(data, null, '  '));
                    context.succeed('SUCCESS');
                }
            });
            break;
        case 'getLists':
            dynamo.scan({
                TableName : listTable
            }, function(err, data) {
                if (err) {
                    context.done('error','reading dynamodb failed: '+err);
                }
                context.done(null, data.Items);
            });
            break;
        case 'deleteListObjectById':
            dynamo.deleteItem({
                TableName: listTable,
                Key: {
                    id: payload.id
                }
            }, function(err, data) {
                if (err) {
                    context.fail('ERROR: DELETE operation failed: ' + err);
                } else {
                    console.log('DELETE operation succeded.');
                    context.succeed('SUCCESS');
                }
            });
            break;
        case 'updateListObjectById':
            //TODO
            break;
        case 'getListObjectById':
            dynamo.scan({
                TableName : listTable,
                FilterExpression: "id = :value",
                ExpressionAttributeValues: {
                    ":value": payload.id
                }
            }, function(err, data) {
                if (err) {
                    context.done('error','reading dynamodb failed: '+err);
                }
                callback(null, data.Items);
            });
            break;
        case 'putTaskObject':
            dynamo.putItem({
                TableName: taskTable,
                Item: {
                    id: Number(datetime),
                    name: payload.name,
                    note: payload.note,
                    complete: payload.complete
                }
            }, function(err, data) {
                if (err) {
                    context.fail('ERROR: Dynamo failed: ' + err);
                } else {
                    console.log('Dynamo Success: ' + JSON.stringify(data, null, '  '));
                    context.succeed('SUCCESS');
                }
            });
            break;
        case 'deleteTasksHavingParentId':
            //TODO
            break;
        case 'getTaskObjectsHavingParentId':
                dynamo.scan({
                TableName : taskTable,
                FilterExpression: "parent = :value",
                ExpressionAttributeValues: {
                    ":value": payload.id
                }
            }, function(err, data) {
                if (err) {
                    context.done('error','reading dynamodb failed: '+err);
                }
                callback(null, data.Items);
            });
            break;
        case 'deleteTaskObjectById':
            dynamo.deleteItem({
                TableName: taskTable,
                Key: {
                    id: payload.id
                }
            }, function(err, data) {
                if (err) {
                    context.fail('ERROR: DELETE operation failed: ' + err);
                } else {
                    console.log('DELETE operation succeded.');
                    context.succeed('SUCCESS');
                }
            });
            break;
        case 'updateTaskObjectById':
            //TODO
            break;
        case 'getTaskObjectById':
                dynamo.scan({
                TableName : taskTable,
                FilterExpression: "id = :value",
                ExpressionAttributeValues: {
                    ":value": payload.id
                }
            }, function(err, data) {
                if (err) {
                    context.done('error','reading dynamodb failed: '+err);
                }
                callback(null, data.Items);
            });
            break;
        default:
            callback(new Error(`Unrecognized operation "${operation}"`));
    }
};
