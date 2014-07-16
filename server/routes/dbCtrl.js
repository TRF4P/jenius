exports.neo4j = require('neo4j');
exports.db = new exports.neo4j.GraphDatabase('http://localhost:7474');
exports.rootId = 25130;
exports.adminUser = 25098;
exports.currentUser = 25098;
exports.noUser = 25101;



//Create a query to hold all the properties of a node

//Create a