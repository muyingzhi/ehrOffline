console.log("recordDetailController...");
define(['controller/controllers','jquery','dictsConstant','directives/easyCombobox',
    'services/DataDictService',
    'services/SpellService',
    'directives/hysDatebox'
    ],function(app){
    app.controller("recordDetailController",['$rootScope','$scope','$routeParams','$indexedDB','dataDicts','DataDictService','SpellService'
        ,function($rootScope,$scope,$routeParams,LocalDBService,dataDicts,datadictService,spellService){
            //----------读取参数
            var id = $routeParams.id;
            //---------设置顶端菜单
	        $rootScope.topNav = [
		        {
		            text:"返回",iconClass:"glyphicon-circle-arrow-left",url:"#/recordlist/"+id
		        }
            ];
            //----人员
            datadictService.listUSER().then(function(list){
                $scope.dictDoctor = list;
            })
            //$scope.dictDoctor = dataDicts.dictDoctor;
            //----机构
            datadictService.listTGOV().then(function(list){
                $scope.dictTgov = list;
            })
            //----ICD10
            datadictService.listICD10().then(function(list){
                $scope.dictICD10 = list;
            })
            //-----------其它字典
            $scope.dictGender = dataDicts.gender;
            $scope.dictClinictype = dataDicts.clinictype;
            $scope.dictVocation = dataDicts.vocation;
	        //--------默认
            var today = new Date();
            var todayStr = today.getFullYear()+'-'+(today.getMonth()+1)+"-"+today.getDate();
	        $scope.record = {
                birthday : getDT(),
	            gender:"HR481_1",
                diatime : getDT("T"),
                clinictype:'1'//---就诊类型：1：初诊，2：复诊
	        };
            $scope.ops = {};
            $scope.familydisease={};
            $scope.setNameSpell = function(){//---拼音
                var fullname = $scope.record.fullname;     
                var spell = spellService.makeSpell(fullname);
                $scope.record.namepinyincode = spell;
            }
            
            //ICD10编码快捷搜索
            $(document).ready(function ($) {
                $.fn.typeahead.Constructor.prototype.blur = function () {
                    var that = this;
                    setTimeout(function () { that.hide() }, 250);
                };
                $('#diseasename').typeahead({
                	source: function (query, process) {
	                    var results = _.map($scope.dictICD10, function (product) {
	                        return product.pinyin;
	                    });
	                    process(results);
	                },
	
	                highlighter: function (pinyin) {
	                    var product = _.find($scope.dictICD10, function (p) {
	                        return p.pinyin == pinyin;
	                    });
	                    return product.icdname + " (" + product.icdcode + ")";
	                },
	
	                updater: function (pinyin) {
	                    var product = _.find($scope.dictICD10, function (p) {
	                        return p.pinyin == pinyin;
	                    });
	                    $scope.record.diseasename = product.icdname;
                        $scope.record.diagnoses = product.icdcode;
                        $scope.$apply();
	                    return product.icdname;
	                }
                });
            });
            
            //根据身份证号，计算出生日期和设置性别
            $scope.calcBir = function(idno){
			    if(idno){
			        var idnoday="";
			        var birthday="";
			        if (idno.length==15){
			            idnoday = idno.substr(6,6);
			            birthday ="19"+idnoday.substr(0,2)+"-"+idnoday.substr(2,2)+"-"+idnoday.substr(4,2);
			        }else if (idno.length==18){
			            idnoday = idno.substr(6,8);
			            birthday =idnoday.substr(0,4)+"-"+idnoday.substr(4,2)+"-"+idnoday.substr(6,2);
			        }else{
			            //$.messager.alert('提示',idno+'身份证长度不对，只能是15位或18位');
			            return; 
			        }
			        $scope.record.birthday = birthday;
			        //searchmedicardno(idno);
			        //------------性别判断
                    if(idno.length==15){
				        if(idno.substr(14,14)%2 == 1){
				            $scope.record.gender =  'HR481_1';
				        }else{
                            $scope.record.gender =  'HR481_2';
				        }
				    }else if(idno.length==18){
				        if(idno.substr(16,16).substr(0,1)%2 == 1){
                            $scope.record.gender =  'HR481_1';
				        }else{
                            $scope.record.gender =  'HR481_2';
				        }
				    }
			    }
            }
            //----------读取一个档案
            LocalDBService.objectStore("EHEALTH_CURE_CASEHISTORY").find(id)
                .then(function(data){
                    if(data){
                        $scope.record = data;
                    }else{
                    }
                },function(error){
                    $.messager.alert(dataDicts.alertTitle,error);
                });
            $scope.saveArch = function(){
                if(checkValid()){
                    return;
                }
                if(checkValid1()){
                    return;
                }
                if(!$scope.record.casehistoryid || $scope.record.casehistoryid==0){
                    LocalDBService.objectStore("EHEALTH_CURE_CASEHISTORY")
                    .count()
                    .then(function(num){
                        $scope.record.casehistoryid = (num + 1).toString();
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
                $scope.record.crtime = getDT("T");
                $scope.record.icpcode =  $rootScope.currentUser.icpcode;
                $scope.record.cruser =  $rootScope.currentUser.userid;//-----当前用户
                LocalDBService.objectStore("EHEALTH_CURE_CASEHISTORY")
                    .upsert($scope.record)
                    .then(function(result){
                        $.messager.alert(dataDicts.alertTitle,"保存成功");
                    },function(result){
                        $.messager.alert(dataDicts.alertTitle,"保存失败:"+result);
                    });
            }
            //检查校验项目
            function checkValid(){
                var bHasInvalidElm = false;
                var warning = '';
                var nInvalidCount = 0;
                if($scope.frmAction.fullname.$error.required){
                    warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>姓名</font>]" + "<br>"; 
                    bHasInvalidElm = true;
                };
                if($scope.frmAction.gender.$error.required){
                    warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>性别</font>]" + "<br>"; 
                    bHasInvalidElm = true;
                };
                if($scope.frmAction.birthday.$error.required){
                    warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>出生日期</font>]" + "<br>"; 
                    bHasInvalidElm = true;
                };
                if($scope.frmAction.namepinyincode.$error.required){
                    warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>拼音</font>]" + "<br>"; 
                    bHasInvalidElm = true;
                };
                if($scope.frmAction.doctor.$error.required){
                    warning += (++nInvalidCount) + '.' + "请选择[<font color='red'>医生</font>]" + "<br>"; 
                    bHasInvalidElm = true;
                };
                if($scope.frmAction.clinictype.$error.required){
                    warning += (++nInvalidCount) + '.' + "请选择[<font color='red'>就诊类型</font>]" + "<br>"; 
                    bHasInvalidElm = true;
                };
                if($scope.frmAction.diatime.$error.required){
                    warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>发病日期</font>]" + "<br>"; 
                    bHasInvalidElm = true;
                };
                if(warning){
                    $.messager.alert(dataDicts.alertTitle,warning);
                }
                return bHasInvalidElm;
            }
            
            //检查校验项目
            function checkValid1(){
            	var birth = $scope.record.birthday;
            	birth = birth.replace(/-/g,"/");
            	birth = new Date(birth);
            	var date = new Date();
            	var age_value = dateDiffYear(birth);
            	if(birth-date>0){
            		$.messager.alert(dataDicts.alertTitle,"出生日期大于当前日期,请重新填写");
            		return true;
            	}
            	if($scope.record.clinictype=='1' && (parseInt(age_value) ==35||parseInt(age_value)>35)){
            		if($scope.record.blood_ss==undefined||$scope.record.blood_ss==''||
            				$scope.record.blood_sz==undefined||$scope.record.blood_sz==''){
            			$.messager.alert(dataDicts.alertTitle,"初诊35岁以上病人，血压值不可空！");
            			return true;
            		}
            	}
            	var tiwen = $scope.record.temperature;
            	if(tiwen !=undefined && tiwen !=""){
            		if(tiwen.indexOf(".")==(tiwen.length-1)){
            			$.messager.alert(dataDicts.alertTitle,"体温不能以点结尾！");
            			return true;
            		}
            		if(tiwen<35 || tiwen>42){
            			$.messager.alert(dataDicts.alertTitle,"请填写体温，体温填写范围：35℃~42℃");
            			return true;
            		}
            	}
            	
            	var icd10name = $scope.record.diseasename;
            	var icd10code = $scope.record.diagnoses;
            	var blood_ss = $scope.record.blood_ss;
            	var blood_sz = $scope.record.blood_sz;
            	var subjectdatatext = $scope.record.datas;
            	if(icd10name==undefined || icd10code==undefined || subjectdatatext==undefined){
            		$.messager.alert(dataDicts.alertTitle,"请先填写主观资料和疾病诊断内容");
            		return true;
            	}
            	if(icd10name.indexOf("高血压")>=0&&(blood_ss==undefined||blood_sz==undefined)){
            		$.messager.alert(dataDicts.alertTitle,"血压值不可为空！");
            		return true;
            	}
            	if(parseInt(age_value) <=14){
            		if($scope.record.jzname==undefined){
            			$.messager.alert(dataDicts.alertTitle,"14岁以下儿童，家长姓名必填");
            			return true;
            		}
            	}
            	if(parseInt(blood_ss) < parseInt(blood_sz) || parseInt(blood_ss)>260 || parseInt(blood_sz)>140){
            		$.messager.alert(dataDicts.alertTitle,"舒张压不得大于收缩压，收缩压不可大于260mmHg,舒张压不可大于140mmHg！");
            		return true;
            	}
            	if(icd10name.indexOf("高血压")>=0){
            	   if($scope.record.fbg==undefined && $scope.record.glycemic ==undefined){
            		   $.messager.alert(dataDicts.alertTitle,"疾病诊断为高血压，空腹血糖或随机血糖必填一项！");
            		   return true;
            	   }
            	}
            }
            
            
            //---返回当前时间日期串;参数dORt="T",返回yyyy-mm-dd,否则返回yyyy-mm-dd HH:MM:SS
            function getDT(dORt){
                var _crdate = new Date();
                var _month = _crdate.getMonth()+1;
                var _date = _crdate.getDate();
                var _hours = _crdate.getHours();
                var _minutes = _crdate.getMinutes();
                var _seconds = _crdate.getSeconds();
                var _crtime = "";
                if (dORt && dORt.toUpperCase() =="T"){
                    _crtime = _crdate.getFullYear() +"-"+ ("00"+ _month).substr((""+ _month).length) + "-"+
                            ("00"+ _date).substr((""+ _date).length) +" "+ ("00"+ _hours).substr((""+ _hours).length) +":"+
                            ("00"+ _minutes).substr((""+ _minutes).length) +":"+ ("00"+ _seconds).substr((""+ _seconds).length);
                }else{
                    _crtime = _crdate.getFullYear() +"-"+ ("00"+ _month).substr((""+ _month).length) + "-"+
                            ("00"+ _date).substr((""+ _date).length)
                }
                return _crtime;
            }
            //通过生日得到年龄
            function dateDiffYear(birthday) {
            	var dateStart = birthday.getFullYear() + "-" + (birthday.getMonth() + 1)
            			+ "-" + birthday.getDate();
            	tick = new Date();
            	month = tick.getMonth() + 1;
            	day = tick.getDate();
            	year = tick.getFullYear();
            	var dateEnd = year + "-" + month + "-" + day;
            	var arr1 = dateStart.split("-");
            	var arr2 = dateEnd.split("-");
            	var year = arr2[0] - arr1[0];
            	if (arr2[1] >= arr1[1] && arr2[2] >= arr1[2] - 1) {
            		return year;
            	} else {
            		if (arr1[2] == 1) {
            			if ((arr2[1] == 1 || arr2[1] == 3 || arr2[1] == 5
            					|| arr2[1] == 7 || arr2[1] == 8 || arr2[1] == 10 || arr2[1] == 12)
            					&& arr2[2] == 31)
            				return year;
            			if ((arr2[1] == 4 || arr2[1] == 6 || arr2[1] == 9 || arr2[1] == 11)
            					&& arr2[2] == 30)
            				return year;
            			if (arr2[1] == 2)
            				if ((arr2[0] % 4 == 0 && arr2[0] % 100 != 0 || arr2[0] % 100 == 0
            						&& arr2[0] % 400 == 0)
            						&& arr2[2] == 29)
            					return year;
            				else if ((arr2[0] % 4 != 0 || arr2[0] % 100 == 0)
            						&& arr2[2] == 28)
            					return year;
            				else
            					return year - 1
            		}
            		return year - 1;
            	}      
            }
            
        }
    ]);
    
/**
 * $scope = {
 *      arch:{
 *      },
 *      saveArch:function(){}
 * }
 */
});