define(['services/services','jquery'],function(services,$){
    services.service("XMLService", ['$window',function($window){
        /**
         * namespaces : {prefix1:"uri1",prefix2:"uri2"}
         */
        this.selectSingleNode = function(context,expression,namespaces){
            var doc = (context.nodeType !=9 ? context.ownerDocument : context);
            
            if (typeof doc.evaluate != "undefined"){
                var nsresolver = null;
                if (namespaces instanceof Object){
                    nsresolver = function(prefix){
                        return namespaces[prefix];
                    }
                }
                var result = doc.evaluate(expression , context ,nsresolver,
                                        XPathResult.FIRST_ORDERED_NODE_TYPE,null);
                return (result !== null?result.singleNodeValue : null);
            }else if (typeof context.selectSingleNode != "undefined"){
                if (namespaces instanceof Object){
                    var ns = "";
                    for(var prefix in namespaces){
                        if(namespaces.hasOwnProperty(prefix)){
                            ns += "xmlns:" + "prefix" + "='" + namespaces[prefix] + "'";
                        }
                    }
                    doc.setProperty("SelectionNamespaces",ns);
                }
                return doc.selectSingleNode(expression);
            }else{
                throw new Error("No XPath engine found.");
            }
        };
        this.selectNodes = function(context,expression,namespaces){
            var doc = (context.nodeType !=9 ? context.ownerDocument : context);
            
            if (typeof doc.evaluate != "undefined"){
                var nsresolver = null;
                if (namespaces instanceof Object){
                    nsresolver = function(prefix){
                        return namespaces[prefix];
                    }
                }
                var result = doc.evaluate(expression , context ,nsresolver,
                                        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
                var nodes = new Array();
                if(result != null){
                    for (var i=0 , len=result.snapshotLength ; i<len ; i++){
                        nodes.push(result.snapshotItem(i));
                    }
                }
                return nodes;
            }else if (typeof context.selectSingleNode != "undefined"){
                if (namespaces instanceof Object){
                    var ns = "";
                    for(var prefix in namespaces){
                        if(namespaces.hasOwnProperty(prefix)){
                            ns += "xmlns:" + "prefix" + "='" + namespaces[prefix] + "'";
                        }
                    }
                    doc.setProperty("SelectionNamespaces",ns);
                }
                var result = context.selectNodes(expression);
                var nodes = new Array();
                for(var i=0 ,len=result.length ; i<len ; i++){
                    nodes.push(result[i]);
                }
                return nodes;
            }else{
                throw new Error("No XPath engine found.");
            }
        };
        this.serializeXml = function(xmldom){
            if(typeof xmldom.xml != "undefined"){
                return xmldom.xml;
            }else if(typeof XMLSerializer != "undefined"){
                var serializer = new XMLSerializer();
                return serializer.serializeToString(xmldom);
            }else {
                throw new Error("Could not serialize XML DOM");
            }
        };
        /**
         * xml字符串转换成XMLDocument
         */
        this.parseXml = function(xml){
            return parseXml(xml);
        }
        function parseXml(xml){
            var xmldom = null;
            if(hasMSXML()){
                xmldom = createDocument();
                xmldom.loadXML(xml);
                if(xmldom.parseError != 0){
                    throw new Error("XML parsing error:"+ xmldom.parseError.reason);
                }
            }else if(typeof DOMParser != "undefined"){
                xmldom = (new DOMParser()).parseFromString(xml,"text/xml");
                var errors = xmldom.getElementsByTagName("parsererror");
                if(errors.length){
                    throw new Error("XML parsing error:"+errors[0].textContent+"::"+xml);
                }
            }else {
                throw new Error("No XML parser available.");
            }
            return xmldom;
        };
        /**
         * json转成xml
         */
        this.toXml = function(json,root){
            var xmlDoc = parseXml("<"+root + "></" + root + ">");
            var children = json2Xml(xmlDoc,json);
            for(var i=0;i<children.length;i++){
                xmlDoc.documentElement.appendChild(children[i]);
            }
            return xmlDoc;
        }
        function json2Xml(xmlDoc,json){
            var children=[];
            for(var pro in json){
                //--------json的每个属性成为一个节点
                if(json[pro]!=undefined && pro!="$$hashKey"){
                    var jsonpro = json[pro];
                    var child = xmlDoc.createElement(pro);
                    if(angular.isArray(jsonpro)){
                        //-------数组节点
                        for(var i=0;i<jsonpro.length;i++){
                            var itemnode = xmlDoc.createElement("item");
                            var itemChildren = json2Xml(xmlDoc,jsonpro[i]);//------递归
                            for(var j=0;j<itemChildren.length;j++){
				                itemnode.appendChild(itemChildren[j]);
				            }
                            child.appendChild(itemnode);
                        }
                    }else{
                        if(child.textContent != undefined){
                            child.textContent = json[pro];
                        }else{
                            child.text = json[pro];
                        }
                    }
                    //----------添加
                    children.push(child)
                }
            }
            return children;
        };
        function createDocument(){
            if(typeof arguments.callee.activeXString != "string"){
                var versions = ["MSXML2.DOMDocument.6.0","MSXML2.DOMDocument.3.0","MSXML2.DOMDocument"],
                            i,len;
                for (i=0,len=versions.length;i<len;i++){
                    try{
                        new ActiveXObject(versions[i]);
                        arguments.callee.activeXString = versions[i];
                        break;
                    } catch(ex){
                        //跳过
                    }
                }
            }
            return new ActiveXObject(arguments.callee.activeXString);
        }
        function hasMSXML(){
            var versions = ["MSXML2.DOMDocument.6.0","MSXML2.DOMDocument.3.0","MSXML2.DOMDocument"],
                            i,len;
            var flag = false;
            for (i=0,len=versions.length;i<len;i++){
                try{
                    new ActiveXObject(versions[i]);
                    flag = true;
                    break;
                } catch(ex){
                    //跳过
                }
            }
            return flag;
        }
    }]
    );
    
});