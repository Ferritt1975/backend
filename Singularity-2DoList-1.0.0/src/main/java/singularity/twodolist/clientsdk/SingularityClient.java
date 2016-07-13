/*
 * Copyright 2010-2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

package singularity.twodolist.clientsdk;

import java.util.*;


@com.amazonaws.mobileconnectors.apigateway.annotation.Service(endpoint = "https://xspfync7pf.execute-api.us-east-1.amazonaws.com/prod")
public interface SingularityClient {
    
    /**
     * 
     * 
     * @return void
     */
    @com.amazonaws.mobileconnectors.apigateway.annotation.Operation(path = "/todo", method = "GET")
    void todoGet();
    
    /**
     * 
     * 
     * @return void
     */
    @com.amazonaws.mobileconnectors.apigateway.annotation.Operation(path = "/todo", method = "POST")
    void todoPost();
    
    /**
     * 
     * 
     * @param id 
     * @return void
     */
    @com.amazonaws.mobileconnectors.apigateway.annotation.Operation(path = "/todo/{id}", method = "GET")
    void todoIdGet(
            @com.amazonaws.mobileconnectors.apigateway.annotation.Parameter(name = "id", location = "path")
            String id);
    
    /**
     * 
     * 
     * @param id 
     * @return void
     */
    @com.amazonaws.mobileconnectors.apigateway.annotation.Operation(path = "/todo/{id}", method = "PUT")
    void todoIdPut(
            @com.amazonaws.mobileconnectors.apigateway.annotation.Parameter(name = "id", location = "path")
            String id);
    
    /**
     * 
     * 
     * @param id 
     * @return void
     */
    @com.amazonaws.mobileconnectors.apigateway.annotation.Operation(path = "/todo/{id}", method = "DELETE")
    void todoIdDelete(
            @com.amazonaws.mobileconnectors.apigateway.annotation.Parameter(name = "id", location = "path")
            String id);
    
}
