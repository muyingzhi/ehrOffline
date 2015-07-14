define(['services/services',
    'services/SOAPClient',
    'services/SOAPClientParameters',
    'services/XMLService',
    'services/interchgConstant'
    ],function(services){
    services.service("InterChangeService", ['$q','$rootScope','SOAPClient','SOAPClientParameters','XMLService','interchgUrl',
        function($q,$rootScope,soapClient,soapClientParameters,XMLService,interchgUrl){
        
        var today = new Date();
        var todayStr = today.getFullYear()+'-'+(today.getMonth()+1)+"-"+today.getDate();
        var soap = {
            url: interchgUrl + "/services/InterChange",//"http://127.0.0.1:8080/interChg/services/InterChange",
            method:"serviceMain",
            header : {servicecode:"21011001",
                apiversion:"1.0",
                createtime:todayStr+" 00:00:00",
                govcode:"",
                systemid:"1412250001",
                username:"1412250001",
                userpass:"1412250001",
                userid :"",
                password:""},
            body : {
                userid : "",
                password:""
            },
            namespaces : {ns:"http://interchange.sqws.hys.com"}
        };
        /**
         * 登录服务21011001
         * return:{
         *      state : 0/1,//0 成功，1失败
         *      data : ,//返回解析后的适合树形展示的数据
         *      message : ''//登录失败，返回消息
         *      }
         */
        this.serv21011001 = function(username,password){
            var result = {state : 0,data:[],message:""};
            var parameters=new soapClientParameters();
            var d = $q.defer();
            
            soap.body.userid = username;
            soap.body.password=password;
            parameters.add("header",makeHeader("21011001"));
            parameters.add("body",'' +
                    '<body>' +
                    '<userid info="手机端登录账号">'+soap.body.userid+'</userid>' +
                    '<password info="手机端登录密码">'+soap.body.password+'</password>' +
                    '<usertype info="用户账号类型">2</usertype>' +
                    '</body>');
            soapClient.invoke(soap.url, soap.method, parameters, true, function(xml,resp){
                        var parser = new DOMParser();
                        var xmldom = XMLService.parseXml(xml);
                        
                        var state = XMLService.selectSingleNode(xmldom,"result/state",soap.namespaces);
                        
                        if(state.attributes[0].value=="0"){
                            var list = XMLService.selectNodes(xmldom,"/result/output/arealist/areaitem",soap.namespaces);
                            var treeData = nodesToTree(list);
                            
                            var icpcode = XMLService.selectSingleNode(xmldom,"/result/output/icpcode",soap.namespaces);
                            soap.header.govcode = icpcode.textContent||icpcode.text;
                            
                            result.state = 0;//---登录成功
                            result.message = "登录成功";
                            result.data = treeData;
                        }else{
                            result.state = 1;
                            result.message = "登录失败:"+getStateMsg(state);
                        }
                        $rootScope.$apply(function(){
                            d.resolve(result);
                        });
            });
            return d.promise;
        };
        
        /**
         * 机构药品目录
         */
        this.serv12140004 = function(){
        	  var parameters=new soapClientParameters();
              var async = true;
              var d = $q.defer();
              var body = '<body>'+
              			'<starttime info="起始时间"></starttime>'+
              			'<downloadflag info="下载类型">3</downloadflag>'+
              			'<maxrows info="请求每次返回字典条数上限">0</maxrows>'+
              			'</body>';

              parameters.add("header",makeHeader("12140004"));
              parameters.add("body",body);
              soapClient.invoke(soap.url, soap.method, parameters, async, function(xml,resp){
                  var parser = new DOMParser();
                  var xmldom = XMLService.parseXml(xml);
                  var state = XMLService.selectSingleNode(xmldom,"result/state",soap.namespaces);
                  var result = {};
                  if(state.attributes[0].value=="0"){
                      var nodes = XMLService.selectNodes(xmldom,"/result/output/dictlist",soap.namespaces);
                      result.druglist = children2Array(nodes[0],"dictitem");
                      result.state = 0;
                      result.message = "药品目录下载成功";
                  }else{
                      result.state = 0;
                      result.message = "药品目录下载失败:"+getStateMsg(state);
                  }
                  $rootScope.$apply(function(){
                      d.resolve(result);
                  });
            });
            return d.promise;
        };
        
        /**
         * ICD10编码下载
         */
        this.serv12120002 = function(){
        	  var parameters=new soapClientParameters();
              var async = true;
              var d = $q.defer();
              var body = '<body>'+
    					'<starttime info="起始时间"></starttime>'+
    					'<maxrows info="请求每次返回字典条数上限">0</maxrows>'+
    					'</body>';
              parameters.add("header",makeHeader("12120002"));
              parameters.add("body",body);
              soapClient.invoke(soap.url, soap.method, parameters, async, function(xml,resp){
                  var parser = new DOMParser();
                  var xmldom = XMLService.parseXml(xml);
                  var state = XMLService.selectSingleNode(xmldom,"result/state",soap.namespaces);
                  var result = {};
                  if(state.attributes[0].value=="0"){
                      var nodes = XMLService.selectNodes(xmldom,"/result/output/icdlist",soap.namespaces);
                      result.icd10list = children2Array(nodes[0],"icditem");
                      result.state = 0;
                      result.message = "ICD10编码下载成功";
                  }else{
                      result.state = 0;
                      result.message = "ICD10编码下载失败:"+getStateMsg(state);
                  }
                  $rootScope.$apply(function(){
                      d.resolve(result);
                  });
            });
            return d.promise;
        };
        /**
         * 儿童体重身高级别标准下载
         */
        this.serv12140015 = function(){
        	  var parameters=new soapClientParameters();
              var async = true;
              var d = $q.defer();
              parameters.add("header",makeHeader("12140015"));
              parameters.add("body",'');
              soapClient.invoke(soap.url, soap.method, parameters, async, function(xml,resp){
                  var parser = new DOMParser();
                  var xmldom = XMLService.parseXml(xml);
                  var state = XMLService.selectSingleNode(xmldom,"result/state",soap.namespaces);
                  var result = {};
                  if(state.attributes[0].value=="0"){
                      var nodes = XMLService.selectNodes(xmldom,"/result/output/babystandardlist",soap.namespaces);
                      result.babylist = children2Array(nodes[0],"item");
                      result.state = 0;
                      result.message = "标准下载成功";
                  }else{
                      result.state = 0;
                      result.message = "标准下载失败:"+getStateMsg(state);
                  }
                  $rootScope.$apply(function(){
                      d.resolve(result);
                  });
            });
            return d.promise;
        };
        /**
         * 查找档案基本信息记录:
         * 行政区划，姓名，档案类型，检索每页数量
         * 返回json数组，为档案记录；
         */
        this.serv21011004 = function(areacode,fullname,jmid,atype,pernum,pageno,dictDoctor){
            var parameters=new soapClientParameters(),
                    async=true;
            var d = $q.defer();
            
            areacode = areacode?areacode:"";
            fullname = fullname?fullname:"";
            jmid = jmid?jmid:"";
            atype    = atype?atype:"0";
            pernum   = pernum && pernum>0 ? pernum : 10;//--------显示记录数
            pageno   = pageno && pageno>0 ? pageno : 1;
            parameters.add("header",makeHeader('21011004'));
            parameters.add("body",'' +
                        '<body>' +
                        '<userid info="手机端登录账号">'+soap.body.userid+'</userid>' +
                        '<archivetype>'+atype+'</archivetype>' +
                        '<areacode>'+areacode+'</areacode>' +
                        '<fullname>'+fullname+'</fullname>' +
                        '<cardno>'+jmid+'</cardno>' +
                        '<dutydoctor>'+dictDoctor+'</dutydoctor>' +
                        '<pageno>'+pageno+'</pageno>' +
                        '<pernum>'+pernum+'</pernum>' +
                        '</body>');
            soapClient.invoke(soap.url, soap.method, parameters, async, function(xml,resp){
                var parser = new DOMParser();
                var xmldom = XMLService.parseXml(xml);
                var state = XMLService.selectSingleNode(xmldom,"result/state",soap.namespaces);
                var result = {state:0,message:"",archlist:[]};
                if(state.attributes[0].value=="0"){
                    result.state = 0;
                    result.message = "查找成功";
                    var list = XMLService.selectNodes(xmldom,"/result/output/item",soap.namespaces);
                    for(var i=0;i<list.length;i++){
                        var node = [];
                        var arch = {rowno:i};
                        if(list[i].children){
                            node = list[i].children;
                        }else{
                            node = list[i].childNodes;
                        }
                        for(var j=0;j<node.length;j++){
                            arch[node[j].tagName] = node[j].textContent||node[j].text;
                        }
                        result.archlist.push(arch);
                    }
                }else{
                    
                    result.state = 0;
                    result.message = "查找失败:"+getStateMsg(state);
                }
                $rootScope.$apply(function(){
                    d.resolve(result);
                })
            }); 
            return d.promise;
        };
        
        /**
         * 查找档案基本信息记录:
         * 行政区划，姓名，档案类型，随访日期,检索每页数量
         * 返回json数组，为档案记录；
         */
        this.serv21011002 = function(areacode,fullname,jmid,atype,pernum,pageno,dictDoctor,startTime,endTime){
            var parameters=new soapClientParameters(),
                    async=true;
            var d = $q.defer();
            
            areacode = areacode?areacode:"";
            fullname = fullname?fullname:"";
            jmid = jmid?jmid:"";
            atype    = atype?atype:"0";
            pernum   = pernum && pernum>0 ? pernum : 10;//--------显示记录数
            pageno   = pageno && pageno>0 ? pageno : 1;
            parameters.add("header",makeHeader('21011002'));
            parameters.add("body",'' +
                        '<body>' +
                        '<userid info="手机端登录账号">'+soap.body.userid+'</userid>' +
                        '<archivetype>'+atype+'</archivetype>' +
                        '<areacode>'+areacode+'</areacode>' +
                        '<fullname>'+fullname+'</fullname>' +
                        '<cardno>'+jmid+'</cardno>' +
                        '<begindate>'+startTime+'</begindate>' +
                        '<enddate>'+endTime+'</enddate>' +
                        '<dutydoctor>'+dictDoctor+'</dutydoctor>' +
                        '<pageno>'+pageno+'</pageno>' +
                        '<pernum>'+pernum+'</pernum>' +
                        '</body>');
            soapClient.invoke(soap.url, soap.method, parameters, async, function(xml,resp){
                var parser = new DOMParser();
                var xmldom = XMLService.parseXml(xml);
                var state = XMLService.selectSingleNode(xmldom,"result/state",soap.namespaces);
                var result = {state:0,message:"",archlist:[]};
                if(state.attributes[0].value=="0"){
                    result.state = 0;
                    result.message = "查找成功";
                    var list = XMLService.selectNodes(xmldom,"/result/output/flpitem",soap.namespaces);
                    for(var i=0;i<list.length;i++){
                        var node = [];
                        var arch = {rowno:i};
                        if(list[i].children){
                            node = list[i].children;
                        }else{
                            node = list[i].childNodes;
                        }
                        for(var j=0;j<node.length;j++){
                            arch[node[j].tagName] = node[j].textContent||node[j].text;
                        }
                        result.archlist.push(arch);
                    }
                }else{
                    
                    result.state = 0;
                    result.message = "查找失败:"+getStateMsg(state);
                }
                $rootScope.$apply(function(){
                    d.resolve(result);
                })
            }); 
            return d.promise;
        };
        /**
         * 下载对应基本信息的儿童，妇女，老年人，慢病患者，体检信息或随访信息（十一项公共卫生相关信息）
         * 
         * **/
        this.serv21011012= function(jmid,businessid,index){
        	var parameters=new soapClientParameters();
            var async = true;
            var d = $q.defer();
            parameters.add("header",makeHeader("21011012"));
            parameters.add("body",'' +
            		'<body><userid info="用户编码">' + soap.body.userid + '</userid>'+
                  	'<jmid info="健康档案号">' + jmid + '</jmid>'+
     				'<archiveinfo><archivetype>2</archivetype><businessid_arr>' + businessid + '</businessid_arr></archiveinfo>' +
     				'<archiveinfo><archivetype>3</archivetype><businessid_arr>-1</businessid_arr></archiveinfo>' +
     				'<archiveinfo><archivetype>7</archivetype><businessid_arr>-1</businessid_arr></archiveinfo>' +
     				'<archiveinfo><archivetype>8</archivetype><businessid_arr>-1</businessid_arr></archiveinfo>' +
     				//'<archiveinfo><archivetype>11</archivetype><businessid_arr>-1</businessid_arr></archiveinfo>' +
     				'<archiveinfo><archivetype>12</archivetype><businessid_arr>-1</businessid_arr></archiveinfo>' +
     				'<archiveinfo><archivetype>41</archivetype><businessid_arr>-1</businessid_arr></archiveinfo>' +
     				'<archiveinfo><archivetype>51</archivetype><businessid_arr>-1</businessid_arr></archiveinfo>' +
     				'<archiveinfo><archivetype>52</archivetype><businessid_arr>-1</businessid_arr></archiveinfo>' +
     				'<archiveinfo><archivetype>53</archivetype><businessid_arr>-1</businessid_arr></archiveinfo>' +
     				'<archiveinfo><archivetype>54</archivetype><businessid_arr>-1</businessid_arr></archiveinfo>' +
     				'<archiveinfo><archivetype>61</archivetype><businessid_arr>-1</businessid_arr></archiveinfo>' +
     				'<archiveinfo><archivetype>62</archivetype><businessid_arr>-1</businessid_arr></archiveinfo>' +
     				'<archiveinfo><archivetype>63</archivetype><businessid_arr>-1</businessid_arr></archiveinfo>' +
     				'<archiveinfo><archivetype>64</archivetype><businessid_arr>-1</businessid_arr></archiveinfo>' +
     				'<archiveinfo><archivetype>92</archivetype><businessid_arr>-1</businessid_arr></archiveinfo></body>');
            soapClient.invoke(soap.url, soap.method, parameters, async, function(xml,resp){
                var parser = new DOMParser();
                var xmldom = XMLService.parseXml(xml);
                var state = XMLService.selectSingleNode(xmldom,"result/state",soap.namespaces);
                var result = {};
                var infoArray = [];//用于存放：[2：个人基本信息,3：健康体检表,51：新生儿家庭随访,……]详见接口文档
                var archive_list = [];//类型[2：个人基本信息,3：健康体检表,51：新生儿家庭随访,……]详见接口文档
                
                if(state.attributes[0].value=="0"){
                	var output_all=XMLService.selectSingleNode(xmldom,"/result/output_all");
                	
                	if (output_all){
                        //---------ie与其它浏览器的差异
                        if(output_all.children){
                        	archive_list = output_all.children;
                        }else{
                        	archive_list = output_all.childNodes;//ie的
                        }
                    }
                	for(var i=0;i<archive_list.length;i++){
                		if(archive_list[i].attributes[0].name=='archivetype'){ //判断参数是否为类型参数
                			if(archive_list[i].attributes[0].value!=undefined && archive_list[i].attributes[0].value!=''){
                				getChildrenInfo(archive_list[i],archive_list[i].attributes[0].value,infoArray);
                			}
                		}else if(archive_list[i].attributes[1].name=='archivetype'){//判断参数是否为类型参数
                			if(archive_list[i].attributes[1].value!=undefined && archive_list[i].attributes[1].value!=''){
                				getChildrenInfo(archive_list[i],archive_list[i].attributes[1].value,infoArray);
                			}
                		}else{
                			continue;
                		}
                	}
                	//console.log(JSON.stringify(infoArray))
                	result.data = infoArray;
                    result.state = 0;
                    result.message = "详情下载成功";
                }else{
                    result.state = 0;
                    result.message = "详情下载失败:"+getStateMsg(state);
                }
                
                $rootScope.$apply(function(){
                    result.index = index;
                    d.resolve(result);
                })
            }); 
            return d.promise;
        }
        
        /**
         *遍历节点,将信息保存起来 
         **/
        function getChildrenInfo(archive_list,archive_type,infoArray){
            var output = [];//每种类型对应记录数组，如有多条体检记录
        	if(archive_list.children){
				output=archive_list.children;
			}else if(archive_list.childNodes){
				output= archive_list.childNodes;
			}
			for(var j=0;j<output.length;j++){
	            var children = [];//没个记录对应哪些类容
				if(output[j].children){
					children=output[j].children;
    			}else if(output[j].childNodes){
    				children= output[j].childNodes;
    			}
				var arch={}
				if(children.length>0){
					for(var i=0;i<children.length;i++){
	                    var node = children[i];
	                    if(node.tagName=="opslist"){
	                        //---------手术列表
	                        arch.opslist = children2Array(node);
	                    }else if(node.tagName=="familydislist"){
	                        arch.familydislist = children2Array(node);;
	                    }else if(node.tagName == "druglist"){
	                        arch.druglist = children2Array(node);
	                    }else if(node.tagName == "hospitallist"){  //住院史
	                        arch.hospitallist = children2Array(node);
	                    }else if(node.tagName == "homebedlist"){	//家庭病床
	                        arch.homebedlist = children2Array(node);
	                    }else if(node.tagName == "inocutelist"){	//接种史
	                        arch.inocutelist = children2Array(node);
	                    }else if(node.tagName == "exposurelist"){	//职业暴露列表
	                        arch.exposurelist = children2Array(node);
	                    }else if(node.tagName == "scoremainlist"){//高危主记录
	                    	arch.scoremainlist=children2Array(node);
	                    }else if(node.tagName == "inocunotelist"){//预防接种
	                    	arch.inocunotelist=children2Array(node);
	                    }else if(node.tagName == "eniorcitizenlist"){//老年人专项体检列表
	                    	arch.eniorcitizenlist=children2Array(node);
	                    }else{
	                        arch[node.tagName] = node.textContent||node.text;
	                    }
	                }
					infoArray.push({type:archive_type ,value:arch});
				}
			}
        } 
        /**
         * 下载详情
         * archivetype：
         * 返回：{
         *     state:0,
         *     data:{},
         *     message:""
         * }
         */
        this.serv21011003 = function(archivetype,jmid,businessid,index){
            var parameters=new soapClientParameters();
            var async = true;
            var d = $q.defer();
            parameters.add("header",makeHeader("21011003"));
            parameters.add("body",'' +
                '<body>' +
                '<userid info="手机端登录账号">'+soap.body.userid+'</userid>' +
                '<archivetype>'+archivetype+'</archivetype>' +
                '<jmid>'+jmid+'</jmid>' +
                '<businessid>'+businessid+'</businessid>' +
                '</body>');
            soapClient.invoke(soap.url, soap.method, parameters, async, function(xml,resp){
                var parser = new DOMParser();
                var xmldom = XMLService.parseXml(xml);
                var state = XMLService.selectSingleNode(xmldom,"result/state",soap.namespaces);
                var result = {};
                if(state.attributes[0].value=="0"){
                    var output = XMLService.selectSingleNode(xmldom,"/result/output");
                    var arch = {};
                    var children = [];
                    if (output){
                        //---------ie与其它浏览器的差异
                        if(output.children){
                            children = output.children;
                        }else{
                            children = output.childNodes;//ie的
                        }
                    }
                    for(var i=0;i<children.length;i++){
                        var node = children[i];
                        if(node.tagName=="opslist"){
                            //---------手术列表
                            arch.opslist = children2Array(node);
                        }else if(node.tagName=="familydislist"){
                            arch.familydislist = children2Array(node);;
                        }else if(node.tagName == "druglist"){
                            arch.druglist = children2Array(node);
                        }else if(node.tagName == "hospitallist"){  //住院史
                            arch.hospitallist = children2Array(node);
                        }else if(node.tagName == "homebedlist"){	//家庭病床
                            arch.homebedlist = children2Array(node);
                        }else if(node.tagName == "inocutelist"){	//接种史
                            arch.inocutelist = children2Array(node);
                        }else if(node.tagName == "exposurelist"){	//职业暴露列表
                            arch.exposurelist = children2Array(node);
                        }else if(node.tagName == "scoremainlist"){//高危主记录
	                    	arch.scoremainlist=children2Array(node);
	                    }else{
                            arch[node.tagName] = node.textContent||node.text;
                        }
                    }
                    result.data = arch;
                    result.state = 0;
                    result.message = "详情下载成功";
                }else{
                    result.state = 0;
                    result.message = "详情下载失败:"+getStateMsg(state);
                }
                $rootScope.$apply(function(){
                    result.index = index;
                    d.resolve(result);
                })
            }); 
            return d.promise;
        };
        /**
         * 随访类别下载
         * 最终的结果{state:0,message:"",datas:[{type:"",jmid:"",businessid:""}]}
         */
        this.serv21011005 = function(type,jmid,pernum,pageno){
	        var parameters=new soapClientParameters();
            var d = $q.defer();
			parameters.add("header",makeHeader("21011005"));
			parameters.add("body",'' +
								'<body>' +
								'<userid info="手机端登录账号">'+soap.body.userid+'</userid>' +
								'<archivetype>'+type+'</archivetype>' +
								'<jmid>'+jmid+'</jmid>' +
								'<pageno>'+pageno+'</pageno>' +
								'<pernum>'+pernum+'</pernum>' +
								'</body>');
	        soapClient.invoke(soap.url, soap.method, parameters, true, function(xml,resp){
                var parser = new DOMParser();
                var xmldom = XMLService.parseXml(xml);
                var state = XMLService.selectSingleNode(xmldom,"result/state",soap.namespaces);
                var result = {state:0,message:"",datas:[]};
                if(state.attributes[0].value=="0"){
                    result.message = "("+type+")随访列表下载成功";
                    result.state = 0;
                    var list = XMLService.selectNodes(xmldom,"/result/output/item",soap.namespaces);
                    if(list){
                        for(var i=0;i<list.length;i++){
                            var visit = list[i];
                            var bid = visit.getElementsByTagName("businessid");
                            if(bid){
                                var value = bid[0].textContent || bid[0].text;
                                if(value){
                                //------------关键数据保留到datas
                                //loadDetail(type,arch.jmid,bid[0].textContent);
                                result.datas.push({type:type,jmid:jmid,businessid:value});
                                }
                            }
                        }
                    }
                }else{
                    result.state = 1;
                    result.message = "随访列表("+type+")下载失败:"+getStateMsg(state);
                }
                $rootScope.$apply(function(){
                    d.resolve(result);
                })
            }); 
            return d.promise;
        }
        /**
         * 档案、随访信息保存
         * record,要上传的记录
         * type ,类型
         * userid,登录平台的用户id
         * num,进度计数
         * 
         */
        this.serv21011006 = function(record,type,userid,num){
            var dataxml;
            var parameters=new soapClientParameters();
            var d = $q.defer();
            var xmlstr = XMLService.toXml(record,"dataxml");
            dataxml = XMLService.serializeXml(xmlstr);
            parameters.add("header",makeHeader("21011006"));
            parameters.add("body",'<body>' +
                    '<userid info="手机端登录账号">'+userid+'</userid>' +
                    '<archivetype>'+type+'</archivetype>' +
                    dataxml + 
                    '</body>');
            soapClient.invoke(soap.url, soap.method, parameters, true, function(xml,resp){
                //--------上传结果处理
                var parser = new DOMParser();
                var xmldom = null;
                var result = {};
                var state = null;
                try{
	                xmldom = XMLService.parseXml(xml);
	                state = XMLService.selectSingleNode(xmldom,"result/state",soap.namespaces);
	                var resultNUM = "0";
                    if(state.attributes["success"]){
                        resultNUM = state.attributes["success"].value;
                    }else{
                        resultNUM = state.attributes[0].value;
                    }
                    if(resultNUM=="0"){
	                    result.state = 0;
	                    result.message = "成功";
                        
                        var node = null;
                        node = XMLService.selectSingleNode(xmldom,"result/output/keyid",soap.namespaces);
	                    result.keyid = node.textContent || node.text; //---取服务端返回的物理id
                        if(type=="2"){//----健康档案，取archid和纸质档案号
	                        node = XMLService.selectSingleNode(xmldom,"result/output/archid",soap.namespaces);
		                    result.archid = node.textContent || node.text;
	                        
	                        node = XMLService.selectSingleNode(xmldom,"result/output/archiveno",soap.namespaces);
	                        result.archiveno = node.textContent || node.text;
                        }
	                }else{
	                    result.state = 1;
	                    result.message = "失败："+getStateMsg(state);
	                }
                }catch(ex){
                    result = ex;
                }finally{
                    result.num = num;
                }
                $rootScope.$apply(function(){
                    d.resolve(result);
                })
            });
            return d.promise;
        }
        
        /**
         * 健康教育活动下载
         * atype ,类型
         * userid,登录平台的用户id
         * 
         */
        this.serv21011013 = function(icpcode,atype,startTime,endTime,pernum){
            var parameters=new soapClientParameters();
            var d = $q.defer();
            parameters.add("header",makeHeader("21011013"));
            parameters.add("body",'<body>' +
                    '<userid info="手机端登录账号">'+soap.body.userid+'</userid>' +
                    '<icpcode>'+icpcode+'</icpcode>' +
                    '<startdate>'+startTime+'</startdate>' +
                    '<enddate>'+endTime+'</enddate>' +
                    '<pageno>1</pageno>' +
                    '<pernum>'+pernum+'</pernum>' +
                    '</body>');
            soapClient.invoke(soap.url, soap.method, parameters, true, function(xml,resp){
                var parser = new DOMParser();
                var xmldom = XMLService.parseXml(xml);
                var state = XMLService.selectSingleNode(xmldom,"result/state",soap.namespaces);
                var result = {state:0,message:"",list:[]};
                
                if(state.attributes[0].value=="0"){
                    var list = XMLService.selectNodes(xmldom,"/result/output/item",soap.namespaces);
                    for(var i=0;i<list.length;i++){
                    	var node=[];
                    	var arch = {};
                        if(list[i].children){
                            node = list[i].children;
                        }else{
                            node = list[i].childNodes;
                        }
                        for(var j=0;j<node.length;j++){
                            arch[node[j].tagName] = node[j].textContent||node[j].text;
                        }
                        result.list.push(arch);
                    }
                    result.state = 0;
                    result.message = "详情下载成功";
                }else{
                    result.state = 1;
                    result.message = "详情下载失败:"+getStateMsg(state);
                }
                $rootScope.$apply(function(){
                    d.resolve(result);
                })
            }); 
            return d.promise;
        }
        /**
         * 健康教育活动下载
         * atype ,类型
         * userid,登录平台的用户id
         * 
         */
        this.serv21011014 = function(icpcode,atype,startTime,endTime,pernum){
            var parameters=new soapClientParameters();
            var d = $q.defer();
            parameters.add("header",makeHeader("21011014"));
            parameters.add("body",'<body>' +
                    '<userid info="手机端登录账号">'+soap.body.userid+'</userid>' +
                    '<busitype>'+atype+'</busitype>' +
                    '<startdate>'+startTime+'</startdate>' +
                    '<enddate>'+endTime+'</enddate>' +
                    '<pageno>1</pageno>' +
                    '<pernum>'+pernum+'</pernum>' +
                    '</body>');
            soapClient.invoke(soap.url, soap.method, parameters, true, function(xml,resp){
                var parser = new DOMParser();
                var xmldom = XMLService.parseXml(xml);
                var state = XMLService.selectSingleNode(xmldom,"result/state",soap.namespaces);
                var result = {state:0,message:"",list:[]};
                if(state.attributes[0].value=="0"){
                    var list = XMLService.selectNodes(xmldom,"/result/output/item",soap.namespaces);
                    for(var i=0;i<list.length;i++){
                    	var node=[];
                    	var arch = {};
                        if(list[i].children){
                            node = list[i].children;
                        }else{
                            node = list[i].childNodes;
                        }
                        for(var j=0;j<node.length;j++){
                            arch[node[j].tagName] = node[j].textContent||node[j].text;
                        }
                        result.list.push(arch);
                    }
                    result.state = 0;
                    result.message = "详情下载成功";
                }else{
                    result.state = 1;
                    result.message = "详情下载失败:"+getStateMsg(state);
                }
                $rootScope.$apply(function(){
                    d.resolve(result);
                })
            }); 
            return d.promise;
        }
        /**
         * 其他信息保存
         * record,要上传的记录
         * type ,类型
         * userid,登录平台的用户id
         * num,进度计数
         * 
         */
        this.serv21011015 = function(record,type,userid,num){
            var dataxml;
            var parameters=new soapClientParameters();
            var d = $q.defer();
            var xmlstr = XMLService.toXml(record,"dataxml");
            dataxml = XMLService.serializeXml(xmlstr);
            parameters.add("header",makeHeader("21011015"));
            parameters.add("body",'<body>' +
                    '<userid info="手机端登录账号">'+userid+'</userid>' +
                    '<busitype>'+type+'</busitype>' +
                    dataxml + 
                    '</body>');
            soapClient.invoke(soap.url, soap.method, parameters, true, function(xml,resp){
                //--------上传结果处理
                var parser = new DOMParser();
                var xmldom = null;
                var result = {};
                var state = null;
                try{
	                xmldom = XMLService.parseXml(xml);
	                state = XMLService.selectSingleNode(xmldom,"result/state",soap.namespaces);
	                var resultNUM = "0";
                    if(state.attributes["success"]){
                        resultNUM = state.attributes["success"].value;
                    }else{
                        resultNUM = state.attributes[0].value;
                    }
                    if(resultNUM=="0"){
	                    result.state = 0;
	                    result.message = "成功";
                        var node = XMLService.selectSingleNode(xmldom,"result/output/keyid",soap.namespaces);
	                    result.keyid = node.textContent || node.text; //---取服务端返回的物理id
	                }else{
	                    result.state = 1;
	                    result.message = "失败："+getStateMsg(state);
	                }
                }catch(ex){
                    result = ex;
                }finally{
                    result.num = num;
                }
                $rootScope.$apply(function(){
                    d.resolve(result);
                })
            });
            return d.promise;
        }
        /**
         * 机构信息下载
         */
        this.serv12140001 = function(){
            var parameters=new soapClientParameters();
            var d = $q.defer();
            var header = makeHeader(12140001);
            var body = '<body>' +
                    '<starttime  info="起始时间"></starttime>' +
                    '<maxrows info="请求每次返回字典条数上限">0</maxrows>' +
                    '</body>';
            parameters.add("header",header);
            parameters.add("body",body);
            soapClient.invoke(soap.url, soap.method, parameters, true, function(xml,resp){
                //--------上传结果处理
                var parser = new DOMParser();
                var xmldom = XMLService.parseXml(xml);
                var result = {};
                var state = XMLService.selectSingleNode(xmldom,"result/state",soap.namespaces);
                
                if(state.attributes[0].value=="0"){
                    result.state = 0;
                    result.message = "机构下载成功";
                    var nodes = XMLService.selectNodes(xmldom,"/result/output/dictlist",soap.namespaces);
                    result.dictlist = children2Array(nodes[0],"dictitem");
                }else{
                    result.state = 1;
                    result.message = "机构下载失败："+getStateMsg(state);
                }
                $rootScope.$apply(function(){
                    d.resolve(result);
                })
            });
            return d.promise;
        };
        /**
         * 人员字典下载
         */
        this.serv12140003 = function(){
            var parameters=new soapClientParameters();
            var d = $q.defer();
            var header = makeHeader("12140003");
            var body = '<body>' +
                    '<starttime  info="起始时间"></starttime>' +
                    '<maxrows info="请求每次返回字典条数上限">0</maxrows>' +
                    '</body>';
            parameters.add("header",header);
            parameters.add("body",body);
            soapClient.invoke(soap.url, soap.method, parameters, true, function(xml,resp){
                //--------上传结果处理
                var parser = new DOMParser();
                var xmldom = XMLService.parseXml(xml);
                var result = {};
                var state = XMLService.selectSingleNode(xmldom,"result/state",soap.namespaces);
                
                if(state.attributes[0].value=="0"){
                    result.state = 0;
                    result.message = "人员下载成功";
                    var nodes = XMLService.selectNodes(xmldom,"/result/output/dictlist",soap.namespaces);
                    result.dictlist = children2Array(nodes[0],"dictitem");
                }else{
                    result.state = 1;
                    result.message = "人员下载失败："+getStateMsg(state);
                }
                $rootScope.$apply(function(){
                    d.resolve(result);
                })
            });
            return d.promise;
        };
        //-------------组织协议头信息
        function makeHeader(servicecode){
            var rtn = 
                    '<?xml version="1.0" encoding="GBK" ?>' +
                    '<header>' +
                    '<servicecode>'+servicecode+'</servicecode>' +
                    '<apiversion>'+soap.header.apiversion+'</apiversion>' +
                    '<createtime>'+soap.header.createtime+'</createtime>' +
                    '<govcode>'+soap.header.govcode+'</govcode>' +
                    '<systemid>'+soap.header.systemid+'</systemid>' +
                    '<username>'+soap.header.username+'</username>' +
                    '<userpass>'+soap.header.userpass+'</userpass>' +
                    '</header>';
            return rtn;
        }
        //-----------递归函数,xmlDoc生成树形数据
        function nodesToTree(nodes){
            var treeData = [];
            for(var i=0;i<nodes.length;i++){
                var node = [];
                var area = {};
                if(nodes[i].children){
                    node = nodes[i].children;
                }else{
                    node = nodes[i].childNodes;
                }
                if(node && node.length>0){
                    area.areacode = node[0].textContent || node[0].text;
                    area.areaname = node[1].textContent || node[1].text;
                    area.id   = node[0].textContent || node[0].text;
                    area.text = node[1].textContent || node[1].text;
                    var children = [];
                    if(node[2].children && node[2].children.length>0){
                        children = nodesToTree(node[2].children);
                    }else if(node[2].childNodes && node[2].childNodes.length>0){
                        children = nodesToTree(node[2].childNodes);
                    }
                    area.children = children;
                    treeData.push(area);
                }
            }
            return treeData;
        }
        //-----------档案中的字表数据转成数组
        function children2Array(node,itemTagName){
            var items = [];
            var itemNodes = {};
            var itemNode = {};
            var childNodes = [];
            
            itemTagName = itemTagName || 'item';
            itemNodes = XMLService.selectNodes(node,itemTagName);
            for(var ii=0;ii<itemNodes.length;ii++){
                //------循环每个item
                itemNode = itemNodes[ii];
                if(itemNode.children){
                    childNodes = itemNode.children;
                }else{
                    childNodes = itemNode.childNodes;
                }
                
                var one = {};//-------组织一个对象
                var colNode = {};
                //--------------每个子节点成为对象属性；
                for(var opi=0;opi<childNodes.length;opi++){
                    colNode = childNodes[opi];
                    if(colNode.tagName == "scoredetaillist"){//高危明细
                    	one.scoredetaillist=children2Array(colNode);
                    }else{
                    	one[colNode.tagName]=colNode.textContent||colNode.text;
                    }
                }
                items.push(one);//-----加入数组；
            }
            return items;
        }
        //--------------取错误信息(xml节点的message属性值)
        function getStateMsg(state){
            var msg = "";
            if(state.childNodes[0].xml){
                msg = state.childNodes[0].xml;
            }else{
                msg = state.childNodes[0].outerHTML;
            }
            return msg;
        }
    }]
    );
    
});