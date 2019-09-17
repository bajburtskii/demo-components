(function () {
    'use strict';

    angular
        .module('app.leagues', [
            'satellizer'
        ])

        .config(configure)
        .controller('LeaguesCtrl.sidebar', LeaguesCtrl_Sidebar)

        .controller('LeaguesCtrl.list', LeaguesCtrl_List)
        .controller('LeaguesCtrl.edit', LeaguesCtrl_Edit)

        .controller('LeaguesCtrl.bank', LeaguesCtrl_Bank)
        .controller('LeaguesCtrl.transactions', LeaguesCtrl_Transactions)
        .controller('LeaguesCtrl.owners', LeaguesCtrl_Owners)
        .controller('LeaguesCtrl.team', LeaguesCtrl_Team)
        .controller('LeaguesCtrl.vendor', LeaguesCtrl_Vendor)
        .controller('LeaguesCtrl.invite', LeaguesCtrl_Invite)
        .controller('LeaguesCtrl.board', LeaguesCtrl_Board)
        .controller('LeaguesCtrl.invite_league', LeaguesCtrl_Invite_League)

        .controller('LeaguesCtrl.dashboard', LeaguesCtrl_Dashboard)
        .controller('LeaguesCtrl.freeAgency', LeaguesCtrl_FreeAgency)
        .controller('LeaguesCtrl.standings', LeaguesCtrl_Standings)
        .controller('LeaguesCtrl.scoresAndSchedule', LeaguesCtrl_ScoresAndSchedule)
        .controller('LeaguesCtrl.teams', LeaguesCtrl_Teams)
        .controller('LeaguesCtrl.trades', LeaguesCtrl_Trades)

        .controller('LeaguesCtrl.link', LeaguesCtrl_Link)
        .controller('LeaguesCtrl.provlink', LeaguesCtrl_ProvLink)
        .controller('LeaguesCtrl.share', LeaguesCtrl_Share)

    ;

    /* Fn
     ============================================================================================================= */
    configure.$inject = ['$stateProvider', '$authProvider'];
    function configure($stateProvider, $authProvider) {

        // Yahoo
        // $authProvider.oauth1({
        //     clientId: APP_CONFIG.services.yahoo.client_id,
        //     name: 'yahoo',
        //     url: APP_CONFIG.services.yahoo.redirect,
        //     authorizationEndpoint: 'https://api.login.yahoo.com/oauth/v2/request_auth',
        //     redirectUri: APP_CONFIG.services.yahoo.callback_url,
        //     display: 'popup',
        //     oauthType: '1.0',
        //     popupOptions: { width: 580, height: 400 }
        // });

        // Yahoo
        $authProvider.yahoo({
          url: '/api/auth/yahoo',
          clientId: APP_CONFIG.services.yahoo.client_id,
          authorizationEndpoint: 'https://api.login.yahoo.com/oauth2/request_auth',
          redirectUri: APP_CONFIG.services.yahoo.callback_url,
          scope: [],
          scopeDelimiter: ',',
          oauthType: '2.0',
          popupOptions: { width: 559, height: 519 }
        });


        $stateProvider
            .state('leagues', {
                abstract   : true,
                url        : '/dashboard/leagues',
                views : {
                    '' : {
                        templateUrl: '/app/modules/dashboard/layout.html'
                    }
                },
                resolve: {
                    items : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues');
                    }],
                    sports : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/sports');
                    }],
                    providers: ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/providers');
                    }]
                }
            })
            .state('leagues.list', {
                url  : '',
                views: {
                    content: {
                        controller : 'LeaguesCtrl.list',
                        templateUrl: '/app/modules/dashboard/leagues/list.html'
                    },
                    'sidebar' : {
                        controller: 'LeaguesCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/leagues/sidebar.html'
                    }
                }
            })
            .state('leagues.provider', {
                url  : '/provider',
                views: {
                    content: {
                        controller : 'LeaguesCtrl.edit',
                        templateUrl: '/app/modules/dashboard/leagues/provider.html'
                    }
                },
                resolve: {
                    sports : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/sports');
                    }]
                }
            })
            .state('leagues.league', {
                url  : '/league',
                templateUrl: '/app/modules/dashboard/leagues/league.html'
            })
            .state('leagues.payment', {
                url  : '/payment',
                templateUrl: '/app/modules/dashboard/leagues/payment.html'
            })
            .state('leagues.create', {
                url  : '/create?welcome',
                params: {
                    welcome: null,
                },
                views: {
                    content: {
                        controller : 'LeaguesCtrl.edit',
                        templateUrl: '/app/modules/dashboard/leagues/create.html'
                    },
                    'sidebar' : {
                        controller: 'LeaguesCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/leagues/sidebar.html'
                    },
                    'form@leagues.create' : {
                        templateUrl: '/app/modules/dashboard/leagues/form.html'
                    }
                },
                resolve : {
                    item: function () {
                        return {data: {}}
                    },
                    users: function () {
                        return {data: {}}
                    },
                }
            })
            .state('leagues.edit', {
                url  : '/:id/edit',
                views: {
                    content: {
                        controller : 'LeaguesCtrl.edit',
                        templateUrl: '/app/modules/dashboard/leagues/edit.html'
                    },
                    'sidebar' : {
                        controller: 'LeaguesCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/leagues/sidebar.html'
                    },
                    'form@leagues.edit' : {
                        templateUrl: '/app/modules/dashboard/leagues/form.html'
                    }
                },
                resolve: {
                    item : [
                        'HttpService', '$stateParams','$q', '$state', '$timeout',
                        function(HttpService, $stateParams, $q, $state, $timeout) {
                            var deferred = $q.defer();
                            HttpService.get('/api/leagues/' + $stateParams.id)
                                .success(function(resp) {
                                    if (resp.is_user_active === false) {
                                        $timeout(function(){
                                            $state.go('leagues.invite_league', {id: $stateParams.id })
                                        });
                                        deferred.reject();
                                    } else {
                                        deferred.resolve(resp);
                                    }
                                });
                            return deferred.promise;
                        }
                    ],
                    users : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/' + $stateParams.id + '/users');
                    }]
                }
            })

            // SUB ROUTES
            .state('leagues.bank', {
                url  : '/:id/bank',
                views: {
                    content: {
                        controller : 'LeaguesCtrl.bank',
                        templateUrl: '/app/modules/dashboard/leagues/sub/bank.html'
                    },
                    'sidebar' : {
                        controller: 'LeaguesCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/leagues/sidebar.html'
                    }
                },
                resolve: {
                    item : [
                        'HttpService', '$stateParams','$q', '$state', '$timeout',
                        function(HttpService, $stateParams, $q, $state, $timeout) {
                            var deferred = $q.defer();
                            HttpService.get('/api/leagues/' + $stateParams.id)
                                .success(function(resp) {
                                    if (resp.is_user_active === false) {
                                        $timeout(function(){
                                            $state.go('leagues.invite_league', {id: $stateParams.id })
                                        });
                                        deferred.reject();
                                    } else {
                                        deferred.resolve(resp);
                                    }
                                });

                            return deferred.promise;
                        }
                    ],
                    payin : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/'+$stateParams.id+'/payin');
                    }],
                    paid : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/'+$stateParams.id+'/paid');
                    }],
                    users : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/'+$stateParams.id+'/users');
                    }]
                }
            })
            .state('leagues.transactions', {
                url  : '/:id/transactions?page',
                views: {
                    content: {
                        controller : 'LeaguesCtrl.transactions',
                        templateUrl: '/app/modules/dashboard/leagues/sub/transactions.html'
                    },
                    'sidebar' : {
                        controller: 'LeaguesCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/leagues/sidebar.html'
                    }
                },
                resolve: {
                    item : [
                        'HttpService', '$stateParams','$q', '$state', '$timeout',
                        function(HttpService, $stateParams, $q, $state, $timeout) {
                            var deferred = $q.defer();
                            HttpService.get('/api/leagues/' + $stateParams.id)
                                .success(function(resp) {
                                    if (resp.is_user_active === false) {
                                        $timeout(function(){
                                            $state.go('leagues.invite_league', {id: $stateParams.id })
                                        });
                                        deferred.reject();
                                    } else {
                                        deferred.resolve(resp);
                                    }
                                });

                            return deferred.promise;
                        }
                    ],
                    transactions : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.getWParams('/api/leagues/'+$stateParams.id+'/transactions', {params: { page: _.clone($stateParams).page || null } });
                    }],
                    transactions_non_confirmed : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/'+$stateParams.id+'/transactions/non_confirmed');
                    }]
                }
            })
            .state('leagues.owners', {
                url  : '/:id/owners',
                views: {
                    content: {
                        controller : 'LeaguesCtrl.owners',
                        templateUrl: '/app/modules/dashboard/leagues/sub/owners.html'
                    },
                    'sidebar' : {
                        controller: 'LeaguesCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/leagues/sidebar.html'
                    }
                },
                resolve: {
                    item : [
                        'HttpService', '$stateParams','$q', '$state', '$timeout',
                        function(HttpService, $stateParams, $q, $state, $timeout) {
                            var deferred = $q.defer();
                            HttpService.get('/api/leagues/' + $stateParams.id)
                                .success(function(resp) {
                                    if (resp.is_user_active === false) {
                                        $timeout(function(){
                                            $state.go('leagues.invite_league', {id: $stateParams.id })
                                        });
                                        deferred.reject();
                                    } else {
                                        deferred.resolve(resp);
                                    }
                                });

                            return deferred.promise;
                        }
                    ],
                    users : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/'+$stateParams.id+'/users');
                    }]
                }
            })

            .state('leagues.owncreate', {
                url  : '/create',
                views: {
                    content: {
                        controller : 'LeaguesCtrl.edit',
                        templateUrl: '/app/modules/dashboard/leagues/create.html'
                    },
                    'sidebar' : {
                        controller: 'LeaguesCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/leagues/sidebar.html'
                    },
                    'form@leagues.create' : {
                        templateUrl: '/app/modules/dashboard/leagues/form.html'
                    }
                },
                resolve : {
                    item: function () {
                        return {data: {}}
                    }
                }
            })
            .state('leagues.invite', {
                url  : '/:id/invite',
                views: {
                    content: {
                        controller : 'LeaguesCtrl.invite',
                        templateUrl: '/app/modules/dashboard/leagues/sub/invite.html'
                    },
                    'sidebar' : {
                        controller: 'LeaguesCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/leagues/sidebar.html'
                    }
                },
                resolve: {
                    item : [
                        'HttpService', '$stateParams','$q', '$state', '$timeout',
                        function(HttpService, $stateParams, $q, $state, $timeout) {
                            var deferred = $q.defer();
                            HttpService.get('/api/leagues/' + $stateParams.id)
                                .success(function(resp) {
                                    if (resp.is_user_active === false) {
                                        $timeout(function(){
                                            $state.go('leagues.invite_league', {id: $stateParams.id })
                                        });
                                        deferred.reject();
                                    } else {
                                        deferred.resolve(resp);
                                    }
                                });

                            return deferred.promise;
                        }
                    ],
                    countries : ['HttpService', function(HttpService) {
                        return HttpService.getWParams('/api/countries/calling_list');
                    }]
                }
            })
            .state('leagues.board', {
                url  : '/:id/board',
                views: {
                    content: {
                        controller : 'LeaguesCtrl.board',
                        templateUrl: '/app/modules/dashboard/leagues/sub/board.html'
                    },
                    'sidebar' : {
                        controller: 'LeaguesCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/leagues/sidebar.html'
                    }
                },
                resolve: {
                    item : [
                        'HttpService', '$stateParams','$q', '$state', '$timeout',
                        function(HttpService, $stateParams, $q, $state, $timeout) {
                            var deferred = $q.defer();
                            HttpService.get('/api/leagues/' + $stateParams.id)
                                .success(function(resp) {
                                    if (resp.is_user_active === false) {
                                        $timeout(function(){
                                            $state.go('leagues.invite_league', {id: $stateParams.id })
                                        });
                                        deferred.reject();
                                    } else {
                                        deferred.resolve(resp);
                                    }
                                });

                            return deferred.promise;
                        }
                    ],
                    messages : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/' + $stateParams.id + '/board');
                    }]
                }
            })
            .state('leagues.invite_league', {
                url  : '/:id/invite_league',
                views: {
                    content: {
                        controller : 'LeaguesCtrl.invite_league',
                        templateUrl: '/app/modules/dashboard/leagues/invite_league.html'
                    },
                    'sidebar' : {
                        controller: 'LeaguesCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/leagues/sidebar.html'
                    }
                },
                resolve: {
                    invite : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/' + $stateParams.id);
                    }]
                }
            })
            .state('leagues.link', {
                url  : '/:id/link',
                views: {
                    content: {
                        controller : 'LeaguesCtrl.link',
                        templateUrl: '/app/modules/dashboard/leagues/list.html'
                        // templateUrl: '/app/modules/dashboard/leagues/sub/link.html'
                    },
                    'sidebar' : {
                        controller: 'LeaguesCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/leagues/sidebar.html'
                    }
                },
                resolve : {
                    item : [
                        'HttpService', '$stateParams','$q', '$state', '$timeout',
                        function(HttpService, $stateParams, $q, $state, $timeout) {
                            var deferred = $q.defer();
                            HttpService.get('/api/leagues/' + $stateParams.id)
                                .success(function(resp) {
                                    if (resp.is_user_active === false) {
                                        $timeout(function(){
                                            $state.go('leagues.invite_league', {id: $stateParams.id })
                                        });
                                        deferred.reject();
                                    } else {
                                        deferred.resolve(resp);
                                    }
                                });

                            return deferred.promise;
                        }
                    ],
                    users : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/' + $stateParams.id + '/users');
                    }]
                }
            })
            .state('leagues.provlink', {
                url  : '/:id/provlink',
                views: {
                    content: {
                        controller : 'LeaguesCtrl.provlink',
                        templateUrl: '/app/modules/dashboard/leagues/sub/link.html'
                    },
                    'sidebar' : {
                        controller: 'LeaguesCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/leagues/sidebar.html'
                    }
                },
                resolve : {
                    item : [
                        'HttpService', '$stateParams','$q', '$state', '$timeout',
                        function(HttpService, $stateParams, $q, $state, $timeout) {
                            var deferred = $q.defer();
                            HttpService.get('/api/leagues/' + $stateParams.id)
                                .success(function(resp) {
                                    if (resp.is_user_active === false) {
                                        $timeout(function(){
                                            $state.go('leagues.invite_league', {id: $stateParams.id })
                                        });
                                        deferred.reject();
                                    } else {
                                        deferred.resolve(resp);
                                    }
                                });

                            return deferred.promise;
                        }
                    ],
                    users : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/' + $stateParams.id + '/users');
                    }] 
                }
            })
            .state('leagues.share', {
                url  : '/:id/share',
                views: {
                    content: {
                        controller : 'LeaguesCtrl.share',
                        templateUrl: '/app/modules/dashboard/leagues/sub/share.html'
                    },
                    'sidebar' : {
                        controller: 'LeaguesCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/leagues/sidebar.html'
                    }
                },
                resolve : {
                    item : [
                        'HttpService', '$stateParams','$q', '$state', '$timeout',
                        function(HttpService, $stateParams, $q, $state, $timeout) {
                            var deferred = $q.defer();
                            HttpService.get('/api/leagues/' + $stateParams.id)
                                .success(function(resp) {
                                    if (resp.is_user_active === false) {
                                        $timeout(function(){
                                            $state.go('leagues.invite_league', {id: $stateParams.id })
                                        });
                                        deferred.reject();
                                    } else {
                                        deferred.resolve(resp);
                                    }
                                });

                            return deferred.promise;
                        }
                    ],
                    users : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/' + $stateParams.id + '/users');
                    }]
                }
            })
            .state('leagues.dashboard', {
                url : '/:id/dashboard',
                views: {
                    content: {
                        controller: 'LeaguesCtrl.dashboard',
                        templateUrl: '/app/modules/dashboard/leagues/dashboard.html'
                    },
                    'sidebar' : {
                        controller: 'LeaguesCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/leagues/sidebar.html'
                    }
                },
                resolve : {
                    item : [
                        'HttpService', '$stateParams','$q', '$state', '$timeout',
                        function(HttpService, $stateParams, $q, $state, $timeout) {
                            var deferred = $q.defer();
                            HttpService.get('/api/leagues/' + $stateParams.id)
                                .success(function(resp) {
                                    if (resp.is_user_active === false) {
                                        $timeout(function(){
                                            $state.go('leagues.invite_league', {id: $stateParams.id })
                                        });
                                        deferred.reject();
                                    } else {
                                        deferred.resolve(resp);
                                    }
                                });

                            return deferred.promise;
                        }
                    ],
                    users : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/' + $stateParams.id + '/users');
                    }],
                    scores : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/linked/' + $stateParams.id + '/scores');
                    }],
                    teams: ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/linked/' + $stateParams.id + '/teams');
                    }],
                      trades: ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                       return HttpService.get('/api/leagues/linked/' + $stateParams.id + '/trades');
                    }]

                }
            })
            .state('leagues.team', {
                url  : '/:id/team',
                views: {
                    content: {
                        controller : 'LeaguesCtrl.team',
                        templateUrl: '/app/modules/dashboard/leagues/sub/team_form.html'
                    },
                    'sidebar' : {
                        controller: 'LeaguesCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/leagues/sidebar.html'
                    }
                },
                resolve : {
                    item : [
                        'HttpService', '$stateParams','$q', '$state', '$timeout',
                        function(HttpService, $stateParams, $q, $state, $timeout) {
                            var deferred = $q.defer();
                            HttpService.get('/api/leagues/' + $stateParams.id)
                                .success(function(resp) {
                                    if (resp.is_user_active === false) {
                                        $timeout(function(){
                                            $state.go('leagues.invite_league', {id: $stateParams.id })
                                        });
                                        deferred.reject();
                                    } else {
                                        deferred.resolve(resp);
                                    }
                                });

                            return deferred.promise;
                        }
                    ],
                    team : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/linked/' + $stateParams.id + '/team');
                    }]
                }
            })
            .state('leagues.teams', {
                url : '/:id/teams/:team',
                views: {
                    content: {
                        controller: 'LeaguesCtrl.teams',
                        templateUrl: '/app/modules/dashboard/leagues/teams.html'
                    },
                    'sidebar' : {
                        controller: 'LeaguesCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/leagues/sidebar.html'
                    }
                },
                resolve : {
                    item : [
                        'HttpService', '$stateParams','$q', '$state', '$timeout',
                        function(HttpService, $stateParams, $q, $state, $timeout) {
                            var deferred = $q.defer();
                            HttpService.get('/api/leagues/' + $stateParams.id)
                                .success(function(resp) {
                                    if (resp.is_user_active === false) {
                                        $timeout(function(){
                                            $state.go('leagues.invite_league', {id: $stateParams.id })
                                        });
                                        deferred.reject();
                                    } else {
                                        deferred.resolve(resp);
                                    }
                                });

                            return deferred.promise;
                        }
                    ],
                    users : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/' + $stateParams.id + '/users');
                    }],
                    teams: ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/linked/' + $stateParams.id + '/teams');
                    }]
                }
            })
            .state('leagues.freeAgency', {
                url : '/:id/free_agents',
                views: {
                    content: {
                        controller: 'LeaguesCtrl.freeAgency',
                        templateUrl: '/app/modules/dashboard/leagues/free_agents.html'
                    },
                    'sidebar' : {
                        controller: 'LeaguesCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/leagues/sidebar.html'
                    }
                },
                resolve : {
                    item : [
                        'HttpService', '$stateParams','$q', '$state', '$timeout',
                        function(HttpService, $stateParams, $q, $state, $timeout) {
                            var deferred = $q.defer();
                            HttpService.get('/api/leagues/' + $stateParams.id)
                                .success(function(resp) {
                                    if (resp.is_user_active === false) {
                                        $timeout(function(){
                                            $state.go('leagues.invite_league', {id: $stateParams.id })
                                        });
                                        deferred.reject();
                                    } else {
                                        deferred.resolve(resp);
                                    }
                                });

                            return deferred.promise;
                        }
                    ],
                    users : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/' + $stateParams.id + '/users');
                    }],
                    freeAgents: ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/linked/' + $stateParams.id + '/freeagents');
                    }]
                }
            })
            .state('leagues.standings', {
                url : '/:id/standings',
                views: {
                    content: {
                        controller: 'LeaguesCtrl.standings',
                        templateUrl: '/app/modules/dashboard/leagues/standings.html'
                    },
                    'sidebar' : {
                        controller: 'LeaguesCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/leagues/sidebar.html'
                    }
                },
                resolve : {
                    item : [
                        'HttpService', '$stateParams','$q', '$state', '$timeout',
                        function(HttpService, $stateParams, $q, $state, $timeout) {
                            var deferred = $q.defer();
                            HttpService.get('/api/leagues/' + $stateParams.id)
                                .success(function(resp) {
                                    if (resp.is_user_active === false) {
                                        $timeout(function(){
                                            $state.go('leagues.invite_league', {id: $stateParams.id })
                                        });
                                        deferred.reject();
                                    } else {
                                        deferred.resolve(resp);
                                    }
                                });

                            return deferred.promise;
                        }
                    ],
                    users : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/' + $stateParams.id + '/users');
                    }],
                    standings : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                       return HttpService.get('/api/leagues/linked/' + $stateParams.id + '/standings');
                    }]
                }
            })
            .state('leagues.scoresAndSchedule', {
                url : '/:id/scores_and_schedule',
                views: {
                    content: {
                        controller: 'LeaguesCtrl.scoresAndSchedule',
                        templateUrl: '/app/modules/dashboard/leagues/scores_and_schedule.html'
                    },
                    'sidebar' : {
                        controller: 'LeaguesCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/leagues/sidebar.html'
                    }
                },
                resolve : {
                    item : [
                        'HttpService', '$stateParams','$q', '$state', '$timeout',
                        function(HttpService, $stateParams, $q, $state, $timeout) {
                            var deferred = $q.defer();
                            HttpService.get('/api/leagues/' + $stateParams.id)
                                .success(function(resp) {
                                    if (resp.is_user_active === false) {
                                        $timeout(function(){
                                            $state.go('leagues.invite_league', {id: $stateParams.id })
                                        });
                                        deferred.reject();
                                    } else {
                                        deferred.resolve(resp);
                                    }
                                });

                            return deferred.promise;
                        }
                    ],
                    users : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/' + $stateParams.id + '/users');
                    }],
                    scores : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/linked/' + $stateParams.id + '/scores');
                    }]
                    // scores: ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                    //    return HttpService.get('/api/leagues/linked/' + $stateParams.id + '/scores');
                    // }]
                }
            })
            .state('leagues.trades', {
                url : '/:id/trades',
                views: {
                    content: {
                        controller: 'LeaguesCtrl.trades',
                        templateUrl: '/app/modules/dashboard/leagues/trades.html'
                    },
                    'sidebar' : {
                        controller: 'LeaguesCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/leagues/sidebar.html'
                    }
                },
                resolve : {
                    item : [
                        'HttpService', '$stateParams','$q', '$state', '$timeout',
                        function(HttpService, $stateParams, $q, $state, $timeout) {
                            var deferred = $q.defer();
                            HttpService.get('/api/leagues/' + $stateParams.id)
                                .success(function(resp) {
                                    if (resp.is_user_active === false) {
                                        $timeout(function(){
                                            $state.go('leagues.invite_league', {id: $stateParams.id })
                                        });
                                        deferred.reject();
                                    } else {
                                        deferred.resolve(resp);
                                    }
                                });

                            return deferred.promise;
                        }
                    ],
                    teams: ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/linked/' + $stateParams.id + '/teams');
                    }],
                    trades: ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                       return HttpService.get('/api/leagues/linked/' + $stateParams.id + '/trades');
                    }]
                }
            })

        ;
    }

    LeaguesCtrl_Sidebar.$inject = ['$scope', '$stateParams', 'items', 'sports'];
    function LeaguesCtrl_Sidebar($scope, $stateParams, items, sports) {
        //$scope.global_data = item;
        $scope.navItems = _.each(items.data, function (x) {
            if($stateParams.id == x.id) {
                x._active = true;
            }
        });

        $scope.sports = sports.data;

        $scope.$watch(function () { return $stateParams.id }, function (nv, ov) {
            if(!nv) {
                _.map($scope.navItems, function (x) {
                    x._active = false;
                });
            }
        });

        $scope.ui = {
            open: function (league_id) {
                _.map($scope.navItems, function (x) {
                    x._active = x.id == league_id && !x._active;
                });
            }
        }


        // Events

        // On league avatar uploaded
        $scope.$root.$on('league:avatar_upload', function (event, leagueId, avaToken) {
            _.map($scope.navItems, function (x) {
                if(x.id == leagueId) {
                    x.avaToken = avaToken;
                }
            });
        });

    }

    LeaguesCtrl_List.$inject = ['$rootScope', '$scope', '$state', 'items', 'BreadCrumbsService', 'HttpService'];
    function LeaguesCtrl_List($rootScope, $scope, $state, items, BreadCrumbsService, HttpService) {
        BreadCrumbsService.addCrumb(Lang.get('titles.leagues.list'));

        HttpService.get('/api/profile', function (resp)
        {
            $rootScope.auth = resp;
        });

        if(!items.data.length) {
            $state.go('leagues.create')
        }
        $scope.leagues = items.data;
    }

    LeaguesCtrl_Edit.$inject = ['$scope', 'HttpService', 'Notify', '$state', 'item', 'items', 'BreadCrumbsService', 'users', '$stateParams', '$location', 'providers'];
    function LeaguesCtrl_Edit($scope, HttpService, Notify, $state, item, items, BreadCrumbsService, users, $stateParams, $location, providers) {
        var isEdit = typeof item.id !== 'undefined';

        if(isEdit) {
            BreadCrumbsService.addCrumb(Lang.get('titles.leagues.edit'));
        } else {
            BreadCrumbsService.addCrumb(Lang.get('titles.leagues.create'));
        }
        $scope.league = (isEdit ? item : {});
        $scope.save = saveFn;
        $scope.leagueDelete = leagueDelete;
        $scope.leagueLeave = leagueLeave;
        $scope.league.provider_id = 1;
        $scope.league.sport_short = "leagues";
        $scope.league.sport_id = "";
        $scope.league.sport_name = "";
        $scope.league.provider_name = "";
        $scope.providers = providers.data;

        if(isEdit) {
            $scope.league.sport_id = item.sport.id;
            $scope.league.provider_id = item.provider.id;
            $scope.editMode = true;
        }

        $scope.updateProviderURL = function(url,type) {
            $scope.league.provider_url_selected = url;
            $scope.league.provider_type = type;
        }

        $scope.updateProvider = function(sport) {
            for( var i = 0; i < $scope.vendors.length;i++) {
                if( $scope.vendors[i]["sport_id"] == sport ) {
                    $scope.league.provider_id = $scope.vendors[i]["id"];
                    $scope.league.provider_url_selected = $scope.vendors[i]["uri"];
                    $scope.league.provider_type = $scope.vendors[i]["title"];
                    break;
                }
            }
        }

        $scope.updateProviders = function(provider) {           
            $scope.league.note = '';
            $scope.league.provider_id = provider;
            var __slug = false;
            for( var i = 0; i < $scope.vendors.length;i++) {
                if( $scope.vendors[i]["id"] == provider ) {
                    __slug = $scope.vendors[i]["slug"];
                    break;
                }
            }

            if ( (__slug == 'my-fantasy-league' && $scope.league.sport_short == 'nfl') || (__slug == 'yahoo' && $scope.league.sport_short == 'mlb') )  {
            } else {
                $scope.league.note = 'LS does not support linking of this fantasy provider at this time';
            }
        }

        $scope.updateSports = function() {
            $scope.league.sport_short = "leagues";
            for( var i = 0; i < $scope.sports.length;i++) {
                // alert($scope.sports[i]["id"]);
                if( $scope.sports[i]["id"] == $scope.league.sport_id ) {
                    // alert($scope.sports[i]["short"]);
                    $scope.league.sport_short = $scope.sports[i]["short"];
                    // alert($scope.league.sport_short);
                    break;
                }
            }

            $scope.league.sport_name = "";
            if (!isEdit) {
                $scope.providers = {};
                if ($scope.league.sport_id != null) {
                    $scope.providers = $scope.vendors;
                }
            }
            
            if ($scope.league.provider_id != '1') {
//console.log($scope.league.provider_id);
                $scope.updateProviders($scope.league.provider_id);
            }
        }

        if($stateParams.welcome) {
            $scope.welcome = true;
        }

        if (!$scope.league.url) {
            $scope.league.url = 'https://';
        }

        if (!$scope.league.notifications) {
            $scope.league.notifications = {
                email: {
                    new_board_message: true,
                    new_owner_joined: true,
                    new_transaction: true,
                    payout_confirmed: true,
                    payout_denied: true,
                }
            }
        }

        if ($scope.league.author && $scope.league.author.user && $scope.league.author.user.phone) {
            $scope.league.user_phone = ($scope.league.author.user.phone).slice(2)
        } else {
            $scope.league.user_phone = '';
        }
        if (isEdit) {
            $scope.users = users.data;
            $scope.users.map(function (user, index) {
                if (user.id == $scope.$root.auth.id) {
                    $scope.users.splice(index, 1);
                }
            });
        }

        HttpService.get('/api/leagues/sports', function (resp)
        {
            console.log('/api/leagues/sports',resp);
            $scope.sports = resp.filter(function(e) {
                return isEdit ? true : e.owner_id === null;
            });
            $scope.sports.push({
                id: -1,
                name: 'Other'
            });
            $scope.updateSports();
        });

        HttpService.get('/api/leagues/providers', function (resp)
        {
            console.log('/api/leagues/providers',resp);
            $scope.vendors = resp.filter(function(e) {
                return e.sport_id === null;
            });
            $scope.vendors.push({
                id: -1,
                name: 'Other'
            });

        }).then(function(res){

            for( var i = 0; i < res.data.length;i++) {
                if( res.data[i]["sport_id"] = 1 ) {
                    $scope.league.provider_url_selected = res.data[i]["uri"];
                    break;
                }
            }

        });

        $scope.options_payout_rule = [
            {key:null, value:'Confirm by commissioner (default)'},
            {key:50, value:'50%'},
            {key:60, value:'60%'},
            {key:70, value:'70%'}
        ];

        $scope.options_owners_limit = [
            {key:null, value:'- Select -'},
            {key:6, value:'6'},
            {key:8, value:'8'},
            {key:10, value:'10'},
            {key:12, value:'12'},
            {key:14, value:'14'},
            {key:16, value:'16'},
            {key:18, value:'18'},
            {key:20, value:'20'},
            {key:50, value:'50'},
            {key:100, value:'100'},
            {key:999, value:'no limit'},
        ];

        if(!isEdit) {
            $scope.league.payout_rule = null;
            $scope.league.owners_limit = null;
        }

        // Avatar upload event
        $scope.avatarUploadCallback = function (resp) {
            if(!$scope.league.id) return false;
            $scope.$root.$broadcast('league:avatar_upload', $scope.league.id, resp.token);
        };

        $scope.changeView = function(view,data){
            $state.go(view,data);
        }

        function saveFn() {

            if(!isEdit) {

                var lid = $scope.league.url.substr($scope.league.url.lastIndexOf('/') + 1);
                if( lid.lastIndexOf('#') != -1 ){
                    $scope.league.url = $scope.league.url.split('#')[0];
                }

                // if(  $scope.league.url.indexOf( $scope.league.provider_url_selected ) == -1 && $scope.league.provider_type !== "custom"){
                //     saveFnError({message: "League URL is not accurate"});
                //     return false;
                // }

            }

            var data = Object.assign({}, $scope.league);
            if (data.user_phone){
                data.user_phone = '+1' + data.user_phone;
            }
            if (isEdit) {
                var apiUrl = item.author.user_id == $scope.$root.auth.id
                    ? '/api/leagues/' + $scope.league.id
                    : '/api/leagues/' + $scope.league.id + '/settings';
                HttpService.put(apiUrl, data, function (resp) {
                    Notify.success(resp.message);
                    $state.go('leagues.list', null, {reload: true});
                }, saveFnError);
            } else {
                HttpService.post('/api/leagues', data, function (resp) {
                    if (resp && resp.data && resp.data.id) {
                        $state.go('leagues.bank', {id: resp.data.id}, { reload: true });
                    }
                }, saveFnError);
            }
        }

        function leagueDelete() {
            Notify.confirm_cordova(function(){
                HttpService.delete('/api/leagues/' + $scope.league.id, function (resp) {
                    Notify.success(resp.message);
                    $state.transitionTo('leagues.list', null, {'reload':true});
                }, saveFnError);
            }, Lang.get('notify_actions.leagues.events.delete_confirm'));
        }

        function leagueLeave() {
            Notify.confirm_cordova(function(){
                HttpService.put('/api/leagues/' + $scope.league.id + '/leave', {}, function (resp) {
                    Notify.success(resp.message);
                    $state.transitionTo('leagues.list', null, {'reload':true});
                }, saveFnError);
            }, Lang.get('notify_actions.leagues.events.leave_confirm'));
        }

        function saveFnError(err) {
            console.log(err);
            if(err && err.message) {
                Notify.error(err.message);
            } else {
                Notify.error(Lang.get('main.errors.something_went_wrong'));
            }
        }
    }

    LeaguesCtrl_Bank.$inject = ['$scope', 'HttpService', 'Notify', 'BreadCrumbsService', 'item', 'payin', 'paid', 'users', 'ngDialog'];
    function LeaguesCtrl_Bank($scope, HttpService, Notify, BreadCrumbsService, item, payin, paid, users, ngDialog) {

        BreadCrumbsService.addCrumb(Lang.get('titles.leagues.bank'));

        $scope.league = item;

        $scope.payin = payin.data;
        $scope.paid = paid.data;

        $scope.users = _.reject(users.data, function (x) {
            //return x.id === $scope.$root.auth.id; // Reject league user id
        });

        $scope.ui = {
            payout:        {
                league_id: item.id,
                amount:    null,
                user_id:   null,
                note: null
            },
            payoutCreate:  function () {
                HttpService.post('/api/leagues/' + item.id + '/transactions/payout', $scope.ui.payout, function (res) {
                    // Minus balance on transaction
                    $scope.league.balance = $scope.league.balance - $scope.ui.payout.amount;

                    //if (!$scope.league.payout_rule) {

                     //   $scope.league.balance = $scope.league.balance - $scope.ui.payout.amount;
                    //}

                    $scope.ui.payout.amount = null;
                    $scope.ui.payout.note = null;
                    $scope.ui.payout.user_id = null;
                    $scope.ui.payout_server_message = null;

                    Notify.success(res.message);
                }, function (error) {
                    $scope.errors = error;
                    if (error && error.message) {
                        $scope.ui.payout_server_message = error.message;
                    }
                })
            },
            payout_server_message: null,

            transferToLeagueCreate: function (league, amount, note) {
                var data = {
                    amount: amount,
                    note: note,
                    league_id: item.id
                };
                HttpService.post('/api/transactions/transfer', data, function (res) {
                    $scope.ui.payoutAmount = null;

                    if(res && res.data && res.data.current_balance) {
                        $scope.league.balance = res.data.current_balance;
                        $scope.payin = parseFloat($scope.payin) + parseFloat(amount);
                    }
                    data = {
                        amount: null,
                        note: null,
                        league_id: null
                    };
                    Notify.success(res.message);
                    ngDialog.closeAll();
                }, function (error) {
                    console.log(error);
                    if (error && error.message) {
                        ngDialog.closeAll();
                        Notify.error(error.message);
                    }
                })
            },
            transferToLeagueDialog: function (league) {
                ngDialog.openConfirm({
                    templateUrl: '/app/modules/dashboard/leagues/sub/transfer_to_league_dialog.html',
                    showClose: false,
                    data: {
                        title: 'Create transfer funds for league ' + league.name,
                        data: {
                            league: league,
                            ui: $scope.ui
                        }
                    },
                    scope: true
                }).then(function () {});
            }
        }

    }

    LeaguesCtrl_Transactions.$inject = ['$scope', '$state', '$stateParams', 'BreadCrumbsService', 'HttpService', 'item', 'transactions', 'transactions_non_confirmed', 'Notify'];
    function LeaguesCtrl_Transactions($scope, $state, $stateParams, BreadCrumbsService, HttpService, item, transactions, transactions_non_confirmed, Notify) {

        BreadCrumbsService.addCrumb(Lang.get('titles.leagues.transactions'));

        var auth_id = $scope.$root.auth.id;

        $scope.league = item;
        $scope.transactions = transactions.data;
        $scope.transactions_non_confirmed = transactions_non_confirmed.data;

        $scope.ui = {
            alreadyConfirmOrDeny: function (transaction) {
                return $scope.league.payout_rule && _.findWhere(transaction.statuses, {user_id: auth_id});
            },
            countConfirmedTransactions: function (transaction) {
                return _.filter(transaction.statuses, function (x) {
                    return x.status == 1;
                }).length;
            },
            countDeniedTransactions: function (transaction) {
                return _.filter(transaction.statuses, function (x) {
                    return x.status == 2;
                }).length;
            },
            canConfirmTransaction: function () {
                // If user commissioner
                if( $scope.league.author.user_id == auth_id) {
                    return !$scope.league.payout_rule;
                }
                // If user
                else {
                    return $scope.league.payout_rule;
                }
            },
            changeTransactionStatus: function (id, status) {
                Notify.confirm_cordova(function(){
                    HttpService.put('/api/leagues/'+ item.id +'/transactions/' + id + '/set_status/' + status , {}, function (res) {
                        Notify.success(res.message);
                        // Update state
                        $state.transitionTo($state.current, angular.copy($stateParams), { reload: true, inherit: true });
                    }, function (error) {
                        Notify.error(error.message);
                    })
                }, status == 'accept' ? Lang.get('notify_actions.transactions.accept_confirm') : Lang.get('notify_actions.transactions.deny_confirm'));
            }
        }

    }

    LeaguesCtrl_Owners.$inject = ['$scope', 'BreadCrumbsService', 'HttpService', 'Notify', 'ngDialog', 'item', 'users'];
    function LeaguesCtrl_Owners($scope, BreadCrumbsService, HttpService, Notify, ngDialog, item, users) {
        BreadCrumbsService.addCrumb(Lang.get('titles.leagues.owners'));

        $scope.league = item;
        $scope.users = users.data;

        $scope.ui = {
            payoutCreate: function (user, amount, note) {
                var data = {
                    amount: amount,
                    note: note,
                    owner_id: user.id
                };
                HttpService.post('/api/transactions/transfer', data, function (res) {
                    $scope.ui.payoutAmount = null;
                    if($scope.$root.auth.data) {
                        $scope.$root.auth.data.balance = parseFloat($scope.$root.auth.data.balance) - parseFloat(data.amount);
                    }
                    data = {
                        amount: null,
                        note: null,
                        owner_id: null
                    };
                    Notify.success(res.message);
                    ngDialog.closeAll();
                }, function (error) {
                    console.log(error);
                    Notify.error(error.message);
                })
            },
            payoutDialog: function (user) {
                ngDialog.openConfirm({
                    templateUrl: '/app/modules/dashboard/leagues/sub/owners_payout_dialog.html',
                    showClose: false,
                    data: {
                        title: 'Create transfer funds for ' + user.league_user.role_name + ' ' + [user.first_name, user.last_name].join(' '),
                        data: {
                            user: user,
                            ui: $scope.ui
                        }
                    },
                    scope: true
                }).then(function () {});
            }
        }
    }

    LeaguesCtrl_Team.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'HttpService', 'Notify', 'CONFIG', 'team', 'BreadCrumbsService'];
    function LeaguesCtrl_Team($rootScope, $scope, $state, $stateParams, HttpService, Notify, CONFIG, team, BreadCrumbsService) {

        BreadCrumbsService.addCrumb(Lang.get('titles.leagues.team'));
        $scope.team = team.data || [];

        if (!Object.keys($scope.team).length) {
            $scope.team.players = [];
        }

        $scope.item = {
            avaToken: $scope.team.avatar ? $scope.team.avatar.token : null,
        };

        // Avatar upload event
        $scope.avatarUploadCallback = function (resp) {
            if(!$scope.team.id) return false;
            $scope.$root.$broadcast('team:avatar_upload', $scope.team.id, resp.token);
        };

        $scope.save = saveFn;

        function saveFn() {
            HttpService.post('/api/leagues/'+ $stateParams.id +'/team', $scope.team, function (resp) {
                Notify.success(resp.message);
                $state.go('leagues.team', {id: $stateParams.id}, { reload: true });
            }, saveFnError);
        }

        function saveFnError(err) {
            if(err && err.message) {
                Notify.error(err.message);
            } else {
                Notify.error(Lang.get('main.errors.something_went_wrong'));
            }
        }

        $scope.addPlayer = function () {
            $scope.team.players.push({'name': ''});
        };

        $scope.removePlayer = function (index) {
            $scope.team.players.splice(index, 1);
        };
    }

    LeaguesCtrl_Vendor.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'CordovaService', 'items', 'BreadCrumbsService', 'HttpService', '$location', 'AuthDataService', '$auth', '$window', 'Notify'];
    function LeaguesCtrl_Vendor($rootScope, $scope, $state, $stateParams, CordovaService, items, BreadCrumbsService, HttpService, $location, AuthDataService, $auth, $window, Notify) {
        BreadCrumbsService.addCrumb(Lang.get('titles.leagues.vendor'));

        $scope.item = {};
        $scope.server_message = null;






    }

    LeaguesCtrl_Invite.$inject = ['$scope', '$state', 'BreadCrumbsService', 'HttpService', 'Notify', 'item', 'countries'];
    function LeaguesCtrl_Invite($scope, $state, BreadCrumbsService, HttpService, Notify, item, countries) {

        BreadCrumbsService.addCrumb(Lang.get('titles.leagues.invite'));

        var _id = item.id;

        $scope.league = item;
        $scope.invite = {
            phone: ''
        };

        // [options] countries
        $scope.options_countries = _.map(countries.data, function (name, id) {
            return { id: id, name: name}
        });
        $scope.addPhoneCode = function() {
            $scope.invite.phone = $scope.invite.country_code;
        };

        $scope.sentInvite = function () {
            var data = Object.assign({}, $scope.invite);
            if (data.phone){
                data.phone = '+1' + data.phone;
            }

            HttpService.post('/api/leagues/'+ _id +'/invite', data, function (res) {
                $scope.invite = {};
                Notify.success(res.message);
                $state.go('leagues.owners', {id: _id})
            }, function (res) {

            });
        }
    }

    LeaguesCtrl_Board.$inject = ['$scope', 'BreadCrumbsService', 'messages', '$stateParams', 'HttpService', 'Notify', '$state'];
    function LeaguesCtrl_Board($scope, BreadCrumbsService, messages, $stateParams, HttpService ,Notify, $state) {
        BreadCrumbsService.addCrumb(Lang.get('titles.leagues.board'));


        $scope.current_user = $scope.$root.auth;

        //summernoteOptions redactor
        $scope.options = {
            height: 400,
            focus: true,
            toolbar: [
                ['style', ['bold', 'italic', 'underline', 'strikethrough', 'clear']],
                //['alignment', ['ul', 'ol', 'paragraph', 'lineheight']],
                //['headline', ['style']],
                ['fontface', ['fontname']],
                ['textsize', ['fontsize']],
                ['fontclr', ['color']],
                //['height', ['height']],
                //['table', ['table']],
                ['insert', ['link','picture','video']]
                //['view', ['fullscreen', 'codeview']],
                //['help', ['help']]
            ]
        };

        $scope.message = {};
        $scope.sendMessage = sendMessageFn;
        $scope.messages = messages.data;

        $scope.editMessage = function(event, message) {
            $scope.message = message;
            $("body").animate({scrollTop: $('#summernote').offset().top}, "slow");
        }

        $scope.cancelEditing = function() {
            $scope.message = {}
        }

        function sendMessageFn() {
            if ($scope.message.id) {
                HttpService.put('/api/leagues/'+ $stateParams.id +'/board/'+$scope.message.id, $scope.message, function (res) {
                    $scope.message = {};
                    Notify.success(res.message);
                    $state.reload();
                })
            } else {
                HttpService.post('/api/leagues/'+ $stateParams.id +'/board', $scope.message, function (res) {
                    $scope.message = {};
                    Notify.success(res.message);
                    $state.reload();
                })
            }
        }
    }

    LeaguesCtrl_Invite_League.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'BreadCrumbsService', 'HttpService', 'Notify', 'invite'];
    function LeaguesCtrl_Invite_League($rootScope, $scope, $state, $stateParams, BreadCrumbsService, HttpService, Notify, invite) {

        BreadCrumbsService.addCrumb(Lang.get('titles.profile.invite_league'));

        $scope.league = invite.data;

        $scope.server_message = null;

        $scope.item = {
            amount: null
        };

        if($stateParams.welcome) {
            $scope.welcome = true;
        }

        if(!$rootScope.auth.data) {
            $rootScope.auth.data = {
                balance: 0
            }
        }

        $scope.charge = function() {
            Notify.confirm_cordova(function(){
                HttpService.post('/api/transactions/charge', $scope.item, function (res) {
                    $scope.server_message = null;
                    if(!$scope.$root.auth.data) {
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
            HttpService.post('/api/leagues/' +  $stateParams.id +'/users/activate', function (res) {
                $scope.$root.auth.data.balance = parseFloat( $scope.$root.auth.data.balance) - parseFloat($scope.league.amount);
                Notify.success(res.message);
                $state.go('leagues.link', {id: $stateParams.id });
            }, function(err){
                console.log(err);
                if(err && err.message) {
                    Notify.success(err.message);
                    $state.go('leagues.link', {id: $stateParams.id });
                }
            })
        };

        $scope.inviteDecline = function () {
            Notify.confirm_cordova(function(){
                HttpService.post('/api/leagues/' + $scope.league.id + '/users/delete', {}, function (resp) {
                    Notify.success(resp.message);
                    $state.transitionTo('leagues.list', null, {'reload':true});
                }, saveFnError);
            }, Lang.get('notify_actions.leagues.events.leave_decline'));
        };

        function saveFnError(err) {
            if(err && err.message) {
                Notify.success(err.message);
            }

        }
    }

    LeaguesCtrl_Dashboard.$inject = ['$scope', 'HttpService', 'Notify', '$state', 'item', 'users', 'BreadCrumbsService','$stateParams', '$location', '$auth', '$window', 'scores', 'teams','trades', '$filter'];
    function LeaguesCtrl_Dashboard($scope, HttpService, Notify, $state, item, users, BreadCrumbsService, $stateParams, $location, $auth, $window, scores, teams, trades, $filter) {

        $scope.global_data = item;

        // SCORES & SCHEDULE

        $scope.weeks = scores.data[0];
        $scope.activeWeek = scores.data[0].current_week;
        $scope.current = {};
        // $scope.current.date = moment(new Date()).format('YYYY-MM-DD');
        $scope.current.week = scores.data[0].current_week;
        $scope.start_week = scores.data[0].start_week;
        $scope.end_week = scores.data[0].end_week;
        if (scores.data[0].your_matchup[0]) $scope.current.opponent = scores.data[0].your_matchup[0];
        if (scores.data[0].your_matchup[0]) $scope.current.your_team = scores.data[0].you[0];
        $scope.current.matchups = scores.data[0].matchups;

        $scope.default_player = APP_CONFIG.host + '/images/football_default.png';
        $scope.default_team = APP_CONFIG.host + '/images/stubs/leagueava/preview.jpg';

        $scope.dateRefresh = function (dateDirection, week) {
            var newWeek = [];
            if (dateDirection == 'decrement') {
                if ($scope.activeWeek <= $scope.start_week) {
                    Notify.error('You cannot go back further in time. The first week in this league is week ' + $scope.start_week);
                    return;
                } else {
                    $scope.activeWeek = $scope.activeWeek - 1;
                    newWeek[0] = $scope.activeWeek;
                    newWeek[1] = $scope.global_data.user.external_user_id;
                    post(newWeek, 'refreshscores');
                }
            } else if (dateDirection == 'increment') {
                if ($scope.activeWeek >= $scope.end_week) {
                    Notify.error('You cannot go this far in time. The last week in this league is week ' + $scope.end_week);
                    return;
                } else {
                    $scope.activeWeek = $scope.activeWeek + 1;
                    newWeek[0] = $scope.activeWeek;
                    newWeek[1] = $scope.global_data.user.external_user_id;
                    post(newWeek, 'refreshscores');
                }
            }
        }

        function post(data, path) {
            HttpService.post('/api/leagues/linked/' + $stateParams.id + '/' + path, data, function (res) {
                $scope.current.your_team = res[0].you[0];
                $scope.current.matchups = res[0].matchups;
            })
        }

        // LINEUP

        $scope.teams = teams.data[1];
        $scope.team_count = teams.data[1]['count'];
        if (scores.data[0].your_matchup[0]) $scope.current.opponent = scores.data[0].your_matchup[0];
        if (scores.data[0].your_matchup[0]) $scope.current.opponent_key = scores.data[0].your_matchup[0].team_key;
        $scope.users_team_key = item.user.external_user_id;
        $scope.team_count = $scope.teams.length;

        $scope.mfl_startIds = [];
        $scope.mfl_startNames= [];

        if ($scope.global_data.provider.title =='yahoo') {
            for(var i=0; i < $scope.team_count; i++) {
                if ($scope.teams[i]['profile']['team_key'] == item.user.external_user_id) {
                    $scope.users_team_meta = $scope.teams[i];
                    $scope.data_a = $scope.teams[i].roster.position_type['B'];
                    $scope.data_b = $scope.teams[i].roster.position_type['P'];
                    $scope.users_team_data = $scope.data_a.concat($scope.data_b);
                } else if (scores.data[0].your_matchup[0] && $scope.teams[i]['profile']['team_key'] == scores.data[0].your_matchup[0].team_key) {
                    $scope.opponent_in_view = $scope.teams[i];
                    $scope.data_a = $scope.teams[i].roster.position_type['B'];
                    $scope.data_b = $scope.teams[i].roster.position_type['P'];
                    $scope.opponent_team_data = $scope.data_a.concat($scope.data_b);
                }
            }
        } else if ($scope.global_data.provider.title =='mfl') {
            for(var i=0; i < $scope.team_count; i++) {
                if ($scope.teams[i]['profile']['team_key'] == item.user.external_user_id) {
                    $scope.users_team_meta = $scope.teams[i];
                    $scope.users_team_data = $scope.teams[i].roster.position_type.all;
                    if (!$scope.current.your_team) $scope.current.your_team = $scope.teams[i];
                } else if (scores.data[0].your_matchup[0] && $scope.teams[i]['profile']['team_key'] == scores.data[0].your_matchup[0].team_key) {
                    $scope.opponent_in_view = $scope.teams[i];
                    $scope.opponent_team_data = $scope.teams[i].roster.position_type.all;
                }
            }
        }

        // TRADES

        $scope.trades_received = trades.data[1];

        // INJURIES
        $scope.injuryCount = 0;
        $scope.is_injured = function(player){
            switch(player.status) {
                case 'DL':
                    $scope.injuryCount++;
                    return true;
                    break;
                case 'DL7':
                    $scope.injuryCount++;
                    return true;
                    break;
                case 'DL10':
                    $scope.injuryCount++;
                    return true;
                    break;
                case 'DL30':
                    $scope.injuryCount++;
                    return true;
                    break;
                case 'DL60':
                    $scope.injuryCount++;
                    return true;
                    break;
                case 'DTD':
                    $scope.injuryCount++;
                    return true;
                    break;
                default:
                    return false;
            }
        }

    // Pending Trades
    // Fetch Pending Trades
//     $scope.global_data = item;
//     // $scope.dynamicData = keyFinder;

//     $scope.teamMeta = {};
//     // $scope.teamMeta.img = keyFinder(keyFinder(tmeta['data'][0], 'team_logos'), 'team_logo', 'url');
//     // $scope.teamMeta.name = keyFinder(tmeta['data'][0], 'name');
//     $scope.leagueMeta = {};
//     $scope.leagueMeta.week = meta['data'][0]['current_week'];
//     $scope.leagueMeta.game = meta['data'][0]['game_code'];
//     $scope.leagueMeta.name = meta['data'][0]['name'];
//     $scope.leagueMeta.teams = meta['data'][0]['num_teams'];
//     $scope.leagueMeta.url = meta['data'][0]['url'];
//     $scope.teamMeta.role = item['user']['role_name'];
//     $scope.leagueMeta.provider = item['provider']

//     // Scores And Schedules
//     $scope.weeks = weeks.data['fantasy_content'];

//     $scope.current = {};
//     $scope.current.date = moment(new Date()).format('YYYY-MM-DD');
//     $scope.tomorrow = moment(moment($scope.current.date, 'YYYY-MM-DD').add(1, 'days')).format('YYYY-MM-DD');
//     $scope.current.week = parseInt(scores.data[0]['current_week']);
//     $scope.current.dateSimpleFormat = moment(new Date()).format('MMM DD');
//     $scope.current.month = moment($scope.current.date).format('MM');
//     $scope.current.year = moment($scope.current.date).format('YYYY');
//     $scope.current.user = scores.data['team_key'];

//     function backupFindParam(struct, param, bool_filter){
//         return struct.filter(function(el){
//             if (bool_filter){
//                 return el[param] === bool_filter;
//             } else {
//                 return el[param];
//             }
//         })
//     }

//     function hasParam(arr, param) {
//         var bin = false;
//         for (var i=0; i < arr.length; i++) {
//             if (arr[i][param] && arr[i][param] == 1) { bin = true; break}
//         }
//         return bin;
//     }

//     $scope.findParam = function(struct, param, bool_filter){
//         return struct.filter(function(el){
//             if (bool_filter){
//                 return el[param] === bool_filter;
//             } else {
//                 return el[param];
//             }
//         })
//     }

//     $scope.start = {};
//     $scope.start.date = moment(scores.data[0]['start_date']).format('YYYY-MM-DD');
//     $scope.start.day = parseInt(moment($scope.start.date).format('DD'));
//     $scope.start.dayOfWeek = moment($scope.start.date).format('dddd');
//     $scope.start.week = parseInt(scores.data[0]['start_week']);
//     $scope.start.realWeek = 0;
//     $scope.start.month = moment($scope.start.date).format('MM');
//     $scope.start.year = moment($scope.start.date).format('YYYY');

//     $scope.end = {};
//     $scope.end.date = moment(scores.data[0]['end_date']).format('YYYY-MM-DD');
//     $scope.end.day = parseInt(moment($scope.end.date).format('DD'));
//     $scope.end.dayOfWeek = moment($scope.end.date).format('dddd');
//     $scope.end.week = parseInt(scores.data[0]['end_week']);
//     $scope.end.realWeek = $scope.end.week - $scope.start.week;
//     $scope.end.month = moment($scope.end.date).format('MM')
//     $scope.end.year = moment($scope.end.date).format('YYYY')

//     $scope.league = {};
//     $scope.league.id = item.id;
//     $scope.league.dateDisplayFormat = 'MMM dd';
//     $scope.league.days = Math.abs(moment($scope.start.date).diff(moment($scope.end.date), 'days'));
//     $scope.league.weekCount = moment($scope.end.date).diff(moment($scope.start.date), 'week');
//     $scope.league.realWeek = ($scope.current.week - $scope.start.week) + 1;
//     $scope.league.months = catchMonths($scope.start.date, $scope.end.date, 'MMM');
//     $scope.league.monthsNumeric = catchMonths($scope.start.date, $scope.end.date, 'MM');
//     $scope.league.monthCount = $scope.league.months.length;
//     $scope.league.monthWyears = catchMonthsWYears($scope.start.date, $scope.end.date);
//     $scope.league.monthEnds = monthEnds($scope.league.monthWyears);
//     $scope.league.monthYears = grabYears($scope.league.monthWyears);

//     $scope.league.weeks = [];
//     for(var i=0; i < $scope.league.weekCount; i++) {
//         $scope.league.weeks[i] = $scope.start.week + i;
//     }

//     var dayCount = 0;
//     var weekCount = 0;
//     var holdingCell = [];
//     $scope.league.dateList = [];
//     for (var i=0; moment($scope.start.date).add(i, 'days') <= moment($scope.end.date); i++) {
//         if (moment(moment($scope.start.date)).add(i, 'days').format('dddd') === 'Monday') {
//             dayCount = 0;
//             holdingCell = [];
//             holdingCell[dayCount] = moment(moment($scope.start.date, 'YYYY-MM-DD').add(i, 'days')).format('YYYY-MM-DD');
//             dayCount++;
//         } else if (moment(moment($scope.start.date)).add(i, 'days').format('dddd') === 'Sunday') {
//             holdingCell[dayCount] = moment(moment($scope.start.date, 'YYYY-MM-DD').add(i, 'days')).format('YYYY-MM-DD');
//             $scope.league.dateList.push(holdingCell);
//         } else  {
//             holdingCell[dayCount] = moment(moment($scope.start.date, 'YYYY-MM-DD').add(i, 'days')).format('YYYY-MM-DD');
//             dayCount++;
//         }

//     }

//     $scope.displayWeek = $scope.league.realWeek + $scope.start.week - 1;
//     $scope.activeWeek = $scope.league.realWeek - 1;
//     $scope.dateRefresh = function (dateDirection, week) {
//         if (dateDirection == 'decrement') {
//             if (($scope.activeWeek - 1) < 0) {
//                 Notify.error('You cannot go back further in time. The league started on ' + moment($scope.start.date).format('MMM DD, YYYY'));
//                 return;
//             } else {
//                 $scope.activeWeek = $scope.activeWeek - 1;
//                 $scope.displayWeek = $scope.displayWeek - 1;
//                 var newDate = {period: $scope.displayWeek, type: 'week'};
//                 console.log(newDate);
//                 postDates(newDate, 'refreshscores');
//             }
//         } else if (dateDirection == 'increment') {
//             if (($scope.activeWeek + 1) > $scope.league.weekCount) {
//                 Notify.error('You cannot go this far in time. The league ends on ' + moment($scope.end.date).format('MMM DD, YYYY'));
//                 return;
//             } else {
//                 $scope.activeWeek = $scope.activeWeek + 1;
//                 $scope.displayWeek = $scope.displayWeek + 1;
//                 var newDate = {period: $scope.displayWeek, type: 'week'};
//                 postDates(newDate, 'refreshscores');
//             }
//         }
//     }

//     $scope.dataUpdate = function(date) {
//         $scope.league.dateSelected = date;
//         console.log($scope.league.dateSelected);
//     }

//     $scope.displayDecrement = function () {
//         $scope.current.dateArrayLocation = $scope.current.dateArrayLocation - 1;
//     }

//     function monthEnds(array){
//         var arr = [];
//         for (var i=0; i < $scope.league.monthCount; i++) {
//             arr.push(moment(array[i]).daysInMonth());
//         }
//         return arr;
//     }

//     function grabYears(array){
//         var arr = [];
//         for(var i=0; i < $scope.league.monthCount; i++) {
//             arr.push(moment(array[i]).format('YYYY'))
//         }
//         return arr;
//     }

//     function dateRange() {
//         var start = $scope.start.day;
//         var end = $scope.end.day;
//         for (var i= 0; i < $scope.league.days; i++) {
//            $scope.league.months.forEach(


//             )
//         }
//     }

//     $scope.league.activeDate = moment($scope.current.date).format('MMM DD, YYYY');
//     $scope.dateRegistry = function (date) {
//         $scope.league.activeDate = moment(date).format('MMM DD, YYYY');
//         var newDate = {period: date, type: 'date'};
//         post(newDate, 'refreshscores');
//     }

//     function postDates(data, path) {
//         HttpService.post('/api/leagues/linked/' + $stateParams.id + '/' + path, data, function (res) {
//             console.log(res);
//             $scope.current.matchup_count = res['fantasy_content']['league'][1]['scoreboard'][0]['matchups']['count'];
//             $scope.current.matchups = [];
//             console.log(res['fantasy_content']['league'][1]['scoreboard'][0]['matchups'])
//             for (var key in res['fantasy_content']['league'][1]['scoreboard'][0]['matchups']) {
//                 if (key == 'count') { break};
//                 $scope.current.matchups.push(res['fantasy_content']['league'][1]['scoreboard'][0]['matchups'][key])
//             }
//         })
//     }

//     // Qual

//     // $scope.dateSelection = null;
//     $scope.current.matchup_count = scores.data[1]['scoreboard'][0]['matchups']['count'];
//     $scope.current.opponent = [];
//     $scope.current.matchups = [];

//     $scope.scoring_type = scores.data[0]['scoring_type'];

//     for (var key in scores.data[1]['scoreboard'][0]['matchups']) {
//         if (key == 'count') { break};
//         $scope.current.matchups.push(scores.data[1]['scoreboard'][0]['matchups'][key])
//     }
//     console.log($scope.current.matchups);

//     // List Months between dates

//     function catchMonths(start, end, stringFormat){
//         var months = [];
//         start = moment(start);
//         end = moment(end);
//         while (end > start) {
//            months.push(start.format(stringFormat));
//            start.add(1,'month');
//         }
//         return months;
//     }

//     function catchMonthsWYears(start, end){
//         var monthYears = [];
//         start = moment(start);
//         end = moment(end);
//         while (end > start) {
//            monthYears.push(start.format('YYYY-MM'));
//            start.add(1,'month');
//         }
//         return monthYears;
//     }


// function findOpponent() {
//     console.log('run');
//     var whackAmole = false;
//     var hallPass = false;
//     var wormhole = false;
//     var escape = false;
//     var backDoor;
//     var you;
//     for (var key1 in $scope.current.matchups){
//         if (escape) {break};
//         for (var key2 in $scope.current.matchups[key1]['matchup']['0']['teams']) {
//             if (escape) {break};
//             if (key2 == 'count') {continue};
//             if (typeof $scope.current.matchups[key1]['matchup'] != "undefined" ) {

//                 if($scope.current.matchups[key1]['matchup']['0']['teams'][key2]['team'][0][0]['team_key'] == $scope.current.user) {
//                     if (hallPass && backDoor) {
//                         $scope.current.opponent[0] = backDoor;
//                         $scope.current.opponent[1] = $scope.current.matchups[key1]['matchup']['0']['teams'][key2];
//                         escape = true;
//                         break;
//                     } else {
//                         you = $scope.current.matchups[key1]['matchup']['0']['teams'][key2];
//                         wormhole = true;
//                         continue;
//                     }
//                 } else if ($scope.current.matchups[key1]['matchup']['0']['teams'][key2]['team'][0][0]['team_key'] != $scope.current.user) {
//                     if (wormhole) {
//                         $scope.current.opponent[0] = $scope.current.matchups[key1]['matchup']['0']['teams'][key2];
//                         $scope.current.opponent[1] = you;
//                         escape = true;
//                         break;
//                     } else {
//                         backDoor = $scope.current.matchups[key1]['matchup']['0']['teams'][key2];
//                         hallPass = true;
//                     }
//                 }
//             } else {
//                 $scope.current.opponent[0] = backDoor;
//                 escape = true;
//                 break;
//             }
//         }
//     }
// }
// findOpponent();
// console.log($scope.current.opponent[1])

//     $scope.yourNextLineup = [];
//     $scope.yourNextOpponentLineup = [];


//     post({date: $scope.tomorrow, team: $scope.current.opponent[1]['team'][0][0]['team_key']}, $scope.yourNextLineup);
//     post({date: $scope.tomorrow, team: $scope.current.opponent[0]['team'][0][0]['team_key']}, $scope.yourNextOpponentLineup);

//     function post(data, array) {
//         return HttpService.post('/api/leagues/linked/' + $stateParams.id + '/matchup', data, function(res) {
//             console.log(res);
//             array[0] = {};
//             array[1] = [];
//             array[2] = [];
//             array[0]['logo'] = backupFindParam(res['fantasy_content']['team'][0], 'team_logos')[0]['team_logos'][0]['team_logo']['url'];
//             array[0]['name'] = backupFindParam(res['fantasy_content']['team'][0], 'name')[0]['name'][0];
//             var data = res['fantasy_content']['team'][1]['roster'][0]['players'];

//             for (var i = 0; i < data.count; i++) {
//                 if (backupFindParam(data[i]['player'][0], 'is_undroppable')[0]['is_undroppable'] == 0) {
//                     array[1].push(data[i]);
//                 }
//                 if (hasParam(data[i]['player'][0], 'on_disabled_list')) {
//                     array[2].push(data[i]);
//                 }
//             }
//         });
//     }

//     if ($scope.current.opponent[1]['team'][1]['team_points']['total'] > $scope.current.opponent[0]['team'][1]['team_points']['total'] ) { $scope.gameStatus = 'W'}
//         else { $scope.gameStatus = 'L';}

//     $scope.binary = null;

//     $scope.createModal = function(){
//         $scope.binary = true;
//     }
//     $scope.disposeModal = function(){
//         $scope.binary = false;
//     }

//     $scope.logged_in_team = trades.data['team_key'];

//     $scope.teams = teams;

//     $scope.bool_true = true;
//     $scope.bool_false = false;
//     $scope.incoming_count = null;
//     $scope.outgoing_count = null;

//     $scope.transactions = [];
//     console.log($scope.transactions);
//     var transactions_data = trades.data[1]['transactions'];
//     var i = 0;
//     for (var key in transactions_data) {
//         if (!transactions_data.hasOwnProperty(key)) continue;

//         var key_val = transactions_data[key]['transaction'];

//         $scope.transactions[i] = {
//             meta: key_val[0],
//             players: []
//         }
//         var players = key_val[1]['players'];
//         var j = 0;
//         for (var key in players) {
//             $scope.transactions[i]['players'][j] = players[key];
//             if(j == (players['count'] - 1)) { break;}
//             j++;
//         }
//         if(i == (trades.data[1]['transactions']['count'] - 1)){ break; {}}
//         i++;
//     }
}

    LeaguesCtrl_FreeAgency.$inject = ['$scope', 'HttpService', 'Notify', '$state', 'item', 'freeAgents', 'BreadCrumbsService','$stateParams', '$location', '$window', 'ngDialog', '$q', 'playerStatDictionary', '$filter'];
    function LeaguesCtrl_FreeAgency($scope, HttpService, Notify, $state, item, freeAgents,  BreadCrumbsService, $stateParams, $location, $window, ngDialog, $q, playerStatDictionary, $filter) {
        $scope.global_data = item;
        $scope.free_agents = freeAgents.data[0];
        $scope.positions = freeAgents.data[1];

        $scope.playerStatDictionary = playerStatDictionary;

        $scope.active_position = $scope.free_agents.position;
        $scope.active_players =  $scope.free_agents.players;
        $scope.active_position_type = $scope.free_agents.position_type;

        $scope.default_player = APP_CONFIG.host + '/images/football_default.png';
        $scope.default_team = APP_CONFIG.host + '/images/stubs/leagueava/preview.jpg';

        $scope.filters = [
            {display: 'Name', query: 'NAME'},
            {display: 'Overall Rank', query: 'OR'},
            {display: 'Actual Rank', query: 'AR'},
            {display: 'Fantasy Points', query: 'FP'},
        ]

        $scope.isMobile = (function() {
            var check = true;
            (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = false})(navigator.userAgent||navigator.vendor||window.opera);
            return !check;
        })();
        $scope.removedStat = false;
        $scope.reduceStatTitle = function(stat, index){
            console.log(index);
            if ($scope.isMobile && $scope.global_data.sport.short == 'mlb') {
                if (playerStatDictionary['mlb'][stat.id]['acronym'] == 'H/AB') {
                    $scope.removedStat = true;
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        }
        $scope.statReduction = function(stat){
            if ($scope.isMobile && $scope.global_data.sport.short == 'mlb') {
                var string = stat.value,
                substring = "/";
                if (string.includes(substring)) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        }

        $scope.currentFilter = $scope.filters[2];
        $scope.currentAction = 'filter';
        $scope.sortFilterSearch = function (action, filter, position) {

            $scope.currentAction = action;
            if (action == 'filter') {
                $scope.currentFilter = filter;
                $scope.filterType = $scope.currentFilter.query;
            } else if (action == 'update_position') {
                $scope.active_position = position;
                $scope.filterType = $scope.currentFilter.query;
                action = 'sort';
            } else if (action == 'search' || action == 'sort') {
                $scope.filterType = filter;
            }

            var arr = {
                action: action,
                type: $scope.filterType,
                position: $scope.active_position
            }

            HttpService.post('/api/leagues/linked/' + $stateParams.id + '/refreshfreeagents', arr, function (res) {
                $scope.active_players = res;
                if ($scope.global_data.provider.title !='mfl') {
                    $scope.active_position_type = res[0].position_type;
                }
            })
        }

        $scope.clearSearch = function() {
            $scope.text = null;
            $scope.sortFilterSearch('filter', $scope.currentFilter);
        }

        $scope.transferToLeagueDialog = function (player) {
            ngDialog.openConfirm({
                templateUrl: '/app/modules/dashboard/leagues/sub/addFreeAgent.html',
                showClose: false,
                scope: $scope,
                data: {
                    title: 'You are about to add ' + player.name + ', ' + player.position + ' to your roster',
                    data: {
                        player: player,
                        display: player.img,
                        dropPlayer: function(selection) {
                            $scope.dropPlayer = selection;
                        },
                        clearScope: function() {
                            $scope.transactionReq = undefined;
                        },
                        executeTransaction: function() {
                            var trans = {
                                dropping: $scope.dropPlayer.key,
                                signing: this.player.key,
                                team_id: $scope.global_data.user.external_user_id
                            };
                            HttpService.post('/api/leagues/linked/' + $stateParams.id + '/signandreplace', trans, function (res) {
                                $scope.yourPlayers = null;
                                $scope.transactionReq = {
                                    errorId: 'none',
                                }
                                if ($scope.global_data.provider.title !='mfl' && res[0] == 'error') {
                                    Notify.error(res[1]);
                                    $scope.transactionReq = {
                                        errorId: null
                                    }
                                } else if ($scope.global_data.provider.title =='mfl' && typeof res == "object" && Object.keys(res).length == 1) {
                                     Notify.error(res[0]);
                                    $scope.transactionReq = {
                                        errorId: null
                                    }
                                } else {
                                   Notify.success('You sucessfully signed ' + player.name + ', replacing ' + $scope.dropPlayer.name + ' from your roster');
                                   $scope.sortFilterSearch('filter', $scope.currentFilter);
                                   $scope.transactionReq = {
                                        errorId: null,
                                    }
                                }
                            })
                        },
                        logger: function(action){
                            $scope.transactionReq = undefined;
                            var playerToSend = {
                                player: this.player.key
                            };
                            HttpService.post('/api/leagues/linked/' + $stateParams.id + '/signfreeagent', playerToSend, function (res) {
                                if (res[0] == 'error'){
                                    if (res[1] == 'This move will put you 1 over max roster size.') {
                                        var yourTeam = [{'your_key': $scope.global_data.user.external_user_id}];

                                        $scope.transactionReq = {
                                            response: 'failure',
                                            errorId: 'max',
                                            msg: res[1],
                                            link: 'https://baseball.fantasysports.yahoo.com/b1/183435/players',
                                            dropDownLabel: 'Select a player on your roster to replace',
                                            btnTxt: 'Replace Player'
                                        }

                                        HttpService.post('/api/leagues/linked/' + $stateParams.id + '/team_refresh', yourTeam, function (response) {
                                            $scope.yourPlayers = [];
                                            for (var key in response[0].roster.position_type) {
                                                var player_count = response[0].roster.position_type[key].length;
                                                for (var z = 0; z < player_count; z++) {
                                                    $scope.yourPlayers.push(response[0].roster.position_type[key][z]);
                                                }
                                            }
                                        });

                                    } else {
                                        Notify.error(res[1]);
                                        $scope.transactionReq = {
                                            response: 'failure'
                                        }
                                    }
                                } else if ($scope.global_data.provider.title =='mfl' && typeof res == "object" && Object.keys(res).length == 1) {
                                    if (res[0].indexOf('You Must Add or Drop At Least One Player or Team') >= 0) {
                                        var yourTeam = [{'your_key': $scope.global_data.user.external_user_id}];

                                        $scope.transactionReq = {
                                            response: 'failure',
                                            errorId: 'max',
                                            msg: res[0],
                                            link: 'https://baseball.fantasysports.yahoo.com/b1/183435/players',
                                            dropDownLabel: 'Select a player on your roster to replace',
                                            btnTxt: 'Replace Player'
                                        }

                                        if (!$scope.yourPlayers) {
                                            HttpService.post('/api/leagues/linked/' + $stateParams.id + '/team_refresh', yourTeam, function (response) {
                                                $scope.yourPlayers = response[0].roster.position_type.all;
                                            });
                                        }
                                    } else {
                                       Notify.error(res[0]);
                                    }
                                } else if (res == "success" || res == "successful") {
                                    Notify.success('You successfully signed ' + player.name);
                                    $scope.sortFilterSearch('filter', $scope.currentFilter);
                                    ngDialog.close();
                                }
                            }, function (error) {
                                console.log(error);
                            })

                        }
                    }
                }
            }).then(function(){
            })
        }

        $scope.sortNumber = function(index) {
            $scope.sortParam = index;
        }

    }
    LeaguesCtrl_Standings.$inject = ['$scope', 'HttpService', 'Notify', 'standings', '$state', 'BreadCrumbsService','$stateParams','$location', 'item'];
    function LeaguesCtrl_Standings($scope, HttpService, Notify, standings, $state, BreadCrumbsService, $stateParams, $location, item) {

        $scope.global_data = item;
        $scope.team_standings = standings.data;
        $scope.default_logo = '/images/stubs/leagueava/preview.jpg';
        $scope.isMobile = (function() {
            var check = true;
            (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = false})(navigator.userAgent||navigator.vendor||window.opera);
            return !check;
        })();


    }
    LeaguesCtrl_ScoresAndSchedule.$inject = ['$scope', 'HttpService', 'Notify', '$state', 'scores', 'item','BreadCrumbsService','$stateParams', '$location'];
    function LeaguesCtrl_ScoresAndSchedule($scope, HttpService, Notify, $state, scores, item, BreadCrumbsService, $stateParams, $location) {

        // Quant
        $scope.global_data = item;
        $scope.weeks = scores.data[0];
        $scope.activeWeek = scores.data[0].current_week;

        $scope.current = {};
        // $scope.current.date = moment(new Date()).format('YYYY-MM-DD');
        $scope.current.week = scores.data[0].current_week;
        $scope.start_week = scores.data[0].start_week;
        $scope.end_week = scores.data[0].end_week;
        $scope.current.opponent = scores.data[0].your_matchup[0];
        $scope.current.your_team = scores.data[0].you[0];
        $scope.current.matchups = scores.data[0].matchups;

        // $scope.current.dateSimpleFormat = moment(new Date()).format('MMM DD');
        // $scope.current.month = moment($scope.current.date).format('MM');
        // $scope.current.year = moment($scope.current.date).format('YYYY');
        // $scope.current.user = scores.data['team_key'];

        // $scope.start = {};
        // $scope.start.date = moment(scores.data[0]['start_date']).format('YYYY-MM-DD');
        // $scope.start.day = parseInt(moment($scope.start.date).format('DD'));
        // $scope.start.dayOfWeek = moment($scope.start.date).format('dddd');
        // $scope.start.week = parseInt(scores.data[0]['start_week']);
        // $scope.start.realWeek = 0;
        // $scope.start.month = moment($scope.start.date).format('MM');
        // $scope.start.year = moment($scope.start.date).format('YYYY');

        // $scope.end = {};
        // $scope.end.date = moment(scores.data[0]['end_date']).format('YYYY-MM-DD');
        // $scope.end.day = parseInt(moment($scope.end.date).format('DD'));
        // $scope.end.dayOfWeek = moment($scope.end.date).format('dddd');
        // $scope.end.week = parseInt(scores.data[0]['end_week']);
        // $scope.end.realWeek = $scope.end.week - $scope.start.week;
        // $scope.end.month = moment($scope.end.date).format('MM')
        // $scope.end.year = moment($scope.end.date).format('YYYY')

        // $scope.league = {};
        // $scope.league.id = item.id;
        // $scope.league.dateDisplayFormat = 'MMM dd';
        // $scope.league.days = Math.abs(moment($scope.start.date).diff(moment($scope.end.date), 'days'));
        // $scope.league.weekCount = moment($scope.end.date).diff(moment($scope.start.date), 'week');
        // $scope.league.realWeek = ($scope.current.week - $scope.start.week) + 1;
        // $scope.league.months = catchMonths($scope.start.date, $scope.end.date, 'MMM');
        // $scope.league.monthsNumeric = catchMonths($scope.start.date, $scope.end.date, 'MM');
        // $scope.league.monthCount = $scope.league.months.length;
        // $scope.league.monthWyears = catchMonthsWYears($scope.start.date, $scope.end.date);
        // $scope.league.monthEnds = monthEnds($scope.league.monthWyears);
        // $scope.league.monthYears = grabYears($scope.league.monthWyears);

        // $scope.league.weeks = [];
        // for(var i=0; i < $scope.league.weekCount; i++) {
        //     $scope.league.weeks[i] = $scope.start.week + i;
        // }

        // var dayCount = 0;
        // var weekCount = 0;
        // var holdingCell = [];
        // $scope.league.dateList = [];
        // for (var i=0; moment($scope.start.date).add(i, 'days') <= moment($scope.end.date); i++) {
        //     if (moment(moment($scope.start.date)).add(i, 'days').format('dddd') === 'Monday') {
        //         dayCount = 0;
        //         holdingCell = [];
        //         holdingCell[dayCount] = moment(moment($scope.start.date, 'YYYY-MM-DD').add(i, 'days')).format('YYYY-MM-DD');
        //         dayCount++;
        //     } else if (moment(moment($scope.start.date)).add(i, 'days').format('dddd') === 'Sunday') {
        //         holdingCell[dayCount] = moment(moment($scope.start.date, 'YYYY-MM-DD').add(i, 'days')).format('YYYY-MM-DD');
        //         $scope.league.dateList.push(holdingCell);
        //     } else  {
        //         holdingCell[dayCount] = moment(moment($scope.start.date, 'YYYY-MM-DD').add(i, 'days')).format('YYYY-MM-DD');
        //         dayCount++;
        //     }

        // }

        $scope.dateRefresh = function (dateDirection, week) {
            var newWeek = [];
            if (dateDirection == 'decrement') {
                if ($scope.activeWeek <= $scope.start_week) {
                    Notify.error('You cannot go back further in time. The first week in this league is week ' + $scope.start_week);
                    return;
                } else {
                    $scope.activeWeek = $scope.activeWeek - 1;
                    newWeek[0] = $scope.activeWeek;
                    newWeek[1] = $scope.global_data.user.external_user_id;
                    post(newWeek, 'refreshscores');
                }
            } else if (dateDirection == 'increment') {
                if ($scope.activeWeek >= $scope.end_week) {
                    Notify.error('You cannot go this far in time. The last week in this league is week ' + $scope.end_week);
                    return;
                } else {
                    $scope.activeWeek = $scope.activeWeek + 1;
                    newWeek[0] = $scope.activeWeek;
                    newWeek[1] = $scope.global_data.user.external_user_id;
                    post(newWeek, 'refreshscores');
                }
            }
        }

        // $scope.dataUpdate = function(date) {
        //     $scope.league.dateSelected = date;
        //     console.log($scope.league.dateSelected);
        // }

        // $scope.displayDecrement = function () {
        //     $scope.current.dateArrayLocation = $scope.current.dateArrayLocation - 1;
        // }

        // function monthEnds(array){
        //     var arr = [];
        //     for (var i=0; i < $scope.league.monthCount; i++) {
        //         arr.push(moment(array[i]).daysInMonth());
        //     }
        //     return arr;
        // }

        // function grabYears(array){
        //     var arr = [];
        //     for(var i=0; i < $scope.league.monthCount; i++) {
        //         arr.push(moment(array[i]).format('YYYY'))
        //     }
        //     return arr;
        // }

        // function dateRange() {
        //     var start = $scope.start.day;
        //     var end = $scope.end.day;
        //     for (var i= 0; i < $scope.league.days; i++) {
        //        $scope.league.months.forEach(


        //         )
        //     }
        // }
        // $scope.league.activeDate = moment($scope.current.date).format('MMM DD, YYYY');
        // $scope.dateRegistry = function (date) {
        //     $scope.league.activeDate = moment(date).format('MMM DD, YYYY');
        //     var newDate = {period: date, type: 'date'};
        //     post(newDate, 'refreshscores');
        // }

        function post(data, path) {
            HttpService.post('/api/leagues/linked/' + $stateParams.id + '/' + path, data, function (res) {
                $scope.current.opponent = res[0].your_matchup[0];
                $scope.current.your_team = res[0].you[0];
                $scope.current.matchups = res[0].matchups;
            })
        }

        // Qual

        // $scope.dateSelection = null;
        // $scope.current.matchup_count = scores.data[1]['scoreboard'][0]['matchups']['count'];
        // $scope.current.opponent = [];
        // $scope.current.matchups = [];

        // $scope.scoring_type = scores.data[0]['scoring_type'];

        // for (var key in scores.data[1]['scoreboard'][0]['matchups']) {
        //     if (key == 'count') { break};
        //     $scope.current.matchups.push(scores.data[1]['scoreboard'][0]['matchups'][key])
        //     findOpponent($scope.current.matchups);
        // }

        // List Months between dates

        // function catchMonths(start, end, stringFormat){
        //     var months = [];
        //     start = moment(start);
        //     end = moment(end);
        //     while (end > start) {
        //        months.push(start.format(stringFormat));
        //        start.add(1,'month');
        //     }
        //     return months;
        // }

        // function catchMonthsWYears(start, end){
        //     var monthYears = [];
        //     start = moment(start);
        //     end = moment(end);
        //     while (end > start) {
        //        monthYears.push(start.format('YYYY-MM'));
        //        start.add(1,'month');
        //     }
        //     return monthYears;
        // }

// function findOpponent(matchups) {
//     console.log('run');
//     var whackAmole = false;
//     var hallPass = false;
//     var wormhole = false;
//     var escape = false;
//     var backDoor;
//     var you;
//     console.log(matchups);
//     for (var key1 in matchups){
//         if (escape) {break};
//         for (var key2 in matchups[key1]['matchup']['0']['teams']) {
//             if (escape) {break};
//             if (key2 == 'count') {continue};
//             if (typeof matchups[key1]['matchup'] != "undefined" ) {

//                 if(matchups[key1]['matchup']['0']['teams'][key2]['team'][0][0]['team_key'] == $scope.current.user) {
//                     if (hallPass && backDoor) {
//                         $scope.current.opponent[0] = backDoor;
//                         $scope.current.opponent[1] = matchups[key1]['matchup']['0']['teams'][key2];
//                         escape = true;
//                         break;
//                     } else {
//                         you = matchups[key1]['matchup']['0']['teams'][key2];
//                         wormhole = true;
//                         continue;
//                     }
//                 } else if (matchups[key1]['matchup']['0']['teams'][key2]['team'][0][0]['team_key'] != $scope.current.user) {
//                     if (wormhole) {
//                         $scope.current.opponent[0] = matchups[key1]['matchup']['0']['teams'][key2];
//                         $scope.current.opponent[1] = you;
//                         escape = true;
//                         break;
//                     } else {
//                         backDoor = matchups[key1]['matchup']['0']['teams'][key2];
//                         hallPass = true;
//                     }
//                 }
//             } else {
//                 $scope.current.opponent[0] = backDoor;
//                 escape = true;
//                 break;
//             }
//         }
//     }
// }

//         console.log($scope.current.opponent[1])

    if ($scope.current.your_team) {
        if ($scope.current.your_team.points > $scope.current.opponent.points ) {
            $scope.gameStatus = 'W';
        } else if ($scope.current.your_team.points == $scope.current.opponent.points ){
            $scope.gameStatus = null;
        } else {
            $scope.gameStatus = 'L';
        }
    }

//         $scope.binary = null;

//         $scope.createModal = function(){
//             $scope.binary = true;
//         }
//         $scope.disposeModal = function(){
//             $scope.binary = false;
//         }

    }
    LeaguesCtrl_Teams.$inject = ['$scope', 'HttpService', 'Notify', 'item', 'teams', '$state', 'BreadCrumbsService','$stateParams', '$location', '$http', 'ngDialog', 'playerStatDictionary', '$filter'];
    function LeaguesCtrl_Teams($scope, HttpService, Notify, item, teams, $state, BreadCrumbsService, $stateParams, $location, $http, ngDialog, playerStatDictionary, $filter) {

        // PAGE INITIATION
        $scope.global_data = item;
        $scope.teams = teams.data[1];
        $scope.users_team_key = item.user.external_user_id;
        $scope.team_count = $scope.teams.length;
        $scope.team_keys = teams.data[0];
        $scope.stretch = null;
        $scope.displayDate = moment(new Date()).format('YYYY-MM-DD');
        $scope.playerStatDictionary = playerStatDictionary;
        $scope.rosterFormat = null;
        $scope.mfl_startIds = [];
        $scope.mfl_startNames= [];

        $scope.default_player = APP_CONFIG.host + '/images/football_default.png';
        $scope.default_team = APP_CONFIG.host + '/images/stubs/leagueava/preview.jpg';

        $scope.isMobile = (function() {
            var check = true;
            (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = false})(navigator.userAgent||navigator.vendor||window.opera);
            return !check;
        })();

        console.log($scope.isMobile);

        $scope.nfl_start = 1; // TEMP DATA
        $scope.nfl_current = teams.data[2];
        $scope.nfl_actual = $scope.nfl_current;
        $scope.nfl_end = 17; // TEMP DATA
        $scope.week_incr = function(week){
            if ((week + 1) > $scope.nfl_end) {
                return;
            }
            if ((week + 1) <= $scope.nfl_end) {
                $scope.nfl_actual++;
            }
            weekRefresh($scope.nfl_actual);
        }
         $scope.week_decr = function(week){
            if ((week - 1) < $scope.nfl_start) {
                return;
            }
            if ((week - 1) >= $scope.nfl_start) {
                $scope.nfl_actual--;
            }
            weekRefresh($scope.nfl_actual);
        }

        $scope.pushToLineup = function(player_id, player_name){
            if ($scope.mfl_startIds.includes(player_id)) {
                var index_id = $scope.mfl_startIds.indexOf(player_id);
                $scope.mfl_startIds.splice(index_id, 1);
                var index_name = $scope.mfl_startNames.indexOf(player_name);
                $scope.mfl_startNames.splice(index_name, 1);
            } else {
                $scope.mfl_startIds.push(player_id);
                $scope.mfl_startNames.push(player_name);
            }
        }

        for(var i=0; i < $scope.team_count; i++) {
            if ($stateParams.team) {
                var load_team = $stateParams.team;
            } else {
                var load_team = item.user.external_user_id;
            }
            if ($scope.teams[i]['profile']['team_key'] == load_team) {
                $scope.roster_in_view = $scope.teams[i];
                $scope.lineup_in_view = $scope.teams[i];
                starterCount($scope.lineup_in_view);
                $scope.key_in_view = $scope.teams[i].profile.team_key;
                $scope.active_key = $scope.teams[i].profile.team_key;
                break;
            }
        }

        if ($scope.teams[0]['game_code'] == "mlb" || $scope.teams[0]['game_code'] == "nhl" || $scope.teams[0]['game_code'] == "nba" ) {
            $scope.time_start = $scope.teams[0]['start_date'];
            $scope.time_finish = $scope.teams[0]['end_date'];
            $scope.time_current = $scope.teams[1][0]['roster']['position_type']['B']['players']['position_date'];
        } else if ($scope.teams[0]['game_code'] == "nfl") {
            $scope.time_start = $scope.teams[0]['start_week'];
            $scope.time_finish = $scope.teams[0]['end_week'];
            $scope.time_current = $scope.teams[0]['current_week'];
        }

        function parser(struct) {
            return struct.charAt(0) + '.';
        }

        function listParser(struct) {
            return struct.split(',');
        }

        $scope.setTeamInView = function(team) {
            $scope.roster_in_view = team;
            $scope.key_in_view = team.profile.team_key;
            var bundle = [];

            if ($scope.global_data.sport.short == 'mlb') {
                var dateFormatted = moment($scope.displayDate).format('YYYY-MM-DD');
            } else if ($scope.global_data.sport.short == 'nfl') {
                var dateFormatted = $scope.nfl_actual;
            }

            bundle[0] = dateFormatted;
            bundle[1] = team;
            post(bundle, 'lineup');
        }

        function starterCount(lineup) {
            $scope.lineupCount = {};
            for (var k in lineup.roster.position_type){
                $scope.lineupCount[k] = null;
                var count = lineup.roster.position_type[k]['length'];
                var counter = 0;
                for(var i=0; i < count; i++) {
                    if (lineup.roster.position_type[k][i]['position'] == 'BN') {
                        continue;
                    } else {
                        counter++;
                    }
                }
                $scope.lineupCount[k] = counter;
            }
        }

        $scope.dropPlayerFromRoster = function (player) {
            ngDialog.openConfirm({
                templateUrl: '/app/modules/dashboard/leagues/sub/editRoster.html',
                showClose: false,
                scope: $scope,
                data: {
                    title: 'You are about to drop ' + player.name + ' from your roster',
                    data: {
                        player: player,
                        display: player.img,
                        clearScope: function() { $scope.transactionReq = undefined},
                        logger: function(action){
                            $scope.transactionReq = undefined;

                            if ($scope.global_data.provider.title =='yahoo') {
                                 var playerToDrop = {player: player.key};
                            } else if ($scope.global_data.provider.title =='mfl') {
                                 var playerToDrop = {player: player.key, action: 'DROP'};
                            }
                            HttpService.post('/api/leagues/linked/' + $stateParams.id + '/dropplayer', playerToDrop, function (res) {
                                if (res[0] == 'error') {
                                    Notify.error(res[1]);

                                } else if (res == 'successful' || res == 'success') {
                                    Notify.success('Success! ' + player.name + ' was dropped from your roster, and added to waivers');
                                    var bundle = [];
                                    if ($scope.global_data.provider.title =='mfl') {
                                        var dateFormatted = $scope.nfl_current;
                                    } else if ($scope.global_data.provider.title =='yahoo') {
                                        var dateFormatted = moment($scope.displayDate).format('YYYY-MM-DD');
                                    }
                                        bundle[0] = dateFormatted;
                                        bundle[1] = $scope.roster_in_view;
                                        post(bundle, 'team');

                                        bundle[0] = dateFormatted;
                                        bundle[1] = $scope.lineup_in_view;
                                        post(bundle, 'lineup');
                                } else if ($scope.global_data.provider.title =='mfl' && typeof res == "object" && Object.keys(res).length == 1) {
                                    Notify.error(res[0]);
                                } else {
                                    Notify.error('There was an error in processing your request');
                                }
                            }, function (error) {
                                console.log(error);
                            })
                        }
                    }
                }
            })
        }

        // Function to open modal and remove player from starting lineup
        //
        //

        $scope.editStartingLineup = function (player, action, players) {
            if (players) { var player_list = players.join(', ')}
            $scope.lineup_action = action;
            if ($scope.global_data.provider.title =='yahoo') {
                var playerPositions = [];
                if ($scope.lineup_action == 'start') {
                    playerPositions = listParser(player.plays);
                    playerPositions.push('Util');
                    playerPositions.push('DL');
                    var modal_msg = 'You are trying to add ' + player.name + ' to your starting lineup on ' + $scope.displayDate;
                    var modal_callback = 'Please select the desired position:';
                    $scope.successmsg = 'You have successfully added ' + player.name + ' to your starting lineup on ' + $scope.displayDate;
                } else if ($scope.lineup_action == 'bench') {
                    var modal_msg = 'You are trying to remove ' + player.name + ' from your starting lineup';
                    var modal_callback = '';
                    $scope.setPosition = 'BN';
                    $scope.successmsg = 'Success! You removed ' + player.name + ' from your starting lineup for ' + $scope.displayDate;
                }
            } else if ($scope.global_data.provider.title =='mfl') {
                if ($scope.lineup_action == 'start') {
                    var modal_msg = 'You are trying to add ' + player_list + ' to your starting lineup for week ' + $scope.nfl_actual;
                    var modal_callback = '';
                    $scope.successmsg = 'You have successfully added ' + player_list + ' to your starting lineup for week ' + $scope.nfl_actual;
                }
            }

            ngDialog.openConfirm({
                templateUrl: '/app/modules/dashboard/leagues/sub/editRoster.html',
                showClose: false,
                scope: $scope,
                data: {
                    title: modal_msg,
                    callback: modal_callback,
                    data: {
                        player: player,
                        display: player.img,
                        positions: playerPositions,
                        clearScope: function() {
                            $scope.transactionReq = undefined;
                            $scope.lineup_action = null;
                        },
                        setPosition: function(position) {
                            $scope.setPosition = position;
                        },
                        logger: function(action){
                            $scope.transactionReq = undefined;
                            if ($scope.global_data.provider.title =='yahoo') {
                                var playerToAdd = {player: player.key, sport: $scope.global_data.sport.short, period: $scope.displayDate, position: $scope.setPosition};
                            } else if ($scope.global_data.provider.title =='mfl') {
                                var playerToAdd = {players: player, week: $scope.nfl_actual};
                            }

                            HttpService.post('/api/leagues/linked/' + $stateParams.id + '/editstarters', playerToAdd, function (res) {

                                if (res[0] == 'error') {
                                    Notify.error(res[1]);
                                } else if (res == 'success') {
                                    Notify.success($scope.successmsg);
                                    if ($scope.global_data.provider.title =='mfl') {
                                        weekRefresh($scope.nfl_actual);
                                    } else if ($scope.global_data.provider.title =='yahoo') {
                                        var bundle = [];
                                        var dateFormatted = moment($scope.displayDate).format('YYYY-MM-DD');
                                        bundle[0] = dateFormatted;
                                        bundle[1] = $scope.lineup_in_view;

                                        post(bundle, 'lineup');
                                    }
                                } else if ($scope.global_data.provider.title =='mfl' && typeof res == "object" && Object.keys(res).length == 1) {
                                    Notify.error(res[0]);
                                } else {
                                    Notify.error('There was an error in processing your request');
                                }
                            }, function (error) {
                                console.log(error);
                            })

                        }
                    }
                }
            })
        }

        $scope.dateRefresh = function(date){
            $scope.displayDate = date;
            var bundle = [];
            var dateFormatted = moment($scope.displayDate).format('YYYY-MM-DD');
            bundle[0] = dateFormatted;
            bundle[1] = $scope.lineup_in_view;

            post(bundle, 'lineup');
        };

        function weekRefresh(week){
            var bundle = [];
            bundle[0] = week;
            bundle[1] = $scope.lineup_in_view;

            post(bundle, 'lineup');
        };


        // Function to grab team data
        //
        //

        function post(team, what_to_refresh) {
            HttpService.post('/api/leagues/linked/' + $stateParams.id + '/team_refresh', team).then(function (res) {

                if ($scope.global_data.sport.short == 'mlb') {
                    var msg = "You are now viewing the starting lineup for " + team[0];
                } else if ($scope.global_data.sport.short == 'nfl') {
                    var msg = "You are now viewing the starting lineup for week " + team[0];
                }
                if (what_to_refresh == 'lineup') {
                    $scope.lineup_in_view = res['data'][0];
                    if ($scope.global_data.sport.short == 'nfl') {
                        starterCount($scope.lineup_in_view);
                    }
                    if (res) {
                        Notify.success(msg);
                    }
                } else if (what_to_refresh == 'team') {
                    $scope.roster_in_view = res['data'][0];

                    for (var i = 0; i < $scope.team_count; i++) {

                        if ($scope.teams[i]['profile']['team_key'] == res['data'][0]['profile']['team_key']) {
                            $scope.teams[i] = res['data'][0];
                        }
                    }

                    if (res) {
                        var msg = "Please allow 24 hours for roster changes to take effect on Leagues";
                        Notify.error(msg);
                    }
                }
            })
        }

        // Function to inject player stats when player is selected
        //
        //
        $scope.playersAndStats = {};
        $scope.injectStats = function(player) {
            if ($scope.global_data.provider.title =='mfl') return;
            if ($scope.playersAndStats.hasOwnProperty(player.name)) return;
            else $scope.playersAndStats[player.name] = {};
            var data = {id: player.key};
            HttpService.post('/api/leagues/linked/' + $stateParams.id + '/stats', data).then(function(res){
                for (var i = 0; i < res.data.length; i++) {
                    if (playerStatDictionary[$scope.global_data.sport.short].hasOwnProperty(res.data[i]['stat']['stat_id'])) {
                        $scope.playersAndStats[player.name][res.data[i]['stat']['stat_id']] = res.data[i]['stat']['value'];
                    } else { continue }
                }

            })
        }

}
    LeaguesCtrl_Trades.$inject = ['$scope', 'HttpService', 'Notify', '$state', '$window', 'BreadCrumbsService','$stateParams', '$location', 'ngDialog', 'item', 'trades', 'teams'];
    function LeaguesCtrl_Trades($scope, HttpService, Notify, $state, $window, BreadCrumbsService, $stateParams, $location, ngDialog, item, trades, teams) {

        $scope.global_data = item;

        $scope.trades_made = trades.data[0];
        $scope.trades_received = trades.data[1];
        $scope.teams = teams.data[1];
        $scope.teams_count = $scope.teams.length;
        $scope.users_team_key = item.user.external_user_id;
        $scope.is_currentuser = function(team) {
            if (team.profile.team_key == $scope.users_team_key) {
                return false;
            } else if (team.roster.position_type.all == "") {
                return false;
            } else {
                return true;
            }
        }

        $scope.users_team_short_key = item.user.external_user_id.substring(2, 4);

        $scope.bool_true = true;
        $scope.bool_false = false;

        $scope.tradeForList = [];
        $scope.tradeListKeys = [];
        $scope.tradeAwayList = [];
        $scope.yourTradeListKeys = [];
        $scope.txtMsg = '';

        $scope.makeTradeRequest = function () {
            ngDialog.openConfirm({
                templateUrl: '/app/modules/dashboard/leagues/sub/make_trade_request.html',
                showClose: false,
                scope: $scope,
                data: {
                    title: ['Select your trade partner', 'Select the players you want to trade for', 'Select the players you want to trade'],
                    data: {
                        injectTradeTargets: function(selected_team) {
                            $scope.tradePartnerKey = selected_team;
                            $scope.tradePartnerTeam = null;
                            $scope.tradePartnerPlayers = null;
                            $scope.users_team = null;
                            $scope.users_players = null;

                            for (var i=0; i < $scope.teams_count; i++) {
                                if ($scope.teams[i]['profile']['team_key'] == $scope.tradePartnerKey) {
                                    $scope.tradePartnerTeam = $scope.teams[i];
                                    $scope.tradePartnerPlayers = buildPlayerList($scope.teams[i]);

                                } else if ($scope.teams[i]['profile']['team_key'] == $scope.users_team_key) {
                                    $scope.users_team = $scope.teams[i];
                                    $scope.users_players = buildPlayerList($scope.users_team);
                                }
                            }

                            function buildPlayerList(team) {
                                var players = [];
                                for (var key in team.roster.position_type) {
                                    var player_count = team.roster.position_type[key].length;
                                    for (var z = 0; z < player_count; z++) {
                                        players.push(team.roster.position_type[key][z]);
                                    }
                                }
                                return players;
                            }

                        }, acquirePlayer: function(team, playerKey, playerName) {
                            if (team == 'opponent') {
                                if ($scope.tradeListKeys.includes(playerKey)) {
                                    var keyIndex = $scope.tradeListKeys.indexOf(playerKey);
                                    var playerIndex = $scope.tradeForList.indexOf(playerName);
                                    $scope.tradeListKeys.splice(keyIndex, 1);
                                    $scope.tradeForList.splice(playerIndex, 1);

                                } else {
                                    $scope.tradeListKeys.push(playerKey);
                                    $scope.tradeForList.push(playerName);
                                }
                            } else {
                                if ($scope.yourTradeListKeys.includes(playerKey)) {
                                    var keyIndex = $scope.yourTradeListKeys.indexOf(playerKey);
                                    var playerIndex = $scope.tradeAwayList.indexOf(playerName);
                                    $scope.yourTradeListKeys.splice(keyIndex, 1);
                                    $scope.tradeAwayList.splice(playerIndex, 1);

                                } else {
                                    $scope.yourTradeListKeys.push(playerKey);
                                    $scope.tradeAwayList.push(playerName);
                                }
                            }
                        }, clearTradeList: function(team) {
                            if (team == 'opponent') {
                                $scope.tradeListKeys = [];
                                $scope.tradeForList = [];
                            } else {
                                $scope.tradeAwayList = [];
                                $scope.yourTradeListKeys = [];
                            }
                        }, clearSelectedClass: function(class_to_remove, list_class){
                            var total_players = document.getElementsByClassName(list_class);
                            for (var i = 0; i < total_players.length; i++) {
                                if (total_players[i].classList.contains(class_to_remove)) {
                                    total_players[i].classList.remove(class_to_remove);
                                }
                            }
                        }, captureTxtMsg: function(text){
                            $scope.txtMsg = text;
                        }, clearScope: function() {
                            $scope.txtMsg = '';
                        }, executeTrade: function(){
                            console.log('Trade Initiated');
                            var trader_team_key = $scope.users_team_key;
                            var tradee_team_key = $scope.tradePartnerKey;
                            var message = $scope.txtMsg;
                            var trader_adds = $scope.tradeListKeys;
                            var trader_drops = $scope.yourTradeListKeys;
                            var tradePkg = [trader_team_key, tradee_team_key, message, trader_adds, trader_drops];
                            HttpService.post('/api/leagues/linked/' + $stateParams.id + '/executetrade', tradePkg, function (res) {
                                if (res[0] == 'error') {
                                    Notify.error(res[1]);
                                    $scope.transactionReq = undefined;
                                    $scope.tradeForList = [];
                                    $scope.tradeListKeys = [];
                                    $scope.tradeAwayList = [];
                                    $scope.yourTradeListKeys = [];
                                    $scope.txtMsg = '';
                                } else if (res.hasOwnProperty('error')) {
                                    Notify.error(res['error']['description']);
                                    $scope.transactionReq = undefined;
                                    $scope.tradeForList = [];
                                    $scope.tradeListKeys = [];
                                    $scope.tradeAwayList = [];
                                    $scope.yourTradeListKeys = [];
                                    $scope.txtMsg = '';
                                } else if (res == 'proposed' || res == 'success') {
                                    var msg = 'You successfully traded ' + $scope.tradeAwayList + ' for ' + $scope.tradeForList;
                                    Notify.success(msg);
                                    $scope.transactionReq = undefined;
                                    $scope.tradeForList = [];
                                    $scope.tradeListKeys = [];
                                    $scope.tradeAwayList = [];
                                    $scope.yourTradeListKeys = [];
                                    $scope.txtMsg = '';
                                    setTimeout(function(){ $window.location.reload()}, 2000);

                                } else {
                                    Notify.error(res[0]);
                                    $scope.transactionReq = undefined;
                                    $scope.tradeForList = [];
                                    $scope.tradeListKeys = [];
                                    $scope.tradeAwayList = [];
                                    $scope.yourTradeListKeys = [];
                                    $scope.txtMsg = '';
                                }
                            }, function (error) {
                                console.log(error);
                            })
                        }
                    }
                }
            })
        }

        $scope.notYourTeam = function(team) {
            if(team.profile.team_key == $scope.global_data.user.external_user_id) {
                return false;
            }
        }

        $scope.tradeResponse = function (tradeDecision, index, transaction) {
            var decision;
            $scope.tradeNote = '';
            if (tradeDecision) {
                decision = 'accept';
            } else if (!tradeDecision) {
                decision = 'reject';
            }
            ngDialog.openConfirm({
                templateUrl: '/app/modules/dashboard/leagues/sub/trade_response.html',
                showClose: false,
                scope: $scope,
                data: {
                    title: 'You are about to ' + decision + ' trade offer #' + index,
                    data: {
                        clearScope: function() { $scope.transactionReq = undefined},
                        captureTxtMsg: function(text){
                            $scope.tradeNote = text;
                        },
                        logger: function(action){
                            $scope.transactionReq = undefined;
                            if ($scope.global_data.provider.title == 'yahoo') {
                                var tradeDecision = {action: decision, note: $scope.tradeNote, key: transaction.meta.transaction_key};
                            } else if ($scope.global_data.provider.title == 'mfl') {
                                var will_give_up = '';
                                for (var i = 0; i < transaction.players_traded.length; i++) {
                                    will_give_up = will_give_up + ',' + transaction.players_traded[i]['key'];
                                }
                                var will_receive = '';
                                for (var i = 0; i < transaction.players_received.length; i++) {
                                    will_receive = will_receive + ',' + transaction.players_received[i]['key'];
                                }
                                var tradeDecision = {response: decision, comments: $scope.tradeNote, offeringteam: transaction.meta.trade_partner_key, offeredto: $scope.global_data.user.external_user_id, will_give_up: will_give_up, will_receive: will_receive};
                            }
                            HttpService.post('/api/leagues/linked/' + $stateParams.id + '/traderesponse', tradeDecision, function (res) {
                                if (res[0] == 'error') {
                                    Notify.error(res[1]);
                                } else if (res.hasOwnProperty('error')) {
                                    var msg = res['error']['description'];
                                    Notify.error(msg);
                                } else if (res == 'success') {
                                    var msg = 'Success! ' + 'Trade # ' + index + ', Action: ' + decision;
                                    Notify.success(msg);
                                    setTimeout(function(){ $window.location.reload()}, 2000);
                                } else {
                                    Notify.error(res[0]);
                                }
                            }, function (error) {
                                console.log(error);
                            })
                        }
                    }
                }
            })
        }

    }

    LeaguesCtrl_Link.$inject = ['$rootScope','$scope', '$state', 'BreadCrumbsService', 'HttpService', 'Notify', 'ngDialog', 'item', 'users', '$stateParams', 'AuthDataService', '$auth', '$window'];
    function LeaguesCtrl_Link($rootScope, $scope, $state, BreadCrumbsService, HttpService, Notify, ngDialog, item, users, $stateParams, AuthDataService, $auth, $window) {

        BreadCrumbsService.addCrumb(Lang.get('titles.leagues.link'));

        var _id = item.id;

        $scope.league = item;

        $scope.link = {};
        $scope.link.username = '';
        $scope.link.password = '';

        var userData = {};

        // Social auth

        if($scope.league.provider == null || !$scope.league.provider.hasOwnProperty('is_linked')) {
            $scope.league.provider = {};
            $scope.league.provider.is_linked = false;

        }

        if( $scope.league.provider.title == "yahoo" || $scope.league.provider.title == "mfl"){
            $scope.league.user_league_id = $scope.league.url.substr($scope.league.url.lastIndexOf('/') + 1);
            //     user_league_id
        }

        $scope.authenticate = function(provider) {

            if( !$scope.league.league_provider_id){
                if(!$scope.league.user_league_id){
                    $scope.league.error = "You must enter League ID";
                } else {
                    userData.league_id = $scope.league.id;
                    userData.provider_league_id = $scope.league.user_league_id;
                    userData.sport = $scope.league.sport.short;
                    userData.email = $rootScope.auth.email;
                }
            } else {
                userData.league_id = $scope.league.id;
                userData.provider_league_id = $scope.league.league_provider_id;
                userData.sport = $scope.league.sport.short;
                userData.email = $rootScope.auth.email;
            }

            if(provider =="yahoo"){

                $auth.authenticate('yahoo',userData)
                        .then(authLoginSuccess)
                        .catch(authLoginError);

                // $auth.authenticate(provider,userData)
                //         .then(authLoginSuccess)
                //         .catch(authLoginError);

            } else if(provider=="mfl"){

                ngDialog.open({
                    template: '/app/modules/dashboard/leagues/mfl.html',
                    showClose: false,
                    controller : ['$scope', function($scope) {
                        // controller logic
                    }],
                    scope: $scope
                });

            }
        };

         $scope.loginMFL = function(){
            var errors = {};
            if($scope.link.username == ""){
                errors.username = ['Enter Username'];
            }
            if($scope.link.password == ""){
                errors.password = ['Enter password'];
            }

            if($scope.link.username == "" || $scope.link.password == ""){
                $scope.$emit('form:error', errors);

            } else {
                userData.username = $scope.link.username;
                userData.password = $scope.link.password

                HttpService.post('/api/leagues/linked/' + $stateParams.id + '/auth/mfl', userData, function (resp) {
                    Notify.success(resp.message) == resp.message;
                    if($scope.league.user.role_name =="Owner"){
                        $state.go('leagues.standings', {id: resp.league_id}, { reload: true });
                    } else {
                        $state.go('leagues.share', {id: resp.league_id}, { reload: true });
                    }
                }, function (error) {
                    console.log(error);
                    $scope.errors = error[0];
                    // if (error && error.message) {
                    //     console.log(error);
                    // }
                });

            }

        }

        function authLoginSuccess(resp) {
            resp = resp.data || resp;
            Notify.success(resp.message) == resp.message;
            if($scope.league.user.role_name == "Owner"){
                $state.go('leagues.standings', {id: resp.league_id}, { reload: true });
            } else {
                $state.go('leagues.share', {id: resp.league_id}, { reload: true });
            }
        }

        function authLoginError(errors) {
            console.log(errors);
            //errors = errors.data || errors;
            //$scope.$emit('form:error', errors);
            //$scope.server_message = errors.error || null;
        }

        $scope.unlinkLeague = function() {
            Notify.confirm_cordova(function(){
                HttpService.post('/api/leagues/linked/' + $scope.league.id + '/unlink', {provider: $scope.league.provider.title},function (resp) {
                    Notify.success(resp.message);
                    $state.go('leagues.link', null, {reload: true});
                });
            }, Lang.get('notify_actions.leagues.link.unlink_confirm'));
        }

    }

    LeaguesCtrl_ProvLink.$inject = ['$rootScope','$scope', '$state', 'BreadCrumbsService', 'HttpService', 'Notify', 'ngDialog', 'item', 'users', '$stateParams', 'AuthDataService', '$auth', '$window', '$location'];
    function LeaguesCtrl_ProvLink($rootScope, $scope, $state, BreadCrumbsService, HttpService, Notify, ngDialog, item, users, $stateParams, AuthDataService, $auth, $window, $location) {

        $scope.league = item;

        $scope.link = {};
        $scope.link.username = '';
        $scope.link.password = '';
        $scope.baseUrl = $location.$$protocol + '://' + $location.$$host;

        var userData = {};
        
// test?       
$scope.league.provider_league_id = null;

        // Social auth

        if($scope.league.provider == null || !$scope.league.provider.hasOwnProperty('is_linked')) {
            $scope.league.provider = {};
            $scope.league.provider.is_linked = false;

        }

        if( $scope.league.provider.slug == "yahoo" || $scope.league.provider.slug == "my-fantasy-league"){
            $scope.league.user_league_id = $scope.league.url.substr($scope.league.url.lastIndexOf('/') + 1);
        }

        $scope.authenticate = function(provider) {

            if( !$scope.league.league_provider_id){
                if(!$scope.league.user_league_id){
                    $scope.league.error = "You must enter League ID";
                } else {
                    userData.league_id = $scope.league.id;
                    userData.provider_league_id = $scope.league.user_league_id;
                    userData.sport = $scope.league.sport.short;
                    userData.email = $rootScope.auth.email;
                }
            } else {
                userData.league_id = $scope.league.id;
                userData.provider_league_id = $scope.league.league_provider_id;
                userData.sport = $scope.league.sport.short;
                userData.email = $rootScope.auth.email;
            }

            if(provider =="yahoo"){
                $auth.authenticate('yahoo',userData)
                        .then(authLoginSuccess)
                        .catch(authLoginError);

            } else if(provider=="my-fantasy-league"){

                ngDialog.open({
                    template: '/app/modules/dashboard/leagues/mfl.html',
                    showClose: false,
                    controller : ['$scope', function($scope) {
                        // controller logic
                    }],
                    scope: $scope
                });

            }
        };

        $scope.loginMFL = function(){
            var errors = {};

            if($scope.link.username == ""){
                errors.username = ['Enter Username'];
            }
            if($scope.link.password == ""){
                errors.password = ['Enter password'];
            }

            if($scope.link.username == "" || $scope.link.password == ""){
                $scope.$emit('form:error', errors);

            } else {
                userData.username = $scope.link.username;
                userData.password = $scope.link.password;

                HttpService.post('/api/leagues/linked/' + $stateParams.id + '/auth/mfl', userData, function (resp) {
                    Notify.success(resp.message) == resp.message;
                    if($scope.league.user.role_name =="Owner"){
                        $state.go('leagues.standings', {id: resp.league_id}, { reload: true });
                    } else {
                        $state.go('leagues.share', {id: resp.league_id}, { reload: true });
                    }
                }, function (error) {
                    console.log(error);
                    $scope.errors = error[0];
                });

            }

        }

        function authLoginSuccess(resp) {
            resp = resp.data || resp;
            Notify.success(resp.message) == resp.message;
            if($scope.league.user.role_name == "Owner"){
                $state.go('leagues.standings', {id: resp.league_id}, { reload: true });
            } else {
                $state.go('leagues.share', {id: resp.league_id}, { reload: true });
            }
        }

        function authLoginError(errors) {
            console.log(errors);
        }

        $scope.unlinkLeague = function() {
            Notify.confirm_cordova(function(){
                HttpService.post('/api/leagues/linked/' + $scope.league.id + '/unlink', {provider: $scope.league.provider.slug},function (resp) {
                    Notify.success(resp.message);
                    $state.go('leagues.provlink', {id: $scope.league.id}, { reload: true });
                });
            }, Lang.get('notify_actions.leagues.link.unlink_confirm'));
        }

    }

    LeaguesCtrl_Share.$inject = ['$scope', '$state', 'BreadCrumbsService', 'HttpService', 'Notify', 'item', 'users', 'AuthDataService', '$auth', '$window'];
    function LeaguesCtrl_Share($scope, $state, BreadCrumbsService, HttpService, Notify, item, users, AuthDataService, $auth, $window) {
        $scope.league = item;
        BreadCrumbsService.addCrumb(Lang.get('titles.leagues.share'));

        HttpService.get('/api/leagues/' + $scope.league.id + '/share', function (res) {
            $scope.share_link = res.data;
        })


    }



})();
