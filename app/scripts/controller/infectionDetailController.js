console.log("infectionDetailController...");
define(['controller/controllers','jquery','dictsConstant','directives/easyCombobox',
    'services/DataDictService',
    'services/SpellService',
    'directives/hysDatebox',
    'directives/checkboxInspdisease'
    ],function(app){
    app.controller("infectionDetailController",['$rootScope','$scope','$routeParams','$indexedDB','dataDicts','DataDictService','SpellService'
        ,function($rootScope,$scope,$routeParams,LocalDBService,dataDicts,datadictService,spellService){
            //----------读取参数
            var id = $routeParams.id;
            //---------设置顶端菜单
	        $rootScope.topNav = [
		        {
		            text:"返回",iconClass:"glyphicon-circle-arrow-left",url:"#/infectionlist/"+id
		        }
            ];
	        //----报卡类别
	        $scope.dictReportlevel = dataDicts.reportlevel;
	        
	        //---乡镇(街道)*
            datadictService.listGOVDICT().then(function(list){
                $scope.dictStreet = list;
            });
            //----村(居)委会
            $scope.dictResident = dataDicts.dictResident;
            //----人员
            datadictService.listUSER().then(function(list){
                $scope.dictDoctor = list;
            })
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
            $scope.dictVocation = dataDicts.vocation1;
            $scope.dictCasetype1 = dataDicts.casetype1;
            $scope.dictCasetype2 = dataDicts.casetype2;
            $scope.dictFamilyaddr = dataDicts.familyaddr;
            $scope.dictInfectioncode = dataDicts.infectioncode;
            $scope.dictInfectiontype = dataDicts.infectiontype;
            $scope.dictIsstd = dataDicts.isstoned;
            $scope.dictMarriage = dataDicts.marriage;
            $scope.dictNation = dataDicts.nation;
            $scope.dictEducation = dataDicts.education;
            $scope.dictBetweenvisit = dataDicts.betweenvisit;
            $scope.dictInsroute = dataDicts.insroute;
            $scope.dictResourcef = dataDicts.resourcef;
            $scope.dictLimresoult = dataDicts.limresoult;
	        //--------默认
            var today = new Date();
            var todayStr = today.getFullYear()+'-'+(today.getMonth()+1)+"-"+today.getDate();
	        $scope.infection = {
                birthday : getDT(),
                inputtime : getDT(),
                ocurrtime : getDT(),
                reportlevel:"reportlevel_1",
	            gender:"HR481_1",
                diatime : getDT("T"),
                familyaddr:"familyaddr_1"
	        };
	        $scope.toggle = "hide";
            $scope.ops = {};
            $scope.familydisease={};
            $scope.setNameSpell = function(){//---拼音
                var fullname = $scope.infection.fullname;     
                var spell = spellService.makeSpell(fullname);
                $scope.infection.namepinyincode = spell;
            }
            
            $scope.$watch("infection.street",function(newvalue){
                //----村(居)委会
                if(!newvalue)return;
                datadictService.listResident(newvalue).then(function(list){
                    $scope.dictResident = list;
                })
            })
            
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
	                    $scope.infection.diseasename = product.icdname;
                        $scope.infection.diagnoses = product.icdcode;
                        $scope.$apply();
	                    return product.icdname;
	                }
                });
            });
            
            //传染病疾病对应类型
            $scope.getillName = function (){
	        	var selObjValue= $scope.infection.illname;
	        	var eq=selObjValue.indexOf("_",14);
	        	var value=selObjValue.substring(0,eq);
	        		if(value=="infectiontype_jia"){
	        			$scope.infection.infectiontype = "infectiontype_1";
	        		}else if(value=="infectiontype_yi"){
	        			$scope.infection.infectiontype="infectiontype_2";
	        		}else if(value=="infectiontype_bing"){
	        			$scope.infection.infectiontype="infectiontype_3";
	        		}else if(value=="infectiontype_qt"){
	        			$scope.infection.infectiontype="infectiontype_5";
	        		}else if(value=="infectiontype_other"){
	        			$scope.infection.infectiontype="infectiontype_4";
	        		}else{
	        			$scope.infection.infectiontype="";
	        		}
	        }

            //是否展示
            $scope.isShow = function(val){
            	return  $scope.toggle = val;
            }
            //是否性病展现性病报告附加栏
            $scope.isstdShow = function(){
            	if($scope.infection.isstd=="HR396_1"){
            		$scope.toggle = 'show';
            	}else if($scope.infection.isstd=="HR396_0") {
            		$scope.toggle = 'hide';
            	}
            }
            
            //根据病人属于，显示人员地址
            $scope.persontype = function(){
            	var familyaddr = $scope.infection.familyaddr;
            	if(familyaddr=='familyaddr_1'){
            		$("#streetDiv").show();
            		$("#residentcommitteeDiv").show();
            		$("#shengDiv").hide();
            		$("#shiDiv").hide();
            		$("#xianDiv").hide();
            		$("#xiangDiv").hide();
            		$("#cunDiv").hide();
            	}else{
            		$("#streetDiv").hide();
            		$("#residentcommitteeDiv").hide();
            		$("#shengDiv").show();
            		$("#shiDiv").show();
            		$("#xianDiv").show();
            		$("#xiangDiv").show();
            		$("#cunDiv").show();
            	}
            }
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
			        $scope.infection.birthday = birthday;
			        //searchmedicardno(idno);
			        //------------性别判断
                    if(idno.length==15){
				        if(idno.substr(14,14)%2 == 1){
				            $scope.infection.gender =  'HR481_1';
				        }else{
                            $scope.infection.gender =  'HR481_2';
				        }
				    }else if(idno.length==18){
				        if(idno.substr(16,16).substr(0,1)%2 == 1){
                            $scope.infection.gender =  'HR481_1';
				        }else{
                            $scope.infection.gender =  'HR481_2';
				        }
				    }
			    }
            }
            //----------读取一个档案
            LocalDBService.objectStore("EHEALTH_DIS_INFECTIONCARD").find(id)
                .then(function(data){
                    if(data){
                        $scope.infection = data;
                    }else{
                    }
                },function(error){
                    $.messager.alert(dataDicts.alertTitle,error);
                });
            $scope.saveInfection = function(){
                if(checkValid()){
                    return;
                }
                if(checkValid1()){
                    return;
                }
                if(!$scope.infection.infectioncardid || $scope.infection.infectioncardid==0){
                    LocalDBService.objectStore("EHEALTH_DIS_INFECTIONCARD")
                    .count()
                    .then(function(num){
                        $scope.infection.infectioncardid = (num + 1).toString();
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
                $scope.infection.crtime = getDT("T");
                $scope.infection.diagnosetime = getDT("T");
                $scope.infection.icpcode =  $rootScope.currentUser.icpcode;
                $scope.infection.cruser =  $rootScope.currentUser.userid;//-----当前用户
                LocalDBService.objectStore("EHEALTH_DIS_INFECTIONCARD")
                    .upsert($scope.infection)
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
                if($scope.frmAction.reportlevel.$error.required){
                    warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>报卡类别</font>]" + "<br>"; 
                    bHasInvalidElm = true;
                };
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
                if($scope.frmAction.tel.$error.required){
                    warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>联系电话</font>]" + "<br>"; 
                    bHasInvalidElm = true;
                };
                if($scope.frmAction.vocation.$error.required){
                    warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>职业</font>]" + "<br>"; 
                    bHasInvalidElm = true;
                };
                if($scope.frmAction.casetype1.$error.required){
                    warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>病例分类(1)</font>]" + "<br>"; 
                    bHasInvalidElm = true;
                };
                if($scope.frmAction.ocurrtime.$error.required){
                    warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>发病日期</font>]" + "<br>"; 
                    bHasInvalidElm = true;
                };
                if($scope.frmAction.diagnosehour.$error.required){
                    warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>诊断日期(时)</font>]" + "<br>"; 
                    bHasInvalidElm = true;
                };
                if($scope.frmAction.illname.$error.required){
                    warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>传染病名称</font>]" + "<br>"; 
                    bHasInvalidElm = true;
                };
                if($scope.frmAction.infectiontype.$error.required){
                    warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>传染病类型</font>]" + "<br>"; 
                    bHasInvalidElm = true;
                };
                if($scope.frmAction.recordsguy.$error.required){
                    warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>报告医生</font>]" + "<br>"; 
                    bHasInvalidElm = true;
                };
                if($scope.frmAction.inputtime.$error.required){
                    warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>填卡日期</font>]" + "<br>"; 
                    bHasInvalidElm = true;
                };
                var familyaddr = $scope.infection.familyaddr;
            	if(familyaddr=="familyaddr_1"){
            		if($scope.frmAction.street.$error.required){
                        warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>乡镇(街道)</font>]" + "<br>"; 
                        bHasInvalidElm = true;
                    };
                    if($scope.frmAction.residentcommittee.$error.required){
                        warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>村(居)委会</font>]" + "<br>"; 
                        bHasInvalidElm = true;
                    };
            	}else{
            		if($scope.frmAction.sheng.$error.required){
                        warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>省</font>]" + "<br>"; 
                        bHasInvalidElm = true;
                    };
                    if($scope.frmAction.shi.$error.required){
                        warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>市</font>]" + "<br>"; 
                        bHasInvalidElm = true;
                    };
                    if($scope.frmAction.xian.$error.required){
                        warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>县</font>]" + "<br>"; 
                        bHasInvalidElm = true;
                    };
                    if($scope.frmAction.xiang.$error.required){
                        warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>乡镇(街道)</font>]" + "<br>"; 
                        bHasInvalidElm = true;
                    };
                    if($scope.frmAction.cun.$error.required){
                        warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>村(居)委会</font>]" + "<br>"; 
                        bHasInvalidElm = true;
                    };
            	}
                if($scope.frmAction.addr.$error.required){
                    warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>门牌号</font>]" + "<br>"; 
                    bHasInvalidElm = true;
                };
                var isstd = $scope.infection.isstd;
            	if(isstd=="HR396_1"){
            		if($scope.frmAction.marriage.$error.required){
                        warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>婚姻状况</font>]" + "<br>"; 
                        bHasInvalidElm = true;
                    };
                    if($scope.frmAction.nation.$error.required){
                        warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>民族</font>]" + "<br>"; 
                        bHasInvalidElm = true;
                    };
                    if($scope.frmAction.education.$error.required){
                        warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>文化程度</font>]" + "<br>"; 
                        bHasInvalidElm = true;
                    };
                    if($scope.frmAction.fatherland.$error.required){
                        warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>户籍所在地</font>]" + "<br>"; 
                        bHasInvalidElm = true;
                    };
                    if(!$scope.infection.inspdisease){
                        warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>接触史</font>]" + "<br>"; 
                        bHasInvalidElm = true;
                    };
                    if($scope.frmAction.stdhistory.$error.required){
                        warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>性病史</font>]" + "<br>"; 
                        bHasInvalidElm = true;
                    };
                    if($scope.frmAction.insroute.$error.required){
                        warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>可能感染途径</font>]" + "<br>"; 
                        bHasInvalidElm = true;
                    };
            	}
                if(warning){
                    $.messager.alert(dataDicts.alertTitle,warning);
                }
                return bHasInvalidElm;
            }
            
            //检查校验项目
            function checkValid1(){
            	var birth = $scope.infection.birthday;
            	birth = birth.replace(/-/g,"/");
            	birth = new Date(birth);
            	var date = new Date();
            	var age_value = dateDiffYear(birth);
            	if(birth-date>0){
            		$.messager.alert(dataDicts.alertTitle,"出生日期大于当前日期,请重新填写");
            		return true;
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