angular.module('semPagar.controllers.payments', [])

.controller('PaymentsCtrl', function($scope, Payment, paymentModal, $stateParams, $state, $ionicHistory, $ionicModal) {

	if ($stateParams.paymentId) {
		// single payment
		console.log($stateParams.paymentId);

		Payment.get($stateParams.paymentId)
			.then(function (payment) {
				// open modal
				paymentModal.open(payment);
			});

	} else {
		// multiple payments
		// close modal
		paymentModal.close();

		Payment.get().then(function (payments) {

			$scope.payments = payments;

			console.log(payments);

		});

		$scope.openCharge = function () {

			$ionicHistory.nextViewOptions({
				disableBack: true,
			})
			$state.go('app.charge');
		};

		$scope.viewDetails = function (payment) {
			paymentModal.open(payment);
		}
	}
})

.service('paymentModal', function($ionicModal, $rootScope, $ionicHistory, $state) {
	var serviceScope = {};

	var modalScope = serviceScope.modalScope = $rootScope.$new();

	// create modal
	$ionicModal.fromTemplateUrl('templates/payment.html', {
		scope: modalScope,

		// custom animation defined at css
		animation: 'scale-in',
	})
	.then(function (modal) {
		serviceScope.modal = modal;
	});

	serviceScope.open = function (payment) {

		modalScope.close = function () {
			serviceScope.modal.hide();
		};

		modalScope.payment = payment;
		return serviceScope.modal.show();
	};

	serviceScope.close = function () {

		if (serviceScope.modal) {
			return serviceScope.modal.hide();
		}
		
	};

	return serviceScope;
})