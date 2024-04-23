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
        .state('/blogEdit', {
            url: '/blogEdit/:blogid',
            templateUrl: '/blogEdit.html',
            controller: 'EditController',
            controllerAs: 'vm'
        })
        .state('blogDelete', {
            url: '/blogDelete/:blogid',
            templateUrl: '/blogDelete.html',
            controller: 'DeleteController',
            controllerAs: 'vm'
        })  
        .state('register', {
            url: '/register',
            templateUrl: '/register.html',
            controller: 'RegisterController',
            controllerAs: 'vm'
        })
        .state('login', {
            url: '/login',
            templateUrl: '/login.html',
            controller: 'LoginController',
            controllerAs: 'vm'
        })
        .state('chatRoom', {
            url: '/chatRoom',
            templateUrl: '/chatRoom.html',
            controller: 'ChatRoomController',
            controllerAs: 'vm'
        })
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
    vm.blogs = {};
    vm.title = 'Blog List';

    vm.isLoggedIn = function() {
        return authentication.isLoggedIn();
    };

    vm.logout = function() {
        authentication.logout();
    };

    vm.currentUser = function() {
        return authentication.currentUser();
    };

    console.log('Current user is' + authentication.currentUser());

    BlogService.listBlogs().then(function(response) {
        vm.blogs = response.data;
    }, function(error) {
        console.error('Error fetching blogs:', error);
    });
}]);



app.controller('AddController', ['$location', 'BlogService', 'authentication', 
    function AddController($location, BlogService, authentication) {
        var vm = this;
        vm.blog = {};
        vm.title = 'Add Blog';

        vm.addBlog = function() {
            // Get the current user
            var user = authentication.currentUser();
            vm.blog.author = user.name;
            vm.blog.authorEmail = user.email;


            BlogService.addBlog(vm.blog)
                .then(function(response) {
                    vm.message = 'Blog added successfully';
                    $location.path('/blogList');
            }, function(error) {
                vm.message = 'Error adding blog something went wrong' + vm.blogId;
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


// Controller for deleting blogs
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
            vm.message = 'Error fetching blog' + vm.blogId + 'delete blog failed';
        });

        vm.deleteBlog = function() {
            BlogService.deleteBlog(blogId).then(function(response) {
                $location.path('/blogList');
            }, function(error) {
                vm.message = 'Error deleting blog ' + vm.blogId;
            });
        };
}]);

app.controller('ChatRoomController', ['$stateParams', '$location', 'BlogService', 'authentication', function ChatRoomController($stateParams, $location, BlogService, authentication) {
    var vm = this;
    vm.title = 'Chat Room';
    vm.message = 'Welcome to the chat room';
    vm.messages = [];
    vm.messageText = '';
    var socket = io();

    socket.on('connection', function(socket) {
        console.log(socket.id);
    });

    socket.on('receive-message', function(message) {
        vm.messages.push(message);
    });

    vm.sendMessage = function() {
        if (vm.messageText != '') {
            socket.emit('send-message', vm.messageText);
            vm.messages.push(vm.messageText);
            vm.messageText = '';
        }
    };
}]);