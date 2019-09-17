(function () {
    'use strict';

    angular
        .module('app.leagues_news', [])

        .config(configure)

        .controller('LeagueNewsCtrl.sidebar', LeagueNewsCtrl_Sidebar)
        .controller('LeagueNewsCtrl.list', LeagueNewsCtrl_List)
        .controller('LeagueNewsCtrl.one', LeagueNewsCtrl_One)
        .controller('LeagueNewsCtrl.edit', LeagueNewsCtrl_Edit)
    ;

    /* Fn
     ============================================================================================================= */
    configure.$inject = ['$stateProvider'];
    function configure($stateProvider) {

        $stateProvider
            .state('leagues_news', {
                abstract   : true,
                url        : '/dashboard/leagues/:id',
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
                    }],
                    sports : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/sports');
                    }]
                }
            })

            .state('leagues_news.list', {
                url  : '/news?page',
                views: {
                    content: {
                        controller : 'LeagueNewsCtrl.list',
                        templateUrl: '/app/modules/dashboard/leagues/sub/news/list.html'
                    },
                    'sidebar' : {
                        controller: 'LeagueNewsCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/leagues/sidebar.html'
                    }
                },
                resolve : {
                    news : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        var params = _.clone($stateParams);
                        delete params.id;
                        return HttpService.getWParams('/api/leagues/'+$stateParams.id+'/news',{params:params});
                    }]
                }
            })
            .state('leagues_news.create', {
                url  : '/news/create',
                views: {
                    content: {
                        controller : 'LeagueNewsCtrl.edit',
                        templateUrl: '/app/modules/dashboard/leagues/sub/news/create.html'
                    },
                    'sidebar' : {
                        controller: 'LeagueNewsCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/leagues/sidebar.html'
                    },
                    'form@leagues_news.create' : {
                        templateUrl: '/app/modules/dashboard/leagues/sub/news/form.html'
                    }
                },
                resolve : {
                    item: function () {
                        return {data: {}}
                    }
                }
            })
            .state('leagues_news.one', {
                url  : '/news/:post_id/show',
                views: {
                    content: {
                        controller : 'LeagueNewsCtrl.one',
                        templateUrl: '/app/modules/dashboard/leagues/sub/news/one.html'
                    },
                    'sidebar' : {
                        controller: 'LeagueNewsCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/leagues/sidebar.html'
                    },
                },
                resolve : {
                    post : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/'+$stateParams.id+'/news/' +$stateParams.post_id);
                    }]
                }
            })
            .state('leagues_news.edit', {
                url  : '/news/:post_id/edit',
                views: {
                    content: {
                        controller : 'LeagueNewsCtrl.edit',
                        templateUrl: '/app/modules/dashboard/leagues/sub/news/edit.html'
                    },
                    'sidebar' : {
                        controller: 'LeagueNewsCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/leagues/sidebar.html'
                    },
                    'form@leagues_news.edit' : {
                        templateUrl: '/app/modules/dashboard/leagues/sub/news/form.html'
                    }
                },
                resolve: {
                    item : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/leagues/' + $stateParams.id +'/news/' + $stateParams.post_id);
                    }]
                }
            })
        ;
    }


    /**
     * NEWS
     */
    LeagueNewsCtrl_Sidebar.$inject = ['$scope', '$stateParams', 'league','items', 'sports'];
    function LeagueNewsCtrl_Sidebar($scope, $stateParams, league, items, sports) {
    
        // $scope.league_id = $stateParams.id;
        // $scope.current_user = $scope.$root.auth;
        // $scope.league = league.data;

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

    LeagueNewsCtrl_List.$inject = ['$scope', 'BreadCrumbsService', 'news', '$stateParams', 'league'];
    function LeagueNewsCtrl_List($scope, BreadCrumbsService, news, $stateParams, league) {
        BreadCrumbsService.addCrumb(Lang.get('titles.leagues.news.list'));

        $scope.news = news.data;

        $scope.league_id = $stateParams.id;
        $scope.current_user = $scope.$root.auth;
        $scope.league = league;
    }

    LeagueNewsCtrl_One.$inject = ['$scope', 'BreadCrumbsService', 'post', '$stateParams', 'Notify', 'HttpService', '$state'];
    function LeagueNewsCtrl_One($scope, BreadCrumbsService, post, $stateParams, Notify, HttpService, $state) {
        BreadCrumbsService.addCrumb(post.data.title);

        $scope.post = post.data;
        $scope.current_user = $scope.$root.auth;
        $scope.removePost = removePostFn;

        function removePostFn(){
            Notify.confirm_cordova(function(){
                HttpService.delete('/api/leagues/' + $stateParams.id +'/news/' + $stateParams.post_id, function(){
                    $state.go('leagues_news.list');
                });
            }, Lang.get('notify_actions.leagues.news.delete_confirm'));
        }
    }

    LeagueNewsCtrl_Edit.$inject = ['$scope', 'HttpService', 'Notify', '$state', 'item', 'BreadCrumbsService', '$stateParams'];
    function LeagueNewsCtrl_Edit($scope, HttpService, Notify, $state, item, BreadCrumbsService, $stateParams) {
        var isEdit = typeof item.data.id !== 'undefined';
        if(isEdit) {
            BreadCrumbsService.addCrumb(Lang.get('titles.leagues.news.edit'));
        } else {
            BreadCrumbsService.addCrumb(Lang.get('titles.leagues.news.create'));
        }
        $scope.post = (isEdit ? item.data : {});
        $scope.save = saveFn;

        function saveFn() {
            var method = null;
            if (isEdit) {
                method = HttpService.put('/api/leagues/' + $stateParams.id +'/news/' + $scope.post.id, $scope.post);
            } else {
                method = HttpService.post('/api/leagues/' + $stateParams.id + '/news', $scope.post);
            }

            method
                .success(function(resp) {
                    Notify.success(resp.message);
                    $state.go('leagues_news.list', {id:$stateParams.id});
                })
                .error(function(err) {
                    $scope.errors = err;
                });
        }
    }

})();
