(function () {
	'use strict';

	angular
		.module('app.notify', [
			'ui-notification' // https://github.com/alexcrack/angular-ui-notification
		])

		.config(function (NotificationProvider) {
			NotificationProvider.setOptions({
				delay: 3000,
				startTop: 20,
				startRight: 10,
				verticalSpacing: 20,
				horizontalSpacing: 20,
				positionX: 'left',
				positionY: 'bottom',
				templateUrl: '/app/components/views/angular-ui-notification.html'
			});
		})

		.factory('Notify', ['$rootScope', 'ngDialog', 'Notification', function ($rootScope, ngDialog, Notification) {

			var defaultDelay = window.location.href.indexOf('seleniumtc.l') !== -1 ? 100 : 3000;

			return {
				confirm_cordova: function (callback, message) {

					function onConfirm(buttonIndex) {
						if(buttonIndex === 1) {
							callback();
						}
					}

					if(navigator.notification && typeof navigator.notification === 'object') {
						navigator.notification.confirm(
							message,  		  // message
							onConfirm,         // callback
							null,            // title
							['Ok', 'Cancel']                  // buttonName
						);
					} else {
						ngDialog.openConfirm({
							templateUrl: '/app/directives/main/confirm.html',
							showClose: false,
							data: {
								title: message
							},
							scope: true
						}).then(function (value) {
							$rootScope.$evalAsync(function () {
								callback(value);
							});

						});
					}

				},
				confirm: function (callback, title, template, data) {
					ngDialog.openConfirm({
						templateUrl: template ? template.toString() : '/app/directives/main/confirm.html',
						showClose: false,
						data: {
							title: title,
							data: data
						},
						scope: true
					}).then(function (value) {
						callback(value);
					});
				},
				alert_cordova: function (message, title) {
					title = title ? title : 'Attention!';

					if(navigator.notification && typeof navigator.notification === 'object') {
						navigator.notification.alert(
							message,  // message
							null,         // callback
							title,            // title
							'Close'                  // buttonName
						);
					} else {
						ngDialog.open({
							plain: true,
							template: '<div class="custom-alert custom-confirm dialog-contents"><div class="confirm-inner"><img src="/images/logo.png" alt=""><h4 class="m-t-2 alert-danger">' + title + '</h4><span class="text-danger">' + message + '</span></div></div>'
						});
					}
				},
				alert: function (message, title) {
					title = title ? title : 'Attention!';

					navigator.notification.alert(
						'You are the winner!',  // message
						alertDismissed,         // callback
						'Game Over',            // title
						'Done'                  // buttonName
					);

					ngDialog.open({
						plain: true,
						template: '<div class="custom-alert custom-confirm dialog-contents"><div class="confirm-inner"><img src="/images/logo.png" alt=""><h4 class="m-t-2 alert-danger">' + title + '</h4><span class="text-danger">' + message + '</span></div></div>'
					});
				},

				info: function (text) {
					Notification.info({message: text});
				},
				success: function (text, delay) {
					Notification.success({message: text, delay: delay || defaultDelay});
				},
				warning: function (text) {
					Notification.warning({message: text});
				},
				error: function (text, delay) {
					Notification.error({message: text, delay: delay || defaultDelay});
				},
				clear: function () {
					Notification.clearAll();
				},
				close: function () {
					ngDialog.closeAll();
				}
			};
		}])

	;

})();
