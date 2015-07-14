define(['controller/controllers',
            'jquery',
            'directives/hysNavMenu',
            'services/LoginUserService'
            ],function(controllers,$){
                controllers.controller("mainController", ['$rootScope','$scope','$location','LoginUserService',
                    function($rootScope,$scope,$location,loginUserService){
                		var loginHref = "../../log_on.html"
                        if ($location.path().indexOf("archDownload") > 0) {
                            $scope.navItems = [{
                                label:"档案下载",iconClass:"glyphicon glyphicon-retweet",url:"/archDownload"
                            },
                            {
                            	label:"卫生监督下载",iconClass:"glyphicon glyphicon-retweet",url:"/sanitDownload"
                            },
                            {
                            	label:"门诊下载",iconClass:"glyphicon glyphicon-retweet",url:"/hisDownload"
                            }]
                        } else{
                            // -------读取当前登陆用户
                            loginUserService.find().then(
                                function(data){
                                    if (data) {
                                        $rootScope.currentUser = {
                                            username: data.username,
                                            icpcode: data.govcode,
                                            userid: data.staffid,
                                            platuserid:data.platuserid
                                        };
                                        $scope.navItems = [
                                            {
                                                label:"健康档案",iconClass:"glyphicon glyphicon-file",url:"/archlist"
                                            },{
                                                label:"卫生监督",iconClass:"glyphicon glyphicon-eye-open",url:"/healthSupervision"
                                            },{
                                                label:"健康教育",iconClass:"glyphicon glyphicon-film",url:"/healthEducation"
                                            },{
                                                label:"预防接种",iconClass:"glyphicon glyphicon-pushpin",url:"/vaccination"
                                            },{
                                                label:"一体机体检",iconClass:"glyphicon glyphicon-inbox",url:"/hmslist"
                                            },{
                                                label:"门诊病历",iconClass:"glyphicon glyphicon-user",url:"/recordlist"
                                            },{
                                                label:"传染病登记",iconClass:"glyphicon glyphicon-tint",url:"/infectionlist"
                                            },{
                                                label:"数据上传",iconClass:"glyphicon glyphicon-retweet",url:"/datasUpload"
                                            }
                                        ]
                                    } else{
                                        window.location.href = loginHref;
                                    };
                                },
                                function(error){
                                	alert("findErr:"+error);
                                    window.location.href = loginHref;
                                }
                            )
                        };
                        $rootScope.topNav = [];
                        $scope.logOut = function(){
                            loginUserService.clear().then(
                                function(data){
                                    window.location.href = loginHref;
                                },
                                function(error){
                                    window.location.href = loginHref;
                                }
                            )
                        }
                    }])
            })
