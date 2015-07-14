define(['services/services','jquery'],function(services,$){
    services.factory("SOAPClientParameters", [function(){
        function SOAPClientParameters()
        {
            var _pl = new Array();
            this.add = function(name, value) 
            {
                _pl[name] = value; 
                return this; 
            }
            this.get = function(name){
                return _pl[name];
            }
            this.toXml = function()
            {
                var xml = "";
                for(var p in _pl)
                    xml += "<" + p + ">" + SOAPClientParameters._serialize(_pl[p]) + "</" + p + ">";
                return xml;    
            }
        };
        SOAPClientParameters._serialize = function(o)
        {
            var s = "";
            switch(typeof(o))
            {
                case "string":
                    s += o.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); break;
                case "number":
                case "boolean":
                    s += o.toString(); break;
                case "object":
                    // Date
                    if(o.constructor.toString().indexOf("function Date()") > -1)
                    {
                        var year = o.getFullYear().toString();
                        var month = (o.getMonth() + 1).toString(); month = (month.length == 1) ? "0" + month : month;
                        var date = o.getDate().toString(); date = (date.length == 1) ? "0" + date : date;
                        var hours = o.getHours().toString(); hours = (hours.length == 1) ? "0" + hours : hours;
                        var minutes = o.getMinutes().toString(); minutes = (minutes.length == 1) ? "0" + minutes : minutes;
                        var seconds = o.getSeconds().toString(); seconds = (seconds.length == 1) ? "0" + seconds : seconds;
                        var milliseconds = o.getMilliseconds().toString();
                        var tzminutes = Math.abs(o.getTimezoneOffset());
                        var tzhours = 0;
                        while(tzminutes >= 60)
                        {
                            tzhours++;
                            tzminutes -= 60;
                        }
                        tzminutes = (tzminutes.toString().length == 1) ? "0" + tzminutes.toString() : tzminutes.toString();
                        tzhours = (tzhours.toString().length == 1) ? "0" + tzhours.toString() : tzhours.toString();
                        var timezone = ((o.getTimezoneOffset() < 0) ? "+" : "-") + tzhours + ":" + tzminutes;
                        s += year + "-" + month + "-" + date + "T" + hours + ":" + minutes + ":" + seconds + "." + milliseconds + timezone;
                    }
                    // Array
                    else if(o.constructor.toString().indexOf("function Array()") > -1)
                    {
                        for(var p in o)
                        {
                            if(!isNaN(p)) // linear array
                            {
                                (/function\s+(\w*)\s*\(/ig).exec(o[p].constructor.toString());
                                var type = RegExp.$1;
                                switch(type)
                                {
                                    case "":
                                        type = typeof(o[p]);
                                    case "String":
                                        type = "string"; break;
                                    case "Number":
                                        type = "int"; break;
                                    case "Boolean":
                                        type = "bool"; break;
                                    case "Date":
                                        type = "DateTime"; break;
                                }
                                s += "<" + type + ">" + SOAPClientParameters._serialize(o[p]) + "</" + type + ">"
                            }
                            else // associative array
                                s += "<" + p + ">" + SOAPClientParameters._serialize(o[p]) + "</" + p + ">"
                        }
                    }
                    // Object or custom function
                    else
                        for(var p in o)
                            s += "<" + p + ">" + SOAPClientParameters._serialize(o[p]) + "</" + p + ">";
                    break;
                default:
                    throw new Error(500, "SOAPClientParameters: type '" + typeof(o) + "' is not supported");
            }
            return s;
        };
        return SOAPClientParameters;
    }]
    );
    
});