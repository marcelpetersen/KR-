angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('mainCtrl' , function($scope, $rootScope){
     $rootScope.header = null;
    $rootScope.footer = null;
})

.controller('LoginCtrl', function($scope ,  $mdToast, $animate , $mdDialog , $rootScope, $location , $ionicLoading, $localstorage,$state){
    var userData = {};
    $scope.user = {};
     //$state.go('home');
     
     var userRef = new Firebase("https://9lives.firebaseio.com");
  
     userData = userRef.getAuth();
     $localstorage.setObject('userData', userData);
     
      console.log(userData);

     if(userData)
        $state.go('home');


  $scope.login  = function(authorizationForm){
    $localstorage.setObject("userData", {})
    if(!authorizationForm.$valid)
    {
       $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title('Login Failed')
          .content("Please fill in the Email and Password.")
          .ok('Got it!')
        );
      return
    }

    $ionicLoading.show();

    userRef.authWithPassword({
      email    : $scope.user.email,
      password : $scope.user.password
    }, function(error, authData) { 

      if( error )
      {
        $ionicLoading.hide();

        $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title('Login Failed')
          .content("Couldn't sign in. The email or password is not correct.")
          .ok('Got it!')
        );
      }
      else
      {
        $ionicLoading.hide();
        $localstorage.setObject("userData" , authData);
        $state.go('home');

      }

    }, {
      //remember: "sessionOnly"
    });
  }

  if($rootScope.registerSuccess)
  {
      $mdToast.show(
        $mdToast.simple()
          .content(' Welcome! Login to enjoy.')
          .position("top " )
          .hideDelay(2000)
        );

      $rootScope.registerSuccess = false;
  }

})
.controller('EditProfileCtrl', function($scope , $rootScope , $ionicHistory , $ionicLoading, $state , $mdDialog){
  
})
.controller('SignupCtrl', function($scope , $rootScope , $ionicHistory , $ionicLoading, $state , $mdDialog){
  $scope.title="SIGN UP";
  $scope.user = {};
  ///var ref = new Firebase("https://9lives.firebaseio.com");
    $scope.processing = false;

  $scope.setGender = function(gender)
  {
    $scope.user.gender = gender;
  }
  
  $scope.signup = function()
  {
    
    $ionicLoading.show();
      var userRef = new Firebase("https://9lives.firebaseio.com");
      console.log($scope.user.email);
      userRef.createUser({
        email    : $scope.user.email,
        password : $scope.user.password
      }, function(error, userData) {
        if (error) {
          $ionicLoading.hide();

          var message = "Sorry. Signup failed."
          if(error.code == "EMAIL_TAKEN")
          {
            message = "Sorry. Email already taken. Please use another email. ";
          }
          else if(error.code == "INVALID_EMAIL")
          {
            message = "Sorry. The specified email is invalid.";
          }


          $mdDialog.show(
            $mdDialog.alert()
              .parent(angular.element(document.querySelector('#popupContainer')))
              .clickOutsideToClose(true)
              .title('Signup Failed')
              .content(message)
              .ok('Got it!')
          );

          console.log("Error creating user:", error);
        } else {

           $ionicLoading.hide();
          var profile = userRef.child("profile/"+userData.uid);
          
          var profileObj = {};

          profileObj = {
            'name' : $scope.user.name,
            'email' : $scope.user.email,
            'contact' : $scope.user.contact,
            // 'gender' : $scope.user.gender
          }

          profile.set(profileObj);

          $rootScope.registerSuccess = true;
          $state.go('login');
        }
      });
  }

})

.controller('ForgetPasswordCtrl',  function($scope , $ionicLoading, $mdDialog){
 $scope.resetemail = '';
  $scope.title = "FORGOT PASSWORD"
  $scope.reset = function(form)
  {


    if(!form.$valid)
      return
     $ionicLoading.show();
    var ref = new Firebase("https://9lives.firebaseio.com");
    ref.resetPassword({
      email: this.resetemail
    }, function(error) {
      if (error) {
        console.log(error);
         $ionicLoading.hide();
        switch (error.code) {
          case "INVALID_USER":
            console.log("The specified user account does not exist.");
            $mdDialog.show(
            $mdDialog.alert()
              .parent(angular.element(document.querySelector('#popupContainer')))
              .clickOutsideToClose(true)
              .title('Password Reset')
              .content("The specified user account does not exist.")
              .ok('Got it!')
            );
            break;
          default:
          $mdDialog.show(
            $mdDialog.alert()
              .parent(angular.element(document.querySelector('#popupContainer')))
              .clickOutsideToClose(true)
              .title('Password Reset')
              .content("Error resetting password")
              .ok('Got it!')
            );
            //console.log("Error resetting password:", error);
        }
      } else {
        $ionicLoading.hide();
        $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title('Password Reset Successfully')
          .content("Password reset email sent successfully!")
          .ok('Got it!')
        );
        //console.log("Password reset email sent successfully!");
      }
    });


  }

})
.controller('HomeCtrl',  function($scope , $rootScope , $ionicPlatform , $localstorage,$state, $ionicHistory){
    //$rootScope.header = 'header1';
    $rootScope.footer = 'footer1'; 
    $scope.title = "kr+";
    $scope.promo = {};
    console.log($state.current.name);

    // $ionicPlatform.onHardwareBackButton(function() {
    //   event.preventDefault();
    //   event.stopPropagation();
    //   alert('going back now all');
    // });
     $ionicPlatform.registerBackButtonAction(function (event) {
           if($state.current.name=="home"){
               //event.preventDefault();
               event.preventDefault();
               event.stopPropagation();
              ionic.Platform.exitApp();


          }
          else
          {
            $ionicHistory.goBack();
          }
       }, 100);
     
     var promo = $localstorage.getObject('promo');

    var promotionsRef = new Firebase("https://9lives.firebaseio.com/promotions");

    if(promo)
    {
      //console.log(promo.lastSeen);
      promotionsRef.once("value", function(snapshot) {
        var filter =   _.filter(snapshot.val(), function(data){
            //console.log(data.time , promo.lastSeen);
            return data.time > promo.lastSeen;
          });  
         $scope.promo.count = filter.length;
      });
      
      // promotionsRef.on("child_added", function(snapshot) {
      //   console.log(snapshot.val());
      //     var filter =   _.filter(snapshot.val(), function(data){
      //       //console.log(data.time , promo.lastSeen);
      //       console.log(data);
      //       return data.time > promo.lastSeen;
      //     }); 

      //     $scope.promo.count += filter.length;
      // });
    }



})

.controller('FacematrixCtrl' , function($scope, $rootScope , $mdDialog, $firebaseArray, $ionicLoading){
    $ionicLoading.show();

 $scope.title = "Face Matrix"

    var thumbArr = [];
    var categoriesRef = new Firebase("https://9lives.firebaseio.com/categories/face-matrix/child");
    var categories = $firebaseArray(categoriesRef);
   
      categories.$loaded(function(snapshot){
                $ionicLoading.hide();

      $ionicLoading.hide();
        console.log(snapshot);
        snapshot.forEach(function(childSnaphot){
          console.log(childSnaphot);
          thumbArr.push({
             'key':childSnaphot.$id,
             'val':childSnaphot
           });
        });
       
         $scope.thumbs = chunk(thumbArr , 2);
    })
        


    function chunk(arr, size) {
      var newArr = [];
      for (var i=0; i<arr.length; i+=size) {
        var a = arr.slice(i, i+size);
        newArr.push(arr.slice(i, i+size));
      }
      //console.log(newArr);
      return newArr;
    }

})
.controller('LookbookCtrl', function($scope, $rootScope , $mdDialog, $firebaseArray, $ionicLoading){

    $ionicLoading.show();

    $rootScope.footer = 'footer1'; 

    $scope.title = "kr+ LOOKBOOK"

    $scope.lookbook = {};
   
    var categoriesRef = new Firebase("https://9lives.firebaseio.com/categories");


    var categories = $firebaseArray(categoriesRef);

    categories.$loaded(function(data){
        $ionicLoading.hide();
        $scope.categories = data;
    })


   $scope.find = function(){
      $scope.search = true;
   }
   $scope.cancelFind = function(){
      $scope.search = false;
   }


   $scope.faceMatric = function(items){
    $scope.items = items;
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'templates/face.tmp.html',
        parent: angular.element(document.body),
        clickOutsideToClose:true,
        locals: {
           items: $scope.items
         },
      })
      .then(function(answer) {
        //console.log(answer);
        //$scope.status = 'You said the information was "' + answer + '".';
      }, function() {
        console.log('dialog closed.');
        //$scope.status = 'You cancelled the dialog.';
      });
   }

    $scope.expand = function(type){
      // if($scope.lookbook.expand == true)
      //   $scope.lookbook.expand = false
      // else
      //   $scope.lookbook.expand = true;
      if(type == "stylist")
      {
        if($scope.lookbook.expandStylist == true)
          $scope.lookbook.expandStylist = false
        else
          $scope.lookbook.expandStylist = true;
      }
      else
      {
        if($scope.lookbook.expandFace == true)
          $scope.lookbook.expandFace = false
        else
          $scope.lookbook.expandFace = true;
      }
    }
  
    function DialogController ($scope, $mdDialog, items)
    {
      console.log('adad');
      $scope.items = items;
       console.log($scope.items);
    }
    //Cleanup the modal when we're done with it!


})
.controller('PromotionsCtrl', function($scope , $rootScope, $ionicLoading , $firebaseArray , $localstorage){
    //$rootScope.header = 'header4';
    $ionicLoading.show();
    $rootScope.footer = 'footer1'; 
    $scope.title = "PROMOTIONS";
 
     var TIMESTAMP = Math.round((new Date()).getTime() / 1000);
    //$scope.promo = getObject('promo');

    var promoRef = new Firebase("https://9lives.firebaseio.com/promotions");
    $scope.promotions = $firebaseArray(promoRef);

    $scope.promotions.$loaded(function(data){
      $localstorage.setObject('promo',{'lastSeen': TIMESTAMP});
      $ionicLoading.hide();
    })
   
})

.controller('TrendingCtrl' , function($scope , $rootScope , $ionicLoading){

   $scope.title = "TRENDING";

    $ionicLoading.show();
    $rootScope.footer = 'footer1'; 
    $scope.thumbArr = [];
   
    var  trendingRef = new Firebase("https://9lives.firebaseio.com/likes");

    trendingRef.orderByChild("count").limitToFirst(50).on("value", function(snapshot) {
        $ionicLoading.hide();

        console.log(snapshot.val());
        snapshot.forEach(function(childSnaphot){
          //console.log(childSnaphot.key() , childSnaphot.val());
          $scope.thumbArr.push({
            'key':childSnaphot.key(),
            'val':childSnaphot.val()
          });
        });
        $scope.thumbs = chunk($scope.thumbArr.reverse() , 2);

        
    });

    $scope.$watchCollection('thumbs' , function(){
      console.log($scope.thumbs);
    })

    
    function chunk(arr, size) {
      var newArr = [];
      for (var i=0; i<arr.length; i+=size) {
        newArr.push(arr.slice(i, i+size));
      }
      return newArr;
    }

    $scope.getThumbPath = function(path)
    {
      var arr = path.split(':');
      return arr[0]+"/"+arr[1];

    }

    $scope.getThumbCat = function(path)
    {
      var arr = path.split(':');
      return arr[0];
    }

     $scope.getThumbFile = function(path)
    {
      var arr = path.split(':');
      return arr[1];
    }

    $scope.getPath = function(path)
    {
      var arr = path.split(':');
      return arr[0]+"/"+arr[1];
    }
})

.controller('LoveitCtrl' , function($scope , $rootScope , $ionicLoading, $localstorage , $stateParams){

    $scope.title = "LOVE IT!";
    $ionicLoading.show();
    $rootScope.footer = 'footer1'; 
    $scope.thumbArr = [];
   
    var  loveRef = new Firebase("https://9lives.firebaseio.com/likes");


   //$scope.votes = $firebaseObject(voteRef);
   $scope.scroll = function(){
  
   }
    loveRef.orderByChild("uid")
    .on("value", function(snapshot) {
        $ionicLoading.hide();
        //console.log(snapshot.val());
        snapshot.forEach(function(childSnaphot){
          if(_.find(childSnaphot.val().by , {'uid':$localstorage.getObject('userData').uid})){
              //console.log(childSnaphot.key());
              var data = childSnaphot.key().split(':');
              console.log(data); 
              $scope.thumbArr.push({
                'category':data[0],
                'filename':data[1]
              })
          };

       
        });
        console.log($scope.thumbArr);

        $scope.thumbs = chunk($scope.thumbArr , 2);  
      });
   


    // $scope.$watchCollection('thumbs' , function(){
    //   console.log($scope.thumbs);
    // })

    
    function chunk(arr, size) {
      var newArr = [];
      for (var i=0; i<arr.length; i+=size) {
        newArr.push(arr.slice(i, i+size));
      }
      return newArr;
    }

    $scope.getPath = function(path)
    {
      var arr = path.split(':');
      return arr[0]+"/"+arr[1];
    }

})


.controller('LookbookSubCtrl', function($scope, $rootScope ,$ionicLoading, $stateParams , $firebaseArray , $q){
    


    $scope.title = $stateParams.cat.name;



    $ionicLoading.show();
    console.log($stateParams.category);
    $scope.category = $stateParams.cat.key;
    $rootScope.footer = 'footer1'; 
    //$scope.title = "kr+ Lookbook"
    var thumbArr = [];
   
    var  lookbookRef = new Firebase("https://9lives.firebaseio.com/lookbook2/"+$scope.category);
    //var  scrollRef = new Firebase.util.Scroll(lookbookRef,'filename');
    
    var photos = $firebaseArray(lookbookRef);

    photos.$loaded(function(snapshot){
      $ionicLoading.hide();
        console.log(snapshot);
        snapshot.forEach(function(childSnaphot){
          console.log(childSnaphot);
          thumbArr.push({
             'key':childSnaphot.$id,
             'val':childSnaphot
           });
        });
       
         $scope.thumbs = chunk(thumbArr , 2);
    })
        
 
    $scope.$watchCollection('thumbArr' , function(oldVal, newVal){
       
        //console.log(newVal , oldVal);
         console.log($scope.thumbArr);
         if($scope.thumbArr)
            $scope.thumbs = chunk($scope.thumbArr , 2);
     })  
    //scrollRef.scroll.next(10);
 

    $scope.loadMore = function()
    {
      console.log(scrollRef.scroll);
          $ionicLoading.show();

      console.log('loadMore');
     // scrollRef.scroll.next(10);
      //$scope.$broadcast('scroll.infiniteScrollComplete');


    }

    $scope.moreDataCanBeLoaded = function()
    {

      // var hasMore = scrollRef.scroll.hasNext();
      // return scrollRef.scroll.hasNext();
    }
    
    //$scope.thumbs = chunk(thumbArr , 2);

    function chunk(arr, size) {
      var newArr = [];
      for (var i=0; i<arr.length; i+=size) {
        var a = arr.slice(i, i+size);
        newArr.push(arr.slice(i, i+size));
      }
      //console.log(newArr);
      return newArr;
    }
})

.controller('LookbookDetailCtrl', function($scope , $stateParams , $rootScope , $cordovaSocialSharing , $localstorage , $firebaseArray , $firebaseObject , $ionicPlatform){
    $scope.title = "LOOKBOOK"
  //console.log($stateParams)
   $scope.image = $stateParams.image;
   $scope.category = $stateParams.category;
  
   $scope.votes = [];
   $scope.tags ='';
   $scope.zoomsize = '100%'
 
   var imagename = $stateParams.image.split('.');
   var  voteRef = new Firebase("https://9lives.firebaseio.com/likes");

   $scope.votes = $firebaseObject(voteRef);
  
   // $scope.items = [
   //    {
   //      src:'http://www.wired.com/images_blogs/rawfile/2013/11/offset_WaterHouseMarineImages_62652-2-660x440.jpg',
   //      sub: 'This is a <b>subtitle</b>'
   //    },
   //    {
   //      src:'http://www.gettyimages.co.uk/CMS/StaticContent/1391099215267_hero2.jpg',
   //      sub: '' /* Not showed */
   //    },
   //    {
   //      src:'http://www.hdwallpapersimages.com/wp-content/uploads/2014/01/Winter-Tiger-Wild-Cat-Images.jpg',
   //      thumb:'http://www.gettyimages.co.uk/CMS/StaticContent/1391099215267_hero2.jpg'
   //    }
   //  ]
   

    if($localstorage.getObject('userData') )
    {
      voteRef.child($stateParams.category+":"+imagename[0]+"/by").orderByChild('uid').startAt($localstorage.getObject('userData').uid).once('value', function(data){
         if(data.val()!==null)
            $scope.volted = true;
         else
           $scope.volted = false;
      });
    }

      voteRef.child($stateParams.category+":"+imagename[0]+'/count').on('value' , function(snapshot){

        if(snapshot.val() === null)
            $scope.count = "0";
        else
          $scope.count = snapshot.val() + "";
      })
   

      $scope.nextID  = $stateParams.id;
      var lookbookRef = new Firebase("https://9lives.firebaseio.com/lookbook2/"+$stateParams.category+"");

      $scope.images = $firebaseArray(lookbookRef);
      
      $scope.images.$loaded(function(data){
          var current  = _.find($scope.images, {"filename":$stateParams.image});
          angular.forEach(current.tags , function(t){
              $scope.tags =  $scope.tags+'#'+t+" ";
          })
      })

      $scope.zoom = function(){
        if($scope.zoomsize == '100%')
          $scope.zoomsize = '150%'
        else
          $scope.zoomsize = '100%'
      }

      $scope.getCount = function(count){
         
           if(count === undefined)
              count = 0;

          if(count  > 1 || count == 0)
            return count +' Loves';
          else
            return count +' Love';
      }

      $scope.nextImage = function(direction){

        if($scope.zoomsize === '150%')
          return;

        $scope.tags ='';
        var current = _.findIndex($scope.images , {'filename':$scope.image});
        if(direction == 'fwd')
        {
           angular.forEach($scope.images[current + 1].tags , function(t){
              $scope.tags =  $scope.tags+'#'+t+" ";
           })

          $scope.image = $scope.images[current + 1].filename; 
        }
        else
        {
          angular.forEach($scope.images[current - 1].tags , function(t){
              $scope.tags =  $scope.tags+'#'+t+" ";
           })
          $scope.image = $scope.images[current - 1].filename; 
        }

        var i = $scope.image.split('.');

        if($scope.votes[$scope.category+':'+i[0]] !== undefined){
            console.log( $scope.votes[$scope.category+':'+i[0]] );
             if($scope.votes[$scope.category+':'+i[0]].count > 0)
             {
                $scope.count = $scope.votes[$scope.category+':'+i[0]].count;
                //console.log($scope.count);
             }
             else
             {
                $scope.count = 0;
                //console.log($scope.count);
             }

            var uid = $localstorage.getObject('userData').uid;
            var find = _.find($scope.votes[$scope.category+':'+i[0]].by , {"uid":uid});
            console.log(find);
            if( find ===null || find === undefined )
            {
               $scope.volted = false;
            }
            else
            {
              $scope.volted = true;
            }

        }
        else
        {
          $scope.volted = false;
          $scope.count = 0;
        }
      
      }

   var message ="Look at this cool style from the new app from kr+!";
   var subject = "Cool Style from kr+";
   var link = "";
   var  file = "http://krplus.com/lookbook/"+$stateParams.category+"/"+$scope.image;

   $scope.love = function(){
      $scope.volted = true;
      var imagename = $scope.image.split('.');
      console.log($stateParams.category+":"+imagename[0]+"/count");
      voteRef.child($stateParams.category+":"+imagename[0]+"/count").transaction(function(current_value){
            count = (current_value || 0) + 1
            $scope.count = count;
            return count; 
      });
      
      var uid = $localstorage.getObject('userData').uid;
      voteRef.child($stateParams.category+":"+imagename[0]+"/by").push({'uid':uid});
      //$scope.$apply();
   }

  $scope.unlove  = function(){
    console.log($scope.image);
    $scope.volted = false;
    var imagename = $scope.image.split('.');

    voteRef.child($stateParams.category+":"+imagename[0]+"/count").transaction(function(current_value){
            count = (current_value || 0) - 1
            $scope.count = count;
            return count; 
      });
    
    voteRef.child($stateParams.category+":"+imagename[0]+"/by").orderByChild('uid').startAt($localstorage.getObject('userData').uid).once('value', function(data){
       data.forEach(function(childSnaphot){
          voteRef.child($stateParams.category+":"+imagename[0]+"/by/"+childSnaphot.key()).remove(function(res){
            $scope.volted = false;
          })
        });
    });

  }

  $scope.share = function(){
  $ionicPlatform.ready(function() {
    $cordovaSocialSharing
    .share(message, subject, file, link) // Share via native share sheet
    .then(function(result) {
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title('Social Share')
          .content("Share successfully.")
          .ok('Ok!')
        );
      
    }, function(err) {
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title('Social Share')
          .content("Share failed. Please try again.")
          .ok('Ok!')
        );
    });

  });


   }
   
})

.controller('MyLookbookCtrl' , function($scope, $rootScope, $stateParams , $localstorage, $location , $state , $firebaseArray ,  $ionicLoading ,  $ionicSlideBoxDelegate){

   $ionicLoading.show();
   $scope.mylookbook = [];
   $scope.title = 'MY LOOKBOOK';

   
    var mylookbookRef = new Firebase("https://9lives.firebaseio.com/mylookbook/"+$localstorage.getObject('userData').uid);
  
    var looksRef = mylookbookRef.child('looks');
  
    var myLookbook = $firebaseArray(looksRef);

    myLookbook.$loaded(function(data){
      console.log(data);
       $ionicLoading.hide();
        //$ionicLoading.hide();
        //$scope.categories = data;
        $scope.mylookbook = data.reverse();
        console.log("lookbook :"  , $scope.mylookbook);
        $ionicSlideBoxDelegate.update();
    })

   //$scope.mylookbook = $localstorage.getArray('lookook');

    // if($scope.mylookbook.length <=0);
    //    $state.go('mylookbook-add')

})

.controller('MyLookbookAllCtrl' , function($scope, $rootScope, $stateParams , $localstorage, $location,$firebaseArray , $ionicLoading){

   $ionicLoading.show();
   $scope.title = 'MY LOOKBOOK';

   var mylookbookRef = new Firebase("https://9lives.firebaseio.com/mylookbook/"+$localstorage.getObject('userData').uid);

   var looksRef = mylookbookRef.child('looks');


    var myLookbook = $firebaseArray(looksRef);

    myLookbook.$loaded(function(data){
        $ionicLoading.hide();
        $scope.mylookbook = data;

        $scope.thumbs = chunk($scope.mylookbook.reverse() , 2);
    });


   //$scope.mylookbook = $localstorage.getArray('lookook');
   //console.log("lookbook :"  , $scope.mylookbook);

   

    function chunk(arr, size) {
      console.log(arr);
      var newArr = [];
      for (var i=0; i<arr.length; i+=size) {
        var a = arr.slice(i, i+size);
        newArr.push(arr.slice(i, i+size));
      }
      console.log(newArr);
      return newArr;
    }

})

.controller('MyLookbookFavoritelCtrl' , function($scope, $rootScope, $stateParams , $localstorage, $location, $ionicLoading,$firebaseArray){

    $ionicLoading.show();
    $scope.title = 'MY LOOKBOOK';
    //$scope.mylookbook = [];
    var firebaseRef = new Firebase("https://9lives.firebaseio.com/mylookbook/"+$localstorage.getObject('userData').uid);
  
    var looksRef = firebaseRef.child('looks');

    var mylooks = $firebaseArray(looksRef)

    mylooks.$loaded(function(data){
    $ionicLoading.hide();
      $scope.mylookbook = data.reverse();
    }) 

    $scope.unlove = function(id){
      console.log('unlove');
      console.log(id);
      looksRef.child(id).update({'like' : null});

    } 
  

})

.controller('MyLookbookDetailCtrl' , function($scope, $rootScope, $stateParams , $localstorage, $location, $stateParams  , $state , $ionicPopup, $ionicPlatform , $cordovaSocialSharing,  $mdDialog){

   $scope.title = 'MY LOOKBOOK';

   $scope.photo = $stateParams.item.image;
   $scope.date = $stateParams.item.date;
   $scope.type = $stateParams.item.type;
   $scope.id = $stateParams.item.$id;
   $scope.liked = $stateParams.item.like;


  $scope.delete = function() {
       var confirmPopup = $ionicPopup.confirm({
         title: 'MYLookbook',
         template: 'Are you sure you want to delete this photo?'
       });
       confirmPopup.then(function(res) {
         if(res) {
           //console.log('You are sure');
           removePhoto();
         } else {
           console.log('You are not sure');
         }
       });
 };


   var message ="Look at this cool style from the new app from kr+!";
   var subject = "Cool Style from kr+";
   var link = "";
   var  file = $stateParams.item.image;
   console.log($stateParams.item);

  $scope.share = function(){
  $ionicPlatform.ready(function() {
    $cordovaSocialSharing
    .share(message, subject, file, link) // Share via native share sheet
    .then(function(result) {
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title('Social Share')
          .content("Share successfully.")
          .ok('Ok!')
        );
      
    }, function(err) {
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title('Social Share')
          .content("Share failed. Please try again.")
          .ok('Ok!')
        );
    });

  });


   }
   
   $scope.love = function(){
      console.log('love');

      var firebaseRef = new Firebase("https://9lives.firebaseio.com/mylookbook/"+$localstorage.getObject('userData').uid);
      firebaseRef.child('likes/'+$scope.id).set({
        'like':true,
        'id' : $scope.id
      });

      firebaseRef.child('looks/'+$scope.id).update({'like' : true});

      $scope.liked = true;
   
   }

   $scope.unlove = function(){
      console.log('unlove');

      var firebaseRef = new Firebase("https://9lives.firebaseio.com/mylookbook/"+$localstorage.getObject('userData').uid);
      firebaseRef.child('likes/'+$scope.id).set(null);

      firebaseRef.child('looks/'+$scope.id+'').update({'like' : null});

      $scope.liked = false;
   
   }


   function removePhoto(){
    
     var firebaseRef = new Firebase("https://9lives.firebaseio.com/mylookbook/"+$localstorage.getObject('userData').uid);
     firebaseRef.child('looks/'+$scope.id).remove();
     $state.go('mylookbook-all');
    
   }

})

.controller('MyLookbookAddCtrl' , function($scope, $rootScope , $stateParams , $ionicActionSheet ,$timeout , $q, $mdBottomSheet , $mdDialog , $location, $localstorage, $cordovaFile,$ionicPlatform,Camera,$cordovaImagePicker){
    $scope.title = 'MY LOOKBOOK';
    $scope.images=[];

    if(typeof $rootScope.pic == 'undefined')
    {
       $rootScope.pic={
          before: [],
          after: []
       }
    }

  $scope.delete = function(index){
    $rootScope.pic.before[index]  = null;
  }

  $scope.delete2 = function(index){
    $rootScope.pic.after[index]  = null;
  }

  $scope.showListBottomSheet = function(index) {
    //$scope.photoIndex = index;
    $mdBottomSheet.show({
      templateUrl: 'templates/bottom-sheet-list-template.html',
      controller: 'ListBottomSheetCtrl',
      local : {photoIndex:index}
    }).then(function(action) {
      //console.log(action);
       if(action == 0)
       {
          $scope.getPhotoBefore(index);
       }
       else
       {
          $scope.getLibrary(index);
       }
    });
  };

  $scope.getLibrary = function(index){
    console.log("getLibrary" , index);
  var options = {
   maximumImagesCount: 1,
   width: 1200,
   height: 1080,
   quality: 80
  };

  $cordovaImagePicker.getPictures(options)
    .then(function (results) {
      console.log(results);
       if(index < 3)
            $rootScope.pic.before[index] = results[0];
        else
          $rootScope.pic.after[index-3] = results[0];
      // if(index > 2)
      // {
      //   console.log("getPicfromLibrary");
      //   for (var i = 0; i < results.length; i++) {
      //     console.log(index , i);
      //    $rootScope.pic.after[index] = results[i];
      //   }
      // }
      // else
      // {
      //   for (var i = 0; i < results.length; i++) {
      //    $rootScope.pic.before[index] = results[i];
      //   }
      // }

    }, function(error) {
      // error getting photos
       console.log('Error: ' + error);
    });

    
  }

  $scope.getPhotoBefore = function(index) {
     var option = {quality:80 , 
      //destinationType : Camera.DestinationType.DATA_URL,
      destinationType:1,
      encodingType: 0,
      //targetWidth: 1836,
      targetWidth: 643,
      targetHeight: 900,
      allowEdit:true,
      correctOrientation:true,
      PictureSourceType:2,

      //saveToPhotoAlbum:true
    };


    Camera.getPicture(option).then(function(imageURI) {
        if(index < 3)
          $rootScope.pic.before[index] = imageURI;
        else
          $rootScope.pic.after[index-3] = imageURI;
    }, function(err) {
      console.log(err);
      // $mdDialog.show(
      //   $mdDialog.alert()
      //     .parent(angular.element(document.querySelector('#popupContainer')))
      //     .clickOutsideToClose(true)
      //     .title('Camera Failed')
      //     .content("Opps! Something went wrong. Please try again.")
      //     .ok('Ok!')
      //   );
    })

    //$cordovaCamera.cleanup();
  };

  $scope.selectStylist = function(){
     $location.path('/stylist');
  }

  $scope.saveImage = function() {
    $q.all([
    angular.forEach($rootScope.pic.before, function(photo , key){
      if(photo !==null)
        createFileEntry(photo , "Before");
    }),
    angular.forEach($rootScope.pic.after, function(photo2 , key){
      if(photo2 !==null)
        createFileEntry(photo2 , "After");
    })
    ]).then(function(val){
      console.log(val);
      $rootScope.pic={
          before: [],
          after: []
       }
       $mdDialog.show(
        $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('My New Look')
          .content("New look saved.")
          .ok('Ok!')
        );
    })
  }

  function createFileEntry(imageUrl, type) {
  
     var name = imageUrl.substr(imageUrl.lastIndexOf('/') + 1);
      var namePath = imageUrl.substr(0, imageUrl.lastIndexOf('/') + 1);
      var newName = makeid() + name;

     
      $ionicPlatform.ready(function() {
        $cordovaFile.copyFile(namePath, name, cordova.file.dataDirectory, newName)
          .then(function(info) {
            //console.log("success",info);
            // var library =  $localstorage.getArray('lookook');
            // library.push({
            //    'stylist' : $rootScope.stylist,
            //    'date'    :new Date(),
            //    'photo'   : cordova.file.dataDirectory+newName,
            //    'type'    : type
            // });

            convertImgToBase64URL(cordova.file.dataDirectory+newName, output, 'image/jpeg' , type , getDateString());
            //$localstorage.setArray('lookook', library);

          }, function(e) {
            console.log("Failed" , e);
            //reject();
          });
      });
  }

  function output(dataURL , type , date)
  {
    console.log(date);
    var firebaseRef = new Firebase("https://9lives.firebaseio.com/mylookbook/"+$localstorage.getObject('userData').uid);
    firebaseRef.child('looks').push({
      'image' : dataURL,
      'date' : date,
      'type' : type
    })

  }

  function convertImgToBase64URL(url, callback, outputFormat, type, date){
    console.log(type, date)
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'), dataURL;
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL, type, date);
        canvas = null; 
    };
    img.src = url;
  }

  function getDateString() {
    var now = new Date();
    var todayUTC = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    return todayUTC.toISOString().slice(0, 10).replace(/-/g, '-');
  };



  // 6
  function onCopySuccess(entry) {
    console.log(entry);

      $scope.$apply(function () {
          $scope.images.push(entry.nativeURL);
      });
  }

  function fail(error) {
      console.log("fail: " + error.code);
  }

  function makeid() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i=0; i < 5; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
  }


})

.controller('ListBottomSheetCtrl',  function($scope, $mdBottomSheet , $rootScope , Camera){

   $scope.items = [
    { name: 'Camera', icon: 'ion-camera' },
    { name: 'Gallery', icon: 'upload' },
   
  ];

  $scope.listItemClick = function($index) {
    $mdBottomSheet.hide($index);
  };
})
.controller('stylistListCtrl' , function($scope, $firebaseArray,$stateParams , $ionicPopup){
   $scope.title = $stateParams.cat.name;

  var firebaseRef = new Firebase("https://9lives.firebaseio.com/");

  $scope.category = $stateParams.cat.key;
  var stylistRef = firebaseRef.child('lookbook2/'+$stateParams.cat.key);
  $scope.stylists = $firebaseArray(stylistRef);

$scope.stylistDetail = function(id) {
      // An elaborate, custom popup
     console.log($scope.stylists[id]);

    var myPopup = $ionicPopup.show({
      cssClass : "stylist",
      template: '<div class="list card">'+
                  '<div class="item item-image">'+
                  '  <img src="http://krplus.com/lookbook/'+$scope.category+'/'+$scope.stylists[id].filename+'">'+
                  '</div>'+
                  '<div class="item item-text-wrap">'+
                  '<h3>'+$scope.stylists[id].name+'</h3>'+
                  'I love hair because '+$scope.stylists[id].desc+'<br /><br>'+
                  'My passion are '+$scope.stylists[id].passion+'<br/><br>'+
                  '</div>'+
                '</div>',
      scope: $scope,
      buttons: [
        { text: 'Close' },
      
      ]
    });
  }



})

.controller('ShopListCtrl' , function($scope, $rootScope , $mdDialog, $firebaseArray, $ionicLoading ){
    $ionicLoading.show();

    $rootScope.footer = 'footer1'; 

    $scope.title = "STYLIST"

    $scope.lookbook = {};
   
    var categoriesRef = new Firebase("https://9lives.firebaseio.com/categories");


    var categories = $firebaseArray(categoriesRef);

    categories.$loaded(function(data){
        $ionicLoading.hide();
        $scope.categories = data;
    })






})

.controller('StylistCtrl' , function($scope , $mdDialog , $rootScope ){
   console.log('Stylist');
   $scope.title = "STYLIST";

   $scope.stylistDetail = function(id){
      console.log(id);
      $mdDialog.show({
        controller : TheChosenOne,
        templateUrl: 'templates/detail.tmp.html',
        parent: angular.element(document.body),
        clickOutsideToClose:true
      })
      .then(function(answer) {
        //console.log(answer);
        $rootScope.stylist = answer; 
        window.history.back();
        //$scope.status = 'You said the information was "' + answer + '".';
      }, function() {
        console.log('dialog closed.');
        //$scope.status = 'You cancelled the dialog.';
      });
   }

   function TheChosenOne($scope , $mdDialog)
   {
     $scope.chosen = function(answer)
     {
        console.log("clicked");
        $mdDialog.hide(answer);
     }
   } 

})

.controller('TileCtrl',  function($scope, $mdGridLayout){
  
})
.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})
.controller('VideoCtrl', function($scope , $rootScope, $firebase,$firebaseArray){
    $scope.title = "VIDEO"
    var firebaseRef = new Firebase("https://9lives.firebaseio.com/");
    var videoRef = firebaseRef.child('videos');
    $scope.videos = $firebaseArray(videoRef);

})

.controller('MyaccountCtrl' , function($scope , $localstorage,$location , $ionicLoading , $ionicPopup, $firebase , $mdBottomSheet , $cordovaImagePicker , Camera){
  $ionicLoading.show();
     $scope.title = "MY ACCOUNT"
     $scope.user = {}

     var authData =   $localstorage.getObject("userData");

     var profile = new Firebase("https://9lives.firebaseio.com/profile/"+$localstorage.getObject('userData').uid);
    
    //console.log("https://9lives.firebaseio.com/profile/"+$localstorage.getObject('userData').uid);
     profile.on('value' , function(snapshot){
       if(snapshot.val() !== null)
       {
          console.log(snapshot.val());
          $ionicLoading.hide();
          $scope.user = snapshot.val();
          //$scope.user.avatar = "img/avatar.png";
       }
     })

     $scope.setGender = function(gender){
        $scope.user.gender = gender;
        profile.update({
          'gender':$scope.user.gender
        })

     }

   $scope.logout = function(){
       var userRef = new Firebase("https://9lives.firebaseio.com");

        userRef.unauth();
        $localstorage.setObject("userData" , {});
        $location.path('/login');
     }   

  $scope.updateAvatar = function(){

    $scope.showListBottomSheet(0);
  }

  $scope.editProfile = function() {
      console.log($scope.user.contact);
      var myPopup = $ionicPopup.show({
        template: ' <div class="login-wraper">'+
                  '   <input type="text"  class="login-textfield" ng-model="user.name"  placeholder="name" style="width:100%">'+
                  '</div>'+
                  '<div class="login-wraper">'+
                  '   <input type="text"  class="login-textfield" ng-model="user.contact" placeholder="contact no" style="width:100%">'+  
                  '</div>',
        scope: $scope,
        cssClass: 'custom-popup',
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Save</b>',
            type: 'cus-button',
            onTap: function(e) {
              return true;
            }
          }
        ]
      });

       myPopup.then(function(res) {
        if(res)
        {
          $ionicLoading.show();
           profile.update({
              'name' : $scope.user.name,
              'contact': $scope.user.contact,
           }, function(error){
             $ionicLoading.hide();
            if (error) {
              var alertPopup = $ionicPopup.alert({
                    title : 'My Account',
                    template: 'Error changing profile.' + error.code
                });
                //alert("Error changing profile." + error.code);
              }
              else
              {
                var alertPopup = $ionicPopup.alert({
                    title : 'My Account',
                    template: 'Profile changed successfully.'
                });
                //alert("Profile changed successfully.")
              }
           })
         }
        console.log('Tapped!', res);
      });

  }

  $scope.showListBottomSheet = function(index) {
    console.log(index);
    //$scope.photoIndex = index;
    $mdBottomSheet.show({
      templateUrl: 'templates/bottom-sheet-list-template.html',
      controller: 'ListBottomSheetCtrl',
      local : {photoIndex:index}
    }).then(function(action) {
      //console.log(action);
       if(action == 0)
       {
          $scope.getPhotoBefore(index);
       }
       else
       {
          $scope.getLibrary(index);
       }
    });
  };

  $scope.getLibrary = function(index){

  var options = {
   maximumImagesCount: 1,
   width: 1080,
   height: 1080,
   quality: 80
  };

  $cordovaImagePicker.getPictures(options)
    .then(function (results) {
      for (var i = 0; i < results.length; i++) {
       $scope.user.avatar = results[i];
        profile.update({
          'avatar': $scope.user.avatar 
        })
      }
    }, function(error) {
      // error getting photos
       console.log('Error: ' + error);
    });

    
  }

  $scope.getPhotoBefore = function(index) {
     var option = {quality:50 , 
      //destinationType : Camera.DestinationType.DATA_URL,
      destinationType:1,
      encodingType: 0,
      targetWidth: 1080,
      targetHeight: 1080,
      allowEdit : true,
      correctOrientation:true,
      PictureSourceType:2,

      //saveToPhotoAlbum:true
    };


    Camera.getPicture(option).then(function(imageURI) {
      $scope.user.avatar = imageURI
      profile.update({
        'avatar': $scope.user.avatar 
      })
        // if(index < 3)
        //     $scope.user.avatar = imageURI;
        // else
        //   $rootScope.pic.after[index-3] = imageURI;
    }, function(err) {
      console.log(err);
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title('Camera Failed')
          .content("Opps! Something went wrong. Please try again.")
          .ok('Ok!')
        );
    })

    //$cordovaCamera.cleanup();
  };


  })

.controller('SettingCtrl' , function($scope , $localstorage,$location , $ionicLoading , $ionicPopup, $firebase ,$ionicPush){
  $ionicLoading.show();
     $scope.title = "ACCOUNT SETTINGS"
     $scope.user = {}

    
      var authData =   $localstorage.getObject("userData");

     var profile = new Firebase("https://9lives.firebaseio.com/profile/"+$localstorage.getObject('userData').uid);
    
    //console.log("https://9lives.firebaseio.com/profile/"+$localstorage.getObject('userData').uid);
     profile.on('value' , function(snapshot){
       if(snapshot.val() !== null)
       {
         $ionicLoading.hide();
          $scope.user = snapshot.val();
          //$scope.user.avatar = "img/avatar.png";
       }
     })

     $scope.setGender = function(gender){
        $scope.user.gender = gender;
        profile.update({
          'gender':$scope.user.gender
        })

     }

     $scope.logout = function(){
       var userRef = new Firebase("https://9lives.firebaseio.com");

        userRef.unauth();
        $localstorage.setObject("userData" , {});
        $location.path('/login');
     }

     $scope.changeNotification = function(){

       if(this.setting.notification)
       {
          $ionicPush.register({
            canShowAlert: true, //Can pushes show an alert on your screen?
            canSetBadge: true, //Can pushes update app icon badges?
            canPlaySound: true, //Can notifications play a sound?
            canRunActionsOnWake: true, //Can run actions outside the app,
            onNotification: function(notification) {
              // Handle new push notifications here
              // $log.info(notification);
              console.log(notification);
              return true;
            }
          });

       }

     }

    $scope.changePassword = function() {
      $scope.password = {}

      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
        template: '<form  name="Form">'+
                  '<div class="login-wraper">'+
                  '<input name="password" type="password"  class="login-textfield" ng-model="password.oldPassword" placeholder="Existing Password" style="width:100%"  required> '+
                  '<span class="error" ng-show="Form.password.$error.required && Form.password.$dirty && Form.password.$touched">Required!</span>'+
                  '</div>'+
                  '<div class="login-wraper">'+
                  '<input name="newPassword" type="password"  class="login-textfield" ng-model="password.newPassword" placeholder="New Password" style="width:100%" required ng-minlength="8" ng-maxlength="25">'+
                  '<span class="error" ng-show="Form.newPassword.$error.required && Form.newPassword.$dirty && Form.newPassword.$touched">Required!</span>'+
                  '<span class="error" ng-show="Form.newPassword.$error.minlength && Form.newPassword.$dirty && Form.newPassword.$touched">'+
                  'Password must be contain at least 8 characters.</span>'+
                  ' </div>'+
                  ' <div class="login-wraper">'+
                  '<input name="cPassword" type="password" class="login-textfield" ng-model="password.confirmPassword" placeholder="Confirm  Password" style="width:100%" required ng-minlength="8" ng-maxlength="25">'+
                  '<span class="error" ng-show="Form.cPassword.$error.required && Form.cPassword.$dirty && Form.cPassword.$touched">Required!</span>'+
                  '<span class="error" ng-show="Form.cPassword.$error.minlength && Form.cPassword.$dirty && Form.cPassword.$touched">'+
                  'Password must be contain at least 8 characters.</span><br>'+
                  '<span class="error" ng-show="confirmError">'+
                  'New Password and Confirm Password not match.</span>'+
                   '<span class="error" ng-show="fillall">'+
                  'Please fill in all fields.</span>'+
                  ' </div></form>',
        scope: $scope,
        cssClass: 'custom-popup',
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b >Save</b>',
            type: 'cus-button',
            attr: 'data-ng-disabled="!Form.$valid "',
            onTap: function(e) {
              if ($scope.password.newPassword != $scope.password.confirmPassword) {
                //don't allow the user to close unless he enters wifi password
                $scope.confirmError = true;
                e.preventDefault();
            
              } 
             else if($scope.password.newPassword.length == 0 || $scope.password.newPassword.length==0 )
             {
                $scope.fillall = true;
                e.preventDefault();
             }
              else {
                $scope.confirmError = false;
                return true;
              }
            }
          }
        ]
      });

      myPopup.then(function(res) {
        if(res)
        {
          $ionicLoading.show();
           var userRef = new Firebase("https://9lives.firebaseio.com");
           userRef.changePassword({
              'email' : $scope.user.email,
              'oldPassword': $scope.password.oldPassword,
              'newPassword' : $scope.password.newPassword
           }, function(error){
             console.log(error);
             $ionicLoading.hide();

            if (error) {
                switch (error.code) {
                  case "INVALID_PASSWORD":
                    var alertPopup = $ionicPopup.alert({
                       title : 'Change Password',
                       template: 'Error changing password. The specified user account password is incorrect.'
                    });
                    //alert("Error changing password. The specified user account password is incorrect.");
                    break;
                  default:
                   var alertPopup = $ionicPopup.alert({
                       title : 'Change Password',
                       template: 'Error changing password'
                    });
                }
              }
              else
              {
                var alertPopup = $ionicPopup.alert({
                    title : 'Change Password',
                    template: 'Password changed successfully.'
                });
                //alert("Password changed successfully.")
              }
           })
         }
        console.log('Tapped!', res);
      });

     };
  })

.controller('SearchCtrl', function($scope , $firebaseArray , $ionicLoading , $ionicHistory , $firebaseObject , $state) {
    $scope.search = {};
    $ionicLoading.show();

    var tagsRef = new Firebase("https://9lives.firebaseio.com/tags");

    $scope.tags = $firebaseArray(tagsRef);

  
    $scope.tags.$loaded(function(data){
      $ionicLoading.hide();
    })

    $scope.$watchCollection('search.tag', function(newVal , oldVal){
       if($scope.search.tag !='')
       {
          $scope.search.result =   _.filter($scope.tags ,function(res) {
            return res.$id.indexOf($scope.search.tag)>=0;
          })
        }
    })

    $scope.stringify = function(j)
    {
      return JSON.stringify(j);
    }

    $scope.cancel = function()
    {
      //$ionicHistory.goBack();
      $state.go('lookbook');
    }

    $scope.redirect =function(obj)
    {
      $state.go('search_result' , { 'tag': obj.$id, 'link':obj.Links});
    }

})
.controller('SearchResultCtrl' , function($scope , $stateParams){

       var thumbArr = [];
       var links = $stateParams.link;
       $scope.title = "#"+$stateParams.tag; 

      angular.forEach(links ,  function(data){
        thumbArr.push(data);
      })

      $scope.thumbs = chunk(thumbArr , 2);

      function chunk(arr, size) {

      var newArr = [];
      for (var i=0; i<arr.length; i+=size) {
        var a = arr.slice(i, i+size);
        newArr.push(arr.slice(i, i+size));
      }
      console.log(newArr);
      return newArr;
    }

})
.controller('locationCtrl',  function($scope , $ionicLoading, $firebase, $firebaseArray , $cordovaGeolocation , $http){
      $scope.title = "STUDIOS";
      
    $ionicLoading.show();

    var storesRef = new Firebase("https://9lives.firebaseio.com/stores");

    var stores = $firebaseArray(storesRef);

  
     stores.$loaded(function(data){
      $scope.stores = data;
      $ionicLoading.hide();
    })


 
   
  $scope.getDistance = function(store){

  var posOptions = {timeout: 1000000, enableHighAccuracy: false};
  $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      var lat  = position.coords.latitude
      var long = position.coords.longitude
      console.log(position);
      $scope.CurrentPosition = position;

      var dis =  distance(store.loc.lat, store.loc.lon , $scope.CurrentPosition.coords.latitude , $scope.CurrentPosition.coords.longitude );
      console.log( dis.toFixed(2)+"km");
      return dis.toFixed(2)+"km";

       
      // if(dis < 100)
      // {
      //   return dis.toFixed(2)+"km";
      // }
      // else
      // {
      //   return "";
      // }

    }, function(err) {
      // error
      console.log(err);
      return "";
  });
    
  }

  function distance(lat1, lon1, lat2, lon2, unit) {
      var radlat1 = Math.PI * lat1/180
      var radlat2 = Math.PI * lat2/180
      var radlon1 = Math.PI * lon1/180
      var radlon2 = Math.PI * lon2/180
      var theta = lon1-lon2
      var radtheta = Math.PI * theta/180
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      dist = Math.acos(dist)
      dist = dist * 180/Math.PI
      dist = dist * 60 * 1.1515
      if (unit=="K") { dist = dist * 1.609344 }
      if (unit=="N") { dist = dist * 0.8684 }
      return dist
 }


  
})

.controller('locationDetailCtrl',  function($scope , $ionicLoading, $stateParams){
      $scope.store = $stateParams.store;
      $scope.title = $scope.store.name;
      $scope.map = { center: { latitude:  $scope.store.loc.lat, longitude:  $scope.store.loc.lon }, zoom: 18 };

      $scope.marker = {
      id: 0,
      coords: {
        latitude: $scope.store.loc.lat,
        longitude: $scope.store.loc.lon
      }
    };

  
})


.controller('tncCtrl', function($scope ,$sce , $ionicLoading, $sce){
  $scope.title = "TERMS AND PRIVACY"
  $sce.trustAsHtml()
  $ionicLoading.show();
    var tncRef = new Firebase("https://9lives.firebaseio.com/TNC");

    tncRef.once('value', function(snapshot){
      $ionicLoading.hide();
      $scope.tnc = $sce.trustAsHtml(snapshot.val().value);

       console.log($scope.tnc);
    })

})
.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
