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
```javascript
#set($allParams = $input.params())
{
    "operation": "deleteListObjectById",
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

## /list/{id}/POST
```javascript
#set($allParams = $input.params())
{
    "operation": "updateListObjectById",
    "tableName": "lists",
    "payload" : $input.json('$'),
        #set($params = $allParams.get('path'))
        #foreach($paramName in $params.keySet())
        "$paramName" : $util.escapeJavaScript($params.get($paramName))
        #if($foreach.hasNext),#end
        #end
}
```

## /list/{id}/GET
```javascript
#set($allParams = $input.params())
{
    "operation": "getListObjectById",
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
```javascript
#set($allParams = $input.params())
{
    "operation": "putTaskObject",
    "tableName": "tasks",
    "payload" : {
        #set($params = $allParams.get('path'))
        #foreach($paramName in $params.keySet())
        "$paramName" : $util.escapeJavaScript($params.get($paramName))
        #if($foreach.hasNext),#end
        #end
    }
}
```
## /task/withparent/{id}/DELETE
```javascript
#set($allParams = $input.params())
{
    "operation": "deleteTasksHavingParentId",
    "tableName": "tasks",
    "payload" : {
        #set($params = $allParams.get('path'))
        #foreach($paramName in $params.keySet())
        "$paramName" : $util.escapeJavaScript($params.get($paramName))
        #if($foreach.hasNext),#end
        #end
    }
}
```

## /task/withparent/{id}/GET
```javascript
#set($allParams = $input.params())
{
    "operation": "getTaskObjectHavingParentId",
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

## /task/{id}/DELETE
```javascript
#set($allParams = $input.params())
{
    "operation": "deleteTaskObjectById",
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

## /task/{id}/POST
```javascript
#set($allParams = $input.params())
{
    "operation": "updateTaskObjectById",
    "tableName": "lists",
    "payload" : $input.json('$'),
        #set($params = $allParams.get('path'))
        #foreach($paramName in $params.keySet())
        "$paramName" : $util.escapeJavaScript($params.get($paramName))
        #if($foreach.hasNext),#end
        #end
}
```

## /task/{id}/GET
```javascript
#set($allParams = $input.params())
{
    "operation": "getTaskObjectById",
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
