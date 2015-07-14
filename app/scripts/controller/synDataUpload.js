define(['controller/controllers',
    'services/InterChangeService',
    'services/SysConfigService',
    'dictsConstant'],function(app){
    app.controller("synDataUpload"
                ,['$q','$rootScope','$scope','$routeParams','dataDicts','$indexedDB','InterChangeService','SysConfigService'
        ,function($q,$rootScope,$scope,$routeParams,dataDicts,$indexedDB,interChangeService,sysConfigService){
            //---------设置顶端菜单
            $rootScope.topNav = [];
            $scope.dbInfo ={name:"",version:"",stores:[]};//---进度显示的内容
            $scope.userid=$rootScope.currentUser.userid;//-----当前用户
            //------初始化，获取indexedDB信息
            $indexedDB.dbInfo().then(function(result){
                $scope.dbInfo = {
                    name : result.name,
                    version : result.version,
                    stores : []
                    };
                for(var i=0;i<result.objectStores.length;i++){
                    var store = result.objectStores[i];
                    var dbStore = $indexedDB.objectStore(store.name);
                    var count = dbStore.count();//---记录数
                    var text = "",type="",aid="";
                    switch(store.name){
                        case "EHEALTH_ARCH_BASEINFO":
                            text = "健康档案";type="2";
                            break;
                        case "EHEALTH_ARCH_HEALTHCHECKA":
                            text = "健康体检";type="11";aid = "arch_id";
                            break;
                        case "EHEALTH_DIS_DMVISIT":
                            text = "糖尿病随访";type="7";aid = "archid";
                            break;
                        case "EHEALTH_DIS_HYPERTENSIONVISIT":
                            text = "高血压随访";type="8";aid = "archid";
                            break;
                        case "EHEALTH_DIS_SCHIZOPHRENIAVISIT":
                            text = "重性精神病随访";type="92";aid = "archid";
                            break;
                        case "EHEALTH_ZY_VISIT":
                            text = "中医体质管理";type="12";aid = "archid";
                            break;
                        case "EHEALTH_KID_BABYVISITSRECORD":
                            text = "儿童首次随访";type="51";aid = "archid";
                            break;
                        case "EHEALTH_KID_BABYCHECKRECORD":
                            text = "0~3岁儿童随访";type="52";aid = "archid";
                            break;
                        case "EHEALTH_KID_KIDCHECKRECORD":
                            text = "3岁及以上儿童随访";type="54";aid = "archid";
                            break;
                        case "EHEALTH_LADY_FIRSTCHECK":
                            text = "产前首次检查";type="61";aid = "archid";
                            break;
                        case "EHEALTH_LADY_FETIFEROUSCHECK":
                            text = "产前检查";type="62";aid = "archid";
                            break;
                        case "EHEALTH_LADY_VISITS":
                            text = "产后访视";type="63";aid = "archid";
                            break;
                        case "EHEALTH_LADY_VISIT42DAYS":
                            text = "产后42天访视";type="64";aid = "archid";
                            break;
                        case "EHEALTH_IMMU_INOCUCARD":
                            text = "预防接种";type="41";aid = "archid";
                            break;
                        case "EHEALTH_USER_HEALTHEDUACTION":
                            text = "健康教育活动";type="42";
                            break;
                        case "EHEALTH_SANIT_REPORTLIST":
                            text = "卫生监督协管信息报告登记表";type="44";
                            break;
                        case "EHEALTH_SANIT_PATROLLIST":
                            text = "卫生监督协管巡查登记表";type="45";
                            break;
                        default:
                            continue;
                    }
                    $scope.dbInfo.stores.push( {
                        text:text,
                        name:store.name,
                        keyPath : store.keyPath ,
                        rowcount : count ,
                        progress: 0,
                        num:0,
                        db: dbStore,
                        type:type,
                        aid:aid
                    });
                }
            });
            //--------上传函数
            $scope.upload = function(){
                //-----------显示信息清零
                $scope.uploadStore = "开始上传...";
                $scope.uploadMessages = [];
                //----------进度清零
                for(var i=0;i<$scope.dbInfo.stores.length;i++){
                    var store = $scope.dbInfo.stores[i];
                    store.progress = 0;
                    store.num = 0;
                }
                //-----------健康档案基本信息的上传，是通过数组顺序逐个完成，完成一个记录后，then()中继续调用
                //-------同一函数uploadArchBasicinfo
                $indexedDB.objectStore("EHEALTH_ARCH_BASEINFO").getAll().then(function(list){
                    uploadArchBasicinfo(0,list);
                });
                //-------非公共卫生数据上传
                uploadOtherInfo();
            }
            /*
             * 健康档案信息上传，基本信息传完后再传其他随访
             * index ,上传哪一个
             * list  基本信息数据列表
             */
            function uploadArchBasicinfo(index,list){
                var rowcount = list.length;
                var arch = list[index],oldarch = clone(arch);
                var store= findStoreByType('2');
                var isOld = true;
                if(index>=rowcount){
                    $scope.uploadStore += "上传完成";
                    return;
                }else{
                    $scope.uploadStore += ".";
                }
                if(arch.storeSign!="1"){
                    //----------没有修改过的
                    index++
                    //----提示和进度
                    $scope.uploadMessages.push(store.text +"("+oldarch.arch_basicinfoid+") "+arch.fullname+">未修改不上传");
                    var progress = Math.round((index)/rowcount * 100);
                    
                    if(store.progress < progress){
                        store.progress = progress;
                    };
                    //----随访
                    return uploadAllFollow(oldarch,oldarch.arch_basicinfoid).then(function(){
                        //---下一个档案上传
                        uploadArchBasicinfo(index,list);
                    });
                    
                }
                if(arch.manageinfo){//-------去掉管理控制说明
                    arch.manageinfo = undefined;
                }
                arch.storeSign=undefined;//----去掉修改标志
                if(!(arch.isOld && arch.isOld=="1")){//-------新增档案，上传不要物理id
                    //-----
                    arch.arch_basicinfoid="";
                    arch.archid="";
                    arch.archiveno="";
                    isOld = false;
                }
                arch.isOld = undefined;//----去掉老记录标志
                //--------------按平台交易要求转字段格式
                arch.birthday   = dt2dtStr(arch.birthday);
                arch.build_date = dt2dtStr(arch.build_date);
                arch.crtime     = dt2dtStr(arch.crtime);
                //-----------手术转换
                if(arch.opslist){
                    if(angular.isArray(arch.opslist) && arch.opslist.length>0){
                        for(var i=0;i<arch.opslist.length;i++){
                            var ops = arch.opslist[i];
                            ops.$$hashKey = undefined;
                            ops.crtime = dt2dtStr(ops.crtime);
                            ops.happend_time = dt2dtStr(ops.happend_time);
                        }
                    }else{
                        arch.opslist = undefined;
                    }
                }
                //-----------家族病史转换
                if(arch.familydislist){
                    if(angular.isArray(arch.familydislist) && arch.familydislist.length>0){
                        for(var i=0;i<arch.familydislist.length;i++){
                            var dis = arch.familydislist[i];
                            dis.$$hashKey = undefined;
                            dis.crtime = dt2dtStr(dis.crtime);
                        }
                    }else{
                        arch.familydislist = undefined;
                    }
                }
                //--------------调用协议进行上传
                return interChangeService.serv21011006(arch,"2",$scope.userid,(index + 1)).then(function(result){
                    //----提示和进度
                    $scope.uploadMessages.push(store.text +"("+arch.arch_basicinfoid+") "+arch.fullname+">"+result.message);
                    var progress = Math.round((result.num)/rowcount * 100);
                    
                    if(store.progress < progress){
                        store.progress = progress;
                    };
                    if(result.state==0){
                        //------更新档案物理ID(先添加，再删除）
                        var oldKeyid = oldarch.arch_basicinfoid;
                        oldarch.arch_basicinfoid = result.keyid;//--物理id
                        oldarch.archid = result.archid;   //----档案号
                        oldarch.archiveno = result.archiveno;//----纸质档案号
                        
                        oldarch.isOld = "1";
                        oldarch.storeSign= "0";
                        //---------改变过id的数据保存(先添加，再删除）
                        store.db.modifyByKey(oldarch,oldKeyid).then(function(newkey){
                            uploadAllFollow(oldarch,oldKeyid).then(function(){
                                //---下一个档案上传
                                uploadArchBasicinfo(result.num,list);
                            });
		                    
                        },function(result){
                            console.log(result)
                        });
                    }else{
                        //---下一个档案上传
                        uploadArchBasicinfo(result.num,list);
                    }
                }); 
            }
            function uploadAllFollow(arch,oldaid){
                //----相关随访
                return getFollow(arch,'11',oldaid).then(function(list){//---体检
                    uploadFollow(0,list,'11').then(function(n){
                    });
                }).then(function(){
                    getFollow(arch,'8',oldaid).then(function(list){//---高血压
                        uploadFollow(0,list,'8').then(function(n){
                        });
                    });
                }).then(function(){
                    getFollow(arch,'7',oldaid).then(function(list){//---糖尿病
                        uploadFollow(0,list,'7').then(function(n){});
                    });
                }).then(function(){
                    getFollow(arch,'92',oldaid).then(function(list){//重性精神疾病
                        uploadFollow(0,list,'92').then(function(n){});
                    });
                }).then(function(){
                    getFollow(arch,'12',oldaid).then(function(list){//--中医体质管理
                        uploadFollow(0,list,'12').then(function(n){});
                    });
                }).then(function(){
                    getFollow(arch,'51',oldaid).then(function(list){//--儿童首次随访
                        uploadFollow(0,list,'51').then(function(n){});
                    });
                }).then(function(){
                    getFollow(arch,'52',oldaid).then(function(list){//--0~3岁儿童
                        uploadFollow(0,list,'52').then(function(n){});
                    });
                }).then(function(){
                	getFollow(arch,'54',oldaid).then(function(list){//3岁及以上儿童
                		uploadFollow(0,list,'54').then(function(n){});
                	});
                }).then(function(){
                	getFollow(arch,'61',oldaid).then(function(list){//产前首次检查
                		uploadFollow(0,list,'61').then(function(n){
                			getFollow(arch,'62',oldaid).then(function(list){//产前检查
                        		uploadFollow(0,list,'62').then(function(n){});
                        	});
                			getFollow(arch,'63',oldaid).then(function(list){//产后访视
                        		uploadFollow(0,list,'63').then(function(n){});
                        	});
                			getFollow(arch,'64',oldaid).then(function(list){//产后42天访视
                        		uploadFollow(0,list,'64').then(function(n){});
                        	});
                		});
                	});
                }).then(function(){
                	getFollow(arch,'41',oldaid).then(function(list){//预防接种
                		uploadFollow(0,list,'41').then(function(n){});;
                	});
                }).then(function(){
                	console.log("end.......");
                })
            }
            //获得和档案无关的要上传列表
            function uploadOtherInfo(){                
            	//----获得要上传的列表
                return getFollows('42').then(function(list){//---健康教育活动检
                    uploadFollows(0,list,'42').then(function(n){
                    });
                }).then(function(){
                    getFollows('44').then(function(list){//---卫生监督协管信息报告登记表
                        uploadFollows(0,list,'44').then(function(n){
                        });
                    });
                }).then(function(){
                    getFollows('45').then(function(list){//---卫生监督协管巡查登记表
                        uploadFollows(0,list,'45').then(function(n){
                        });
                    });
                })
            }
            
            //------获取档案的随访
            function getFollow(arch,type,aid){
                var store = findStoreByType(type);
                var aidname = store.aid;  //----“档案物理id”字段的名称
                var myQuery = $indexedDB.queryBuilder().$index("archid_idx").$eq(aid);//-----------检索条件;要求各store中“档案物理id”索引名都是archid_idx
                var d = $q.defer();
                var list = [];
                store.db.each(function(cursor){
                    if(cursor){
                        var record = cursor.value;
                        //---------新建的档案在上传后，物理id发生了变化，这里随访等跟着更新；
                        record["archiveid"]= arch.archid;          
                        record[aidname]    = arch.arch_basicinfoid;
                        list.push(record);
                        
                        cursor.continue();
                    }else{
                        if(type=="8" && list.length==3){
                            type="8";
                        }
                        console.log(type+"-list:"+list.length);
                        d.resolve(list);
                    }
                },myQuery);
                return d.promise;
            }
            
            //------获取和档案无关的记录
            function getFollows(type){
                var store = findStoreByType(type);
                var d = $q.defer();
                store.db.getAll().then(function(list){
             		if(list){
             			d.resolve(list);
             		}
                 },function(error){
                     $.messager.alert(dataDicts.alertTitle,error);
                 });
                return d.promise;
            }
            
            function uploadFollow(index,list,followType){
                var d = $q.defer();
                if(index>=list.length){
                    console.log(followType + "-over");
                    d.resolve(0);
                }else{
	                var record = list[index];
	                var oldrecord = clone(record);//--------clone原始记录
	                var store = findStoreByType(followType);
                    //
                    var aid = record.arch_id;
                    if(!aid){aid = record.archid;}
                    console.log(aid + ":"+followType + "->" + index+"/"+list.length);
                    //
	                store.num++//总体进度
	                index++;//------标记第几个
	                if(record && record.storeSign=='1'){
	                    //-------修改保存过的才上传-----------------------
	                    record.storeSign= undefined;
	                    if(record.manageinfo){   //-------去掉管理控制说明
	                        record.manageinfo = undefined;
	                    }
	                    if(!(record.isOld && record.isOld=="1")){
	                        //-------新增，上传不要物理id
	                        record[store.keyPath] = "";
	                    }
	                    record.isOld = undefined;
	                    //-----------按协议转换
	                    interChangeValue(record,followType);
		                //-----------调用协议
	                    if(followType==41){
	        	            //alert(JSON.stringify(record));
	                    }
		                var f = interChangeService.serv21011006(record,followType,$scope.userid,index)
		                .then(function(result){
		                    $scope.uploadMessages.push(store.text  + "("+aid+"->"+oldrecord[store.keyPath]+")>"+result.message);
		                    var progress = Math.round((store.num)/store.rowcount.$$v * 100);
		                    if(store.progress < progress){
		                        store.progress = progress;
		                    };
	                        //-------原记录的id
	                        var oldid = oldrecord[store.keyPath];
		                    //------------新随访的，根据返回的物理号更新数据
		                    if(result.state==0){
	                            //---提交成功，
		                        oldrecord.isOld = "1";
		                        oldrecord.storeSign= "0";
	                            if(result.keyid){
	                                oldrecord[store.keyPath] = result.keyid;//----根据平台返回复制
	                            }
	                        }
	                        //---------失败时也要修改保存，因为新建档案已经上传成功并修改了物理id，这里一定要提交
	                        store.db.modifyByKey(oldrecord,oldid);//---提交存储
                            console.log(aid + ":"+oldrecord[store.keyPath]+":上传:"+followType);
		                    uploadFollow(index,list,followType);
		                });
                        d.resolve(f);
	                }else{
                        console.log(aid + "跳过:"+followType);
	                    $scope.uploadMessages.push(store.text  + "("+record[store.keyPath]+")>未变化不上传");
	                    var progress = Math.round((store.num)/store.rowcount.$$v * 100);
	                    if(store.progress < progress){
	                        store.progress = progress;
	                    };
	                    d.resolve(uploadFollow(index,list,followType));
	                }
                }
                return d.promise;
            };
            function uploadFollows(index,list,followType){
                var d = $q.defer();
                if(index>=list.length){
                    console.log(followType + "-over");
                    d.resolve(0);
                }else{
	                var record = list[index];
	                var oldrecord = clone(record);//--------clone原始记录
	                var store = findStoreByType(followType);
                    console.log(oldrecord[store.keyPath] + ":"+followType + "->" + index+"/"+list.length);
                    //
	                store.num++//总体进度
	                index++;//------标记第几个
	                if(record && record.storeSign=='1'){
	                    //-------修改保存过的才上传
	                    record.storeSign= undefined;
	                    if(record.manageinfo){   //-------去掉管理控制说明
	                        record.manageinfo = undefined;
	                    }
	                    if(!(record.isOld && record.isOld=="1")){
	                        //-------新增，上传不要物理id
	                        record[store.keyPath] = "";
	                    }
	                    record.isOld = undefined;
	                    //-----------按协议转换
	                    interChangeValue(record,followType);
		                //-----------调用协议
		                var f = interChangeService.serv21011015(record,followType,$scope.userid,index)
		                .then(function(result){
		                    $scope.uploadMessages.push(store.text  + "("+oldrecord[store.keyPath]+")>"+result.message);
		                    var progress = Math.round((store.num)/store.rowcount.$$v * 100);
		                    if(store.progress < progress){
		                        store.progress = progress;
		                    };
	                        //-------原记录的id
	                        var oldid = oldrecord[store.keyPath];
		                    //------------新随访的，根据返回的物理号更新数据
		                    if(result.state==0){
	                            //---提交成功，
		                        oldrecord.isOld = "1";
		                        oldrecord.storeSign= "0";
	                            if(result.keyid){
	                                oldrecord[store.keyPath] = result.keyid;//----根据平台返回复制
	                            }
	                        }
	                        store.db.modifyByKey(oldrecord,oldid);//---提交存储
                            console.log(oldrecord[store.keyPath]+":上传:"+followType);
		                    uploadFollows(index,list,followType);
		                });
                        d.resolve(f);
	                }else{
                        console.log(record[store.keyPath] + "跳过:"+followType);
	                    $scope.uploadMessages.push(store.text  + "("+record[store.keyPath]+")>未变化不上传");
	                    var progress = Math.round((store.num)/store.rowcount.$$v * 100);
	                    if(store.progress < progress){
	                        store.progress = progress;
	                    };
	                    d.resolve(uploadFollows(index,list,followType));
	                }
                }
                return d.promise;
            };
            //--------------按平台交易要求转字段格式
            function interChangeValue(record,type){
                if(type=="11" || type=='3'){
                    record.record_date = dt2dtStr(record.record_date);
                    if(record.crtime){
                        record.crtime = dt2dtStr(record.crtime);
                    }else{
                        record.crtime = record.record_date;
                    }
                    if(record.hospitallist){//---住院史节点
                        for(var i=0;i<record.hospitallist.length;i++){
                            var one = record.hospitallist[i];
                            one.crtime   = dt2dtStr(one.crtime);
                            one.entertime= dt2dtStr(one.entertime);//入院日期
                            one.leavetime= dt2dtStr(one.leavetime);//出院日期
                            one.archiveid = record.archiveid;
                        }
                    }
                    if(record.homebedlist){//---家庭病床节点
                        for(var i=0;i<record.homebedlist.length;i++){
                            var one = record.homebedlist[i];
                            one.crtime = dt2dtStr(one.crtime);
                            one.buildtime = dt2dtStr(one.buildtime);//建床日期
                            one.canceltime= dt2dtStr(one.canceltime);//撤床日期
                            one.archiveid = record.archiveid;
                        }
                    }
                    if(record.druglist){//---主要用药情况节点
                        for(var i=0;i<record.druglist.length;i++){
                            var one = record.druglist[i];
                            one.crtime = dt2dtStr(one.crtime);
                            one.archiveid = record.archiveid;
                            if(!one.healthcheckaid){
                                one.healthcheckaid = "";
                            }
                        }
                    }
                    if(record.inocutelist){//---非规划接种史节点
                        for(var i=0;i<record.inocutelist.length;i++){
                            var one = record.inocutelist[i];
                            one.crtime = dt2dtStr(one.crtime);
                            one.vaccination_date= dt2dtStr(one.vaccination_date);//接种日期
                            one.archiveid = record.archiveid;
                        }
                    }
                    if(record.exposurelist){//---职业暴露列表节点
                        for(var i=0;i<record.exposurelist.length;i++){
                            var one = record.exposurelist[i];
                            one.crtime = dt2dtStr(one.crtime);
                            one.buildtime = dt2dtStr(one.buildtime);//建床日期
                            one.canceltime= dt2dtStr(one.canceltime);//撤床日期
                            one.archiveid = record.archiveid;
                        }
                    }
                    if(record.eniorcitizenlist){//---老年人专项体检列表
                        for(var i=0;i<record.eniorcitizenlist.length;i++){
                            var one = record.eniorcitizenlist[i];
                            one.idiographdate= dt2dtStr(one.idiographdate);
                            one.inquiredate= dt2dtStr(one.inquiredate);
                            one.checkdate= dt2dtStr(one.checkdate);
                            one.crtime= dt2dtStr(one.crtime);
                            one.send_time= dt2dtStr(one.send_time);
                            one.archiveid = record.archiveid;
                        }
                    }
                }else if(type=="7"){//----------------糖尿病
                    record.inquiredate = dt2dtStr(record.inquiredate);
                    record.bookingdate = dt2dtStr(record.bookingdate);
                    record.crtime = dt2dtStr(record.crtime);
                    record.labdate = dt2dtStr(record.labdate);
                    if(record.druglist){//---用药信息节点
                        for(var i=0;i<record.druglist.length;i++){
                            var one = record.druglist[i];
                            one.crtime = dt2dtStr(one.crtime);
                            one.archiveid = record.archiveid;
                            if(!one.healthcheckaid){
                                one.healthcheckaid = "";
                            }
                        }
                    }
                }else if(type=="8"){//----------------高血压
                    record.inquiredate = dt2dtStr(record.inquiredate);
                    record.bookingdate = dt2dtStr(record.bookingdate);
                    record.crtime = dt2dtStr(record.crtime);
                    if(record.druglist){//---用药信息节点
                        for(var i=0;i<record.druglist.length;i++){
                            var one = record.druglist[i];
                            one.crtime = dt2dtStr(one.crtime);
                            one.archiveid = record.archiveid;
                            if(!one.healthcheckaid){
                                one.healthcheckaid = "";
                            }
                        }
                    }
                }else if(type=="92"){//---------------重性精神疾病
                    record.inquiredate = dt2dtStr(record.inquiredate);
                    record.bookingdate = dt2dtStr(record.bookingdate);
                    record.crtime = dt2dtStr(record.crtime);
                    record.lhospitaldate = dt2dtStr(record.lhospitaldate);
                    if(record.druglist){//---用药信息节点
                        for(var i=0;i<record.druglist.length;i++){
                            var one = record.druglist[i];
                            one.crtime = dt2dtStr(one.crtime);
                            one.archiveid = record.archiveid;
                            if(!one.healthcheckaid){
                                one.healthcheckaid = "";
                            }
                        }
                    }
                }else if(type=="12"){//---------------中医体质管理
                    record.inquiredate = dt2dtStr(record.inquiredate);
                    record.crtime = dt2dtStr(record.crtime);
                }else if(type=="51"){//---------------0~3岁儿童随访
	                 record.jdillsiftdate= dt2dtStr(record.jdillsiftdate);
	                 record.bbtillsiftdate= dt2dtStr(record.bbtillsiftdate);
	                 record.othreillsiftdate= dt2dtStr(record.othreillsiftdate);
	               	 record.currvisitstime = dt2dtStr(record.currvisitstime);//随访时间
	                 record.nextvisitstime = dt2dtStr(record.nextvisitstime);//下次随访时间
	                 record.birthday=dt2dtStr(record.birthday);
	                 record.crtime = dt2dtStr(record.crtime);
                }else if(type=="52"){//---------------0~3岁儿童随访
                	 record.visittime = dt2dtStr(record.visittime);//随访时间
                     record.nextvisitstime = dt2dtStr(record.nextvisitstime);//下次随访时间
                     record.crtime = dt2dtStr(record.crtime);
                }else if(type=="54"){//---------3岁及以上儿童随访
                	record.visittime= dt2dtStr(record.visittime);
                	record.nextvisitdate = dt2dtStr(record.nextvisitdate);//下次随访时间
                    record.crtime = dt2dtStr(record.crtime);
                }else if(type=="61"){//---------产前首次检查
                	record.booking_date=dt2dtStr(record.booking_date);
                	record.crtime=dt2dtStr(record.crtime);
                	record.expected_childbirth=dt2dtStr(record.expected_childbirth);
                	record.last_menses=dt2dtStr(record.last_menses);
                	record.nextvisitdate=dt2dtStr(record.nextvisitdate);
                	//record.booking_date=dt2dtStr(record.booking_date);
                	
                	if(record.scoremainlist){//---高危主记录
                        for(var i=0;i<record.scoremainlist.length;i++){
                            var one = record.scoremainlist[i];
                            one.birthdate = dt2dtStr(one.birthdate);
                            one.crtime = dt2dtStr(one.crtime);
                            one.diagnosedate = dt2dtStr(one.diagnosedate);
                            one.regressdate = dt2dtStr(one.regressdate);
                            if(one.scoredetaillist){//---高危明细
                                for(var j=0;j<one.scoredetaillist.length;j++){
                                    var onee = one.scoredetaillist[j];
                                    onee.crtime = dt2dtStr(onee.crtime);
                                }
                            }
                        }	
                	}
                }else if(type=="62"){//---------产前检查
                	record.crtime = dt2dtStr(record.crtime);
                	record.checkdate = dt2dtStr(record.checkdate);
                	record.nextvisitdate = dt2dtStr(record.nextvisitdate);
                	if(record.scoremainlist){//---高危主记录
                        for(var i=0;i<record.scoremainlist.length;i++){
                            var one = record.scoremainlist[i];
                            one.birthdate = dt2dtStr(one.birthdate);
                            one.crtime = dt2dtStr(one.crtime);
                            one.diagnosedate = dt2dtStr(one.diagnosedate);
                            one.regressdate = dt2dtStr(one.regressdate);
                            if(one.scoredetaillist){//---高危明细
                                for(var j=0;j<one.scoredetaillist.length;j++){
                                    var onee = one.scoredetaillist[j];
                                    onee.crtime = dt2dtStr(onee.crtime);
                                }
                            }
                        }	
                	}
                }else if(type=="63"){//---------产后访视
                	record.checkdate = dt2dtStr(record.checkdate);
                	record.crtime = dt2dtStr(record.crtime);
                    record.nextvisitdate   = dt2dtStr(record.nextvisitdate);                	
                }else if(type=="64"){//---------产后42天访视
                	record.crtime = dt2dtStr(record.crtime);
                	record.visit_date = dt2dtStr(record.visit_date);
                }else if(type=="41"){//---------预防接种卡
                	record.birthday = dt2dtStr(record.birthday);
                	record.settletime = dt2dtStr(record.settletime);
                	record.crtime = dt2dtStr(record.crtime);
                	record.moveoutdate = dt2dtStr(record.moveoutdate);
                	record.builddate = dt2dtStr(record.builddate);
                	record.send_time = dt2dtStr(record.send_time);
                	if(record.inocunotelist){//---预防接种
                        for(var i=0;i<record.inocunotelist.length;i++){
                            var one = record.inocunotelist[i];
                            one.sinocudate = dt2dtStr(one.sinocudate);
                            one.inocudate = dt2dtStr(one.inocudate);
                            one.crtime = dt2dtStr(one.crtime);
                            one.validdate = dt2dtStr(one.validdate);
                            one.send_time = dt2dtStr(one.send_time);
                        }	
                	}
                }else if(type=="42"){//---------健康教育活动检
                	record.crtime = dt2dtStr(record.crtime);
                	record.edudate = dt2dtStr(record.edudate);
                	record.fillformdate = dt2dtStr(record.fillformdate);
                	record.send_time = dt2dtStr(record.send_time);
                	record.checkdate = dt2dtStr(record.checkdate);
                }else if(type=="44"){//---------卫生监督协管信息报告登记表
                	record.crtime = dt2dtStr(record.crtime);
                	record.discover_date = dt2dtStr(record.discover_date);
                	record.report_date = dt2dtStr(record.report_date);
                }else if(type=="45"){//---------卫生监督协管巡查登记表
                	record.crtime = dt2dtStr(record.crtime);
                	record.check_date = dt2dtStr(record.check_date);
                }
            }
            //--------$scope.dbInfo.stores中找到对应的store
            function findStoreByType(type){
                var rtnStore = null;
                for(var i=0;i<$scope.dbInfo.stores.length;i++){
                    var store = $scope.dbInfo.stores[i];
                    if(store.type==type){
                        rtnStore = store;
                    }
                }
                return rtnStore;
            }
            //-------日期或日期时间的字符串(yyyy-mm-dd hh:mm:ss)格式化为(yyyymmddhhmmss)
            function dt2dtStr(dt){
                var rtn="";
                if(!dt){
                    rtn = undefined;
                }else{
	                if(dt.length==10){
	                    rtn = dt.substr(0,4) + dt.substr(5,2) + dt.substr(8,2);
	                }else if(dt.length==19){
	                    rtn = dt.substr(0,4) + dt.substr(5,2) + dt.substr(8,2) + dt.substr(11,2)+dt.substr(14,2)+dt.substr(17,2);
	                }else{
	                    rtn = "("+dt+")"+"格式不符合要求.(应为yyyy-mm-dd 或 yyyy-mm-dd hh:mm:ss)";
	                }
                }
                return rtn;
            }
        }
    ]);
});