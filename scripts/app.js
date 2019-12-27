var app = angular.module("app", ["ngRoute"]);

// MENU
app.controller("menuCtrl", function($scope, $location){

    $scope.shownPageId;

    /*
     | Change the selected menu opeion
     | Uses the route path to select the correct option
    */
    $scope.$on('$routeChangeSuccess', function () {
        let path = $location.path();
        switch(path){
            case '/':
                $scope.shownPageId = 0;
                break;
            case '/create':
                $scope.shownPageId = 1;
                break;
            case '/about':
                $scope.shownPageId = 2;
                break;
            case '/faq':
                $scope.shownPageId = 3;
                break;
            default:
                $scope.shownPageId = 0;
                break;
        }
      });

    // Nav bar navigation options
    $scope.showNews = function(){
        $location.path('/');
    }
    $scope.showCreate = function(){
        $location.path('/create');
    }
    $scope.showAbout = function(){
        $location.path('/about');
    }
    $scope.showFAQ = function(){
        $location.path('/faq');
    }
});

app.controller("currentCtrl", [ '$scope', '$http', function($scope, $http)
{
    /*
     | GET request to pull data out of the MySQL DB
    */
    $http.get('http://127.0.0.1:3000/news/get')
    .then( function success(response){
        let rawData = angular.fromJson(response.data);
        for (let x = 1; x <= rawData.length; x++){
            $scope.posts = rawData;
        }
    },
    function error(response){
        // Catch an erorr and display it
        alert(response);
    });
}]);

app.controller("createCtrl", [ '$scope', '$http', function($scope, $http)
{
    // Get the Date and Time
    $scope.date = returnDate();
    $scope.time = returnTime();

    /*
     | POST request to inster new post into MySQL DB
    */
    $scope.submit = function(){
        var title = $scope.in.title;
        var author = $scope.in.author;
        var content = $scope.in.content;
        var tags = $scope.in.tags;
        var date = returnDate();
        date += " " + returnTime();

        let news = angular.toJson({
            "title" : title, "content" : content, "author" : author, "tags" : tags, "date" : date
        });

        $http.post('http://127.0.0.1:3000/news/create', news)
        .then(function success(response){
            alert('Saved post!');
            // Reload the page
            location.reload();
        }),
        function error(response){
            // Display errors
            alert('Looks like we have an issue');
            alert(response);
        };
    }
}]);


app.config(function($routeProvider)
{
    /*
     | Route configurations
    */
    $routeProvider
    .when("/", {
        templateUrl: "/views/currentnews.html"
    })
    .when("/create", {
        templateUrl: "/views/createnews.html"
    })
    .when("/about", {
        templateUrl: "/views/about.html"
    })
    .when("/faq", {
        templateUrl: "/views/faq.html"
    })
    .otherwise({
        template: "<p class='text-heading'>404</p>" +
                  "<p class='text-body text-hint'>That page doesn't exist</p>"
    });
});


/* === GENERIC FUNCTIONS === */

// Functions to return the Time and Date
function returnTime(){
    let d = new Date();
    // Get the time settings
    let min = d.getMinutes();
    let hour = d.getHours();
    let time = hour + ":" + min;
    return time;
}

function returnDate(){
    let d = new Date();
    // Get the date settings
    let day = d.getDate();
    let month = d.getMonth();
    let year = d.getFullYear();
    let date = day + "/" + month + "/" + year;
    return date;
}