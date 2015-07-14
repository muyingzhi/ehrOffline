define(['controller/controllers',
            'jquery',
            'services/LoginUserService'
            ],function(controllers,$){
                 controllers.controller("loginController", ['$scope','LoginUserService',
                    function($scope,loginUserService){
                        $scope.loginInfo = {
                            username: "",
                            password: "",
                            message: "",
                            downloadHref: "app/views/index.html#archDownload"
                        };
                        $scope.reset = function(){
                            $scope.loginInfo.username = "";
                            $scope.loginInfo.password = "";
                            $scope.loginInfo.message = "";
                        };
                        $scope.login = function(){
                        	var msgNode = document.querySelector("#errorMsg");
                        	msgNode.textContent = '';
                            if(checkValid()){
                                return;
                            };
                            $scope.loginInfo.message = "";
                            loginUserService.runLogin($scope.loginInfo);
                        };
                        //检查校验项目
                        function checkValid(){
                            var bHasInvalidElm = false;
                            $scope.loginInfo.message = "请填写"
                            if($scope.loginForm.username.$error.required){
                                $scope.loginInfo.message +=  " 【用户名】  "; 
                                bHasInvalidElm = true;
                            };
                            if($scope.loginForm.password.$error.required){
                                $scope.loginInfo.message +=  " 【密码】  "; 
                                bHasInvalidElm = true;
                            };
                            return bHasInvalidElm;
                        };
                        
                        document.onkeydown=function()   
                        {
                        	//捕捉回车   
                        	var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
                        	if (keyCode == 13) {
                        		document.getElementById('btnLogin').click();
                        		return false;
                        	} 
                        }
                    }])
            })
