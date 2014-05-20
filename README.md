jenius
======

Jenius is am ambitious project with the goal of enabling the rapid prototyping and
data curation of small to medium sized datasets. More to come.


## Project Goals
The intent of Jenius is to minimize the amount of time it takes to create highly related data models, along with a lightweight (and customizeable as possible) interface. Along with data entry/curation, jenius will also provide a myrid of data visualization tools, which can be dynamically generated based off jenius's understanding of the existing data model. 

The real beauty of jenius is its distributed design. By separating the rules of how data should be manipulated from the data itself, 
Jenius is designed around the following core components:

1. Schema Nodes
2. Schema Properties
3. Schema Relationships
4. Schema Forms
5. Schema Reports

### Schema Nodes
Schema Nodes are the core components within jenius, and define all other models within the database. Schema Nodes are used to define "Node Types" within the database, in fact, schema nodes themselves are introspective, in that the first schema node that exists is "Schema_Node". 

### Schema Properties
Schema Properties are linked to Schema Nodes and define the properties that each schema node will have. These nodes will define ALL properties that any individual node can have. This is where you can define datatypes, rules for input, mandatory fields, edittable fields, order priority, etc. 

### Schema Relationships
Schema Relationships are nodes which define what relationships exist between all schema nodes. This allows you to create define how relationships between two nodes operate

### Schema Forms
Schema Forms are designed to orchestrate how data should be inputted. Schema Forms point to indididual properties/relationships within the graph, and define the rules for how the data should look, and how it should be inputted. This allows you to dynamically generate forms based off the data 

### Schema Reports
Schema Reports operate by linking what relationships/properties to report on, and generating 

# Future Goals
* Data Curation Monitor (reviews for bad data, etc)
* Freestyle data visualization explorer (based on the rules/data types/relationships that exist within the database)
