"use strict";
(function() {;
  angular
    .module('shipmateapp')
    .controller('PackagesController',
      ['$scope', '$http', '$rootScope', 'Packages', '$location',
        function($scope, $http, $rootScope, Packages, $location) {
          var vm = this;
          if (!$rootScope.accesstoken) {
            $location.path('/');
          }
          vm.packageinfo = Packages.packageInfo;
          Packages.getEmailList($rootScope.accesstoken.access_token);

          vm.refresh = function() {
            Packages.addPackages();
          };

        }]);
})();
