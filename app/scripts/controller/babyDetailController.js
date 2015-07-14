console.log("babyDetailController...");
define(['controller/controllers','dictsConstant',
        'directives/alert',
        'directives/isNum',
        'directives/isFloat',
        'directives/hysDatebox',
        'directives/radioPublicstatus',
        'directives/checkboxGouloubinzhuang',
        'directives/checkboxGouloutizheng',
        'directives/checkboxGoulouciyaotizheng',
        'directives/checkboxEattiaoyang',
        'directives/checkboxQijutiaoshe',
        'directives/checkboxTuina',
        'directives/checkboxZhidao',
        'services/BabyBodyStandardService'],function(app){
    app.controller("babyDetailController",['$rootScope','$scope','$routeParams','$indexedDB','dataDicts','DataDictService'
        ,"BabyBodyStandardService",function($rootScope,$scope,$routeParams,LocalDBService,dataDicts,datadictService,babyStandarService){
            //----------读取参数，为表单赋值
            var hid = $routeParams.hid;
            var aid = $routeParams.aid;
            var pid = $routeParams.pid;
	        //---------设置顶端菜单 
	        $rootScope.topNav = [
		        {
		            text:"返回",iconClass:"glyphicon-circle-arrow-left",url:"#/arch/babylist/"+aid
		        }];
	        //----人员
            datadictService.listUSER().then(function(list){
                $scope.babyVisitdoctor = list;
            });
            //1~3岁之间  页面一样
            if(pid.substring(0,14)=="kid_db_twoold_"){//1-3岁选项
            	$scope.babyProjectInfo= dataDicts.babyProjecttwo;
            }else{//0-1岁选项
            	$scope.babyProjectInfo= dataDicts.babyProject;
            }
            $scope.babyBodylevelInfo = dataDicts.babyBodylevel;
            $scope.babyFacecolor=dataDicts.facecolor;
            $scope.babyAnteriorcranialstaten=dataDicts.anteriorcranialstaten;

            $scope.babyNeck=dataDicts.haved;//有无
            $scope.babyHearing=dataDicts.hearing;
            $scope.babyLymph=dataDicts.lymph;
            $scope.babyEyesight=dataDicts.eyesight;//发育评估字典
            $scope.babyBetweenvisit=dataDicts.betweenvisit;
            
	        //--------默认
	        $scope.baby = {
	        	skin: "HR522_1",
	        	eye: "HR522_1",
	        	ear: "HR522_1",
	        	cardiopulmonary: "HR522_1",
	        	abdomen: "HR522_1",
	        	umbilical: "HR522_1",
	        	limbs: "HR522_1",
	        	mouthcavity: "HR522_1",
	        	genitals: "HR522_1",
	        	heightlevel: "",
    			avoirdupoislevel: "",
    			project: pid
	        };
            //----------读取一个档案
	        LocalDBService.objectStore("EHEALTH_ARCH_BASEINFO").find(aid)
            .then(function(data){
                if(data){
                    //data.gender= (data.gender=="HR481_1")?"男":"女";
                    if(data.birthday){
                        var birthday=new Date(Date.parse(data.birthday.replace(/-/g,   "/")));
                        data.age = (new Date()).getFullYear() - birthday.getFullYear() + 1;
                    }
                    $scope.arch = data;
                    $scope.baby.archiveid = data.archid;
                    $scope.baby.archid = aid;
                    $scope.baby.fullname = data.fullname;
                }else{
                }
            },function(error){
                $.messager.alert(dataDicts.alertTitle,error);
            });
	       
	        	 //获取detail数据
	            LocalDBService.objectStore("EHEALTH_KID_BABYCHECKRECORD").find(hid)
	            .then(function(data){
	                if(!data){
	                    data = {};
	                }else{
	                    $.extend($scope.baby,data);
	                }
	            },function(error){
	            });
	       
//	          
	            
            $scope.save = function(){
            	if(checkValid()){
            		return;
            	}
            	$scope.baby.crtime = getCrtime();
            	$scope.baby.cruser=$rootScope.currentUser.userid;
            	$scope.baby.icpcode = $rootScope.currentUser.icpcode;
            	if(!$scope.baby.babycheckrecordid || $scope.baby.babycheckrecordid==0){
                    LocalDBService.objectStore("EHEALTH_KID_BABYCHECKRECORD")
                    .count()
                    .then(function(num){
                        $scope.baby.babycheckrecordid = (num + 1).toString();
                    },function(){
                        $.messager.alert(dataDicts.alertTitle,'取记录数错误');
                    })
                    .then(function(){
                        //-----------插入新记录
                        saveOne();
                    });
                }else{
                    saveOne();
                }
            };
            
            function saveOne(){
            	$scope.baby.storeSign = "1";
                LocalDBService.objectStore("EHEALTH_KID_BABYCHECKRECORD")
                    .upsert($scope.baby)
                    .then(function(result){
                    	$scope.baby.babycheckrecordid = result;
                        $.messager.alert(dataDicts.alertTitle,"保存成功");
                    },function(result){
                        $.messager.alert(dataDicts.alertTitle,"保存失败:"+result);
                    });
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
            }
            $scope.changeValue=function(){
            	baby.hemoglobin_memo="拒查";
            };
            //检查校验项目
            function checkValid(){
            	var bHasInvalidElm = false;
            	var warning = '';
            	var nInvalidCount = 0;
            	if($scope.frmAction.visittime.$error.required){
            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>随访日期</font>]" + "<br>";	
            		bHasInvalidElm = true;
            	};
            	if($scope.frmAction.visitdoctor.$error.required){
            		warning += (++nInvalidCount) + '.' + "请选择[<font color='red'>随访医生</font>]" + "<br>";	
            		bHasInvalidElm = true;
            	};
            	if($scope.frmAction.nextvisitstime.$error.required){
            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>下次随访时间</font>]" + "<br>";	
            		bHasInvalidElm = true;
            	}; 
            	if(warning){
            		$.messager.alert(dataDicts.alertTitle,warning);
            	}
            	return bHasInvalidElm;
            };
            $scope.setMyBookingdate = function(){
            	var _inquiredate = new Date(Date.parse($scope.baby.visittime.replace(/-/g,   "/")));
            	_inquiredate.setMonth(_inquiredate.getMonth()+1);	//1个月后进行下次随访
            	var _month = _inquiredate.getMonth()+1;
	        	var _date = _inquiredate.getDate();
            	$scope.baby.nextvisitstime = _inquiredate.getFullYear()+"-"+("00"+ _month).substr((""+ _month).length)+
            				"-"+("00"+ _date).substr((""+ _date).length);
            };
            
            
           $scope.getChangeValue=function(heightOrWeight){
        	   if(heightOrWeight=="height"){
        	   if($scope.baby.height=="" || $scope.baby.height==null){
        		   $scope.baby.heightlevel="";
        		   return;
        	   }
        	   }else{
        		   if($scope.baby.avoirdupois=="" || $scope.baby.avoirdupois==null){
        			   $scope.baby.avoirdupoislevel="";
        			   return;
        		   }
        	   }
        	   var str=$scope.baby.project;
        	   var year;
        	   var month;
        	   if(str==null){
        		   alert("请先选择项目！");
        		   $scope.baby.height="";
        		   $scope.baby.avourdupois="";
        		   return;
        	   }
        	   var value;
        	   if(heightOrWeight=="height"){
        		   value=$scope.baby.height;
        	   }else{
        		   value=$scope.baby.avoirdupois;
        	   }
                   if(str.substring(0,14)=="kid_db_oneold_"){//0-1岁year=0
                       year="0";
                       month=parseInt(str.replace("kid_db_oneold_",""))%12+"";
                   }else if(str=="kid_db_twoold_1"){//1岁year=1
                       year="1";
                       month="0";
                   }else if(str=="kid_db_twoold_2"){
                	   year="1";
                	   month="6";
                   }else if(str=="kid_db_twoold_3"){
                	   year="2";
                	   month="0";
                   }else if(str=="kid_db_twoold_4"){
                	   year="2";
                	   month="6";
                   }else if(str=="kid_db_twoold_5"){
                	   year="3";
                	   month="0";
                   }else{
                	   year=Math.floor(parseInt(str.replace("kid_db_twoold_",""))/12)+"";//取整
                	   month=parseInt(str.replace("kid_db_twoold_",""))%12+"";
                   }   
                   //--------出生月份查找
            	   babyStandarService.findByBirhmonth(month)
            	   .then(function(list){
                       getStandard(list,heightOrWeight,value,year);
                   });
           };
           
           function  getStandard(list,heightOrWeight,value,year){
          	 var babyinfo;
          	 var index;
          	 var gender=$scope.arch.gender;
          	 for(var i=0;i<list.length;i++){
       		      if(list[i].gender==gender && list[i].birthyear==year ){
       		    	  
       		    	  babyinfo=list[i];
       		    	  index=babyStandarService.saveArrinfo(babyinfo,heightOrWeight,value);
       		    	  if(heightOrWeight=="height"){
       		    		 $scope.baby.heightlevel=babyStandarService.renderResult(0,index).split("|")[0];
       		    	  }else{//
       		    		 $scope.baby.avoirdupoislevel=babyStandarService.renderResult(0,index).split("|")[0];
       		    	  }
       		    	  return;
       		      };
       	   };
          }
       }
    ]);
});
