(function () {
    'use strict';

    angular
        .module('app.profile', [])

        .config(configure)
        .controller('ProfileCtrl.home', ProfileCtrl_Home)
        .controller('ProfileCtrl.sidebar', ProfileCtrl_Sidebar)
        .controller('ProfileCtrl.profile_edit', ProfileCtrl_Edit)
        .controller('ProfileCtrl.transactions', ProfileCtrl_Transactions)
        .controller('ProfileCtrl.add_funds', ProfileCtrl_Add_Funds)
        .controller('ProfileCtrl.withdraw_funds', ProfileCtrl_Withdraw_Funds)
        .controller('ProfileCtrl.messages', ProfileCtrl_Messages)
        .controller('ProfileCtrl.messages_create', ProfileCtrl_MessagesCreate)
        .controller('ProfileCtrl.messages_dialog', ProfileCtrl_MessagesDialog)
        .controller('ProfileCtrl.transfer', ProfileCtrl_Transfer)
        .controller('ProfileCtrl.support', ProfileCtrl_Support)
        .controller('ProfileCtrl.invite_league', ProfileCtrl_Invite_League)
        .controller('ProfileCtrl.invite_friends', ProfileCtrl_Invite_Friends)
        .controller('ProfileCtrl.faq', ProfileCtrl_Faq)
    ;

    /* Fn
     ============================================================================================================= */
    configure.$inject = ['$stateProvider', '$sceProvider'];

    function configure($stateProvider, $sceProvider) {

        $sceProvider.enabled(false);

        $stateProvider
            .state('profile', {
                abstract: true,
                url: '/dashboard',
                views: {
                    '': {
                        templateUrl: '/app/modules/dashboard/layout.html'
                    }
                },
                resolve: {
                    init_profile: ['$rootScope', 'HttpService', function ($rootScope, HttpService) {
                        return HttpService.get('/api/profile', function (user) {
                            $rootScope.auth = user;
                        });
                    }]
                }
            })
            .state('profile.home', {
                url: '?invite?invite_user',
                views: {
                    content: {
                        controller: 'ProfileCtrl.home',
                        templateUrl: '/app/modules/dashboard/profile/home.html'
                    },
                    'sidebar': {
                        controller: 'ProfileCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/profile/sidebar.html'
                    }

                },
                resolve: {
                    last_message: ['HttpService', function (HttpService) {
                        return HttpService.get('/api/messages/latest');
                    }]
                }
            })
            .state('profile.edit', {
                url: '/profile/edit?invite?invite_user',
                views: {
                    content: {
                        controller: 'ProfileCtrl.profile_edit',
                        templateUrl: '/app/modules/dashboard/profile/profile_edit.html'
                    },
                    'sidebar': {
                        controller: 'ProfileCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/profile/sidebar.html'
                    }
                },
                resolve: {
                    Profile: ['HttpService', function (HttpService) {
                        return HttpService.get('/api/profile');
                    }],
                    /*SecurityQuestions : ['HttpService', function(HttpService) {
                        return HttpService.get('/api/security-questions/list');
                    }]*/
                }
            })
            .state('profile.support', {
                url: '/profile/support',
                views: {
                    content: {
                        controller: 'ProfileCtrl.support',
                        templateUrl: '/app/modules/dashboard/profile/support.html'
                    },
                    'sidebar': {
                        controller: 'ProfileCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/profile/sidebar.html'
                    }
                }
            })
            .state('profile.faq', {
                url: '/profile/faq',
                views: {
                    content: {
                        controller: 'ProfileCtrl.faq',
                        templateUrl: '/app/modules/dashboard/profile/faq.html'
                    },
                    'sidebar': {
                        controller: 'ProfileCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/profile/sidebar.html'
                    }
                }
            })

            .state('profile.transactions', {
                url: '/profile/transactions?page',
                views: {
                    content: {
                        controller: 'ProfileCtrl.transactions',
                        templateUrl: '/app/modules/dashboard/profile/transactions.html'
                    },
                    'sidebar': {
                        controller: 'ProfileCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/profile/sidebar.html'
                    }
                },
                resolve: {
                    transactions: ['HttpService', '$stateParams', function (HttpService, $stateParams) {
                        return HttpService.getWParams('/api/transactions', {params: {page: _.clone($stateParams).page || null}});
                    }]
                }
            })
            .state('profile.add_funds', {
                url: '/profile/add_funds',
                views: {
                    content: {
                        controller: 'ProfileCtrl.add_funds',
                        templateUrl: '/app/modules/dashboard/profile/add_funds.html'
                    },
                    'sidebar': {
                        controller: 'ProfileCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/profile/sidebar.html'
                    }
                },
                resolve: {
                    setting: ['HttpService', '$stateParams', function (HttpService) {
                        return HttpService.get('/api/settings/list?name=add_funds_text');
                    }]
                }
            })
            .state('profile.withdraw_funds', {
                url: '/profile/withdraw_funds',
                views: {
                    content: {
                        controller: 'ProfileCtrl.withdraw_funds',
                        templateUrl: '/app/modules/dashboard/profile/withdraw_funds.html'
                    },
                    'sidebar': {
                        controller: 'ProfileCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/profile/sidebar.html'
                    }
                },
                resolve: {
                    setting: ['HttpService', '$stateParams', function (HttpService) {
                        return HttpService.get('/api/settings/list?name=withdraw_text');
                    }]
                }
            })
            .state('profile.transfer', {
                url: '/profile/transfer',
                views: {
                    content: {
                        controller: 'ProfileCtrl.transfer',
                        templateUrl: '/app/modules/dashboard/profile/transfer.html'
                    },
                    'sidebar': {
                        controller: 'ProfileCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/profile/sidebar.html'
                    }
                },
                resolve: {
                    leagues: ['HttpService', function (HttpService) {
                        return HttpService.get('/api/leagues');
                    }],
                    users: ['HttpService', function (HttpService) {
                        return HttpService.get('/api/users/list');
                    }],
                    friends: ['HttpService', function (HttpService) {
                        return HttpService.get('/api/friends');
                    }],
                    setting: ['HttpService', '$stateParams', function (HttpService) {
                        return HttpService.get('/api/settings/list?name=transfer_text');
                    }]
                }
            })
            .state('profile.messages', {
                url: '/messages',
                views: {
                    content: {
                        controller: 'ProfileCtrl.messages',
                        templateUrl: '/app/modules/dashboard/profile/messages.html'
                    },
                    'sidebar': {
                        controller: 'ProfileCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/profile/sidebar.html'
                    }
                }
            })
            .state('profile.messages_create', {
                url: '/messages/create?selected_user_id',
                views: {
                    content: {
                        controller: 'ProfileCtrl.messages_create',
                        templateUrl: '/app/modules/dashboard/profile/messages_create.html'
                    },
                    'sidebar': {
                        controller: 'ProfileCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/profile/sidebar.html'
                    }
                },
                resolve: {
                    users: ['HttpService', '$stateParams', function (HttpService, $stateParams) {
                        return HttpService.get('/api/users/list');
                    }],
                    friends: ['HttpService', function (HttpService) {
                        return HttpService.get('/api/friends');
                    }]
                }
            })
            .state('profile.messages_dialog', {
                url: '/messages/dialog/:group_id',
                views: {
                    content: {
                        controller: 'ProfileCtrl.messages_dialog',
                        templateUrl: '/app/modules/dashboard/profile/messages_dialog.html'
                    },
                    'sidebar': {
                        controller: 'ProfileCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/profile/sidebar.html'
                    }
                },
                resolve: {
                    dialog: ['HttpService', '$stateParams', function (HttpService, $stateParams) {
                        return HttpService.get('/api/messages/' + $stateParams.group_id);
                    }]
                }
            })
            .state('profile.invite_league', {
                url: '/profile/invite_league/:token',
                views: {
                    content: {
                        controller: 'ProfileCtrl.invite_league',
                        templateUrl: '/app/modules/dashboard/profile/invite_league.html'
                    },
                    'sidebar': {
                        controller: 'ProfileCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/profile/sidebar.html'
                    }

                },
                resolve: {
                    invite: ['HttpService', '$stateParams', function (HttpService, $stateParams) {
                        return HttpService.get('/api/invites/league/' + $stateParams.token);
                    }]
                }
                // resolve: {
                //     invite : ['HttpService', '$rootScope', '$state', '$stateParams', '$q', '$timeout', '$location', 'Notify', function(HttpService, $rootScope, $state, $stateParams, $q, $timeout, $location, Notify) {
                //         var deferred = $q.defer();
                //         HttpService.get('/api/invites/league/' + $stateParams.token, function (resp) {
                //             deferred.resolve(resp);
                //         }, function (error) {
                //
                //             delete $rootScope.invite_league_token;
                //             $location.search({});
                //
                //             if(error && error.message) {
                //                 Notify.error(error.message)
                //             }
                //
                //             $timeout(function(){
                //                 $state.go('profile.home');
                //             });
                //             deferred.reject();
                //         });
                //
                //         return deferred.promise;
                //     }]
                // }
            })
            .state('profile.invite_friends', {
                url: '/profile/invite_friends',
                views: {
                    content: {
                        controller: 'ProfileCtrl.invite_friends',
                        templateUrl: '/app/modules/dashboard/profile/invite_friends.html'
                    },
                    'sidebar': {
                        controller: 'ProfileCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/profile/sidebar.html'
                    }
                },
                resolve: {
                    countries: ['HttpService', '$stateParams', function (HttpService, $stateParams) {
                        return HttpService.getWParams('/api/countries/calling_list');
                    }]
                }
            })

        ;
    }

    ProfileCtrl_Home.$inject = ['$rootScope', '$location', '$state', 'BreadCrumbsService', 'HttpService', 'Notify', 'last_message', '$scope', 'CordovaService', '$stateParams'];

    function ProfileCtrl_Home($rootScope, $location, $state, BreadCrumbsService, HttpService, Notify, last_message, $scope, CordovaService, $stateParams) {
        BreadCrumbsService.addCrumb(Lang.get('titles.home'));
        $scope.last_message = last_message.data;

        if ($scope.last_message) {
            CordovaService.setStatusBarColor();
        }

        HttpService.get('/api/profile', function (resp) {
            $rootScope.auth = resp;
        });

        // check if isset $stateParams invite to league
        if ($location.search().invite) {
            HttpService.get('/api/invites/league/' + $location.search().invite, function (resp) {
                //$state.go('profile.invite_league', {token: $location.search().invite })
                HttpService.post('/api/leagues/users/create/' + $location.search().invite)
                    .success(function (resp) {
                        if (resp && resp.data && resp.data.league_id) {
                            $state.go('leagues.link', {id: resp.data.league_id});
                            Notify.success(resp.message);
                        }
                    })
                    .error(function (error) {
                        if (error && error.message) {
                            Notify.error(error.message);
                        }
                    });
            }, function (error) {
                if (error && error.message) {
                    Notify.error(error.message);
                }
                $location.search({});
            });
        }

        //if($location.search().invite) {
        //    HttpService.get('/api/invites/league/' + $location.search().invite, function (resp) {
        //        //$state.go('profile.invite_league', {token: $location.search().invite })
        //        HttpService.post('/api/leagues/users/create/' + $location.search().invite)
        //            .success(function(resp){
        //                if(resp && resp.data && resp.data.league_id) {
        //                    $state.go('leagues.team', {id: resp.data.league_id });
        //                    //Notify.success(resp.message);
        //                }
        //            })
        //            .error(function(error){
        //                if(error && error.message) {
        //                    Notify.error(error.message);
        //                }
        //            });
        //    }, function (error) {
        //        if(error && error.message) {
        //            Notify.error(error.message);
        //        }
        //        $location.search({});
        //    });
        //}

        // StatusBar color check
        CordovaService.setStatusBarColor();

        // Init device & pushes
        CordovaService.initDevice();
    }

    function ProfileCtrl_Sidebar() {

    }

    ProfileCtrl_Edit.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'HttpService', 'Notify', 'CONFIG', 'Profile', /*'SecurityQuestions',*/ 'BreadCrumbsService', 'CordovaService'];

    function ProfileCtrl_Edit($rootScope, $scope, $state, $stateParams, HttpService, Notify, CONFIG, Profile, /*SecurityQuestions,*/ BreadCrumbsService, CordovaService) {

        BreadCrumbsService.addCrumb(Lang.get('titles.profile.settings'));
        $scope.user = Profile.data;

        HttpService.get('/api/profile', function (resp) {
            $rootScope.auth = resp;
        });

        if (!$scope.user.notifications) {
            $scope.user.notifications = {
                email: {
                    new_message: true,
                    new_transaction: true
                }
            }
        }

        //$scope.options_security_questions = SecurityQuestions.data;

        // If user fill question
        /*if(Profile.data.security_answer) {
            $scope.options_security_questions.push(Profile.data.security_answer.question);
        }*/

        $scope.options_skins = CONFIG.settings.skins;

        $scope.options_skins_border = CONFIG.settings.skins_border;

        //if(!$scope.user.is_active) {
        //    Notify.warning('Please fill you profile first');
        //}


        $scope.item = {
            skin: $scope.user.skin,
            skin_border: $scope.user.skin_border,
            avaToken: $scope.user.avatar ? $scope.user.avatar.token : null,
            /*security_answer: {
                question: $scope.user.security_answer ? $scope.user.security_answer.question : _.first($scope.options_security_questions),
                answer: $scope.user.security_answer ? $scope.user.security_answer.answer : null
            },*/
            notifications: $scope.user.notifications,
            phone: $scope.user.phone ? $scope.user.phone.slice(2) : ''
        };

        $scope.update_profile = function () {
            var data = Object.assign({}, $scope.item);
            if (data.phone) {
                data.phone = '+1' + data.phone;
            }

            // Update user profile
            HttpService.put('/api/profile', data, function (resp) {
                $rootScope.auth = resp.data;

                // Cordova status bar change
                CordovaService.setStatusBarColor();

                Notify.success(resp.message);
                $state.reload();
                $state.go('profile.home', _.clone($stateParams));
            });
        };

        // watch for avatar
        $scope.$watch('item.avaToken', function (nv, ov) {
            if (nv && nv !== ov) {
                $rootScope.auth.avaToken = nv;
            }
        });


        $scope.ui = {
            skin: {
                chooser: false,
                change: function (val) {
                    $scope.item.skin = val;
                    $scope.$root.auth.skin = val;

                    // Cordova status bar change
                    CordovaService.setStatusBarColor();
                }
            },
            skins_border: {
                chooser: false,
                change: function (val) {
                    $scope.item.skin_border = val;
                    $scope.$root.auth.skin_border = val;

                    // Cordova status bar change
                    CordovaService.setStatusBarColor();
                }
            }
        }

    }

    ProfileCtrl_Support.$inject = ['$rootScope', '$scope', '$state', 'HttpService', 'Notify', 'BreadCrumbsService'];

    function ProfileCtrl_Support($rootScope, $scope, $state, HttpService, Notify, BreadCrumbsService) {
        BreadCrumbsService.addCrumb(Lang.get('titles.profile.support'));

        HttpService.get('/api/profile', function (resp) {
            $rootScope.auth = resp;
        });

        $scope.ticket = {};
        $scope.sendTicket = sendTicketFn;

        function sendTicketFn() {
            HttpService.post('/api/ticket', $scope.ticket)
                .success(function (resp) {
                    $scope.errors = null;
                    $scope.ticket = null;
                    Notify.success(resp.message);
                })
                .error(function (resp) {
                    $scope.errors = resp;
                })
            ;
        }
    }


    ProfileCtrl_Transactions.$inject = ['$rootScope', '$scope', '$filter', 'BreadCrumbsService', 'HttpService', 'transactions'];

    function ProfileCtrl_Transactions($rootScope, $scope, $filter, BreadCrumbsService, HttpService, transactions) {
        BreadCrumbsService.addCrumb(Lang.get('titles.profile.transactions'));

        HttpService.get('/api/profile', function (resp) {
            $rootScope.auth = resp;
        });

        $scope.transactions = transactions.data;

        $scope.transactions.data = _.groupBy(transactions.data.data, function (x) {
            return $filter('dateFormat')(x.created_at, 'MM/dd/yyyy');
        });

        // Update statistics
        $scope.groupFn = function (data) {
            if (data) {
                return _.groupBy(data, function (x) {
                    return $filter('dateFormat')(x.created_at, 'MM/dd/yyyy');
                });
            }
        };
    }

    ProfileCtrl_Add_Funds.$inject = ['$rootScope', '$scope', '$sce', 'BreadCrumbsService', 'HttpService', 'Notify', 'ngDialog', 'setting'];

    function ProfileCtrl_Add_Funds($rootScope, $scope, $sce, BreadCrumbsService, HttpService, Notify, ngDialog, setting) {
        BreadCrumbsService.addCrumb(Lang.get('titles.profile.add_fund'));

        var $ctrl = this;

        HttpService.get('/api/profile', function (resp) {
            $rootScope.auth = resp;
        });

        $scope.setting_text = (typeof setting !== 'undefined') ? $sce.trustAsHtml(setting.data.value) : '';
        $scope.user = $rootScope.auth;

        $scope.balance = $rootScope.auth.data.balance;

        $scope.server_message = null;
        $scope.item = {
            amount: null,
            note: null
        };

        $scope.updateIframe = function () {
            document.getElementById('payform').contentWindow.updateData($scope.item);
        };

        $scope.sUrl = null;

        $scope.submit = function () {

            Notify.confirm_cordova(function () {
                HttpService.post('/api/transactions/charge', $scope.item, function (resp) {
                    $scope.sec = $sce.trustAsResourceUrl("https://pay.skrill.com/?sid=" + resp.data);
                    ngDialog.open({
                        template: 'skrill_iframe.html',
                        showClose: false,
                        controller: 'ProfileCtrl.add_funds',
                        data: {
                            sUrl: $scope.sec
                        },
                        resolve: {
                            setting: ['HttpService', '$stateParams', function (HttpService) {
                                return HttpService.get('/api/settings/list?name=add_funds_text');
                            }]
                        },
                        scope: true
                    });

                    $scope.$on('ngDialog.opened', function (e, $dialog) {
                        console.log('opened');
                    });

                }, function (error) {
                    console.log(error);
                    if (error.message) {
                        $scope.server_message = error.message;
                        Notify.alert_cordova(error.message, null, null)
                    }
                })
            }, Lang.get('notify_actions.transactions.confirm_charge'));
        }

    }

    ProfileCtrl_Withdraw_Funds.$inject = ['$rootScope', '$scope', '$sce', 'BreadCrumbsService', 'HttpService', 'Notify', 'setting'];

    function ProfileCtrl_Withdraw_Funds($rootScope, $scope, $sce, BreadCrumbsService, HttpService, Notify, setting) {
        BreadCrumbsService.addCrumb(Lang.get('titles.profile.withdraw'));

        HttpService.get('/api/profile', function (resp) {
            $rootScope.auth = resp;
        });

        $scope.setting_text = (typeof setting !== 'undefined') ? $sce.trustAsHtml(setting.data.value) : '';
        $scope.options_payment_types = [
            {key: null, value: '- Select -'},
            {key: 1, value: 'Skrill Wallet'}
        ];

        // Init
        $scope.user = $scope.$root.auth;
        $scope.server_message = null;

        // Model
        $scope.item = {
            amount: null,
            note: null,
            payment_type: null,
            skrill_email: null
        };

        // Fn
        $scope.submit = function () {
            var errors = {};
            if ($scope.item.payment_type != null && $scope.item.skrill_email == null) {
                errors.skrill_email = ['Enter your Skrill Wallet Email'];
                $scope.$emit('form:error', errors);
            } else {
                Notify.confirm_cordova(function () {
                    HttpService.post('/api/transactions/withdraw', $scope.item, function (res) {
                        $scope.server_message = null;
                        if ($scope.$root.auth.data) {
                            $scope.$root.auth.data.balance = parseFloat($scope.$root.auth.data.balance) - parseFloat($scope.item.amount);
                        }
                        $scope.item.amount = null;
                        $scope.item.note = null;
                        $scope.item.skrill_email = null;

                        Notify.success(res.message);
                    }, function (error) {
                        $scope.server_message = error.message;
                    })
                }, Lang.get('notify_actions.transactions.confirm_withdraw'));
            }
        }
    }

    ProfileCtrl_Messages.$inject = ['$rootScope', '$scope', 'BreadCrumbsService', '$stateParams', 'HttpService'];

    function ProfileCtrl_Messages($rootScope, $scope, BreadCrumbsService, $stateParams, HttpService) {
        BreadCrumbsService.addCrumb(Lang.get('titles.profile.messages'));

        HttpService.get('/api/profile', function (resp) {
            $rootScope.auth = resp;
        });
    }

    ProfileCtrl_MessagesDialog.$inject = ['$rootScope', '$scope', 'BreadCrumbsService', 'HttpService', '$stateParams', 'dialog', '$state', 'MessageHelper'];

    function ProfileCtrl_MessagesDialog($rootScope, $scope, BreadCrumbsService, HttpService, $stateParams, dialog, $state, MessageHelper) {

        HttpService.get('/api/profile', function (resp) {
            $rootScope.auth = resp;
        });

        if (!_.isEmpty(dialog.data)) {
            BreadCrumbsService.addCrumb(Lang.get('titles.profile.messages'));
            $scope.dialog = dialog.data;
            $scope.league_id = $stateParams.group_id;
            $scope.getConversationPerson = MessageHelper.getConversationPerson;
            $scope.leagueid = $stateParams.group_id;
        } else {
            $state.go('messages_create', {id: $stateParams.id, selected_user_id: $stateParams.group_id});
        }
    }

    ProfileCtrl_MessagesCreate.$inject = ['$scope', '$rootScope', '$window', 'users', 'friends', '$stateParams', 'HttpService', '$state'];

    function ProfileCtrl_MessagesCreate($scope, $rootScope, $window, users, friends, $stateParams, HttpService, $state) {
        var user_options = [];

        _.each(users.data, function (value, key) {
            user_options.push({
                id: key,
                name: value
            });
        });

        $scope.users = _.reject(user_options, function (user) {
            return user.id === $scope.$root.auth.id
        });
        $scope.friends = friends;
        $scope.addMessage = addMessageFn;
        $scope.newMessage = {recipients: []};
        $scope.friendsList = [];
        $scope.emails = [];


        let friendsIdsList = [];
        for (var i = 0; i < friends.data.length; i++) {
            let myLeagueContact = {};
            let user_id = friends.data[i].user.id;
            let full_name = friends.data[i].user.first_name + " " + friends.data[i].user.last_name;

            if (user_id !== $scope.$root.auth.id) {

                if ($stateParams.selected_user_id !== 'undefined' && user_id === parseInt($stateParams.selected_user_id)) {
                    $scope.newMessage.recipients.push(user_id);
                }

                myLeagueContact.id = user_id;
                myLeagueContact.name = full_name;

                var idIndex = $.inArray(myLeagueContact.id, friendsIdsList);

                if (idIndex < 0) {
                    friendsIdsList.push(myLeagueContact.id);
                    $scope.friendsList.push(myLeagueContact);
                }

            }
        }

        function addMessageFn() {
            HttpService.post('/api/messages', $scope.newMessage, function (resp) {
                $state.go('profile.messages_dialog', {group_id: resp.data.group_id}, {location: false});
                $state.go('profile.messages');
            }, function (err) {
                $scope.errors = err;
            });
        }

        $scope.searchMedia = function ($select) {
            let index = $scope.emails.findIndex(function (x) {
                return x === $select.search;
            });
            if (index === -1) { // if value didnt add before
                HttpService.get('/api/users/' + $select.search, function (resp) {
                    if (resp.error === false) {
                        $scope.friendsList.push({
                            id: resp.id,
                            name: resp.full_name
                        });
                        $scope.emails.push($select.search);
                        $scope.newMessage.recipients.push(resp.id);
                        $select.search = null;
                    }
                });
            }
        };
    }

    ProfileCtrl_Transfer.$inject = ['$rootScope', '$scope', '$sce', 'BreadCrumbsService', 'HttpService', 'Notify', 'leagues', 'users', 'friends', 'setting'];

    function ProfileCtrl_Transfer($rootScope, $scope, $sce, BreadCrumbsService, HttpService, Notify, leagues, users, friends, setting) {
        BreadCrumbsService.addCrumb(Lang.get('titles.profile.transfer'));

        HttpService.get('/api/profile', function (resp) {
            $rootScope.auth = resp;
        });
        $scope.setting_text = $sce.trustAsHtml(setting.data.value);
        // Model
        $scope.item = {
            amount: null,
            owner_id: null,
            league_id: null,
            note: null,
            email: null,
            is_email_valid: false
        };

        // [options] to
        $scope.options_to = [
            {id: 1, value: 'All Users'},
            {id: 2, value: 'Friends'},
            {id: 3, value: 'Leagues'}
        ];

        $scope.selectUserChanged = function (item) {
            if (item && item.originalObject) {
                $scope.item.owner_id = item.originalObject.id;
            }
        };

        $scope.selectLeagueChanged = function (item) {
            if (item && item.originalObject) {
                $scope.item.league_id = item.originalObject.id;
            }
        };

        $scope.validateEmail = function () {
            $scope.item.is_email_valid = false;
            setTimeout(function () {
                HttpService.post('/api/users/validate-email', {email: $scope.item.email}, function (resp) {
                    $scope.item.is_email_valid = !resp.error;
                });
            }, 300);
        };

        $scope.updateOptionsOwners = function (resp) {
            if ($scope.item.is_email_valid) {
                HttpService.get('/api/users/' + $scope.item.email, function (resp) {
                    $scope.options_owners = [resp];
                });
            }
        };

        // [options] friends
        $scope.options_friends = _.map(friends.data, function (item, index) {
            return {id: item.user.id, value: item.user.full_name};
        });
        $scope.options_friends = _.filter($scope.options_friends, function (item) {
            return item.id != $scope.$root.auth.id;
        });

        // [options] leagues
        $scope.options_leagues = _.map(leagues.data, function (x) {
            return {id: x.id, name: x.name, avaToken: x.avaToken}
        });

        // Watchers
        $scope.$watch('item.league_id', function (n) {
            if (n && $scope.item.owner_id) {
                $scope.item.owner_id = undefined;
            }
        });
        $scope.$watch('item.owner_id', function (n) {
            if (n && $scope.item.league_id) {
                $scope.item.league_id = undefined;
            }
        });
        $scope.$watch('item.is_email_valid', function (n) {
            if (n === true) {
                $scope.updateOptionsOwners()
            }
        });
        // Fn
        $scope.submit = function () {

            Notify.confirm_cordova(function () {

                HttpService.post('/api/transactions/transfer', $scope.item, function (res) {

                    //$scope.$broadcast('angucomplete-alt:clearInput');

                    $scope.server_message = null;
                    if ($scope.$root.auth.data) {
                        $scope.$root.auth.data.balance = parseFloat($scope.$root.auth.data.balance) - parseFloat($scope.item.amount);
                    }
                    $scope.item = {
                        amount: null,
                        owner_id: null,
                        league_id: null,
                        note: null
                    };

                    Notify.success(res.message);
                }, function (error) {
                    console.log(error);
                    if (error && error.owner_id) {
                        $scope.server_message = Lang.get('notify_actions.transactions.bad_user_or_league');
                    }
                    if (error && error.league_id) {
                        $scope.server_message = Lang.get('notify_actions.transactions.bad_user_or_league');
                    }
                    if (error && error.message) {
                        $scope.server_message = error.message;
                    }
                })
            }, Lang.get('notify_actions.transactions.confirm_transfer'));
        }

    }

    ProfileCtrl_Invite_League.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'BreadCrumbsService', 'HttpService', 'Notify', 'invite'];

    function ProfileCtrl_Invite_League($rootScope, $scope, $state, $stateParams, BreadCrumbsService, HttpService, Notify, invite) {

        BreadCrumbsService.addCrumb(Lang.get('titles.profile.invite_league'));

        HttpService.get('/api/profile', function (resp) {
            $rootScope.auth = resp;
        });

        $scope.league = invite.data;

        $scope.server_message = null;

        $scope.item = {
            amount: null
        };

        if (!$rootScope.auth.data) {
            $rootScope.auth.data = {
                balance: 0
            }
        }

        $scope.charge = function () {
            Notify.confirm_cordova(function () {
                HttpService.post('/api/transactions/charge', $scope.item, function (res) {
                    $scope.server_message = null;
                    if (!$scope.$root.auth.data) {
                        $scope.$root.auth.data = {
                            balance: 0
                        }
                    }
                    $scope.$root.auth.data.balance = parseFloat($scope.$root.auth.data.balance) + parseFloat($scope.item.amount);
                    $scope.item.amount = null;

                    Notify.success(res.message);
                }, function (error) {
                    $scope.server_message = error.message;
                })
            }, Lang.get('notify_actions.transactions.confirm_charge'));
        };

        $scope.inviteAccept = function () {
            HttpService.put('/api/leagues/accept_invite', {token: $stateParams.token}, function (res) {
                $scope.$root.auth.data.balance = parseFloat($scope.$root.auth.data.balance) - parseFloat($scope.league.amount);
                Notify.success(res.message);
                $state.go('leagues.link', {id: $scope.league.id});
            }, saveFnError)
        };

        $scope.inviteDecline = function () {
            HttpService.put('/api/leagues/decline_invite', {token: $stateParams.token}, function (res) {
                $state.go('profile.home');
                Notify.success(res.message);
            }, saveFnError)
        };


        function saveFnError(err) {
            if (err && err.message) {
                Notify.success(err.message);
            }

        }
    }

    ProfileCtrl_Invite_Friends.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'BreadCrumbsService', 'HttpService', 'Notify', 'countries'];

    function ProfileCtrl_Invite_Friends($rootScope, $scope, $state, $stateParams, BreadCrumbsService, HttpService, Notify, countries) {

        BreadCrumbsService.addCrumb(Lang.get('titles.profile.invite_friends'));

        HttpService.get('/api/profile', function (resp) {
            $rootScope.auth = resp;
        });

        $scope.invite = {
            phone: ''
        };

        // [options] countries
        $scope.options_countries = _.map(countries.data, function (name, id) {
            return {id: id, name: name}
        });

        console.log($scope.options_countries);

        $scope.addPhoneCode = function () {
            $scope.invite.phone = $scope.invite.country_code;
        };

        $scope.sentInvite = function () {
            var data = Object.assign({}, $scope.invite);
            if (data.phone) {
                data.phone = '+1' + data.phone;
            }

            HttpService.post('/api/profile/invite_friends', data, function (res) {
                $scope.invite = {};
                Notify.success(res.message);
                $state.go('profile.home')
            }, function (err) {
                if (err && err.message) {
                    Notify.success(err.message);
                }
            })
        }
    }

    ProfileCtrl_Faq.$inject = ['$rootScope', '$scope', '$state', 'HttpService', 'Notify', 'BreadCrumbsService'];

    function ProfileCtrl_Faq($rootScope, $scope, $state, HttpService, Notify, BreadCrumbsService) {
        BreadCrumbsService.addCrumb(Lang.get('titles.profile.faq'));

    }

    function customUiSelect() {
        var directive = {
            restrict: 'E',
            templateUrl: '/app/directives/form/ui-select.html',
            scope: {
                model: '=',
                options: '=',
                label: '@',
                required: '=',
                disabled: '=',
                searchenabled: '@',
                allowclean: '@',
                placeholder: '@',
                default: '@',
                name: '@',
                transclude: '@',
                filter: '&?'
            },
            replace: true,
            priority: 10,
            controller: ['$scope', controllerFunc]
        };

        return directive;

        function controllerFunc($scope) {

            // Filter items
            $scope.filter = $scope.filter ? $scope.filter() : function () {
                return true;
            };

            $scope.$root.$on('form:error', function (event, res) {
                $scope.errors = res[$scope.name];
            });
        }
    }

})();
