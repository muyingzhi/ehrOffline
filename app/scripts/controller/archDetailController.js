console.log("archDetailController...");
define(['controller/controllers','dictsConstant','directives/easyCombobox',
    'directives/radioGender',
    'directives/radioPaytype',
    'directives/radioNothave',
    'directives/checkboxHypersuses',
    'directives/checkboxUndress',
    'directives/checkboxDiscomname',
    'directives/checkboxDeformity',
    'directives/selectArchStatus',
    'services/DataDictService',
    'services/SpellService',
    'directives/hysDatebox'
    ],function(app){
    app.controller("archDetailController",['$rootScope','$scope','$routeParams','$indexedDB','dataDicts','DataDictService','SpellService'
        ,function($rootScope,$scope,$routeParams,LocalDBService,dataDicts,datadictService,spellService){
            //----------读取参数
            var id = $routeParams.id;
            //---------设置顶端菜单
	        $rootScope.topNav = [
		        {
		            text:"返回",iconClass:"glyphicon-circle-arrow-left",url:"#/archlist/"+id
		        }
            ];
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
            //$scope.dictDoctor = dataDicts.dictDoctor;
            //----机构
            datadictService.listTGOV().then(function(list){
                $scope.dictTgov = list;
            })
            //-----------其它字典
            $scope.dictArchstatus = dataDicts.archstatus;
            $scope.dictBloodtype= dataDicts.bloodtype;
            $scope.dictBloodRH= dataDicts.bloodRH;
            $scope.dictResidenttype = dataDicts.residenttype;
            $scope.dictNation = dataDicts.nation;
            $scope.dictEducation = dataDicts.education;
            $scope.dictVocation = dataDicts.vocation;
            $scope.dictMarriage = dataDicts.marriage;
            $scope.dictMedicaretype = dataDicts.medicaretype;
            $scope.opsType = [{text:"手术",id:"arch_ss_1"},{text:"外伤",id:"arch_ss_2"},{text:"输血",id:"arch_ss_3"}];
            $scope.dictFamilyrelation = [{text:"父辈",id:"HR202_10"},{text:"祖辈",id:"HR202_11"},{text:"后辈",id:"HR202_12"}];
            $scope.dictDis = [{text:"高血压",id:"HR202_10"},{text:"糖尿病",id:"HR202_11"},{text:"脑卒中",id:"HR202_12"}];
	        //--------默认
            var today = new Date();
            var todayStr = today.getFullYear()+'-'+(today.getMonth()+1)+"-"+today.getDate();
	        $scope.arch = {
                archid:'',
                birthday : '1977-01-01',
                arch_basicinfoid : "0",
	            gender:"HR481_1",
                education : 'HR206_4',
                medicare_type : "HR400_3",
                build_date : getDT(),
                archstatus:'HR270_2',//---档案状态：活动
                opslist : [],
                familydislist:[]
	        };
            $scope.ops = {};
            $scope.familydisease={};
            $scope.setNameSpell = function(){
                var fullname = $scope.arch.fullname;     
                var spell = spellService.makeSpell(fullname);
                $scope.arch.namepinyincode = spell;
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
			        $scope.arch.birthday = birthday;
			        //searchmedicardno(idno);
			        //------------性别判断
                    if(idno.length==15){
				        if(idno.substr(14,14)%2 == 1){
				            $scope.arch.gender =  'HR481_1';
				        }else{
                            $scope.arch.gender =  'HR481_2';
				        }
				    }else if(idno.length==18){
				        if(idno.substr(16,16).substr(0,1)%2 == 1){
                            $scope.arch.gender =  'HR481_1';
				        }else{
                            $scope.arch.gender =  'HR481_2';
				        }
				    }
			    }
            }
            $scope.addOps = function(){
                if(!$scope.arch.opslist)$scope.arch.opslist=[];
                var ops = {};
                
                if(!$scope.ops.type_code){
                    $.messager.alert(dataDicts.alertTitle,'"类型"未选择');
                    return;
                }
                //----------属性复制
                ops.type_code = $scope.ops.type_code.id;
                ops.type_name = $scope.ops.type_name;
                ops.hospital = $scope.ops.hospital;
                ops.happend_time=$scope.ops.happend_time;
                //--------未显示的内容赋值
                ops.opsid= "";
                ops.arch_id  = "";
                ops.archiveid= "";
                ops.crtime = todayStr;//
                ops.cruser = $rootScope.currentUser.userid;//
                ops.icpcode= $rootScope.currentUser.icpcode;
                ops.icpname= $scope.arch.icpname;
                
                $scope.arch.opslist.push(ops);
                $scope.ops = {};
            };
            $scope.delOps = function(item){
                var i = $scope.arch.opslist.indexOf(item);
                if(i>=0){
                    $scope.arch.opslist.splice(i,1);//----删除
                }
            }
            $scope.addFamilyDisease = function(){
                if(!$scope.arch.familydislist)$scope.arch.familydislist=[];
                
                if(!$scope.familyDisease.relationtoself){
                    $.messager.alert(dataDicts.alertTitle,'"与本人关系"未选择');
                    return;
                }
                var dis = {};
                //-------属性复制
                dis.relationtoself = $scope.familyDisease.relationtoself;
                dis.disease = $scope.familyDisease.disease;
                dis.remark = $scope.familyDisease.remark;
                //--------未显示的内容赋值
                dis.familydiseaseid= "";
                dis.arch_id  = "";
                dis.archiveid= "";
                dis.crtime= todayStr;//
                dis.cruser= $rootScope.currentUser.userid;//
                dis.icpcode= $rootScope.currentUser.icpcode;
                dis.icpname= $scope.arch.icpname;
                //-----------
                $scope.arch.familydislist.push(dis);
                $scope.familyDisease = {};
            };
            $scope.delFamilyDisease = function(item){
                var i = $scope.arch.familydislist.indexOf(item);
                if(i>=0){
                    $scope.arch.familydislist.splice(i,1);//----删除
                }
            };
            $scope.$watch("arch.street",function(newvalue){
                //----村(居)委会
                if(!newvalue)return;
                datadictService.listResident(newvalue).then(function(list){
                    $scope.dictResident = list;
                })
            })
            //----------读取一个档案
            LocalDBService.objectStore("EHEALTH_ARCH_BASEINFO").find(id)
                .then(function(data){
                    if(data){
                        $scope.arch = data;
                    }else{
                    }
                },function(error){
                    $.messager.alert(dataDicts.alertTitle,error);
                });
            $scope.saveArch = function(){
                if(checkValid()){
                    return;
                }
                if(!$scope.arch.arch_basicinfoid || $scope.arch.arch_basicinfoid==0){
                    LocalDBService.objectStore("EHEALTH_ARCH_BASEINFO")
                    .count()
                    .then(function(num){
                        $scope.arch.arch_basicinfoid = (num + 1).toString();
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
                $scope.arch.storeSign = "1";
                $scope.arch.crtime = getDT("T");
                $scope.arch.icpcode =  $rootScope.currentUser.icpcode;
                $scope.arch.cruser =  $rootScope.currentUser.userid;//-----当前用户
                LocalDBService.objectStore("EHEALTH_ARCH_BASEINFO")
                    .upsert($scope.arch)
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
                if($scope.frmAction.namepinyincode.$error.required){
                    warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>拼音</font>]" + "<br>"; 
                    bHasInvalidElm = true;
                };
                if($scope.frmAction.street.$error.required){
                    warning += (++nInvalidCount) + '.' + "请选择[<font color='red'>乡镇(街道)</font>]" + "<br>"; 
                    bHasInvalidElm = true;
                };
                if($scope.frmAction.residentcommittee.$error.required){
                    warning += (++nInvalidCount) + '.' + "请选择[<font color='red'>村(居)委会</font>]" + "<br>"; 
                    bHasInvalidElm = true;
                };
                if($scope.frmAction.duty_doctor.$error.required){
                    warning += (++nInvalidCount) + '.' + "请选择[<font color='red'>责任医生</font>]" + "<br>"; 
                    bHasInvalidElm = true;
                };
                if($scope.frmAction.archstatus.$error.required){
                    warning += (++nInvalidCount) + '.' + "请选择[<font color='red'>档案状态</font>]" + "<br>"; 
                    bHasInvalidElm = true;
                };
                if($scope.frmAction.cruser.$error.required){
                    warning += (++nInvalidCount) + '.' + "请选择[<font color='red'>建档人</font>]" + "<br>"; 
                    bHasInvalidElm = true;
                };
                if($scope.frmAction.icpcode.$error.required){
                    warning += (++nInvalidCount) + '.' + "请选择[<font color='red'>档案管理机构</font>]" + "<br>"; 
                    bHasInvalidElm = true;
                };
                if($scope.frmAction.birthday.$error.required){
                    warning += (++nInvalidCount) + '.' + "请填写[<font color='red'>出生日期</font>]" + "<br>"; 
                    bHasInvalidElm = true;
                };
                if(warning){
                    $.messager.alert(dataDicts.alertTitle,warning);
                }
                return bHasInvalidElm;
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