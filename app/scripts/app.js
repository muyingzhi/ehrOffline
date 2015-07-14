//----------要先load angular.js controller/controllers.js
console.log("app...");
define(['angular','controller/controllers','services/services','directives/directives','indexedDB'],function(angular){
    //--------------依赖controllers模块
    var ehrModule = angular.module("ehr",["controllers","services",'directives','xc.indexedDB']);
    ehrModule.config(function ($indexedDBProvider) {
        var dbProvider = $indexedDBProvider.connection('ehr')
            .upgradeDatabase(5, function(event, db, tx){
            var objStore = null;
            try{//-----------每次发行数据库版本，以下内容包裹在try中，当有更高级升级时，已有的结构所抛出的异常不会影响代码的执行，
                //------------从而达到任意客户端版本都可以升级到统一版面的效果
	            objStore = db.createObjectStore('EHEALTH_ARCH_BASEINFO', {keyPath: 'arch_basicinfoid'});
	            objStore.createIndex('fullname_idx', 'fullname', {unique: false});
	            objStore.createIndex('identityno_dx', 'identityno', {unique: false});
	            
	            objStore = db.createObjectStore('EHEALTH_DIS_HYPERTENSIONVISIT', {keyPath: 'hypertensionvisitid'});
	            objStore.createIndex('archid_idx', 'archid', {unique: false});
	            objStore.createIndex('inquiredate_idx', 'inquiredate', {unique: false});
	            
	            objStore = db.createObjectStore('EHEALTH_DIS_DMVISIT', {keyPath: 'dmvisitid'});
	            objStore.createIndex('archid_idx', 'archid', {unique: false});
	            
	            objStore = db.createObjectStore('EHEALTH_ZY_VISIT', {keyPath: 'elderlycmrid'});
	            objStore.createIndex('archid_idx', 'archid', {unique: false}); 
	            
	            objStore = db.createObjectStore('EHEALTH_ARCH_HEALTHCHECKA', {keyPath: 'healthcheckaid'});
	            objStore.createIndex('archid_idx', 'arch_id', {unique: false});
	            
	            objStore = db.createObjectStore('EHEALTH_DIS_SCHIZOPHRENIAVISIT', {keyPath: 'schizophreniavisitid'});
	            objStore.createIndex('archid_idx', 'archid', {unique: false});
	            
	            objStore = db.createObjectStore('T_GOVINFO', {keyPath: 'govcode'});
	            
	            objStore = db.createObjectStore('HYS_USER', {keyPath: 'platuserid'});
	            objStore.createIndex('staffid_idx', 'staffid', {unique: true});
	            
	            objStore = db.createObjectStore('PUBLIC_GOV_DICT', {keyPath: 'areacode'});
	            
	            objStore = db.createObjectStore('LOGIN_USER', {keyPath: 'platuserid'});
	            objStore.createIndex('staffid_idx', 'staffid', {unique: true});
	            
	            objStore = db.createObjectStore('EHEALTH_CURE_CASEHISTORY', {keyPath: 'casehistoryid'});
	            objStore.createIndex('fullname_idx', 'fullname', {unique: false});
	            
	            objStore = db.createObjectStore('OUTP_PRESC_DETAIL', {keyPath: 'prescid'});
	            objStore.createIndex('casehistory_idx', 'casehistoryid', {unique: false});
	            
	            objStore = db.createObjectStore('EHEALTH_DIS_ICD10CARD', {keyPath: 'icdcode'});
	            objStore.createIndex('pinyin_idx', 'pinyin', {unique: false});
	            objStore.createIndex('icdcode_idx', 'icdcode', {unique: false});
	            objStore.createIndex('icdname_idx', 'icdname', {unique: false});
	            
	            objStore = db.createObjectStore('DRUG_LIST_HOSPITAL', {keyPath: 'platcode'});
	            objStore.createIndex('spell_idx', 'spell', {unique: false});
	            objStore.createIndex('platcode_idx', 'platcode', {unique: false});
	            
            }catch(e){
            }
           try{
               objStore = db.createObjectStore('EHEALTH_ARCH_CHECKOFLK', {autoIncrement:true});
	           objStore.createIndex('numberofcase_idx', 'numberofcase', {unique: false});

               objStore = db.createObjectStore('HMSPERSONS', {autoIncrement:true});
	           objStore.createIndex('username_idx', 'username', {unique: false});
	           objStore.createIndex('numberofcase_idx', 'numberofcase', {unique: true});
	           
	           objStore = db.createObjectStore('SYS_CONFIG', {keyPath: 'configname'});
           }catch(e){
           }
           try{//zhao
        	   //
               objStore = db.createObjectStore('EHEALTH_KID_HEALTHCHECKSTANDAR', {keyPath: 'id'});
	           objStore.createIndex('birthyear_idx', 'birthyear', {unique: false});
	           objStore.createIndex('birhmonth_idx', 'birhmonth', {unique: false});
	           objStore.createIndex('gender_idx', 'gender', {unique: false});
	           //孕产妇随访
	           objStore = db.createObjectStore('EHEALTH_LADY_VISITS', {keyPath: 'visitsid'});
	           objStore.createIndex('archid_idx', 'archid', {unique: false});
	           //孕产妇42天随访
	           objStore = db.createObjectStore('EHEALTH_LADY_VISIT42DAYS', {keyPath: 'visit42daysid'});
	           objStore.createIndex('archid_idx', 'archid', {unique: false});
	           //孕产妇首次随访
        	   objStore = db.createObjectStore('EHEALTH_LADY_FIRSTCHECK', {keyPath: 'firstcheckid'});
	           objStore.createIndex('archid_idx', 'archid', {unique: false});
	           //孕产妇产前检查
        	   objStore = db.createObjectStore('EHEALTH_LADY_FETIFEROUSCHECK', {keyPath: 'fetiferouscheckid'});
	           objStore.createIndex('archid_idx', 'archid', {unique: false});
	           
	         //-------------------- kid    @author Qiyan
	           objStore = db.createObjectStore('EHEALTH_KID_BABYVISITSRECORD', {keyPath: 'babyvisitsrecordid'});
	           objStore.createIndex('archid_idx', 'archid', {unique: false});

	           objStore = db.createObjectStore('EHEALTH_KID_BABYCHECKRECORD', {keyPath: 'babycheckrecordid'});
	           objStore.createIndex('archid_idx', 'archid', {unique: false});

	           objStore = db.createObjectStore('EHEALTH_KID_KIDCHECKRECORD', {keyPath: 'kidcheckrecordid'});
	           objStore.createIndex('archid_idx', 'archid', {unique: false});
	           
	           //高危登记表
	           //objStore = db.createObjectStore('EHEALTH_LADY_SCOREMAIN', {keyPath: 'scoremainid'});
	           //objStore.createIndex('archid_idx', 'archid', {unique: false});
	           //高危得分明细
	           //objStore = db.createObjectStore('EHEALTH_KID_KIDCHECKRECORD', {keyPath: 'scoredetailid'});
	           //objStore.createIndex('scoremainid_idx', 'scoremainid', {unique: false});
	           
	           //预防接种
	           objStore = db.createObjectStore('EHEALTH_IMMU_INOCUCARD', {keyPath: 'immu_inocucardid'});
	           objStore.createIndex('archid_idx', 'archid', {unique: false});
	           objStore.createIndex('fullname_idx', 'fullname', {unique: false});
	           objStore.createIndex('guardian_idx', 'guardian', {unique: false});
	           objStore.createIndex('tel_idx', 'tel', {unique: false});
	           //健康教育活动
	           objStore = db.createObjectStore('EHEALTH_USER_HEALTHEDUACTION', {keyPath: 'healtheduactionid'});
	           objStore.createIndex('edutype_idx', 'edutype', {unique: false});
	           objStore.createIndex('eduobject_idx', 'eduobject', {unique: false});
	           //老年人生活自理能力
	           //objStore = db.createObjectStore('EHEALTH_DIS_ENIORCITIZEN', {keyPath: 'eniorcitizenid'});
	           //objStore.createIndex('archid_idx', 'archid', {unique: false});
	           //objStore.createIndex('healthcheckaid_idx', 'healthcheckaid', {unique: false});
	           //监督单位
	           objStore = db.createObjectStore('EHEALTH_SANIT_COMPANY', {keyPath: 'id'});
	           objStore.createIndex('compName_idx', 'comp_name', {unique: false});
	           objStore.createIndex('class_idx', 'class1', {unique: false});
	           objStore.createIndex('address_idx', 'address', {unique: false});
	           objStore.createIndex('identityno_idx', 'identityno', {unique: false});
	           //卫生监督协管信息报告登记表
	           objStore = db.createObjectStore('EHEALTH_SANIT_REPORTLIST', {keyPath: 'reportlistid'});
	           //卫生监督协管巡查登记表
	           objStore = db.createObjectStore('EHEALTH_SANIT_PATROLLIST', {keyPath: 'patrollistid'});
	           objStore.createIndex('company_id_idx', 'company_id', {unique: false});
	           //传染病登记表
	           objStore = db.createObjectStore('EHEALTH_DIS_INFECTIONCARD', {keyPath: 'infectioncardid'});
	           objStore.createIndex('fullname_idx', 'fullname', {unique: false});
	           objStore.createIndex('infectioncardid_idx', 'infectioncardid', {unique: false});
	           
           }catch(e){
           }
        });
    });
    return ehrModule;
});