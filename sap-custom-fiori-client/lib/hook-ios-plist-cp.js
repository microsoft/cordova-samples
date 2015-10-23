/*
  Copyright (c) Microsoft. All rights reserved.  
  Licensed under the MIT license. See LICENSE file in the project root for full license information.
*/

module.exports=function(context) { 
	var path = require('path'); 
	context.requireCordovaModule('shelljs').cp('-Rf',path.join(__dirname,'ios'), 'platforms'); 	
}