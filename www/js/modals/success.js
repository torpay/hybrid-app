angular.module('semPagar.modals.success', [])

.service('successModal', function($ionicModal, $rootScope) {
	var serviceScope = {};

	var modalScope = serviceScope.modalScope = $rootScope.$new();

	// create modal
	$ionicModal.fromTemplateUrl('templates/success.html', {
		scope: modalScope,

		// custom animation defined at css
		animation: 'scale-in',
	})
	.then(function (modal) {
		serviceScope.modal = modal;
	});

	serviceScope.open = function (payment) {
		modalScope.payment = payment;
		serviceScope.modal.show();

		modalScope.close = function () {
			serviceScope.modal.hide();
		}
	};

	return serviceScope;
})