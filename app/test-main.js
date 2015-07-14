var allTestFiles = [];
var TEST_REGEXP = /(sp|te)\.js$/i;

var pathToModule = function(path) {
  return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    allTestFiles.push(pathToModule(file));
  }
});

  allTestFiles.push("test/commonTest");
  allTestFiles.push("test/indexedDBSpec");
  allTestFiles.push("test/HmsPersonsServiceSpec");
  allTestFiles.push("test/EhealthArchCheckoflkServiceSpec");
  allTestFiles.push("test/aboutCtrSpec");
//  allTestFiles.push("test/appSpec");
//  allTestFiles.push("test/E2Etest");
//  allTestFiles.push("test/xmlServiceSpec");
  allTestFiles.push("test/InterChangeServiceSpec");
require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base/scripts',
    paths:{
        jquery: '../vendor/jquery-1.8.3',
        angular: '../vendor/angular',
        angularMocks : '../vendor/angular-mocks',
        domReady: "../vendor/domReady",
        twitter: "../vendor/bootstrap",
        easyui : "../vendor/easyui/jquery.easyui.min",
        easyuizh_CN : "../vendor/easyui/locale/easyui-lang-zh_CN",
        indexedDB : "../vendor/indexeddb"
    },
    shim:{
        'twitter' : {
            deps : ['jquery']
        },
        angular:{
            deps:['jquery','twitter'],
            exports:'angular'
        },
        angularMocks:{
            deps:['angular'],
            exports:'angularMocks'
        },
        easyui : {
            deps : ['jquery']
        },
        easyuizh_CN :{
            deps : ['easyui']        
        }
        ,
        indexedDB : {
            deps : ['angular']
        }
    },
  // dynamically load all test files
  deps: allTestFiles,

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});
