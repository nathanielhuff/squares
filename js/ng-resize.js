/**
 * @license ngResize.js v1.1.0
 * (c) 2014 Daniel Smith http://www.danmasta.com
 * License: MIT
 *
 * Forked by Nathaniel Huff
 * 08.28.2015
 *
 * Requires RAF Polyfill by Paul Irish
 *
 */
(function(window, angular, undefined) {

  'use strict';

  // define ngResize module
  var ngResize = angular.module('ngResize', []);

  /*
  * ngResize Provider
  *
  * $broadcasts 'windowResize' event from $rootScope
  * which gets inherited by all child scopes
  */
  ngResize.provider('resize', [function resizeProvider(){

    // provider object
    this.$get = ['$rootScope', '$window', function($rootScope, $window){

      var running = false;

      // fired on resize event
      function resize() {
        if(!running) {
          running = true;
          // handled by RAF Polyfill
          window.requestAnimationFrame(run);
        }
      }

      // handle throttled resize here
      function run() {
        $rootScope.$broadcast('windowResize');
        running = false;
      }

      // if a given scope needs windowResize manually triggered
      function trigger($scope){
        var $scope = $scope || $rootScope;
        $scope.$broadcast('windowResize');
      };

      // bind to window resize event
      // will only ever be bound one time for entire app
      angular.element($window).on('resize', resize);

      // return api
      return {
        trigger: trigger
      };

    }];

  }]);

})(window, window.angular);
