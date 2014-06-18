exports.neo4j = require('neo4j');
exports.db = new exports.neo4j.GraphDatabase('http://localhost:7474');