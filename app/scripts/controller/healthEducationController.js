console.log("healthEducationController...");
define(['controller/controllers','jquery','dictsConstant',
        'directives/hysNoneDatebox'
       ],function(app){
	    app.controller("healthEducationController",['$rootScope','$scope','$routeParams','$indexedDB','dataDicts','DataDictService'
	        ,function($rootScope,$scope,$routeParams,$indexedDB,dataDicts,datadictService){
                //---------设置顶端菜单
		        $rootScope.topNav = [{text:"新增",iconClass:"glyphicon-new-window",url:"#/arch/healthEducationUpsert/-1"}];
                //---------用于存放参数信息
	            $scope.jkjyList=[];
		        
		        //---------字典加载
	            $scope.edutypes = dataDicts.edutype;
		        $scope.eduobjects = dataDicts.eduobject;
		        $scope.publicitytypes = dataDicts.publicitytype;
		        $scope.categorys = dataDicts.category;
		        $scope.checkresults = dataDicts.checkresult;
		        //----人员
	            datadictService.listUSER().then(function(list){
	                $scope.dictDoctor = list;
	            });
	            //----机构
	            datadictService.listTGOV().then(function(list){
	                $scope.dictTgov = list;
	            });
	            
	            $scope.getListJkjy = function(){
		        	if($scope.edutype!=undefined &&  $scope.edutype!=''){
		        		var myQuery=$indexedDB.queryBuilder().$index('edutype_idx').$eq($scope.edutype);
	        			$indexedDB.objectStore("EHEALTH_USER_HEALTHEDUACTION").each(function(cursors){
			 	            if(cursors){
			 	            	if($scope.eduobject!=undefined &&  $scope.eduobject!=''){
			 	            		if(cursors.value.eduobject==$scope.eduobject){
			 	            			$scope.jkjyList.push(cursors.value);
			 	            		}
			 	            	}else{
			 	            		$scope.jkjyList.push(cursors.value);
			 	            	}
			 	                cursors.continue();
			 	            }
	    				},queryS).then(function(){},function(){alert("error");});
		        	}else if($scope.eduobject!=undefined &&  $scope.eduobject!=''){
		        		var myQuery=$indexedDB.queryBuilder().$index('eduobject_idx').$eq($scope.eduobject);
	        			$indexedDB.objectStore("EHEALTH_USER_HEALTHEDUACTION").each(function(cursors){
			 	            if(cursors){
			 	            	if($scope.edutype!=undefined &&  $scope.edutype!=''){
			 	            		if(cursors.value.edutype==$scope.edutype){
			 	            			$scope.jkjyList.push(cursors.value);
			 	            		}
			 	            	}else{
			 	            		$scope.jkjyList.push(cursors.value);
			 	            	}
			 	                cursors.continue();
			 	            }
	    				},queryS).then(function(){},function(){alert("error");});
		        	}else{
		        		$indexedDB.objectStore("EHEALTH_USER_HEALTHEDUACTION").getAll().then(function(list){
		        			if(list){
		        				$scope.jkjyList=list;
		        			}
		                },function(){
		                	$.messager.alert(dataDicts.alertTitle,'取记录数错误');
		                }).then(function(){});
		        	}
		        }
		        
	            function getCrtime(){
	            	var _crdate = new Date();
		        	var _month = _crdate.getMonth()+1;
		        	var _date = _crdate.getDate();
		        	var _hours = _crdate.getHours();
		        	var _minutes = _crdate.getMinutes();
		        	var _seconds = _crdate.getSeconds();
		        	var _crtime = _crdate.getFullYear() +"-"+ ("00"+ _month).substr((""+ _month).length) + "-"+
		        				("00"+ _date).substr((""+ _date).length) +" "+ ("00"+ _hours).substr((""+ _hours).length) +":"+
		        				("00"+ _minutes).substr((""+ _minutes).length) +":"+ ("00"+ _seconds).substr((""+ _seconds).length);
		        	return _crtime;
	            };
	            //检查校验项目
	            function checkValid(){
	            	var bHasInvalidElm = false;
	            	var warning = '';
	            	var nInvalidCount = 0;
	            	if(!$scope.bgdj.discover_date){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>发现时间</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if(!$scope.bgdj.info_type){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>信息类别</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if(!$scope.bgdj.report_user){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>报告人</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if(!$scope.scdj.report_date){
	            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>报告时间</font>]" + "<br>";	
	            		bHasInvalidElm = true;
	            	};
	            	if(warning){
	            		$.messager.alert(dataDicts.alertTitle,warning);
	            	}
	            	return bHasInvalidElm;
	            };
	        }
	    ]);
    
});

/*
  $scope.fileUplade = function(){
		        	// 创建 ADO-stream 对象
		        	var ado_stream = new ActiveXObject("ADODB.Stream");
		        	// 创建包含默认头信息和根节点的 XML文档
		        	var xml_dom = new ActiveXObject("MSXML2.DOMDocument");
		        	xml_dom.loadXML('<?xml version="1.0" ?> <root/>');
		        	// 指定数据类型
		        	xml_dom.documentElement.setAttribute("xmlns:dt", "urn:schemas-microsoft-com:datatypes");
		        	// 创建一个新节点，设置其为二进制数据节点
		        	var l_node1 = xml_dom.createElement("file1");
		        	l_node1.dataType = "bin.base64";
		        	// 打开Stream对象，读源文件
		        	ado_stream.Type = 1; // 1=adTypeBinary
		        	ado_stream.Open();
		        	ado_stream.LoadFromFile("c:\tmp\myfile.doc");
		        	// 将文件内容存入XML节点
		        	l_node1.nodeTypedValue = ado_stream.Read(-1); // -1=adReadAll
		        	ado_stream.Close();
		        	xml_dom.documentElement.appendChild(l_node1);
		        	// 可以创建多个二进制节点，一次上传多个文件
		        	// 把XML文档发送到Web服务器
		        	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		        	xmlhttp.open("POST","./file_recieve.asp",false);
		        	xmlhttp.send(xml_dom);
		        	// 显示服务器返回的信息
		        	div_message.innerHTML = xmlhttp.ResponseText;
		        } 
 */
