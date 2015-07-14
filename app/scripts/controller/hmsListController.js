define(['controller/controllers',
	'jquery','dictsConstant',
	'directives/alert',
	'directives/hysDatebox',
	'services/HmsDownloadService',
	'services/HmsPersonsService',
	'services/EhealthArchCheckoflkService',
	'services/SysConfigService'
], function(app) {
	app.controller("hmsListController", 
		['$rootScope', '$scope', '$routeParams', '$indexedDB', 'dataDicts', 'HmsDownloadService','HmsPersonsService','EhealthArchCheckoflkService','SysConfigService',
		function($rootScope, $scope, $routeParams, LocalDBService, dataDicts, HmsDownloadService,HmsPersonsService,checkoflkService,sysConfigService) {
			//---------设置顶端菜单
	        $rootScope.topNav = [
		        {
		            text:"ftp配置维护",iconClass:"glyphicon-new-window",url:"#/configSet/ftpinfo"
		        }];
			//初始化查询条件
			var nowDate = new Date();
			var gdate = ("0" + nowDate.getDate()).slice(-2);
			var gmonth = ("0" + (nowDate.getMonth() + 1)).slice(-2);
			var gyear = nowDate.getFullYear();
			$scope.ftp = {
				startdate: gyear + '-' + gmonth + '-01',
				enddate: gyear + '-' + gmonth + '-' + gdate,
				cardno: "",
				findName: ""
			};
			//得到ftp的配置信息
			var ftpConfig = {
					ocx: FTP_OCX
			};
			//读取ftp的配置信息
        	sysConfigService.findById("ftpinfo").then(
                function(data){
                    if (data) {
                    	$.extend(ftpConfig,data);
                    };
                },
                function(error){
                    alert("【findByIdErr】:" + error);
                }
            );
			
			//得到已下载的文件
			var downloadedFiles = [];
			HmsPersonsService.findAll().then(function(data){
				if(data && data.length > 0){
					downloadedFiles = data;
				}
			});
			$("#hmspersonList").datagrid({
				singleSelect: true,
	            title: "体检记录",
	            toolbar: "#tb",
	            rownumbers: true,
	            pagination:true,
	            pageSize:20,
	            loadFilter:pagerFilter,
	            columns: [
	            	[ {
						field: 'username',
						title: '姓名',
						width: 100,
						formatter: function(value, row, index) {
							var firstname = value.substr(0, 1);
							return '<span class="avatar">' + firstname + '</span><span>' + value + '</span>';
	                    }
		                } ,{
		                	field:'sex',
		                	title: '性别',
		                	width:50,
		                	align: 'center',
		                	formatter: function(value,row,index){
		                		var result = value=="1"?"男":"女"
		                		return result;
		                	}
		                },{
		                	field: 'personid',
		                	title: '身份证号',
		                	width:150,
		                	align: 'center'
		                },{
		                	field:'birthday',
		                	title: '出生日期',
		                	width:80,
		                	align: 'center'
		                },{
		                	field: 'checktime',
		                	title: '体检时间',
		                	width: 130,
		                	align: 'center'
		                },{
		                	field: 'id1',
		                	title: '建档状态',
		                	width: 100,
		                	align: 'center',
							formatter: function(value, row, index) {
								return "<a href='#/arch/checklist/" + row.arch_basicinfoid + "' title='健康体检'><span class='font_blue glyphicon glyphicon-leaf'></span>&nbsp;</a>"
							}
		                },{
		                	field: 'id2',
		                	title: '健康档案',
		                	width: 100,
		                	align: 'center'
		                },{
		                	field: 'id3',
		                	title: '健康管理',
		                	width: 100,
		                	align: 'center'
		                }] 
        		]
			})

			$scope.downloadHmsperson = function() {
				if(!ftpConfig.host){
					$.messager.alert(dataDicts.alertTitle,"请维护ftp的配置后再查询");
					return;
				}
				var result = HmsDownloadService.downloadMain($scope.ftp.startdate, $scope.ftp.enddate, $scope.ftp.cardno,ftpConfig,downloadedFiles);
				$("#hmspersonList").datagrid({
					data: result.hmspersonlist
				});
				if(result.hmspersonlist && result.hmspersonlist.length > 0){
					for(var i=0 ;i< result.hmspersonlist.length;i++){
                        var hmsperson = result.hmspersonlist[i];
                        HmsPersonsService.upsert(hmsperson).then(function(data){
                        	downloadedFiles.push(hmsperson);
                        });
                    }
				}
				if(result.checkoflklist && result.checkoflklist.length > 0){
					for(var i=0 ;i< result.checkoflklist.length;i++){
                        var checkoflk = result.checkoflklist[i];
                        checkoflkService.upsert(checkoflk);
                    };
				}
			}
			//-----
			$scope.$watch('hmspersonlist',function(newvalue){
	            $("#hmspersonList").datagrid({data:$scope.hmspersonlist});
	        });
			
			$scope.find=function(){
	            if($scope.ftp.findName){
	                //--------按姓名查找
	            	HmsPersonsService.findByName($scope.ftp.findName).then(function(list){
	                    $scope.hmspersonlist = list;
	                });
	            }else{
	                //----全部
	            	HmsPersonsService.findAll().then(function(list){
		                $scope.hmspersonlist = list;
			        });
	            }
	        }
			
			function pagerFilter(data){
	            if (typeof data.length == 'number' && typeof data.splice == 'function'){    // is array
	                data = {
	                    total: data.length,
	                    rows: data
	                }
	            }
	            var dg = $(this);
	            var opts = dg.datagrid('options');
	            var pager = dg.datagrid('getPager');
	            pager.pagination({
	                onSelectPage:function(pageNum, pageSize){
	                    opts.pageNumber = pageNum;
	                    opts.pageSize = pageSize;
	                    pager.pagination('refresh',{
	                        pageNumber:pageNum,
	                        pageSize:pageSize
	                    });
	                    dg.datagrid('loadData',data);
	                }
	            });
	            if (!data.originalRows){
	                data.originalRows = (data.rows);
	            }
	            var start = (opts.pageNumber-1)*parseInt(opts.pageSize);
	            var end = start + parseInt(opts.pageSize);
	            data.rows = (data.originalRows.slice(start, end));
	            return data;
	        }
	}]);
});