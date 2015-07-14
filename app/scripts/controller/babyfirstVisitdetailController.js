console.log("babyDetailController...");
define(['controller/controllers','dictsConstant',
        'directives/alert',
        'directives/isNum',
        'directives/isFloat',
        'directives/hysDatebox',
        'directives/radioPublicstatus',
        'directives/checkboxRenchun',
        'directives/checkboxBornsituation',
        'directives/checkboxZhidaotwo',
        'services/BabyBodyStandardService'],function(app){
    app.controller("babyfirstVisitdetailController",['$rootScope','$scope','$routeParams','$indexedDB','dataDicts','DataDictService'
        ,"BabyBodyStandardService",function($rootScope,$scope,$routeParams,LocalDBService,dataDicts,datadictService,babyStandarService){
            //----------读取参数，为表单赋值
            var hid = $routeParams.hid;
            var aid = $routeParams.aid;
	        //---------设置顶端菜单 
	        $rootScope.topNav = [
		        {
		            text:"返回",iconClass:"glyphicon-circle-arrow-left",url:"#/arch/babylist/"+aid
		        }];
	        //----人员
            datadictService.listUSER().then(function(list){
                $scope.babyVisitdoctor = list;
            });
            
            $scope.babyAsphyxiaAndJixingOrMore = dataDicts.haved;//新生儿窒息 是否有畸形   有无
            $scope.babyAsphyxialevel =dataDicts.saltIntake; //程度 重中轻
            $scope.babyListensift=dataDicts.hearing;
            $scope.babyJdillsiftAndBbtillsift=dataDicts.pandn; //甲低，苯丙酮尿筛查结果
            $scope.babyFeedmode=dataDicts.feedmode;//喂养方式
            $scope.babyFacecolor=dataDicts.facecolor;//面色
            $scope.babyAnteriorshape=dataDicts.anteriorshape;//前颅外观
            $scope.babyPublicstatus=dataDicts.publicstatus;
            $scope.babyStool=dataDicts.stool;//大便
            $scope.babyUmbilical=dataDicts.umbilical;//脐带
            $scope.babyJaundice=dataDicts.jaundice;//黄疸部位
            $scope.babyLymph=dataDicts.lymph;
            $scope.babySkin=dataDicts.skintwo;//皮肤
            
            if($rootScope.currentUser){
            	 $rootScope.userid=$rootScope.currentUser.userid;
            }
	        //--------默认
	        $scope.baby = {
	        	gestationmalady:"HR497_0",
	        	bornsituation: "HR499_1",
	        	babyasphyxia: "HR397_0",
	        	deformity: "HR397_0",
	        	feedmode: "HR523_1",
	        	facecolor: "kid_db_facecolor_1",
	        	anteriorshape: "kid_db_qlwg_1",
	        	eye: "HR522_1",
	        	limbsactivity: "HR522_1",
	        	ear: "HR522_1",
	        	neck: "HR397_0",//you  wu
	        	spine: "HR522_1",
	        	nose: "HR522_1",
	        	skin: "kid_db_skin_1",
	        	mouthcavity: "HR522_1",
	        	anus: "HR522_1",
	        	cardiopulmonary: "HR522_1",
	        	genitals: "HR522_1",
	        	abdomen: "HR522_1",
	        	umbilical: "HR522_1"
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
                    $scope.baby.gender=data.gender;
                    $scope.baby.birthday=data.birthday;
                    $scope.baby.archiveid = data.archid;
                    $scope.baby.archid = aid;
                    $scope.baby.fullname = data.fullname;
                }else{
                }
            },function(error){
                $.messager.alert(dataDicts.alertTitle,error);
            });
	       
	        if(hid){
	        	 //获取detail数据
	            LocalDBService.objectStore("EHEALTH_KID_BABYVISITSRECORD").find(hid)
	            .then(function(data){
	                if(!data){
	                    data = {};
	                }else{
	                	if(data.babyasphyxia=="HR397_1"){
	                		document.getElementById("asphy").style.display="block";
	                	}
	                    $.extend($scope.baby,data);
	                }
	            },function(error){
	            });
	        }
//	          
	            
            $scope.save = function(){
            	if(checkValid()){
            		return;
            	}
            	$scope.baby.crtime = getCrtime();
            	$scope.baby.icpcode = $rootScope.currentUser.icpcode;
            	$scope.baby.cruser = $scope.baby.visitdoctor;
            	if(!$scope.baby.babyvisitsrecordid || $scope.baby.babyvisitsrecordid==0){
                    LocalDBService.objectStore("EHEALTH_KID_BABYVISITSRECORD")
                    .count()
                    .then(function(num){
                        $scope.baby.babyvisitsrecordid = (num + 1).toString();
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
            $scope.$watch("baby.visitdoctor",function(newvalue){
                //医生名称
                if(!newvalue)return;
                var lists=$scope.babyVisitdoctor;
                if(lists){
                	for(var i=0;i<lists.length;i++){
                		if(lists[i].id==newvalue){
                			$scope.baby.visitdoctorname=lists[i].text;
                		}
                	}
                }
            });
            function saveOne(){
            	$scope.baby.storeSign = "1";
                LocalDBService.objectStore("EHEALTH_KID_BABYVISITSRECORD")
                    .upsert($scope.baby)
                    .then(function(result){
                    	$scope.baby.babyvisitsrecordid = result;
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
            	if($scope.frmAction.currvisitstime.$error.required){
            		warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>本次随访日期</font>]" + "<br>";	
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
            	var _inquiredate = new Date(Date.parse($scope.baby.currvisitstime.replace(/-/g,   "/")));
            	_inquiredate.setMonth(_inquiredate.getMonth()+1);	//1个月后进行下次随访
            	var _month = _inquiredate.getMonth()+1;
	        	var _date = _inquiredate.getDate();
            	$scope.baby.nextvisitstime = _inquiredate.getFullYear()+"-"+("00"+ _month).substr((""+ _month).length)+
            				"-"+("00"+ _date).substr((""+ _date).length);
            };
            
           
            $scope.showAsphyxialevel=function(){
            	if($scope.baby.babyasphyxia=="HR397_1"){
            		document.getElementById("asphy").style.display="block";
            	}else{
            		document.getElementById("asphy").style.display="none";
            		$scope.baby.asphyxialevel="";
            	}
        	    
           };
       }
    ]);
});
