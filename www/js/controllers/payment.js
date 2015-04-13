angular.module('semPagar.controllers.payment', ['semPagar.models.payment'])

.controller('PaymentCtrl', function($scope, $stateParams, Payment) {


	Payment.get($stateParams.paymentId)
		.then(function (res) {
			$scope.payment = res;
		});



});
