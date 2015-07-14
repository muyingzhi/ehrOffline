var amail = angular.module("Amail",[]);
function amailRouteConfig($routeProvider){
    console.log("config route");
    $routeProvider
    .when("/",{
        controller:ListController,
        templateUrl:'list.html'
    })
    .when("/view/:id",{
        controller:DetailController,
        templateUrl:'detail.html'
    })
    .otherwise({
        redirectTo:"/"
    })
    ;
};
amail.config(amailRouteConfig);
angular.bootstrap(document,['Amail']);
messages = [{
    id:0,sender:"jean@gmail.com",subject:"hi hear,old friend",date:"2010-10-10",
    recipients:[],message:"xxxxxx,xxxx,xxx"
},{
    id:1,sender:"jordon@gmail.com",subject:"hi hear,old friend",date:"2010-10-10",
    recipients:[],message:"xxxxxx,xxxx,xxx"
},{
    id:2,sender:"peat@gmail.com",subject:"hi hear,old friend",date:"2010-10-10",
    recipients:[],message:"xxxxxx,xxxx,xxx"
}];
function ListController($scope){
    $scope.messages = messages;
    console.log("ListController")
}
function DetailController($scope,$routeParams){
    $scope.message = messages[$routeParams.id];
    console.log("DetailController")
}