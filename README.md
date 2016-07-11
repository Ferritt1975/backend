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
    "payload" : $input.json('$')
}
```

## /list/GET
```javascript
#set($allParams = $input.params())
{
    "operation": "getLists"
}
```

## /list/{id}/DELETE
```javascript
#set($allParams = $input.params())
{
    "operation": "deleteListObjectById",
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
    "payload" : {
        #set($params = $allParams.get('path'))
        #foreach($paramName in $params.keySet())
        "$paramName" : $util.escapeJavaScript($params.get($paramName))
        #if($foreach.hasNext),#end
        #end
    }
}
```
