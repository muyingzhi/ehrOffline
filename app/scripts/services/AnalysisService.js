define(['services/services',
    'services/XMLService'
], function(services) {
    services.service("AnalysisService", ['$rootScope', 'XMLService',
        function($rootScope, XMLService) {

            /*
                20140901_141008_410423201012119012|1|
                20140901_151008_410423201012119012|0|
                20140901_151018_410423201012119012|1|
                根据以上类型的字符串，返回json数组
            */
            this.getReportlistArr = function(strReport) {
                var reportlistArr = [];
                var reportArr = strReport.split("|");
                for (var i = 2; i <= reportArr.length; i = i + 2) {
                    var report = {};
                    report.dirName = trim(reportArr[i - 2]);
                    report.isEcg = trim(reportArr[i - 1]);

                    var nameArr = report.dirName.split("_");
                    report.datetime = dtStr2dt(nameArr[0] + nameArr[1]);
                    report.cardno = nameArr[2];

                    reportlistArr.push(report);
                };
                return reportlistArr;
            };
            // 返回json数据
            this.getHmsPerson = function(strUserbase) {
                var hmsperson = {};
                hmsperson.username = getValueByKey(strUserbase, "username");
                hmsperson.personid = getValueByKey(strUserbase, "personid");
                hmsperson.age = getValueByKey(strUserbase, "age");
                hmsperson.sex = getValueByKey(strUserbase, "sex");
                if (hmsperson.sex = "男") {
                    hmsperson.sex = "1";
                } else {
                    hmsperson.sex = "2";
                };
                hmsperson.birthday = getValueByKey(strUserbase, "birthday");
                hmsperson.phone = getValueByKey(strUserbase, "mobile");
                hmsperson.height = getValueByKey(strUserbase, "height");
                if (hmsperson.height == "0.0") {
                    hmsperson.height = "";
                };
                hmsperson.weight = getValueByKey(strUserbase, "weight");
                if (hmsperson.weight == "0.0") {
                    hmsperson.weight = "";
                };
                hmsperson.bloodtype = getValueByKey(strUserbase, "bloodtype");
                hmsperson.nation = getValueByKey(strUserbase, "nation");
                if (hmsperson.nation == 1) {
                    hmsperson.nation = "汉族";
                } else {
                    hmsperson.nation = "";
                };
                hmsperson.description = getValueByKey(strUserbase, "description");
                hmsperson.datatype = getValueByKey(strUserbase, "datatype");
                hmsperson.checktime = getValueByKey(strUserbase, "checktime");
                hmsperson.device = getValueByKey(strUserbase, "deviceid");
                hmsperson.bloodsugar = getValueByKey(strUserbase, "bloodsugar");
                hmsperson.address = getValueByKey(strUserbase, "address");

                return hmsperson;
            };
            // 返回json数据
            this.getCheckoflk = function(strXml) {
                var xmldom = XMLService.parseXml(strXml);
                var info = XMLService.selectSingleNode(xmldom, "cmdinfo");
                var checkoflk = {};
                var children = [];
                if (info) {
                    //---------ie与其它浏览器的差异
                    if (info.children) {
                        children = info.children;
                    } else {
                        children = info.childNodes; //ie的
                    }
                };
                for (var i = 0; i < children.length; i++) {
                    var node = children[i];
                    if (node.tagName == "user") {
                        checkoflk.cardno = node.textContent || node.text;
                    } else if (node.tagName == "date") {
                        checkoflk.checkdate = node.textContent || node.text;
                    } else if (node.tagName == "sys") {
                        checkoflk.sbp = node.textContent || node.text;
                    } else if (node.tagName == "dia") {
                        checkoflk.dbp = node.textContent || node.text;
                    } else if (node.tagName == "spo2") {
                        checkoflk.oximeter = node.textContent || node.text;
                        if (checkoflk.oximeter == '156' || checkoflk.oximeter == '0') {
                            checkoflk.oximeter = "";
                        };
                    } else if (node.tagName == "bloodsuger") {
                        checkoflk.glu = node.textContent || node.text;
                    } else if (node.tagName == "heartrate") {
                        checkoflk.fetalheart = node.textContent || node.text;
                    } else if (node.tagName == "pulserate") {
                        checkoflk.pulse = node.textContent || node.text;
                        if (checkoflk.pulse == "65436") {
                            checkoflk.pulse = "";
                        };
                    } else if (node.tagName == "height") {
                        checkoflk.height = node.textContent || node.text;
                        if (checkoflk.height == "0.0") {
                            checkoflk.height = "";
                        };
                    } else if (node.tagName == "weight") {
                        checkoflk.weight = node.textContent || node.text;
                        if (checkoflk.weight == "0.0") {
                            checkoflk.weight = "";
                        };
                    } else if (node.tagName == "temp") {
                        checkoflk.temp = node.textContent || node.text;
                    } else if (node.tagName == "mean") {
                        checkoflk.mean = node.textContent || node.text;
                    } else if (node.tagName == "ana1") {
                        checkoflk.anal = node.textContent || node.text;
                    } else if (node.tagName == "URO") {
                        checkoflk.ncg_ubg = node.textContent || node.text;
                        checkoflk.ncg_ubg.replace(/%20/g, "+");
                    } else if (node.tagName == "BLD") {
                        checkoflk.ncg_blo = node.textContent || node.text;
                        checkoflk.ncg_blo.replace(/%20/g, "+");
                    } else if (node.tagName == "BIL") {
                        checkoflk.ncg_bil = node.textContent || node.text;
                        checkoflk.ncg_bil.replace(/%20/g, "+");
                    } else if (node.tagName == "KET") {
                        checkoflk.ncg_ket = node.textContent || node.text;
                        checkoflk.ncg_ket.replace(/%20/g, "+");
                    } else if (node.tagName == "GLU") {
                        checkoflk.ncg_glu = node.textContent || node.text;
                        checkoflk.ncg_glu.replace(/%20/g, "+");
                    } else if (node.tagName == "PRO") {
                        checkoflk.ncg_pro = node.textContent || node.text;
                        checkoflk.ncg_pro.replace(/%20/g, "+");
                    } else if (node.tagName == "PH") {
                        checkoflk.ncg_ph = node.textContent || node.text;
                        checkoflk.ncg_ph.replace(/%20/g, "+");
                    } else if (node.tagName == "NIT") {
                        checkoflk.ncg_nit = node.textContent || node.text;
                        checkoflk.ncg_nit.replace(/%20/g, "+");
                    } else if (node.tagName == "LEU") {
                        checkoflk.ncg_leu = node.textContent || node.text;
                        checkoflk.ncg_leu.replace(/%20/g, "+");
                    } else if (node.tagName == "SG") {
                        checkoflk.ncg_sg = node.textContent || node.text;
                        checkoflk.ncg_sg.replace(/%20/g, "+");
                    } else if (node.tagName == "VC") {
                        checkoflk.ncg_vc = node.textContent || node.text;
                        checkoflk.ncg_vc.replace(/%20/g, "+");
                    } else if (node.tagName == "fvc") {
                        checkoflk.fgn_fvc = node.textContent || node.text;
                    } else if (node.tagName == "fev1") {
                        checkoflk.fgn_fevl = node.textContent || node.text;
                    } else if (node.tagName == "pef") {
                        checkoflk.fgn_pef = node.textContent || node.text;
                    } else if (node.tagName == "rate") {
                        checkoflk.fgv_fev_rate = node.textContent || node.text + "%";
                    } else if (node.tagName == "fef25") {
                        checkoflk.fgv_fef_a = node.textContent || node.text;
                    } else if (node.tagName == "fef75") {
                        checkoflk.fgv_fef_b = node.textContent || node.text;
                    } else if (node.tagName == "fef2575") {
                        checkoflk.fgv_fef_ab = node.textContent || node.text;
                    } else {
                        checkoflk[node.tagName] = node.textContent || node.text;
                    }
                }
                 return checkoflk;
            };
            /*
            personid=410423198012049012;height=0.0;username=赵钱孙;weight=0.0;bloodtype=;sex=男;birthday=1980-12-04;nation=1;
            处理以上类型的字符串，根据key得到值
            */
            function getValueByKey(strFile, sKey) {
                var key2 = sKey + "=";
                var value = "";
                var pos1 = strFile.indexOf(key2);
                if (pos1 != -1) {
                    strFile = strFile.substring(pos1 + key2.length);
                    var pos2 = strFile.indexOf(";");
                    if (pos2 != -1) {
                        value = strFile.substring(0, pos2);
                    } else {
                        value = trim(strFile)
                    }
                }
                return value;
            };

            //-------日期或日期时间的数字串(yyyymmddhhmmss)转成日期时间字符串(yyyy-mm-dd hh:mm:ss)
            function dtStr2dt(dtStr) {
                var rtn = "";
                if (dtStr) {
                    if (dtStr.length == 8) {
                        rtn = dtStr.substr(0, 4) + "-" + dtStr.substr(4, 2) + "-" + dtStr.substr(6, 2);
                    } else if (dtStr.length == 14) {
                        rtn = dtStr.substr(0, 4) + "-" + dtStr.substr(4, 2) + "-" + dtStr.substr(6, 2) + " " + dtStr.substr(8, 2) + ":" + dtStr.substr(10, 2) + ":" + dtStr.substr(12, 2);
                    } else {
                        rtn = "(" + dtStr + ")" + "格式不符合要求.(应为yyyymmdd 或 yyyymmddhhmmss)";
                    }
                } else {
                    rtn = "日期字段值为undefined";
                }
                return rtn;
            }

            function trim(str) { //删除左右两端的空格
                return str.replace(/(^\s*)|(\s*$)/g, "");
            }

            function ltrim(str) { //删除左边的空格
                return str.replace(/(^\s*)/g, "");
            }

            function rtrim(str) { //删除右边的空格
                return str.replace(/(\s*$)/g, "");
            }

        }
    ])
});