angular.module('semPagar.modals.loading', ['semPagar.models.user', 'semPagar.controllers.payments'])



.controller('LoadingCtrl', function ($scope, loadingModal, Payment, $ionicSlideBoxDelegate, $timeout, $ionicHistory, $state, $http, Config, User) {

	$scope.hide = function () {

		loadingModal.hide();

		$ionicHistory.nextViewOptions({
			disableBack: true
		});

		$state.go('app.payments');


	}

	$scope.show = loadingModal.show;
})



.factory('loadingModal', function($ionicModal, $rootScope, $q, $http, Config, User, $ionicHistory, $state) {

	var serviceScope = {};

	var modalScope = serviceScope.modalScope = $rootScope.$new();


	var steps = [
		{
			title: 'aguarde', 
			status: 'loading',
			label: 'enviando a cobrança...'
		},
		{
			title: 'resposta',
			status: 'loading',
			label: 'aguardando resposta do cliente...',
		},
		{
			title: 'sucesso',
			status: 'success',
			label: 'o pagamento foi realizado com sucesso! :)'
		},
		{
			title: 'falha',
			status: 'fail',
			label: 'houve uma falha no pagamento :('
		}
	];
	
	// create modal
	$ionicModal.fromTemplateUrl('templates/loading-modal.html', {
		scope: modalScope,

		// custom animation defined at css
		animation: 'scale-in',
	})
	.then(function (modal) {
		serviceScope.modal = modal;
	});

	var interval;

	var intervalCount = 0;

	function pollPaymentStatus(paymentId) {
		interval = setInterval(function () {

			$http.get(Config.endpoints.transactions + '/' + paymentId, {
				headers: {
					'X-Access-Token': User.getAccessToken()
				}
			})
			.then(function (res) {

				if (res.data.status === 'approved') {
					// success
					modalScope.currentStep = steps[2];

					clearInterval(interval);

					// GOTO THE DETAILS OF THE PAGE
					$ionicHistory.nextViewOptions({
						disableBack: true
					});

					// GOTO payment STATE
					$state.go('app.payment', {
						paymentId: res.data.id
					});

					// close the current loading modal
					serviceScope.modal.hide();


				} else if (res.data.status === 'pending') {

					// pending, persist interval
					modalScope.currentStep = steps[1];

					if (intervalCount > 200) {
						clearInterval(interval);
					} else {
						++intervalCount;
					}
					
				}


			}, function (res) {
				// failure
				modalScope.currentStep = steps[3];

				// clear interval
				clearInterval(interval);
			});


		}, 500);
	}

	return {
		show: function () {

			// set step
			modalScope.currentStep = steps[0];



			var defer = $q.defer();

			serviceScope.modal.show();

			serviceScope.defer = defer;

			return defer.promise;
		},

		startPolling: function (paymentId) {

			setTimeout(function () {
				modalScope.currentStep = steps[1];
			}, 600);

			// start pollPaymentStatus
			pollPaymentStatus(paymentId);
		},

		getDefer: function () {
			return serviceScope.defer;
		},

		hide: function () {

			if (interval) {
				clearInterval(interval);
			}

			return serviceScope.modal.hide();
		},

		fail: function () {
			modalScope.currentStep = steps[3];
		}
	};
})