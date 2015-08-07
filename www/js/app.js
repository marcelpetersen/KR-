// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngMaterial'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider , $mdThemingProvider) {

  $mdThemingProvider.theme('default')
    .primaryPalette('grey')

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('signup', {
      url:'/signup',
      templateUrl : "templates/signup.html",
      controller: "SignupCtrl"
  })
  .state('login', {
    url:'/login',
    templateUrl : 'templates/login.html',
    controller: 'LoginCtrl'
  })
   .state('forgetPassword', {
    url:'/forgetPasssword',
    templateUrl : 'templates/forget-password.html',
    controller: 'ForgetPasswordCtrl'
  })
  .state('home', {
      url:"/home",
      templateUrl:"templates/home.html",
      controller:"HomeCtrl"
  })
  .state('lookbook-sub', {
      url:"/lookbook-sub",
      templateUrl:"templates/lookbook-sub.html",
      controller:"LookbookSubCtrl"
  })
  .state('promotions', {
      url:"/promotions",
      templateUrl:"templates/promotions.html",
      controller:"PromotionsCtrl"
  })
  .state('lookbook', {
      url:"/lookbook",
      templateUrl:"templates/lookbook.html",
      controller:"LookbookCtrl"
  })
  .state('lookbook-detail', {
      url:"/lookbook-detail/:image",
      templateUrl:"templates/lookbook-detail.html",
      controller:"LookbookDetailCtrl"
  })
  .state('video', {
      url:"/video",
      templateUrl:"templates/video.html",
      controller:"VideoCtrl"
  })
 
  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
  // Each tab has its own nav history stack:
  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })
    .state('tab.trending', {
      url: "/trending",
      views: {
        'tab-trending': {
          templateUrl: "templates/tab-trending.html",
          controller: 'TrendingCtrl'
        }
      }
    })
  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('login');

});
