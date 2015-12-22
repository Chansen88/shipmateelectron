"use strict";
(function() {
  angular
    .module('shipmateapp')
    .directive('packageDelivery', function() {
      return {
        template: '<img ng-if="packagedata.delivered" ng-src="/img/delivered.png"/>' +
                  '<img ng-if="!packagedata.delivered" ng-src="/img/oneday.png"/>' +
                  '<h6>{{packagedata.whenDelivered}}</h6>',
        scope: {
            packagedata: '=packageData'
          },
        link: function(scope) {
          if (scope.packagedata.delivered === true) {
            scope.packagedata.whenDelivered = 'Delivered';
          } else if (!scope.packagedata.deliveryDate || scope.packagedata.deliveryDate === 'undefined') {
            scope.packagedata.whenDelivered = 'Delivery not scheduled.';
          } else if (moment(scope.packagedata.deliveryDate).diff(moment()) <= 0) {
            scope.packagedata.delivered = true;
            scope.packagedata.whenDelivered = 'Delivered';
          } else {
            scope.packagedata.whenDelivered = moment(scope.packagedata.deliveryDate).fromNow();
          }
        }
      }
    });
})();
