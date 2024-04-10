var app = angular.module('bloggerApp', ['ui.router']);              
//Router provider
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
        .state('/', {
            url: '/',
            templateUrl: '/home.html',
            controller: 'HomeController',
            controllerAs: 'vm'
        })
        .state('/blogList', {
            url: '/blogList',
            templateUrl: '/blogList.html',
            controller: 'ListController',
            controllerAs: 'vm'
        })
        .state('/blogAdd', {
            url: '/blogAdd',
            templateUrl: '/blogAdd.html',
            controller: 'AddController',
            controllerAs: 'vm'
        })
        .state('/blogEdit/:blogid', {
            url: '/blogEdit/:blogid',
            templateUrl: '/blogEdit.html',
            controller: 'blogEditController',
            controllerAs: 'vm'
        })
        .state('blogDelete/:blogid', {
            url: '/blogDelete/:blogid',
            templateUrl: '/blogDelete.html',
            controller: 'DeleteController',
            controllerAs: 'vm'
        })  
        .state('/register', {
            url: '/register',
            templateUrl: '/register.html',
            controller: 'RegisterController',
            controllerAs: 'vm'
        })
        .state('/login', {
            url: '/login',
            templateUrl: '/login.html',
            controller: 'LoginController',
            controllerAs: 'vm'
        });
    // Default fallback for unmatched urls
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);
//Service for API calls
app.service('BlogService', ['$http', 'authentication', function($http, authentication) {
    var apiBaseUrl = '/api/blogs';

    var makeAuthHeader = function() {
        var token = authentication.getToken();
        return { headers: { 
            Authorization: 'Bearer ' + token } };
    };

    this.listBlogs = function() {
        return $http.get(apiBaseUrl);
    };

    this.addBlog = function(blog) {
        return $http.post(apiBaseUrl, blog,  makeAuthHeader());
    };

    this.getBlog = function(blogId) {
        return $http.get(apiBaseUrl + '/' + blogId);
    };

    this.updateBlog = function(blogId, blog) {
        return $http.put(apiBaseUrl + '/' + blogId, blog,  makeAuthHeader());
    };

    this.deleteBlog = function(blogId) {
        return $http.delete(apiBaseUrl + '/' + blogId,  makeAuthHeader());
    };
}]);

//Controllers
app.controller('HomeController', [function() {
    var vm = this;
    vm.title = 'Christian Michel Blog';
    vm.message = 'Welcome to my blogsite!';
}]);

//Controller for listing blogs
app.controller('ListController', ['BlogService','authentication', 
    function ListController(BlogService, authentication) {
    var vm = this;
    vm.blogs = [];
    vm.title = 'Blog List';

    vm.isLoggedIn = function() {
        return authentication.isLoggedIn();
    };

    vm.logout = function() {
        authentication.logout();
    };

    BlogService.listBlogs().then(function(response) {
        vm.blogs = response.data;
    }, function(error) {
        console.error('Error fetching blogs:', error);
    });
}]);



// Add a controller for the Add Blog page
app.controller('AddController', ['$location', 'BlogService', 'authentication', 
    function AddController($location, BlogService, authentication) {
    var vm = this;
    vm.blog = {};
    vm.title = 'Add Blog';

    vm.addBlog = function() {
        BlogService.addBlog(vm.blog).then(function(response){
            $location.path('/blogList');
        }, function(error){
            console.error('Error adding blog:', error);
        }); 
    };
}]);

// Controller for editing blogs
app.controller('EditController', ['$stateParams', '$location', 'BlogService', 'authentication', 
    function EditController($stateParams, $location, BlogService, authentication) {
        var vm = this;
        var blogId = $stateParams.blogid;
        vm.blog = {};
        vm.title = 'Edit Blog';

        BlogService.getBlog(blogId).then(function(response) {
            vm.blog = response.data;
        }, function(error) {
            console.error('Error fetching blog:', error);
        });

        vm.editBlog = function() {
            BlogService.updateBlog(blogId, vm.blog).then(function(response) {
                $location.path('/blogList');
            }, function(error) {
                vm.message = 'Error updating blog ' + vm.blogId;
            });
        };
}]);



app.controller('DeleteController', ['$stateParams', '$location', 'BlogService', 'authentication', 
    function DeleteController($stateParams, $location, BlogService, authentication)  {
        var vm = this;
        vm.blog = {};
        var blogId = $stateParams.blogid;
        vm.title = 'Delete Blog';

        BlogService.getBlog(blogId).then(function(response) {
            vm.blog = response.data;
            vm.message = "Blog found";
        }, function(error) {
            vm.message = 'Error fetching blog' + vm.blogId + 'for deletion';
        });

        vm.deleteBlog = function() {
            BlogService.deleteBlog(blogId).then(function(response) {
                $location.path('/blogList');
            }, function(error) {
                vm.message = 'Error deleting blog ' + vm.blogId;
            });
        };
}]);