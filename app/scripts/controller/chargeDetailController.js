console.log("chargeDetailController...");
define(['controller/controllers','jquery','dictsConstant','directives/easyCombobox',
    'services/DataDictService',
    'services/ChargeService',
    'directives/hysDatebox'
    ],function(app){
    app.controller("chargeDetailController",['$rootScope','$scope','$routeParams','$indexedDB','dataDicts','DataDictService','ChargeService'
        ,function($rootScope,$scope,$routeParams,LocalDBService,dataDicts,datadictService,chargeService){
            //----------读取参数
            var id = $routeParams.id;
            if(id && id>0){
                chargeService.findByOutpid(id).then(function(list){
                    $scope.druglist = list;
                    $scope.num=list.length;
                    $("#druglist").datagrid({data:$scope.druglist});
                });
            }            
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
            //----药品目录
            datadictService.listDrug().then(function(list){
                $scope.dictDrug = list;
            })
            //-----------其它字典
            $scope.dictGender = dataDicts.gender;
            $scope.dictClinictype = dataDicts.clinictype;
            $scope.dictVocation = dataDicts.vocation;
//            $scope.dictDictDrug = dataDicts.drugName;
            $scope.dictFrequency = dataDicts.drugFrequency;
	        $scope.dictUsagetype = dataDicts.drugUsage;
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
            
            //药品目录快捷搜索
            $(document).ready(function ($) {
                $.fn.typeahead.Constructor.prototype.blur = function () {
                    var that = this;
                    setTimeout(function () { that.hide() }, 250);
                };
                $('#item_name').typeahead({
                	source: function (query, process) {
	                    var results = _.map($scope.dictDrug, function (product) {
	                        return product.pinyin;
	                    });
	                    process(results);
	                },
	                
	                highlighter: function (pinyin) {
	                    var product = _.find($scope.dictDrug, function (p) {
	                        return p.pinyin == pinyin;
	                    });
	                    return product.itemname + " (" + product.itemcode + ")";
	                },
	                
	                updater: function (pinyin) {
	                    var product = _.find($scope.dictDrug, function (p) {
	                        return p.pinyin == pinyin;
	                    });
	                    $scope.drug.item_name = product.itemname;
                        $scope.drug.item_code = product.itemcode;
                        $scope.drug.item_spec = product.itemspec;
                        datadictService.listUnits(product.itemcode).then(function(list){
                            $scope.dictUnits = list;
                        });
                        $scope.$apply();
	                    return product.itemname;
	                }
                });
            });
            
            //处方列表
            $("#druglist").datagrid({
            	rownumbers:true,
	            singleSelect:true,
	            title:"处方",
	            columns:[[
	                {field:'item_name',title:'项目名称',width:100},
	                {field:'item_code',title:'项目编码',width:100},
	                {field:'item_spec',title:'规格',width:100},
	                {field:'units',title:'单位',width:100},
	                {field:'repetition',title:'处方付数',width:80},
	                {field:'amount_pertime',title:'单量',width:50},
	                {field:'amount',title:'总量',width:50},
	                {field:'pres_days',title:'天数',width:50},
	                {field:'frequency',title:'频率',width:100,formatter:function(value,row,index){
	                	var name = "";
	                    for(var i=0;i<$scope.dictFrequency.length;i++){
	                        var item = $scope.dictFrequency[i];
	                        if(item.id==value){
	                            name = item.text;
	                        }
	                    }
	                    return name;
	                }},
	                {field:'usage_type',title:'用法',width:80,formatter:function(value,row,index){
	                	var name = "";
	                    for(var i=0;i<$scope.dictUsagetype.length;i++){
	                        var item = $scope.dictUsagetype[i];
	                        if(item.id==value){
	                            name = item.text;
	                        }
	                    }
	                    return name;
	                }}
	            ]]
	        });
            
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
            $scope.calcTotal = function(){
            	$scope.drug.amount = $scope.drug.repetition * $scope.drug.amount_pertime;
            }
            //添加药品
            $scope.addDrug = function(){
            	if(checkValid()){
                    return;
                }
            	var drug = $scope.drug
                $scope.druglist.push(drug);
                $scope.num= $scope.druglist.length;
                $scope.drug = {};
                $("#druglist").datagrid({data:$scope.druglist});
            }
            $scope.clearDrug = function(){
                $scope.drug = {};
            }
            $scope.delDrug = function(item){
	        	var i = $scope.hyper.druglist.indexOf(item);
	        	if(i>=0){
	        		$scope.hyper.druglist.splice(i,1);//----删除
	        	}
	        };
            //保存处方
            $scope.saveCharge = function(){
                if(checkValid1()){
                    return;
                }
                if(!$scope.drug.prescid || $scope.drug.prescid==0){
					LocalDBService.objectStore("OUTP_PRESC_DETAIL")
					.count()
					.then(function(num){
						$scope.drugMax = num;
					},function(){
						$.messager.alert(dataDicts.alertTitle,'取记录数错误');
					})
					.then(function(){
						saveOne();
					});
				}else{
					saveOne();
				}
            };
            
            function saveOne(){
            	for(var p in $scope.druglist){
            		$scope.drug = $scope.druglist[p];
            		if($scope.drug.prescid){
            			$scope.drugMax = $scope.drug.prescid;
            		}else{
            			$scope.drugMax += 1;
            		}
					$scope.drug.prescid = $scope.drugMax;
					$scope.drug.crtime = getDT("T");
					$scope.drug.casehistoryid = $scope.record.casehistoryid//病历编号
					$scope.drug.icpcode =  $rootScope.currentUser.icpcode;
					$scope.drug.cruser =  $rootScope.currentUser.userid;//-----当前用户
					LocalDBService.objectStore("OUTP_PRESC_DETAIL")
						.upsert($scope.drug)
						.then(function(result){
							if(result==$scope.druglist.length){
								$.messager.alert(dataDicts.alertTitle,"保存成功");
							}
						},function(result){
							$.messager.alert(dataDicts.alertTitle,"保存失败:"+result);
						});
                }
            }
            //检查校验项目
            function checkValid(){
                var bHasInvalidElm = false;
                var warning = '';
                var nInvalidCount = 0;
                if($scope.frmAction.item_name.$error.required){
                    warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>用药名称</font>]" + "<br>"; 
                    bHasInvalidElm = true;
                };
                if($scope.frmAction.item_spec.$error.required){
                    warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>规格</font>]" + "<br>"; 
                    bHasInvalidElm = true;
                };
                if($scope.frmAction.units.$error.required||$scope.frmAction.units.$modelValue==null){
                    warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>单位</font>]" + "<br>"; 
                    bHasInvalidElm = true;
                };
                if($scope.frmAction.repetition.$error.required){
                    warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>处方付数</font>]" + "<br>"; 
                    bHasInvalidElm = true;
                };
                if($scope.frmAction.amount_pertime.$error.required){
                    warning += (++nInvalidCount) + '.' + "请选择[<font color='red'>单量</font>]" + "<br>"; 
                    bHasInvalidElm = true;
                };
                if($scope.frmAction.pres_days.$error.required){
                    warning += (++nInvalidCount) + '.' + "请选择[<font color='red'>天数</font>]" + "<br>"; 
                    bHasInvalidElm = true;
                };
                if($scope.frmAction.frequency.$error.required){
                    warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>频率</font>]" + "<br>"; 
                    bHasInvalidElm = true;
                };
                if($scope.frmAction.usage_type.$error.required){
                    warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>用法</font>]" + "<br>"; 
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
            			$scope.record.jzname.focus();
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