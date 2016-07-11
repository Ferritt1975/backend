# backend

* dockerrun - Definition file used in the deployment of the Swagger Editor container
* swagger.json - Swagger Editor output used in the defition of AWS API Gateway RESTful interface

# Important URLs:

* Swagger Editor - http://singularity-swagger.us-east-1.elasticbeanstalk.com/#/

# API Gateway Body Mapping Templates

## /list/POST
```javascript
#set($allParams = $input.params())
{
    "operation": "putListObject",
    "tableName": "lists",
    "payload" : $input.json('$')
}
```

## /list/GET
```javascript
#set($allParams = $input.params())
{
    "operation": "getLists",
    "tableName": "lists"
}
```

## /list/{id}/DELETE

## /list/{id}/GET
```javascript
#set($allParams = $input.params())
{
    "operation": "getListById",
    "tableName": "lists",
    "payload" : {
        #set($params = $allParams.get('path'))
        #foreach($paramName in $params.keySet())
        "$paramName" : $util.escapeJavaScript($params.get($paramName))
        #if($foreach.hasNext),#end
        #end
    }
}
```

## /task/POST

## /task/withparent/{id}/GET

## /task/{id}/DELETE

## /task/{id}/GET
