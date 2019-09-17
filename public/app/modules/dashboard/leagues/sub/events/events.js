(function () {
    'use strict';

    angular
        .module('app.leagues_events', [])

        .config(configure)

        // .controller('LeagueEventsCtrl.sidebar', LeagueEventsCtrl_Sidebar)
        .controller('LeagueEventsCtrl.list', LeagueEventsCtrl_List)
        .controller('LeagueEventsCtrl.list_date', LeagueEventsCtrl_ListDate)
        .controller('LeagueEventsCtrl.one', LeagueEventsCtrl_One)
        .controller('LeagueEventsCtrl.edit', LeagueEventsCtrl_Edit)
    ;

    /* Fn
     ============================================================================================================= */
    configure.$inject = ['$stateProvider'];
    function configure($stateProvider) {

        $stateProvider
            .state('leagues_events', {
                abstract   : true,
                url        : '/dashboard/leagues/:id/events',
                views : {
                    '' : {
                        templateUrl: '/app/modules/dashboard/layout.html'
                    }
                },
                resolve: {
                    league : [
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
                    items : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues');
                    }]
                }
            })

            .state('leagues_events.list', {
                url  : '?page',
                views: {
                    content: {
                        controller : 'LeagueEventsCtrl.list',
                        templateUrl: '/app/modules/dashboard/leagues/sub/events/list.html'
                    },
                    'sidebar' : {
                        controller: 'LeaguesCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/leagues/sidebar.html'
                    }
                },
                resolve : {
                    events : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        var params = _.clone($stateParams);
                        delete params.id;
                        return HttpService.getWParams('/api/leagues/'+$stateParams.id+'/events',{params:params});
                    }],
                    sports : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/sports');
                    }]
                }
            })
            .state('leagues_events.date', {
                url  : '/date?date?page',
                views: {
                    content: {
                        controller : 'LeagueEventsCtrl.list_date',
                        templateUrl: '/app/modules/dashboard/leagues/sub/events/list.html'
                    },
                    'sidebar' : {
                        controller: 'LeaguesCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/leagues/sidebar.html'
                    }
                },
                resolve : {
                    events : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        var params = _.clone($stateParams);
                        delete params.id;
                        return HttpService.getWParams('/api/leagues/'+$stateParams.id+'/events',{params:params});
                    }],
                    sports : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/sports');
                    }]
                }
            })
            .state('leagues_events.create', {
                url  : '/create',
                views: {
                    content: {
                        controller : 'LeagueEventsCtrl.edit',
                        templateUrl: '/app/modules/dashboard/leagues/sub/events/create.html'
                    },
                    'sidebar' : {
                        controller: 'LeaguesCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/leagues/sidebar.html'
                    },
                    'form@leagues_events.create' : {
                        templateUrl: '/app/modules/dashboard/leagues/sub/events/form.html'
                    }
                },
                resolve : {
                    item: [
                        function () {
                            return {data: {}}
                        }
                    ],
                    sports : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/sports');
                    }]
                }
            })
            .state('leagues_events.one', {
                url  : '/:event_id/show',
                views: {
                    content: {
                        controller : 'LeagueEventsCtrl.one',
                        templateUrl: '/app/modules/dashboard/leagues/sub/events/one.html'
                    },
                    'sidebar' : {
                        controller: 'LeaguesCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/leagues/sidebar.html'
                    }
                },
                resolve : {
                    event : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/'+$stateParams.id+'/events/' +$stateParams.event_id);
                    }],
                    sports : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/sports');
                    }]
                }
            })
            .state('leagues_events.edit', {
                url  : '/:event_id/edit',
                views: {
                    content: {
                        controller : 'LeagueEventsCtrl.edit',
                        templateUrl: '/app/modules/dashboard/leagues/sub/events/edit.html'
                    },
                    'sidebar' : {
                        controller: 'LeaguesCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/leagues/sidebar.html'
                    },
                    'form@leagues_events.edit' : {
                        templateUrl: '/app/modules/dashboard/leagues/sub/events/form.html'
                    }
                },
                resolve: {
                    item : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/' + $stateParams.id +'/events/' + $stateParams.event_id);
                    }],
                    sports : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/sports');
                    }]
                }
            })
        ;
    }


    /**
     * EVENTS
     */

    LeagueEventsCtrl_List.$inject = ['$scope', 'BreadCrumbsService', 'events', '$stateParams', 'league'];
    function LeagueEventsCtrl_List($scope, BreadCrumbsService, events, $stateParams, league) {
        BreadCrumbsService.addCrumb(Lang.get('titles.leagues.events.list'));

        $scope.events = events.data;
        $scope.activedate = false;

        $scope.apiUrl = '/api/leagues/' + $stateParams.id + '/events/list';
        $scope.dayApiUrl = '/dashboard/leagues/' + $stateParams.id + '/events/date';
    }

    LeagueEventsCtrl_ListDate.$inject = ['$scope', 'BreadCrumbsService', 'events', '$stateParams', 'league'];
    function LeagueEventsCtrl_ListDate($scope, BreadCrumbsService, events, $stateParams, league) {
        BreadCrumbsService.addCrumb(Lang.get('titles.leagues.events.list'));

        $scope.events = events.data;
        $scope.activedate = $stateParams.date;

        $scope.apiUrl = '/api/leagues/' + $stateParams.id + '/events/list';
        $scope.dayApiUrl = '/dashboard/leagues/' + $stateParams.id + '/events/date';
    }


    LeagueEventsCtrl_One.$inject = ['$scope', 'BreadCrumbsService', 'event', '$stateParams', 'Notify', 'HttpService', '$state'];
    function LeagueEventsCtrl_One($scope, BreadCrumbsService, event, $stateParams, Notify, HttpService, $state) {
        BreadCrumbsService.addCrumb(event.data.title);

        $scope.event = event.data;
        $scope.current_user = $scope.$root.auth;
        $scope.removePost = removePostFn;

        function removePostFn(){
            Notify.confirm_cordova(function(){
                HttpService.delete('/api/leagues/' + $stateParams.id +'/events/' + $stateParams.event_id, function(){
                    $state.go('leagues_events.list');
                });
            }, Lang.get('notify_actions.leagues.events.delete_confirm'));
        }
    }

    LeagueEventsCtrl_Edit.$inject = ['$scope', 'HttpService', 'Notify', '$state', 'item', 'BreadCrumbsService', '$stateParams'];
    function LeagueEventsCtrl_Edit($scope, HttpService, Notify, $state, item, BreadCrumbsService, $stateParams) {
        var isEdit = typeof item.data.id !== 'undefined';
        if(isEdit) {
            BreadCrumbsService.addCrumb(Lang.get('titles.leagues.events.edit'));
        } else {
            BreadCrumbsService.addCrumb(Lang.get('titles.leagues.events.create'));
        }

        if (isEdit) {
            $scope.post = item.data;

            var dataTime = new Date(item.data.time);
            $scope.post.date = dataTime.toLocaleDateString();
            $scope.post.datetime = dataTime;
        } else {
            $scope.post = {}
        }

        $scope.timePickerOptions = {
            step: 30,
            timeFormat: 'g:i A'
        };

        $scope.save = saveFn;

        function saveFn() {
            var method = null;
            if ($scope.post.date && $scope.post.datetime) {
                var time = moment(new Date($scope.post.date + ' ' + $scope.post.datetime.toLocaleTimeString()));
                $scope.post.time = time.format("YYYY-MM-DD HH:mm:ss");
            }

            if (isEdit)
            {
                method = HttpService.put('/api/leagues/' + $stateParams.id +'/events/' + $scope.post.id, $scope.post);
            } else
            {
                method = HttpService.post('/api/leagues/' + $stateParams.id + '/events', $scope.post);
            }

            method
                .success(function(resp) {
                    Notify.success(resp.message);
                    $state.go('leagues_events.list', {id:$stateParams.id});
                })
                .error(function(err) {
                    $scope.errors = err;
                });
        }
    }

})();
