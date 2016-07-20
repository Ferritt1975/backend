'use strict';

let doc = require('dynamodb-doc');
let crypto = require('crypto');
let dynamo = new doc.DynamoDB();

/**
 * Provide an event that contains the following keys:
 *
 *   - operation: one of the operations in the switch statement below
 *   - tableName: required for operations that interact with DynamoDB
 *   - payload: a parameter to pass to the operation being performed
 */
exports.handler = (event, context, callback) => {

    var json, error;

    if (event.tableName)
        event.payload.TableName = event.tableName;

    const operation = event.operation;

    switch (operation) {
        case 'create':
            if ( event.authorization ) {
                json = {
                        "TableName": "user",
                        "FilterExpression": "#s = :value",
                        "ExpressionAttributeNames": { "#s": "self" },
                        "ExpressionAttributeValues": { ":value": event.authorization }
                    };
                dynamo.scan(json, function(err, data) {
                    if (err) {
                        context.fail('ERROR: Dynamo failed: ' + err);
                    } else {
                        if (data.Count == 1) {
                            var hexstring = crypto.randomBytes(16).toString("hex");
                            var guidstring = hexstring.substring(0,8) + "-" + 
                                             hexstring.substring(8,12) + "-" + 
                                             hexstring.substring(12,16) + "-" + 
                                             hexstring.substring(16,20) + "-" + 
                                             hexstring.substring(20);
                            event.payload.Item.self = event.payload.TableName + '/' + guidstring;
                            event.payload.Item.owner = event.authorization;
                            dynamo.putItem(event.payload, function(err, data) {
                                if (err) {
                                    context.fail('ERROR: Dynamo failed: ' + err);
                                } else {
                                    context.succeed('SUCCESS');
                                }
                            });
                        } else {
                            error = {
                                code: "Unauthorized",
                                message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
                            };
                            context.fail(JSON.stringify(error));
                        }
                    }                
                });
            } else {
                error = {
                    code: "Unauthorized",
                    message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
                };
                context.fail(JSON.stringify(error));
            }
            break;
        case 'read':
            if ( event.authorization ) {
                json = {
                        "TableName": "user",
                        "FilterExpression": "#s = :value",
                        "ExpressionAttributeNames": { "#s": "self" },
                        "ExpressionAttributeValues": { ":value": event.authorization }
                    };
                dynamo.scan(json, function(err, data) {
                    if (err) {
                        context.fail('ERROR: Dynamo failed: ' + err);
                    } else {
                        if (data.Count == 1) {
                            dynamo.scan(event.payload, function(err, data) {
                                if (err) {
                                    context.fail('ERROR: Dynamo failed: ' + err);
                                } else {
                                    if (data.Count >= 1 )
                                    {
                                       if (event.tableName == 'todo' && data.Items[0].owner != event.authorization) {
                                            error = {
                                                code: "Unauthorized",
                                                message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
                                            };
                                            context.fail(JSON.stringify(error));               
                                        } else {
                                            context.succeed(data);
                                        }
                                    } else {
                                        error = {
                                            code: "Not Found",
                                            message: "The origin server did not find a current representation for the target resource or is not willing to disclose that one exists."
                                        };
                                        context.fail(JSON.stringify(error));               
                                    }
                                }
                            });
                        } else {
                            var error = {
                                code: "Unauthorized",
                                message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
                            };
                            context.fail(JSON.stringify(error));
                        }
                    }                
                });
            } else {
                 error = {
                    code: "Unauthorized",
                    message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
                };
                context.fail(JSON.stringify(error));               
            }
            break;
        case 'update':
            if ( event.authorization ) {
                json = {
                        "TableName": "user",
                        "FilterExpression": "#s = :value",
                        "ExpressionAttributeNames": { "#s": "self" },
                        "ExpressionAttributeValues": { ":value": event.authorization }
                    };
                dynamo.scan(json, function(err, data) {
                    if (err) {
                        context.fail('ERROR: Dynamo failed: ' + err);
                    } else {
                        if (data.Count == 1) {
                            if (event.tableName=='todo') {
                                event.payload.Item.version += 1;
                                event.payload.Item.owner = event.authorization;
                            }
                            event.payload.Item.self = event.self;
                            dynamo.putItem(event.payload, function(err, data) {
                                if (err) {
                                    error = {
                                        code: "Precondition Failed",
                                        message: "One or more conditions given in the request body fields evaluated to false when tested on the server."
                                    };
                                    context.fail(JSON.stringify(error));
                                        } else {
                                    context.succeed('SUCCESS');
                                }
                            });
                        } else {
                            error = {
                                code: "Unauthorized",
                                message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
                            };
                            context.fail(JSON.stringify(error));
                        }
                    }                
                });
            } else {
                error = {
                    code: "Unauthorized",
                    message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
                };
                context.fail(JSON.stringify(error));
            }
            break;
        case 'delete':
            if ( event.authorization ) {
                json = {
                        "TableName": "user",
                        "FilterExpression": "#s = :value",
                        "ExpressionAttributeNames": { "#s": "self" },
                        "ExpressionAttributeValues": { ":value": event.authorization }
                    };
                dynamo.scan(json, function(err, data) {
                    if (err) {
                        context.fail('ERROR: Dynamo failed: ' + err);
                    } else {
                        if (data.Count == 1) {
                            dynamo.deleteItem(event.payload, function(err, data) {
                                if (err) {
                                    context.fail('ERROR: Dynamo failed: ' + err);
                                } else {
                                    context.succeed(JSON.stringify(data, null, '  '));
                                }
                            });
                        } else {
                            error = {
                                code: "Unauthorized",
                                message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
                            };
                            context.fail(JSON.stringify(error));
                        }
                    }                
                });
            } else {
                error = {
                    code: "Unauthorized",
                    message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
                };
                context.fail(JSON.stringify(error));
            }
            break;
        case 'login':
            var passwordHash = crypto.createHash('md5').update(event.payload.password).digest("hex");
            json = {
               "TableName": "user",
                "ExpressionAttributeNames": { "#s": "self" },
                "FilterExpression": "email = :email AND passwordHash = :passwordHash",
                "ExpressionAttributeValues": {
                    ":email": event.payload.email,
                    ":passwordHash": passwordHash
                },
                "ProjectionExpression": "#s"
            };
            dynamo.scan(json, function(err, data) {
                if (err) {
                    context.fail('ERROR: Dynamo failed: ' + err);
                } else {
                    if (data.Count == 1) {
                        context.succeed(data);
                    } else {
                        var error = {
                            code: "Unauthorized",
                            message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
                        };
                        context.fail(JSON.stringify(error));
                    }
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
