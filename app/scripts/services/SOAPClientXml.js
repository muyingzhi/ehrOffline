define(['services/services','services/XMLService','jquery'],function(services,$){
    services.service("SOAPClientXml", ['$window','XMLService',function($window,XMLService){
        var SOAPClient_cacheWsdl = new Array();
        
        //function SOAPClient() {}
        var SOAPClient = this;
		SOAPClient.invoke = function(url, method, parameters, async, callback)
		{
			var xml = '<?xml version="1.0" encoding="utf-8"?>';
			var rep = {};
			var header = parameters.get('header');
			var xmldom = XMLService.parseXml(header);
			var node = XMLService.selectSingleNode(xmldom,"header/servicecode");
			var servCode = node.textContent || node.text;
			//---------根据协议，设计返回内容
			if(servCode='21011001'){
				xml +='<result>'+
						'<state value="0">'+
						//'<warning code="" message ="提示信息" />'+
						'</state>'+
						'<output>'+
						'<arealist>'+
						'<areaitem>'+
						'</areaitem>'+
						'</arealist>'+
						'</output>'+
						'</result>';
			}
			setTimeout(function(){
		    	callback(xml,rep);

			},50)
		};
    }]
    );
    
});