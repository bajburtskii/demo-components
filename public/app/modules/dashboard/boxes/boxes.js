(function () {
    'use strict';

    angular
        .module('app.boxes', [])

        .config(configure)
        .controller('BoxesCtrl.list', BoxesCtrl_List)
        .controller('BoxesCtrl.sidebar', BoxesCtrl_Sidebar)
    ;

    /* Fn
     ============================================================================================================= */
    configure.$inject = ['$stateProvider'];
    function configure($stateProvider) {

        $stateProvider
            .state('boxes', {
                abstract   : true,
                url        : '/dashboard/boxes',
                views : {
                    '' : {
                        templateUrl: '/app/modules/dashboard/layout.html'
                    }
                },
                resolve: {
                    categories : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.get('/api/boxes/categories/list');
                    }]
                }
            })
            .state('boxes.list', {
                url  : '?page',
                views: {
                    content: {
                        controller : 'BoxesCtrl.list',
                        templateUrl: '/app/modules/dashboard/boxes/list.html'
                    },
                    'sidebar' : {
                        controller: 'BoxesCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/boxes/sidebar.html'
                    }
                },
                resolve: {
                    items : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.getWParams('/api/boxes');
                    }]
                }
            })
            .state('boxes.category', {
                url  : '/:category_id?page',
                views: {
                    content: {
                        controller : 'BoxesCtrl.list',
                        templateUrl: '/app/modules/dashboard/boxes/list.html'
                    },
                    'sidebar' : {
                        controller: 'BoxesCtrl.sidebar',
                        templateUrl: '/app/modules/dashboard/boxes/sidebar.html'
                    }
                },
                resolve: {
                    items : ['HttpService', '$stateParams', function(HttpService, $stateParams) {
                        return HttpService.getWParams('/api/boxes/category/' + $stateParams.category_id + '/items');
                    }]
                }
            })

        ;
    }

    BoxesCtrl_List.$inject = ['$rootScope', '$scope', 'items', 'BreadCrumbsService', '$stateParams', 'HttpService'];
    function BoxesCtrl_List($rootScope, $scope, items, BreadCrumbsService, $stateParams, HttpService) {
        BreadCrumbsService.addCrumb(Lang.get('titles.boxes'));

        $scope.items = items.data;

        HttpService.get('/api/profile', function (resp)
        {
            $rootScope.auth = resp;
        });

        $scope.showCode = showCodeFn;
        $scope.apiUrl = $stateParams.category_id ? '/api/boxes/category/' + $stateParams.category_id + '/items' : '/api/boxes';

        function showCodeFn(item) {
            item.show_code = true;
        }
    }

    BoxesCtrl_Sidebar.$inject = ['$scope', 'categories'];
    function BoxesCtrl_Sidebar($scope, categories) {
        $scope.categories = categories.data;
    }

})();
