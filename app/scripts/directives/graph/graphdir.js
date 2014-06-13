'use strict';

angular.module('jeniusApp')
    .directive('graphDir', function(CommonServices) {
        return {
            templateUrl: '/scripts/directives/graph/graphdir.html',
            //restrict: 'A',
            scope: {
                graphdata: "=graphdata"
            },
            link: function(scope, element, attr) {

                scope.graphdata = {
                    nodes: [{
                            data: {
                                id: 'j',
                                name: 'Jerry',
                                weight: 65,
                                height: 174
                            }
                        },

                        {
                            data: {
                                id: 'e',
                                name: 'Elaine',
                                weight: 48,
                                height: 160
                            }
                        },

                        {
                            data: {
                                id: 'k',
                                name: 'Kramer',
                                weight: 75,
                                height: 185
                            }
                        },

                        {
                            data: {
                                id: 'g',
                                name: 'George',
                                weight: 70,
                                height: 150
                            }
                        }
                    ],

                    edges: [{
                            data: {
                                source: 'j',
                                target: 'e'
                            }
                        }, {
                            data: {
                                source: 'j',
                                target: 'k'
                            }
                        }, {
                            data: {
                                source: 'j',
                                target: 'g'
                            }
                        },

                        {
                            data: {
                                source: 'e',
                                target: 'j'
                            }
                        }, {
                            data: {
                                source: 'e',
                                target: 'k'
                            }
                        },

                        {
                            data: {
                                source: 'k',
                                target: 'j'
                            }
                        }, {
                            data: {
                                source: 'k',
                                target: 'e'
                            }
                        }, {
                            data: {
                                source: 'k',
                                target: 'g'
                            }
                        },

                        {
                            data: {
                                source: 'g',
                                target: 'j'
                            }
                        }
                    ],
                };
                /**
                 *
                 * Graph View Variables
                 *
                 **/
                scope.containerWidth = "500px";
                scope.containerHeight = "500px";
                scope.nodeWidth = 15;
                scope.nodeHeight = 10;
                scope.nodeBackgroundColor = "white";
                scope.nodeBorderColor = "black";
                scope.nodeTextBackgroundColor = "white";
                scope.nodeTextBorderColor = "black";
                scope.edgeLineColor = "black";
                scope.edgeTextColor = "black";
                scope.edgeTextSize = 10;

                scope.setContainerSize = function() {
                    $('#cy').cytoscape(options);
                };
                var options = {
                    showOverlay: false,
                    minZoom: 0.5,
                    maxZoom: 2,

                    style: cytoscape.stylesheet()
                        .selector('node')
                        .css({
                            'content': 'data(name)',
                            'font-family': 'helvetica',
                            'font-size': 14,
                            'text-outline-width': 3,
                            'text-outline-color': '#888',
                            'text-valign': 'center',
                            'color': '#fff',
                            'width': 'mapData(weight, 30, 80, 20, 50)',
                            'height': 'mapData(height, 0, 200, 10, 45)',
                            'border-color': '#fff'
                        })
                        .selector(':selected')
                        .css({
                            'background-color': '#000',
                            'line-color': '#000',
                            'target-arrow-color': '#000',
                            'text-outline-color': '#000'
                        })
                        .selector('edge')
                        .css({
                            'width': 2,
                            'target-arrow-shape': 'triangle'
                        }),

                    elements: scope.graphdata,
                    ready: function() {
                        //  var cy = this;
                        var bobby = "hi";
                    }

                };

                $('#cy').cytoscape(options);




                //attr.submitSchemaNode();
                //  element.text('this is the commonDir directive ');
            }
        };
    })