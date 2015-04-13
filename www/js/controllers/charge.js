angular.module('semPagar.controllers.charge', ['semPagar.models.payment', 'semPagar.modals.loading'])



.controller('ChargeCtrl', function ($scope, loadingModal, $ionicSlideBoxDelegate, $timeout, $state, $ionicHistory, _, Payment) {

	console.log('ChargeCtrl')

	var steps = [
		{
			title: 'telefone',
		},
		{
			title: 'produtos'
		}
	];


	// setTimeout(function () {
	// 	loadingModal.show();
	// }, 1000)


	$scope.total = 0;

	// shows keyboard and focus phone input
	function adjustPhoneInputStyles() {
		var input = document.getElementById('phone-input');

		$('#phone-input').inputmask('(99) 99999-9999', {
			placeholder: '_',
			clearMaskOnLostFocus: true,
			showMaskOnHover: false,
			showMaskOnFocus: false
		})

		input.focus();

		if (window.cordova) {
			window.cordova.plugins.Keyboard.show();
		}
	}

	// initially adjust input styles
	setTimeout(adjustPhoneInputStyles, 600);

	// variable 
	$scope.phoneNumberComplete = true;


	// object that represents the form
	var chargeForm = {

		values: {},

		currentStepIndex: 0,

		currentStepTitle: steps[0].title,

		nextStep: function () {

			if ($('#phone-input').inputmask('isComplete')) {


				if (chargeForm.currentStepIndex < steps.length - 1) {
					$ionicSlideBoxDelegate.next();
				} else {
					// last step
					$scope.charge();
				}
			} else {
				alert('número inválido :/')
			}

		},

		previousStep: function () {

			if (chargeForm.currentStepIndex > 0) {
				$ionicSlideBoxDelegate.previous();
			} else {

				$ionicHistory.nextViewOptions({
					disableBack: true
				});
				$state.go('app.payments');
			}

		},

		stepChanged: function (index) {
			chargeForm.currentStepIndex = index;
			chargeForm.currentStepTitle = steps[index].title;
			if (index === 0) {

				setTimeout(adjustPhoneInputStyles, 500);
			} else if (index === 1) {

			}
		}
	};

	// object that represents the form
	$scope.chargeForm = chargeForm;

	// var $phoneInput = $('#phone-input');

	// $phoneInput.on('keyup', function () {

		

	// 	console.log($phoneInput.inputmask('isComplete'));
	// 	console.log(chargeForm.values.phone);

	// 	if ($phoneInput.inputmask('isComplete') && $phoneInput.val()) {
	// 		// set complete to true
	// 		$scope.phoneNumberComplete = true;

	// 		$scope.$apply();
	// 	} else {
	// 		$scope.phoneNumberComplete = false;
	// 	}
	// })

	// productCart
	$scope.productCart = [];

	// list of available products ordered by rows
	$scope.availableProducts = [
		[
			{ name: 'Pizza', price: 4.5, icon: 'ion-pizza' },
			{ name: 'Sorvete', price: 3, icon: 'ion-icecream' },
		],

		[
			{ name: 'Beer', price: 7, icon: 'ion-beer' },
			{ name: 'Drink', price: 5.5, icon: 'ion-wineglass' },
			{ name: 'Café', price: 6, icon: 'ion-coffee' },
		],
	];

	$scope.addToCart = function (product) {

		$scope.productCart.push(product);

		$scope.total = calculateTotal();
	}

	$scope.removeFromCart = function (product) {

		var index = _.findIndex($scope.productCart, function (p) {
			return p === product;
		});

		$scope.productCart.splice(index, 1);

		$scope.total = calculateTotal();

	}



	function calculateTotal() {
		return _.reduce($scope.productCart, function (total, item) {
			return total + item.price;
		}, 0);
	}


	$scope.charge = function () {


		// check if cart has products
		if (calculateTotal() > 0) {

			
			loadingModal.show();

			Payment.create({
				phone: '+55' + $('#phone-input').inputmask('unmaskedvalue'),
				value: calculateTotal() * 100,

				description: JSON.stringify($scope.productCart)
			})
			.then(function (res) {

				console.log('transaction');
				console.log(res);

				loadingModal.startPolling(res.data.transaction.id);
			}, function () {
				loadingModal.fail();
			})
		}

	}
});