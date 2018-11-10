# Singularity 2Do-List Backend API Definition

## Desciption:

The backend API is comprised of three key production offerings from the Amazon Web Services portfolio.  This API provides CRUD services to both a native web and an android based application.

- **Amazon API Gateway** - Amazon API Gateway is a fully managed service that makes it easy for developers to publish, maintain, monitor, and secure APIs at any scale. With the proliferation of mobile devices and the rise in the Internet of Things (IoT), it is increasingly common to make back-end systems and data accessible to applications through APIs.
- **Amazon Lambda** - AWS Lambda is a serverless compute service that runs your code in response to events and automatically manages the underlying compute resources for you. You can use AWS Lambda to extend other AWS services with custom logic, or create your own back-end services that operate at AWS scale, performance, and security.
- **Amazon DynamoDB** - DynamoDB supports storing, querying, and updating documents. Using the AWS SDK you can write applications that store JSON documents directly into Amazon DynamoDB tables. This capability reduces the amount of new code to be written to insert, update, and retrieve JSON documents and perform powerful database operations like nested JSON queries using just a few lines of code.

## Amazon API Gateway

The API Gateway logic is driven through method and integration request and response patterns.  For the purposes of this applicaiton the following features were used:
- Method Requests were used to define sepecific HTTP request headers that would be used within the API.  Only two resoureses, */login* and */ping* have no request headers defined.  For all others, an **Authorization** header is defined that will contain an href string corresponsing with the accessing user account.  This string equates to a 128-bit GUID estabished at the time of user creation and is consumed by the backend to control access to resourses.
- The Integration Request defines the target backend (in this case, the Lambda compute platform).  In addition, it defines various Body Mapping Templates that ensure that normalized payloads are delivered to the backend.  The actual templates are shown following the applicaible API definition below.
- Integration Reponses are used to define what HTTP status codes will be returned based upon reponses from the backend comput service.  For example, when a reponse contains the string "Unauthorized", the reponse can be pattered to supply an HTTP status code 401, which correctly describes the error.
- Finally, the Method Responses describe the set of valid HTTP status code that can be returned.

## Amazon Lambda

Amazon Lambda consists of a single function written in node.js to service all CRUD operations against the document database as well as service login requests and a simple ping operation.  Generally speaking, response to crud operations are table agnostic; the target table is defined as part of the API Gateway integration request and passed to the function as a target parameter.  Simple data protection methods are employed so that onwership data is not maliciously overwritten.

Sourcecode for this component can be described in the file [lambdaAPIHandler.js](https://github.com/COP4656-Singularity/backend/blob/master/lambdaAPIHandler.js)

## Amazon DynamoDB

Amaozn DynamoDB acts as a general purpose document storage facility.  For this application, two seporate tables are used, '*user*', and '*todo*'.  As expected, all user objects are stored in the user table, and all list objects are stored in the todo table, according to the following schemas:

```javascript
“user”: {
    “self”: href,
    “passwordHash”: string
    “email”: string
    “firstName”: string,
    “lastName”: string
}
```

```
"todo": {
    “self”: href,
    “version”: int,
    “name”: string,
    “owner”: href,
    “acl”: [
        href
    ]
    “tasks”: [ {
        “name”: string,
        “note”: string,
        “complete” : boolean,
        “subtasks” : {
            “name”: string,
            “note”: string,
            “complete”: boolean
            }
        }
    ]
}
```

# API Definition

**Singularity**
*Version 2016-07-20T01:54:14Z*

## Paths
### /login
#### POST /login
##### Responses
| Code | Description | Headers |
| --- | --- | --- |
| 200 | success | Access-Control-Allow-Origin "string"	Object |
| 401 | .\*"Unauthorized".\* |  |
##### Body Mapping Template
```javascript
#set($allParams = $input.params())
{
    "tableName": "user",
    "operation": "login",
    "payload": $input.json('$')
}
```

#### OPTIONS /login
##### Responses
| Code | Description | Headers |
| --- | --- | --- |
| 200 | success | Access-Control-Allow-Origin "string" Object |
|||Access-Control-Allow-Methods "string"	Object|
|||Access-Control-Allow-Headers "string"	Object|
##### Body Mapping Template
```javascript
{
    "statusCode": 200
}
```

### /ping
#### GET /ping
##### Responses
| Code | Description | Headers |
| --- | --- | --- |
| 200 | success |  |
##### Body Mapping Template
```javascript
{
    "operation": "ping"
}
```

### /todo
#### GET /todo
##### Parameters
| Name | Located in | Description | Required | Schema |
| --- | --- | --- | --- | --- |
| authorization | header |  | No | ⇄ string |
##### Responses
| Code | Description | Headers |
| --- | --- | --- |
| 200 | success | Access-Control-Allow-Origin "string" Object |
| 401 | .\*"Unauthorized".\* |  |
| 404 | .\*"Not Found".\* |  |
```javascript
#set($authorization = '"' + $input.params().header.authorization + '"')
{
    "tableName": "todo",
    "operation": "read",
    "payload" : {
        "FilterExpression": "#o = :value",
        "ExpressionAttributeNames": { "#o": "owner" },
        "ExpressionAttributeValues": { ":value": $authorization }
    },
    "authorization": $authorization
}
```

#### POST /todo
##### Parameters
| Name | Located in | Description | Required | Schema |
| --- | --- | --- | --- | --- |
| authorization | header |  | No | ⇄ string |
##### Responses
| Code | Description | Headers |
| --- | --- | --- |
| 200 | success | Access-Control-Allow-Origin "string" Object |
##### Body Mapping Template
```javascript
#set($authorization = '"' + $input.params().header.authorization + '"')
{
    "tableName": "todo",
    "operation": "create",
    "payload": {
        "Item" : $input.json('$')
    },
    "authorization": $authorization
}
```

#### OPTIONS /todo
##### Responses
| Code | Description | Headers |
| --- | --- | --- |
| 200 | success | Access-Control-Allow-Origin "string" Object |
|||Access-Control-Allow-Methods "string" Object|
|||Access-Control-Allow-Headers "string" Object|
##### Body Mapping Template
```javascript
{"statusCode": 200}
```

### /todo/{id}
#### GET /todo/{id}
##### Parameters
| Name | Located in | Description | Required | Schema |
| --- | --- | --- | --- | --- |
| authorization | header |  | No | ⇄ string |
| id | path |  | Yes | ⇄	string |
##### Responses
| Code | Description | Headers |
| --- | --- | --- |
| 200 | success | Access-Control-Allow-Origin "string" Object |
| 401 | .\*"Unauthorized".\* |  |
| 404 | .\*"Not Found".\* |  |
##### Body Mapping Template
```javascript
#set($authorization = '"' + $input.params().header.authorization + '"')
#set($self = '"todo/' + $input.params().get('path').get('id') + '"')
{
    "tableName": "todo",
    "operation": "read",
    "payload" : {
        "FilterExpression": "#s = :value",
        "ExpressionAttributeNames": { "#s": "self" },
        "ExpressionAttributeValues": { ":value": $self }
    },
    "authorization": $authorization
}
```

#### PUT /todo/{id}
##### Parameters
| Name | Located in | Description | Required | Schema |
| --- | --- | --- | --- | --- |
| authorization | header |  | No | ⇄ string |
| id | path | Yes | | ⇄ string |
##### Responses
| Code | Description | Headers |
| --- | --- | --- |
| 200 | success | Access-Control-Allow-Origin "string" Object |
| 401 | .\*"Unauthorized".\* |  |
| 412 | .\*"ConditionalCheckFailedException".\* |  |
##### Body Mapping Template
```javascript
#set($authorization = '"' + $input.params().header.authorization + '"')
#set($self = '"todo/' + $input.params().get('path').get('id') + '"')
{
    "tableName": "todo",
    "operation": "update",
    "payload" : {
        "Item": $input.json('$'),
        "ExpressionAttributeNames": { "#s": "self" },
        "ExpressionAttributeValues": {
        ":id" : $self,
        ":version" : $input.json('$.version')
        },
        "ConditionExpression": "#s = :id AND version <= :version AND owner = :id"
    },
    "authorization": $authorization,
    "self": $self
}
```

#### DELETE /todo/{id}
##### Parameters
| Name | Located in | Description | Required | Schema |
| --- | --- | --- | --- | --- |
| authorization | header |  | No | ⇄ string |
| id | path |  | Yes | ⇄	string |
##### Responses
| Code | Description | Headers |
| --- | --- | --- |
| 200 | success | Access-Control-Allow-Origin "string" Object |
| 401 | .\*"Unauthorized".\* |  |
| 404 | .\*"Not Found".\* |  |
##### Body Mapping Template
```javascript
#set($authorization = '"' + $input.params().header.authorization + '"')
#set($self = '"todo/' + $input.params().get('path').get('id') + '"')
{
    "tableName": "todo",
    "operation": "delete",
    "payload" : {
        "Key": {
            "self" : $self
        }
    },
    "authorization": $authorization,
    "ExpressionAttributeNames": { "#o": "owner" },
    "ExpressionAttributeValues": { ":owner" : $authorization },
    "ConditionExpression": "#o <= :owner",
     "ReturnValues": "ALL_OLD"
}
```

#### OPTIONS /todo/{id}
##### Parameters
| Name | Located in | Description | Required | Schema |
| --- | --- | --- | --- | --- |
| id | path |  | Yes | ⇄ string Responses |

| Code | Description | Headers |
| --- | --- | --- |
| 200 | success | Access-Control-Allow-Origin "string" Object |
| | | Access-Control-Allow-Methods "string" Object |
| | | Access-Control-Allow-Headers "string" Object |
##### Body Mapping Template
```javascript
{
    "statusCode": 200
}
```

### /user
#### GET /user
##### Parameters
| Name | Located in | Description | Required | Schema |
| --- | --- | --- | --- | --- |
| authorization | header |  | No | ⇄ string |
##### Responses
| Code | Description | Headers |
| --- | --- | --- |
| 200 | success | Access-Control-Allow-Origin "string" Object |
| 404 | .\*"Not Found".\* |  |
| 412 | .\*"ConditionalCheckFailedException".\* |  |
##### Body Mapping Template
```javascript
#set($authorization = '"' + $input.params().header.authorization + '"')
#set($allParams = $input.params())
{
    "tableName": "user",
    "operation": "read",
    "payload" : {},
    "authorization": $authorization
}
```

#### POST /user
##### Parameters
| Name | Located in | Description | Required | Schema |
| --- | --- | --- | --- | --- |
| authorization | header |  | No | ⇄ string |
##### Responses
| Code | Description | Headers |
| --- | --- | --- |
| 200 | success | Access-Control-Allow-Origin "string" Object |
| 401 | .\*"Unauthorized".\* |  |
| 404 |  |  |
##### Body Mapping Template
```javascript
{
    "tableName": "user",
    "operation": "create",
    "payload" : {
        "Item": $input.json('$'),
        "ConditionExpression": "attribute_not_exists(email)"
    }
}
```

#### OPTIONS /user
##### Responses
| Code | Description | Headers |
| --- | --- | --- |
| 200 | success | Access-Control-Allow-Origin "string" Object |
| | | Access-Control-Allow-Methods "string" Object |
| | | Access-Control-Allow-Headers "string" Object |
##### Body Mapping Template
```javascript
{
    "statusCode": 200
}
```

### /user/{id}
#### PUT /user/{id}
##### Parameters
| Name | Located in | Description | Required | Schema |
| --- | --- | --- | --- | --- |
| authorization | header |  | No | ⇄ string |
| id | path |  | Yes | ⇄	string |
##### Responses
| Code | Description | Headers |
| --- | --- | --- |
| 200 | success | Access-Control-Allow-Origin "string" Object |
| 412 | .\*"ConditionalCheckFailedException".\* |  |
##### Body Mapping Template
```javascript
#set($authorization = '"' + $input.params().header.authorization + '"')
#set($self = '"user/' + $input.params().get('path').get('id') + '"')
{
    "tableName": "user",
    "operation": "update",
    "payload" : {
        "Item": $input.json('$'),
        "ExpressionAttributeNames": { "# s": "self" },
        "ExpressionAttributeValues": { ":id1" : $self },
        "ExpressionAttributeValues": { ":id2" : $authorization },
        "ConditionExpression": "#s = :id1 AND #s = :id2"
    },
    "authorization": $authorization,
    "self": $self
}
```

#### OPTIONS /user/{id}
##### Responses
| Code | Description | Headers |
| --- | --- | --- |
| 200 | success | Access-Control-Allow-Origin "string" Object |
|||Access-Control-Allow-Methods "string" Object|
|||Access-Control-Allow-Headers "string" Object|
##### Body Mapping Template
```javascript
{
    "statusCode": 200
}
```
