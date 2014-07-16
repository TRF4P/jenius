angular.module('jeniusApp')
    .directive('jeniusList', function(CommonServices) {
        return {
            templateUrl: '/scripts/directives/jeniusList/jeniusList.html',
            //restrict: 'A',
            scope: {
                jeniusList: "=",
            },
            link: function(scope, element, attr) {
                scope.queryDb = function() {
                    CommonServices.getJeniusList(scope.jeniusList)
                        .success(function(data) {
                            console.log(data);
                            scope.jeniusList.nodeList = data.results;
                        });
                };

                scope.$watch('jeniusList.nodeLabel', function(newValue, oldValue) {
                    console.log(newValue);
                    if (newValue !== null && typeof newValue !== 'undefined') {
                        scope.queryDbNoLocal();
                    };
                });
                scope.refreshList = function() {
                    scope.jeniusList.selectedNode = null;
                    scope.queryDbNoLocal();
                };

                scope.queryDbNoLocal = function() {
                    if (('localList' in scope.jeniusList) && scope.jeniusList.localList === true) {

                    } else {
                        scope.queryDb();
                    }
                };
            }
        };
    })