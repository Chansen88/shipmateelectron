// function($location, $rootScope) {
//   let hash = $location.hash();
//   let splitted = hash.split('&');
//   let params = {};
//   for (let i = 0; i < splitted.length; i++) {
//     let param = splitted[i].split('=');
//     let key = param[0];
//     let value = param[1];
//     params[key] = value;
//     $rootScope.accesstoken = params;
//   }
//   $location.hash('');
//   $location.path('/packages');
// }
