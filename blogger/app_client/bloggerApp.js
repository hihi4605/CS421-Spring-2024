var app = angular.module('bloggerApp', ['ngRoute', 'ngSanitize', 'ui.bootstrap', 'ngResource']);                

console.log('bloggerApp.js loaded');
/* Route Provider */
app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'home.html',
      controller: 'homeController',
      controllerAs: 'vm'
    })
    .when('/blog-add', {
      templateUrl: 'blogAdd.html',
      controller: 'blogAddController',
      controllerAs: 'vm'
    })
    .when('/blog-list', {
      templateUrl: 'blogList.html',
      controller: 'blogListController',
      controllerAs: 'vm'
    })
    .when('/blog-edit/:id', {
      templateUrl: 'blogEdit.html',
      controller: 'blogEditController',
      controllerAs: 'vm'
    })
    .otherwise({
      redirectTo: '/'
    });
});

/* Home Controller */
app.controllers('homeController', function HomeController() {
    var vm = this;
    vm.pageHeader = {
        title: 'Blogger',
        strapline: 'Welcome to Blogger'
    };
});

//*** REST Web API functions ***/

function getAllBlogs($http) {
  return $http.get('/api/blogs');
}

function getBlogbyId($http, id) {
    return $http.get('/api/blogs/' + id);
}

function updateBlogById($http, id, data) {
    return $http.put('/api/blogs/' + id, data);
}


/* Blog Add Controller */
app.controllers('blogAddController', function BlogAddController($location) {
    var vm = this;
    vm.pageHeader = {
        title: 'Add Blog'
    };
    vm.blog = {};
    vm.save = function() {
        getBlogs().save(vm.blog, function() {
            $location.path('/blog-list');
        });
    };
});

/* Blog List Controller */
app.controllers('blogListController', function BlogListController() {
    var vm = this;
    vm.pageHeader = {
        title: 'Blog List'
    };
    vm.blogs = getBlogs().query();
});

/* Blog Edit Controller */
app.controllers('blogEditController', function BlogEditController($location, $routeParams) {
    var vm = this;
    vm.pageHeader = {
        title: 'Edit Blog'
    };
    vm.blog = getBlogs().get({ id: $routeParams.id });
    vm.save = function() {
        getBlogs().update({ id: $routeParams.id }, vm.blog, function() {
            $location.path('/blog-list');
        });
    };
});