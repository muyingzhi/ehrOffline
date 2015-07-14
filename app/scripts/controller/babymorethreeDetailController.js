console.log("babymorethreeDetailController...");
define(['controller/controllers','dictsConstant',
        'directives/alert',
        'directives/isNum',
        'directives/isFloat',
        'directives/hysDatebox',
        'directives/radioPublicstatus',
        'directives/checkboxGouloubinzhuang',
        'directives/checkboxGouloutizheng',
        'directives/checkboxGuidance',
        'directives/checkboxPrevalence',
        'services/BabyBodyStandardService'],function(app){
    app.controller("babymorethreeDetailController",['$rootScope','$scope','$routeParams','$indexedDB','dataDicts','DataDictService'
        ,"BabyBodyStandardService",function($rootScope,$scope,$routeParams,LocalDBService,dataDicts,datadictService,babyStandarService){
    	$scope.item={
    			heightlevel: "",
    			avoirdupoislevel: ""
    	};
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
	        $scope.babyProjectInfo= dataDicts.babyProject2;
            $scope.babyBodylevelInfo = dataDicts.babyBodylevel;
            $scope.babyFacecolor=dataDicts.facecolor2;//面色
            $scope.babyAnteriorcranialstaten=dataDicts.anteriorcranialstaten;

            $scope.babyNeck=dataDicts.haved;//有\无
            $scope.babyHearing=dataDicts.hearing; //听力的字典
            $scope.babyLymph=dataDicts.lymph;
            $scope.babyEyesight=dataDicts.eyesight;//通过\未通过
            $scope.babyBetweenvisit=dataDicts.betweenvisit;
            $scope.babyBodygrowthstate=dataDicts.bodygrowthstate;//体格发育评价
	        //--------默认
	        $scope.baby = {
	        	facecolor: "HR549_1",
	        	eye: "HR522_1",
	        	ear: "HR622_3",
	        	cardiopulmonary: "HR522_1",
	        	abdomen: "HR522_1",
	        	mouthcavity: "HR522_1",
	        	project: pid
	        	
	        };
            //----------读取一个档案
	        LocalDBService.objectStore("EHEALTH_ARCH_BASEINFO").find(aid)
            .then(function(data){
                if(data){
                    if(data.birthday){
                        var birthday=new Date(Date.parse(data.birthday.replace(/-/g,   "/")));
                        data.age = (new Date()).getFullYear() - birthday.getFullYear() + 1;
                    }
                    $scope.arch = data;
                    $scope.baby.archiveid = data.archid;
                    $scope.baby.icpcode = $rootScope.currentUser.icpcode;
                    $scope.baby.fullname = data.fullname;
                    $scope.baby.archid = aid;
                }else{
                }
            },function(error){
                $.messager.alert(dataDicts.alertTitle,error);
            });
	        LocalDBService.objectStore("EHEALTH_KID_KIDCHECKRECORD").find(hid)
            .then(function(data){
                if(!data){
                    data = {};
                }else{
                    
                }
                $.extend($scope.baby,data);
            },function(error){
            });
	        
            $scope.save = function(){
            	if(checkValid()){
            		return;
            	}
            	$scope.baby.crtime = getCrtime();
            	$scope.baby.cruser=$rootScope.currentUser.userid;//当前用户
            	$scope.baby.icpcode = $rootScope.currentUser.icpcode;
                if(!$scope.baby.kidcheckrecordid || $scope.baby.kidcheckrecordid==0){
                    LocalDBService.objectStore("EHEALTH_KID_KIDCHECKRECORD")
                    .count()
                    .then(function(num){
                        $scope.baby.kidcheckrecordid = (num + 1).toString();
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
                LocalDBService.objectStore("EHEALTH_KID_KIDCHECKRECORD")
                    .upsert($scope.baby)
                    .then(function(result){
                        $scope.baby.kidcheckrecordid = result;
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
            	if($scope.frmAction.nextvisitdate.$error.required){
            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>下次随访时间</font>]" + "<br>";	
            		bHasInvalidElm = true;
            	};
            	if(warning){
            		$.messager.alert(dataDicts.alertTitle,warning);
            	}
            	return bHasInvalidElm;
            };
            
           $scope.getChangeValue=function(year,heightOrWeight){
        	   var project=$scope.baby.project;
        	   var str=project.split("_")[1];
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
                   if($scope.baby.project){//
                       //--------
                	   year=Number(str)+2;
                	   //alert(year);
                	   babyStandarService.findByBirhyear(year+"")
                	   .then(function(list){
                           getStandard(list,heightOrWeight,value,year);
                       });
                   };
           };
           
           function  getStandard(list,heightOrWeight,value,year){
          	 var babyinfo;
          	 var index;
          	 var gender=$scope.arch.gender;
 			var date1 = $scope.baby.visittime;
 			var date2 = $scope.arch.birthday;
 			// 拆分年月日
 			date1 = date1.split('-');
 			// 得到月数
 			date1 = parseInt(date1[0]) * 12 + parseInt(date1[1]);
 			// 拆分年月日
 			date2 = date2.split('-');
 			// 得到月数
 			date2 = parseInt(date2[0]) * 12 + parseInt(date2[1]);
 			var m = Math.abs(date1 - date2);
 			var month=parseInt(m)%12;
          	 for(var i=0;i<list.length;i++){
       		      if(list[i].gender==gender && list[i].birthyear==year && list[i].birhmonth==month){
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
