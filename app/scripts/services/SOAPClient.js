define(['services/services','services/XMLService','jquery'],function(services,$){
    services.service("SOAPClient", ['$window','XMLService',function($window,XMLService){
        var SOAPClient_cacheWsdl = new Array();
        
        //function SOAPClient() {}
        var SOAPClient = this;
		SOAPClient.invoke = function(url, method, parameters, async, callback)
		{
		    if(async)
		        SOAPClient._loadWsdl(url, method, parameters, async, callback);
		    else
		        return SOAPClient._loadWsdl(url, method, parameters, async, callback);
		};
        SOAPClient._loadWsdl = function(url, method, parameters, async, callback)
		{
		    // load from cache?
		    var wsdl = SOAPClient_cacheWsdl[url];
		    if(wsdl + "" != "" && wsdl + "" != "undefined")
		        return SOAPClient._sendSoapRequest(url, method, parameters, async, callback, wsdl);
		    // get wsdl
		    var xmlHttp = SOAPClient._getXmlHttp();
		    xmlHttp.open("GET", url + "?wsdl", async);
		    if(async) 
		    {
		        xmlHttp.onreadystatechange = function() 
		        {
		            if(xmlHttp.readyState == 4){
		            	if ((xmlHttp.status >= 200 && xmlHttp.status < 300) || xmlHttp.status == 304 || xmlHttp.status==0) {
		                	SOAPClient._onLoadWsdl(url, method, parameters, async, callback, xmlHttp);
		            	} else {
		            		alert('SOAPClient._loadWsdl(),请求服务端失败:('+xmlHttp.status + ')' + xmlHttp.statusText);
		            	};
		            }
		        }
		    }
		    xmlHttp.send(null);
		    if (!async)
		        return SOAPClient._onLoadWsdl(url, method, parameters, async, callback, xmlHttp);
		}
		SOAPClient._onLoadWsdl = function(url, method, parameters, async, callback, req)
		{
		    var wsdl = req.responseXML;
		    SOAPClient_cacheWsdl[url] = wsdl;    // save a copy in cache
		    return SOAPClient._sendSoapRequest(url, method, parameters, async, callback, wsdl);
		};
        SOAPClient._sendSoapRequest = function(url, method, parameters, async, callback, wsdl)
		{
            if(!wsdl){console.log("SOAPClient._sendSoapRequest:wsdl IS "+wsdl);return;}            
		    // get namespace
            
		    var ns = (wsdl.documentElement.attributes["targetNamespace"] + "" == "undefined") ? wsdl.documentElement.attributes.getNamedItem("targetNamespace").nodeValue : wsdl.documentElement.attributes["targetNamespace"].value;
		    // build SOAP request
		    var sr = 
		                "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
		                "<soap:Envelope " +
		                "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" " +
		                "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" " +
		                "xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">" +
		                "<soap:Body>" +																							
		                "<" + method + " xmlns=\"" + ns + "\">" +
		                parameters.toXml() +
		                "</" + method + "></soap:Body></soap:Envelope>";
		    // send request
		    var xmlHttp = SOAPClient._getXmlHttp();
		    xmlHttp.open("POST", url, async);
		    var soapaction = ((ns.lastIndexOf("/") != ns.length - 1) ? ns + "/" : ns) + method;
		    xmlHttp.setRequestHeader("SOAPAction", soapaction);
		    xmlHttp.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
		    if(async) 
		    {
		        xmlHttp.onreadystatechange = function() 
		        {
		            if(xmlHttp.readyState == 4)
		                SOAPClient._onSendSoapRequest(method, async, callback, wsdl, xmlHttp);
		        }
		    }
		    xmlHttp.send(sr);
		    if (!async)
		        return SOAPClient._onSendSoapRequest(method, async, callback, wsdl, xmlHttp);
		}
        SOAPClient._onSendSoapRequest = function(method, async, callback, wsdl, req) 
		{
		    var o = null;
//		    var nd = SOAPClient._getElementsByTagName(req.responseXML, method + "Result");
            var xmldom = req.responseXML;
            if(!xmldom){
                xmldom = XMLService.parseXml("<result>网络访问未获得返回内容</result>")
                console.log("网络访问未获得返回内容");
                return xmldom;
            }
            if(req.responseXML.xml){
                xmldom = req.responseXML.xml;
            }
            var nd = SOAPClient._getElementsByTagName(xmldom, "return");
		    if(nd.length == 0)
		    {
		        if(req.responseXML.getElementsByTagName("faultcode").length > 0)
		        {
		            if(async || callback)
		                o = new Error(500, req.responseXML.getElementsByTagName("faultstring")[0].childNodes[0].nodeValue);
		            else
		                throw new Error(500, req.responseXML.getElementsByTagName("faultstring")[0].childNodes[0].nodeValue);            
		        }
		    }
		    else
		        o = SOAPClient._soapresult2object(nd[0], wsdl);
		    if(callback)
		        callback(o, req.responseXML);
		    if(!async)
		        return o;        
		};
        SOAPClient._soapresult2object = function(node, wsdl)
		{
		    var wsdlTypes = SOAPClient._getTypesFromWsdl(wsdl);
		    return SOAPClient._node2object(node, wsdlTypes);
		}
		
		SOAPClient._node2object = function(node, wsdlTypes)
		{
		    // null node
		    if(node == null)
		        return null;
		    // text node
		    if(node.nodeType == 3 || node.nodeType == 4)
		        return SOAPClient._extractValue(node, wsdlTypes);
		    // leaf node
		    if (node.childNodes.length == 1 && (node.childNodes[0].nodeType == 3 || node.childNodes[0].nodeType == 4))
		        return SOAPClient._node2object(node.childNodes[0], wsdlTypes);
		    var isarray = SOAPClient._getTypeFromWsdl(node.nodeName, wsdlTypes).toLowerCase().indexOf("arrayof") != -1;
		    // object node
		    if(!isarray)
		    {
		        var obj = null;
		        if(node.hasChildNodes())
		            obj = new Object();
		        for(var i = 0; i < node.childNodes.length; i++)
		        {
		            var p = SOAPClient._node2object(node.childNodes[i], wsdlTypes);
		            obj[node.childNodes[i].nodeName] = p;
		        }
		        return obj;
		    }
		    // list node
		    else
		    {
		        // create node ref
		        var l = new Array();
		        for(var i = 0; i < node.childNodes.length; i++)
		            l[l.length] = SOAPClient._node2object(node.childNodes[i], wsdlTypes);
		        return l;
		    }
		    return null;
		}
		
		SOAPClient._extractValue = function(node, wsdlTypes)
		{
		    var value = node.nodeValue;
		    switch(SOAPClient._getTypeFromWsdl(node.parentNode.nodeName, wsdlTypes).toLowerCase())
		    {
		        default:
		        case "s:string":            
		            return (value != null) ? value + "" : "";
		        case "s:boolean":
		            return value + "" == "true";
		        case "s:int":
		        case "s:long":
		            return (value != null) ? parseInt(value + "", 10) : 0;
		        case "s:double":
		            return (value != null) ? parseFloat(value + "") : 0;
		        case "s:datetime":
		            if(value == null)
		                return null;
		            else
		            {
		                value = value + "";
		                value = value.substring(0, (value.lastIndexOf(".") == -1 ? value.length : value.lastIndexOf(".")));
		                value = value.replace(/T/gi," ");
		                value = value.replace(/-/gi,"/");
		                var d = new Date();
		                d.setTime(Date.parse(value));                                        
		                return d;                
		            }
		    }
		}
		
		SOAPClient._getTypesFromWsdl = function(wsdl)
		{
		    var wsdlTypes = new Array();
		    // IE
		    var ell = wsdl.getElementsByTagName("s:element");    
		    var useNamedItem = true;
		    // MOZ
		    if(ell.length == 0)
		    {
		        ell = wsdl.getElementsByTagName("element");     
		        useNamedItem = false;
		    }
		    for(var i = 0; i < ell.length; i++)
		    {
		        if(useNamedItem)
		        {
		            if(ell[i].attributes.getNamedItem("name") != null && ell[i].attributes.getNamedItem("type") != null) 
		                wsdlTypes[ell[i].attributes.getNamedItem("name").nodeValue] = ell[i].attributes.getNamedItem("type").nodeValue;
		        }    
		        else
		        {
		            if(ell[i].attributes["name"] != null && ell[i].attributes["type"] != null)
		                wsdlTypes[ell[i].attributes["name"].value] = ell[i].attributes["type"].value;
		        }
		    }
		    return wsdlTypes;
		}
		
		SOAPClient._getTypeFromWsdl = function(elementname, wsdlTypes)
		{
		    var type = wsdlTypes[elementname] + "";
		    return (type == "undefined") ? "" : type;
		}
		//The SOAPClient._getElementsByTagName method optimizes XPath queries according to the available XML parser:
		
		SOAPClient._getElementsByTagName = function(document, tagName)
		{
//		    try
//		    {
//		        // trying to get node omitting any namespaces (latest versions of MSXML.XMLDocument)
//		        //return document.selectNodes(".//*[local-name()=\""+ tagName +"\"]");
//                return document.documentElement.selectNodes(tagName);
//		    }
//		    catch (ex) {}
//            //var node = document.evaluate(tagName,document.documentElement,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null)
//		    // old XML parser support
            var nodes = document.getElementsByTagName(tagName);
            if(nodes==null || nodes.length==0){
                nodes = document.getElementsByTagName("ns:"+tagName)
            }
		    return nodes;
		}
		
		SOAPClient._getXmlHttp = function() 
		{
		    try
		    {
		        if($window.XMLHttpRequest) 
		        {
		            var req = new $window.XMLHttpRequest();
		            // some versions of Moz do not support the readyState property and the onreadystate event so we patch it!
		            if(req.readyState == null) 
		            {
		                req.readyState = 1;
		                req.addEventListener("load", 
		                                    function() 
		                                    {
		                                        req.readyState = 4;
		                                        if(typeof req.onreadystatechange == "function")
		                                            req.onreadystatechange();
		                                    },
		                                    false);
		            }
		            return req;
		        }
		        if($window.ActiveXObject) 
		            return new ActiveXObject(SOAPClient._getXmlHttpProgID());
		    }
		    catch (ex) {}
		    throw new Error("Your browser does not support XmlHttp objects");
		}
		
		SOAPClient._getXmlHttpProgID = function()
		{
		    if(SOAPClient._getXmlHttpProgID.progid)
		        return SOAPClient._getXmlHttpProgID.progid;
		    var progids = ["Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
		    var o;
		    for(var i = 0; i < progids.length; i++)
		    {
		        try
		        {
		            o = new ActiveXObject(progids[i]);
		            return SOAPClient._getXmlHttpProgID.progid = progids[i];
		        }
		        catch (ex) {};
		    }
		    throw new Error("Could not find an installed XML parser");
		}
        
    }]
    );
    
});