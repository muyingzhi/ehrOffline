console.log("bootstrap...");
define(['domReady','angular'],function(domReady,angular){
    console.log("bootstrap start");
    return function(){
        domReady(function(){
	        angular.bootstrap(document,["ehr"]);
	        console.log("bootstrap");
        })
    }
});