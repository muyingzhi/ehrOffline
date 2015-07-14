define(['services/services',
    'services/AnalysisService',
    'services/FileOperationService',
    'services/FtpDownloadService'
], function(services) {
    services.service("HmsDownloadService", ['$q', '$rootScope', 'AnalysisService', 'FileOperationService','FtpDownloadService',
        function($q, $rootScope, AnalysisService, FileOperationService,FtpDownloadService) {
            // 1、参数
            var downloadParm = {
                localPath: "c:\\haoyisheng\\hms_reports",
                serverPath: "/opt/etc/data/archive/"
            };
            // 2、下载主函数
            this.downloadMain = function(startDate, endDate, cardNo, ftpConfig, downloadedFiles) {
                    var reportlistArr = [];
                    var wantDownloadlistArr = [];
                    var downloadlistArr = [];
                    var result = {
                        hmspersonlist: [],
                        checkoflklist: []
                    };
                    //ftp初始化
                    FtpDownloadService.init(ftpConfig);
                    //下载目录文件report.list
                    if(ftpDownloadReportIndexFile() == true){
                    	// 读取并解析目录文件
                    	var strReport = FileOperationService.readLocalFile(downloadParm.localPath + "\\report.list");
                    	if(strReport){
                    		reportlistArr = AnalysisService.getReportlistArr(strReport);
                    	}
                    }
                    // 根据查询条件找到要下载的数据
                    for (var i = 0; i < reportlistArr.length; i++) {
                        var report = reportlistArr[i];
                        // 要求开始时间结束时间不允许为空
                        var sDate = Date.parse(startDate.replace(/-/g, "/"));
                        var eDate = Date.parse(endDate.replace(/-/g, "/"));
                        var rDate = Date.parse(report.datetime.replace(/-/g, "/"));
                        if (cardNo) {
                            if (cardNo == report.cardno && rDate >= sDate && rDate <= eDate) {
                            	wantDownloadlistArr.push(report);
                            }
                        } else {
                            if (rDate >= sDate && rDate <= eDate) {
                            	wantDownloadlistArr.push(report);
                            }
                        }
                    };
                    //已下载的文件不需要重复下载
                	for(var i = 0; i < wantDownloadlistArr.length; i++) {
                		var downloaded = false;
                		var wantReport = wantDownloadlistArr[i];
                		for(var j = 0; j < downloadedFiles.length; j++) {
                			var downloadedHmsperson = downloadedFiles[j]
                			if(wantReport.dirName == downloadedHmsperson.numberofcase){
                				result.hmspersonlist.push(downloadedHmsperson);
                				downloaded = true;
                				break;
                			}
                		}
                		if(downloaded == false){
                			downloadlistArr.push(wantReport);
                		}
                	}
                	// 循环下载并读文件
                	for (var i = 0; i < downloadlistArr.length; i++) {
                		var hmsperson = {};
                		var checkoflk = {};
                		var strUserbase = "";
                		var strXml = "";
						var downloadReport = downloadlistArr[i];
						if(downloadReport.isEcg == 1){
							ftpDownloadOneReportFile(downloadReport.dirName, "ecg.png");
							ftpDownloadOneReportFile(downloadReport.dirName, "HMS9800.DATBAS");
						}
						ftpDownloadOneReportFile(downloadReport.dirName, "All_FailFile.dat");
						if(ftpDownloadOneReportFile(downloadReport.dirName, "userbase.bas")==true){
							strUserbase = FileOperationService.readLocalFile(downloadParm.localPath + "\\" + downloadReport.dirName + "\\userbase.bas");
	                        if(strUserbase){
	                        	hmsperson = AnalysisService.getHmsPerson(strUserbase);
	                        	hmsperson.numberofcase = downloadReport.dirName;		
	                        	result.hmspersonlist.push(hmsperson);
	                        }
						}
						if(ftpDownloadOneReportFile(downloadReport.dirName, "upload_trend_pc.xml")==true){
							strXml = FileOperationService.readLocalFile(downloadParm.localPath + "\\" + downloadReport.dirName + "\\upload_trend_pc.xml");
	                        if(strXml){
	                        	checkoflk = AnalysisService.getCheckoflk(strXml);
	                        	checkoflk.devicesn = hmsperson.device || "";
	                        	checkoflk.numberofcase = downloadReport.dirName;;
	                        	result.checkoflklist.push(checkoflk);
	                        }
						}
                	}
//                    // 循环下载
//                    for (var i = 0; i < downloadlistArr.length; i++) {
//                        var downloadReport = downloadlistArr[i];
//                        ftpDownloadOneReport(downloadReport.dirName, downloadReport.isEcg);
//                    }
//                    for (var i = 0; i < downloadlistArr.length; i++) {
//                        var downloadReport = downloadlistArr[i];
//                        var strUserbase = FileOperationService.readLocalFile(downloadParm.localPath + "\\" + downloadReport.dirName + "\\userbase.bas");
//                        var hmsperson = AnalysisService.getHmsPerson(strUserbase);
//                        hmsperson.numberofcase = downloadReport.dirName;		
//                        result.hmspersonlist.push(hmsperson);
//
//                        var strXml = FileOperationService.readLocalFile(downloadParm.localPath + "\\" + downloadReport.dirName + "\\upload_trend_pc.xml");
//                        var checkoflk = AnalysisService.getCheckoflk(strXml);
//                        checkoflk.devicesn = hmsperson.device;
//                        checkoflk.numberofcase = downloadReport.dirName;;
//                        result.checkoflklist.push(checkoflk);
//                    };
                    return result;
                }
            this.getHmspersonMain=function(cardNo, ftpConfig, downloadedFiles){
            	 var reportlistArr = [];
                 var wantDownloadlistArr = [];
                 var downloadlistArr = [];
          		 var checkoflk = {};
                 //ftp初始化
                 FtpDownloadService.init(ftpConfig);
                 //下载目录文件report.list
                 if(ftpDownloadReportIndexFile() == true){
                 	// 读取并解析目录文件
                 	var strReport = FileOperationService.readLocalFile(downloadParm.localPath + "\\report.list");
                 	if(strReport){
                 		reportlistArr = AnalysisService.getReportlistArr(strReport);
                 	}
                 }
                 var report;
                 // 根据查询条件找到要下载的数据
                 for (var i = 0; i < reportlistArr.length; i++) {
                     // 用来获取最新的一条记录值
                	 var num_max=-9000000000;
                     if (cardNo) {
                         if (cardNo == reportlistArr[i].cardno) {
                        	if(num_max<Date.parse(reportlistArr[i].datetime.replace(/-/g, "/"))){
                        		max=Date.parse(reportlistArr[i].datetime.replace(/-/g, "/"));
                        		report=reportlistArr[i];
                        	}
                         }
                     }
                 };
              	 wantDownloadlistArr.push(report);
                 //已下载的文件不需要重复下载
             	 for(var i = 0; i < wantDownloadlistArr.length; i++) {
             		var downloaded = false;
             		var wantReport = wantDownloadlistArr[i];
             		for(var j = 0; j < downloadedFiles.length; j++) {
             			var downloadedHmsperson = downloadedFiles[j]
             			if(wantReport.dirName == downloadedHmsperson.numberofcase){
             				downloaded = true;
             				break;
             			}
             		}
             		if(downloaded == false){
             			downloadlistArr.push(wantReport);
             		}
             	 }
             	 // 循环下载并读文件
             	 for (var i = 0; i < downloadlistArr.length; i++) {
             		var strXml = "";
						var downloadReport = downloadlistArr[i];
						if(ftpDownloadOneReportFile(downloadReport.dirName, "upload_trend_pc.xml")==true){
							strXml = FileOperationService.readLocalFile(downloadParm.localPath + "\\" + downloadReport.dirName + "\\upload_trend_pc.xml");
	                        if(strXml){
	                        	checkoflk = AnalysisService.getCheckoflk(strXml);
	                        }
						}
             	 }
                 return checkoflk;
            }
            
            
                //3、下载report.list文件
            function ftpDownloadReportIndexFile() {
            	var result = false;
                var serverPath = downloadParm.serverPath + "report.list";
                var localPath = downloadParm.localPath + "\\report.list";
                if(FileOperationService.createLocalDir(downloadParm.localPath) == true){
                	if(FtpDownloadService.downloadFile(serverPath, localPath) == true){
                		result = true;
                	}
                }
                return result;
            };
            //4、下载一个报告（目前最多包含5个文件 20141215）
            function ftpDownloadOneReport(reportDirName, isEcg) {
                var localPath = downloadParm.localPath + "\\" + reportDirName;
                var serverPath = downloadParm.serverPath + reportDirName;
                FileOperationService.createLocalDir(downloadParm.localPath + "\\" + reportDirName);

                FtpDownloadService.downloadFile(serverPath+ "/All_FailFile.dat", localPath+ "\\All_FailFile.dat");
                FtpDownloadService.downloadFile(serverPath+ "/upload_trend_pc.xml", localPath+ "\\upload_trend_pc.xml");
                FtpDownloadService.downloadFile(serverPath+ "/userbase.bas", localPath+ "\\userbase.bas");

                if (isEcg == 1) {
                    FtpDownloadService.downloadFile(serverPath+ "/ecg.png", localPath+ "\\ecg.png");
                    FtpDownloadService.downloadFile(serverPath+ "/HMS9800.DATBAS", localPath+ "\\HMS9800.DATBAS");
                };
            };
            //4、下载单个文件
            function ftpDownloadOneReportFile(reportDirName, reportFileName) {
            	var result = false;
            	var localPath = downloadParm.localPath + "\\" + reportDirName;
            	var serverPath = downloadParm.serverPath + reportDirName;
            	if(FileOperationService.createLocalDir(downloadParm.localPath + "\\" + reportDirName)==true){
            		if(FtpDownloadService.downloadFile(serverPath+ "/"+reportFileName, localPath+ "\\"+reportFileName)==true){
            			result = true;
            		}
            	}
            	return result;
            };
        }
    ])
});