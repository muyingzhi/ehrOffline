console.log("vaccinationInfoController...");
define(['controller/controllers','jquery','dictsConstant',
        'directives/hysNoneDatebox'
       ],function(app){
	    app.controller("vaccinationInfoController",['$rootScope','$scope','$routeParams','$indexedDB','dataDicts','DataDictService'
	        ,function($rootScope,$scope,$routeParams,$indexedDB,dataDicts,datadictService){
	    	 	//----------读取参数，为表单赋值
            	var id = $routeParams.id;   
            	var listId = $routeParams.listId;  
	    		//---------设置顶端菜单
		        $rootScope.topNav = [{text:"返回",iconClass:"glyphicon-circle-arrow-left",url:"#/vaccinationList/"+id}];
                //---------用于存放参数信息
	            $scope.data={};
		        //----人员
	            datadictService.listUSER().then(function(list){
	                $scope.dictDoctor = list;
	            });
	            //----机构
	            datadictService.listTGOV().then(function(list){
	                $scope.dictTgov = list;
	            });
	            $indexedDB.objectStore("EHEALTH_IMMU_INOCUCARD").find(id).then(function(data){
        			if(data.inocunotelist){
        				for(var i=0;i<data.inocunotelist.length;i++){
        					if(listId==data.inocunotelist[i].inocunoteid){
        						$scope.data=data.inocunotelist[i];
        					}
        				}
        			}
                },function(){
                	$.messager.alert(dataDicts.alertTitle,'取记录数错误');
                }).then(function(){});
	            
	            $scope.save = function(){
	            	$indexedDB.objectStore("EHEALTH_IMMU_INOCUCARD").find(id).then(function(data){
	         			if(data.inocunotelist){
	         				data.storeSign = "1";
	         				for(var i=0;i<data.inocunotelist.length;i++){
	         					if(listId==data.inocunotelist[i].inocunoteid){
	         						$scope.data.cruser = $rootScope.currentUser.userid;
	         						$scope.data.icpcode = $rootScope.currentUser.icpcode;
	         						$scope.data.crtime = getCrtime();
	         						if($scope.data.inocustate==true){
	         							$scope.data.inocustate='1';
	         						}else if($scope.data.inocustate==false){
	         							$scope.data.inocustate='0';
	         						}
	         						data.inocunotelist[i]=$scope.data;
	         						$indexedDB.objectStore("EHEALTH_IMMU_INOCUCARD").upsert(data).then(function(result){
	        	                        $.messager.alert(dataDicts.alertTitle,"保存成功");
	        	                    },function(result){
	        	                        $.messager.alert(dataDicts.alertTitle,"保存失败:"+result);
	        	                    });
	         					}
	         				}
	         			}
	                 },function(){
	                 	$.messager.alert(dataDicts.alertTitle,'取记录数错误');
	                 }).then(function(){});
	            	 
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
	            
	            function openWindow(){
		        	var _z=9000;//新对象的z-index
		        	var _mv=false;//移动标记
		        	var _x,_y;//鼠标离控件左上角的相对位置		
		        	var _obj= $("#detail");
		        	var _wid= _obj.width();
		        	var _hei= _obj.height();
		        	var _tit= _obj.find(".tit");
		        	var _cls =_obj.find(".close");
		        	var docE =document.documentElement;
		        	var left=($(document).width()-_obj.width())/2;
		        	var top =(docE.clientHeight-_obj.height())/2;
		        	_obj.css({	"left":left,"top":top,"display":"block","z-index":_z-(-1)});
		        			
		        	_tit.mousedown(function(e){
		        		_mv=true;
		        		_x=e.pageX-parseInt(_obj.css("left"));//获得左边位置
		        		_y=e.pageY-parseInt(_obj.css("top"));//获得上边位置
		        		_obj.css({	"z-index":_z-(-1)}).fadeTo(50,.5);//点击后开始拖动并透明显示	
		        	});
		        	_tit.mouseup(function(e){
		        		_mv=false;
		        		_obj.fadeTo("fast",1);//松开鼠标后停止移动并恢复成不透明				 
		        	
		        	});
		        	
		        	$(document).mousemove(function(e){
		        		if(_mv){
		        			var x=e.pageX-_x;//移动时根据鼠标位置计算控件左上角的绝对位置
		        			if(x<=0){x=0};
		        			x=Math.min(docE.clientWidth-_wid,x)-5;
		        			var y=e.pageY-_y;
		        			if(y<=0){y=0};
		        			y=Math.min(docE.clientHeight-_hei,y)-5;
		        			_obj.css({
		        				top:y,left:x
		        			});//控件新位置
		        		}
		        	});

		        	_cls.live("click",function(){
		        		$(this).parent().parent().hide();
		        		$("#maskLayer").remove();
		        	});
		        			
		        	$('<div id="maskLayer"></div>').appendTo("body").css({
		        		"background":"#000","opacity":".4","top":0,"left":0,"position":"absolute","zIndex":"8000"
		        	});
		        	reModel();
		        	$(window).bind("resize",function(){reModel();});
		        	$(document).keydown(function(event) {
		        		if (event.keyCode == 27) {
		        			$("#maskLayer").remove();
		        			_obj.hide();
		        		}
		        	});
		        	function reModel(){
		        		var b = docE? docE : document.body,
		        		height = b.scrollHeight > b.clientHeight ? b.scrollHeight : b.clientHeight,
		        		width = b.scrollWidth > b.clientWidth ? b.scrollWidth : b.clientWidth;
		        		$("#maskLayer").css({
		        			"height": height,"width": width
		        		});
		        	};
		        };
	        }
	    ]);
    
});