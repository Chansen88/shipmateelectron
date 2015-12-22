"use strict";
(function() {
  angular
    .module('shipmateapp')
    .factory('Packages', ['$http', '$q', function($http, $q) {
      let Packages = {};

      Packages.emailIds = [];
      Packages.ups = new Set();
      Packages.fedex = new Set();
      Packages.usps = new Set();
      Packages.packageInfo = [];

      Packages.getEmailList = function(accessToken) {
        console.log('running fetch');
        $http({
          method: 'GET',
          url: 'https://www.googleapis.com/gmail/v1/users/me/messages',
          headers: {
            Authorization: 'Bearer ' + accessToken
          }
        }).then(function successCallback(response) {
          Packages.emailIds = response.data.messages;
          Packages.scanEmails(accessToken);
        }, function errorCallback(response) {
          console.log('Request Error');
          console.log(response);;
        });
      };

      Packages.scanEmails = function(accessToken) {

        let promises = Packages.emailIds.map(function(messageId) {
          return $http({
            method: 'GET',
            url: 'https://www.googleapis.com/gmail/v1/users/me/messages/' +
              messageId.id + '?format=raw',
            headers: {
              Authorization: 'Bearer ' + accessToken
            }
          });
        });

        $q.all(promises).then(function successCallback(responses) {
          for (let response of responses) {
            let message = atob(response.data.raw.replace(/-/g, '+').replace(/_/g, '/'));
            let from = message.split('\n')[6];

            let upsMatchedIds = message.match(/\b(1Z ?[0-9A-Z]{3} ?[0-9A-Z]{3} ?[0-9A-Z]{2} ?[0-9A-Z]{4} ?[0-9A-Z]{3} ?[0-9A-Z]|[\dT]\d\d\d ?\d\d\d\d ?\d\d\d)\b/i) || [];
            for (let id of upsMatchedIds) {
              Packages.ups.add(JSON.stringify({id: id, from: from}));
            }

            let fedexMatchedIds = message.match(/\b((96\d\d\d\d\d ?\d\d\d\d|96\d\d) ?\d\d\d\d ?d\d\d\d( ?\d\d\d)?)\b|\b[0-9]{15}/i) || [];
            for (let id of fedexMatchedIds) {
              if (id !== undefined) {
                console.log(id);
                Packages.fedex.add(JSON.stringify({id: id, from: from}));
              }
            }

            let uspsMatchedIds = message.match(/(\b\d{22}\b)|(\b\d{30}\b)|(\b\d{20}\b)|^E\D{1}\d{9}\D{2}$|^9\d{15,21}$|^91[0-9]+$|^[A-Za-z]{2}[0-9]+US$/g) || [];
            for (let id of uspsMatchedIds) {
              Packages.usps.add(JSON.stringify({id: id, from: from}));
            }

          }
          Packages.addPackages();
        }, function errorCallback(response) {
          console.log('Request Error');
          console.log(response);;
        });

      };

      Packages.addPackages = function() {
        let promises = [];

        Packages.ups.forEach(function(upsTrackingId) {
          promises.push($http({
            method: 'POST',
            url: '/api/upsfetch',
            data: {upsTrackingId}
          }));
        });

        Packages.fedex.forEach(function(fedexTrackingId) {
          promises.push($http({
            method: 'POST',
            url: '/api/fedexfetch',
            data: {fedexTrackingId}
          }));
        });

        Packages.usps.forEach(function(uspsTrackingId) {
          promises.push($http({
            method: 'POST',
            url: '/api/uspsfetch',
            data: {uspsTrackingId}
          }));
        });

        $q.all(promises).then(function successCallback(responses) {
          console.log(responses);
          Packages.packageInfo.length = 0;
          for (const response of responses) {
            if (response.data) {
              Packages.packageInfo.push(response.data);
            }
          }
        }, function errorCallback(responses) {
          console.log('Request Error');
          Packages.packageInfo[0] = 'Request Error';
        });
      };

      return Packages;
    }]);
})();
