#Singularity 2Do-List Backend API Definition

##Desciption:

The backend API consists of the key production offerings from the Amazon Web Services portfolio.

- **Amazon API Gateway** - Amazon API Gateway is a fully managed service that makes it easy for developers to publish, maintain, monitor, and secure APIs at any scale. With the proliferation of mobile devices and the rise in the Internet of Things (IoT), it is increasingly common to make back-end systems and data accessible to applications through APIs.
- **Amazon Lambda** - AWS Lambda is a serverless compute service that runs your code in response to events and automatically manages the underlying compute resources for you. You can use AWS Lambda to extend other AWS services with custom logic, or create your own back-end services that operate at AWS scale, performance, and security.
- **Amazon DynamoDB** - DynamoDB supports storing, querying, and updating documents. Using the AWS SDK you can write applications that store JSON documents directly into Amazon DynamoDB tables. This capability reduces the amount of new code to be written to insert, update, and retrieve JSON documents and perform powerful database operations like nested JSON queries using just a few lines of code.

# Amazon API Gateway

The API Gateway logic is driven through method and integration request and response patterns.  For the purposes of this applicaiton the following features were used:
- Method Requests were used to define sepecific HTTP request headers that would be used within the API.  Only two resoureses, */login* and */ping* have no request headers defined.  For all others, an **Authorization** header is defined that will contain an href string corresponsing with the accessing user account.  This string equates to a 128-bit GUID estabished at the time of user creation and is consumed by the backend to control access to resourses.
- The Integration Request defines the target backend (in this case, the Lambda compute platform).  In addition, it defines various Body Mapping Templates that ensure that normalized payloads are delivered to the backend.  The actual templates are shown following the applicaible API definition below.
- Integration Reponses are used to define what HTTP status codes will be returned based upon reponses from the backend comput service.  For example, when a reponse contains the string "Unauthorized", the reponse can be pattered to supply an HTTP status code 401, which correctly describes the error.
- Finally, the Method Responses describe the set of valid HTTP status code that can be returned.

# Amazon Lambda

Amazon Lambda consists of a single function written in node.js to service all CRUD operations against the document database as well as service login requests and a simple ping operation.  Generally speaking, response to crud operations are table agnostic; the target table is defined as part of the API Gateway integration request and passed to the function as a target parameter.  Simple data protection methods are employed so that onwership data is not maliciously overwritten.

# Amazon DynamoDB

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

#API Definition

**Singularity**
*Version 2016-07-20T01:54:14Z*

##Paths
###/login
####POST /login
#####Responses
|Code|Description|Headers|
|---|---|---|
|200|success|Access-Control-Allow-Origin "string"	Object|
|401|unauthorized||

####OPTIONS /login
#####Responses
|Code|Description|Headers|
|---|---|---|
|200|success|Access-Control-Allow-Origin "string" Object|
|||Access-Control-Allow-Methods "string"	Object|
|||Access-Control-Allow-Headers "string"	Object|

###/ping
####GET /ping
#####Responses
|Code|Description|Headers|
|---|---|---|
|200|success||

###/todo
####GET /todo
#####Parameters
|Name|Located in|Description|Required|Schema|
|---|---|---|---|---|
|authorization|header||No|⇄ string|
#####Responses
|Code|Description|Headers|
|---|---|---|
|200|Access-Control-Allow-Origin "string" Object||
|401|||
|404|||

####POST /todo
#####Parameters
|Name|Located in|Description|Required|Schema|
|---|---|---|---|---|
|authorization|header||No|⇄ string|
#####Responses
|Code|Description|Headers|
|---|---|---|
|200|success|Access-Control-Allow-Origin "string" Object|

####OPTIONS /todo
#####Responses
|Code|Description|Headers|
|---|---|---|
|200|success|Access-Control-Allow-Origin "string" Object|
|||Access-Control-Allow-Methods "string" Object|
|||Access-Control-Allow-Headers "string" Object|

###/todo/{id}
####GET /todo/{id}
#####Parameters
|Name|Located in|Description|Required|Schema|
|---|---|---|---|---|
|authorization|header||No|⇄ string|
|id|path||Yes|⇄	string|
#####Responses
|Code|Description|Headers|
|---|---|---|
|200|success|Access-Control-Allow-Origin "string" Object|
|401|||
|404|||

####PUT /todo/{id}
#####Parameters
|Name|Located in|Description|Required|Schema|
|---|---|---|---|---|
|authorization|header||No|⇄ string|
|id|path|Yes|⇄ string|
#####Responses
|Code|Description|Headers|
|---|---|---|
|200|success|Access-Control-Allow-Origin "string" Object|
|401|||
|412|||

####DELETE /todo/{id}
#####Parameters
|Name|Located in|Description|Required|Schema|
|---|---|---|---|---|
|authorization|header||No|⇄ string|
|id|path||Yes|⇄	string|
#####Responses
|Code|Description|Headers|
|---|---|---|
|200|success|Access-Control-Allow-Origin "string" Object|
|401|||
|404|||

####OPTIONS /todo/{id}
#####Parameters
|Name|Located in|Description|Required|Schema|
|---|---|---|---|---|
|id|path||Yes|⇄	string Responses|

|Code|Description|Headers|
|---|---|---|
|200|success|Access-Control-Allow-Origin "string" Object|
|||Access-Control-Allow-Methods "string" Object|
|||Access-Control-Allow-Headers "string" Object|

###/user
####GET /user
#####Parameters
|Name|Located in|Description|Required|Schema|
|---|---|---|---|---|
|authorization|header||No|⇄ string|
#####Responses
|Code|Description|Headers|
|---|---|---|
|200|success|Access-Control-Allow-Origin "string" Object|
|404|||
|412|||

####POST /user
#####Parameters
|Name|Located in|Description|Required|Schema|
|---|---|---|---|---|
|authorization|header||No|⇄ string|
#####Responses
|Code|Description|Headers|
|---|---|---|
|200|success|Access-Control-Allow-Origin "string" Object|
|401|||
|404|||

####OPTIONS /user
#####Responses
|Code|Description|Headers|
|---|---|---|
|200|success|Access-Control-Allow-Origin "string" Object|
|||Access-Control-Allow-Methods "string" Object|
|||Access-Control-Allow-Headers "string" Object|

###/user/{id}
####PUT /user/{id}
#####Parameters
|Name|Located in|Description|Required|Schema|
|---|---|---|---|---|
|authorization|header||No|⇄ string|
|id|path||Yes|⇄	string|
#####Responses
|Code|Description|Headers|
|---|---|---|
|200|success|Access-Control-Allow-Origin "string" Object|
|412|||

####OPTIONS /user/{id}
#####Responses
|Code|Description|Headers|
|---|---|---|
|200|success|Access-Control-Allow-Origin "string" Object|
|||Access-Control-Allow-Methods "string" Object|
|||Access-Control-Allow-Headers "string" Object|
