START n=node(*) MATCH (n)-[r]-() DELETE r,n;
START n=node(*) MATCH (n) DELETE n;
CREATE (schema_node:Schema_Node {
					label_name:'Schema_Node',
					description:'Schema Node',
					number:44
					})



CREATE (schema_property:Schema_Node {
					label_name:'Schema_Property',
					description:'Schema Property',
					number:22
					})


CREATE (s_label_name:Schema_Property{
					property_name:'label_name',
					display_name:'Label Name',
					is_edittable:true,
					mandatory_field:true,
					has_multiple_values:false,
					select_options:[],
					priority:1,
					data_type:'text',
					default_value:"null"
					})

CREATE (s_description:Schema_Property{
					property_name:'description',
					display_name:'Node Description',
					is_edittable:true,
					mandatory_field:true,
					has_multiple_values:false,
					select_options:[],
					priority:2,
					data_type:'text',
					default_value:"null"
					})
CREATE (s_number:Schema_Property{
					property_name:'number',
					display_name:'Number',
					is_edittable:true,
					mandatory_field:true,
					has_multiple_values:false,
					select_options:[],
					priority:2,
					data_type:'number',
					default_value:44
					})

CREATE (p_property_name:Schema_Property{
					property_name:'property_name',
					display_name:'Property Name',
					is_edittable:true,
					mandatory_field:true,
					has_multiple_values:false,
					select_options:[],
					priority:1,
					data_type:'text',
					default_value:'null'
					})

CREATE (p_display_name:Schema_Property{
					property_name:'display_name',
					display_name:'Display Name',
					is_edittable:true,
					mandatory_field:true,
					has_multiple_values:false,
					select_options:[],
					priority:2,
					data_type:'text',
					default_value:'null'
					})

CREATE (p_is_edittable:Schema_Property{
					property_name:'is_edittable',
					display_name:'Edittable?',
					is_edittable:true,
					mandatory_field:true,
					has_multiple_values:false,
					select_options:[],
					priority:3,
					data_type:'boolean',
					default_value:true
					})

CREATE (p_mandatory_field:Schema_Property{
					property_name:'mandatory_field',
					display_name:'Mandatory Field?',
					is_edittable:true,
					mandatory_field:true,
					has_multiple_values:false,
					select_options:[],
					priority:4,
					data_type:'boolean',
					default_value:false
					})

CREATE (p_has_multiple_values:Schema_Property{
					property_name:'has_multiple_values',
					display_name:'Multiple Values?',
					is_edittable:true,
					mandatory_field:true,
					has_multiple_values:false,
					select_options:[],
					priority:5,
					data_type:'boolean',
					default_value:false
					})

CREATE (p_select_options:Schema_Property{
					property_name:'select_options',
					display_name:'Select Options',
					is_edittable:true,
					mandatory_field:false,
					has_multiple_values:true,
					select_options:[],
					priority:6,
					data_type:'text',
					default_value:['null']
					})

CREATE (p_priority:Schema_Property{
					property_name:'priority',
					display_name:'Priority',
					is_edittable:true,
					mandatory_field:true,
					has_multiple_values:false,
					select_options:[],
					priority:7,
					data_type:'number',
					default_value:9999
					})

CREATE (p_data_type:Schema_Property{
					property_name:'data_type',
					display_name:'Data Type',
					is_edittable:true,
					mandatory_field:true,
					has_multiple_values:true,
					select_options:['text','textarea','number','date','boolean','text-array'],
					priority:8,
					data_type:'text',
					default_value:'"text"'
					})

CREATE (p_default_value:Schema_Property{
					property_name:'default_value',
					display_name:'Default Value',
					is_edittable:true,
					mandatory_field:false,
					has_multiple_values:false,
					select_options:[],
					priority:9,
					data_type:'text',
					default_value:'null'
					})

CREATE (p_property_name)<-[:approved_property]-(schema_property),
	(p_display_name)<-[:approved_property]-(schema_property),
	(p_is_edittable)<-[:approved_property]-(schema_property),
	(p_mandatory_field)<-[:approved_property]-(schema_property),
	(p_has_multiple_values)<-[:approved_property]-(schema_property),
	(p_select_options)<-[:approved_property]-(schema_property),
	(p_priority)<-[:approved_property]-(schema_property),
	(p_data_type)<-[:approved_property]-(schema_property),
	(p_default_value)<-[:approved_property]-(schema_property),
	(s_label_name)<-[:approved_property]-(schema_node),
	(s_description)<-[:approved_property]-(schema_node),
	(s_number)<-[:approved_property]-(schema_node);
