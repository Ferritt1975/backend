# backend

* dockerrun - Definition file used in the deployment of the Swagger Editor container
* swagger.json - Swagger Editor output used in the defition of AWS API Gateway RESTful interface

# Important URLs:

* Swagger Editor - http://singularity-swagger.us-east-1.elasticbeanstalk.com/#/

# API Gateway Body Mapping Templates

## /todo/GET
```javascript
#set($allParams = $input.params())
{
    "tableName": "todo",
    "operation": "read",
    "payload" : {}
}
```

## /todo/{id}/GET
```javascript
#set($allParams = $input.params())
{
    "tableName": "todo",
    "operation": "read",
    "payload" : {
        "FilterExpression": "#s = :value",
        "ExpressionAttributeNames": { "#s": "self" },
        "ExpressionAttributeValues": { ":value": 
        #set($params = $allParams.get('path'))
        #foreach($paramName in $params.keySet())
        "$util.escapeJavaScript($params.get($paramName))"
        #if($foreach.hasNext),#end
        #end
        }
    }
}
```

## /todo/POST
```javascript
#set($allParams = $input.params())
{
    "tableName": "todo",
    "operation": "create",
    "payload" : $input.json('$')
}
```

## /todo/{id}/PUT
```javascript
#set($allParams = $input.params())
{
    "tableName": "todo",
    "operation": "update",
    "payload" : {
        "Item": $input.json('$'),
        "ExpressionAttributeNames": { "#s": "self" },
        "ExpressionAttributeValues": {
        #set($params = $allParams.get('path'))
        #foreach($paramName in $params.keySet())
        ":id" : "$util.escapeJavaScript($params.get($paramName))"
        #if($foreach.hasNext),#end
        #end,
        ":version" : $input.json('$.version')
        },
        "ConditionExpression": "#s <= :id AND version <= :version"
    }
}
```

## /todo/{id}DELETE
```javascript
#set($allParams = $input.params())
{
    "tableName": "todo",
    "operation": "delete",
    "payload" : {
        "Key": {
            #set($params = $allParams.get('path'))
            #foreach($paramName in $params.keySet())
            "self" : "$util.escapeJavaScript($params.get($paramName))"
            #if($foreach.hasNext),#end
            #end
        }
    }
}
```
