const { gql } = require('apollo-server');


const typeDefs = gql `
	type Map {
		_id: String!
		id: Int!
		name: String!
		owner: String!
		regions: [Region]
	}
	type Region {
		_id: String!
		id: Int!
		name: String!
		capital: String!
		leader: String!
		flag: String!
		parent: String!
		landmarks: [String]
	}
	extend type Query {
		getAllMaps: [Map]
		getMapById(_id: String!): Map 
	}
	extend type Mutation {
		addRegion(region: RegionInput!, _id: String!, index: Int!): String
		addMap(map: MapInput!): String
		deleteRegion(regionId: String!, _id: String!): [Region]		
		deleteMap(_id: String!): Boolean
		deleteLandmark(map_id: String!, region_id: String!, landmark: Int!): String
		updateMapField(_id: String!, field: String!, value: String!): String
		updateRegionField(regionId: String!, _id: String!, field: String!, value: String!, flag: Int!): [Region]
		reorderRegions(regionId: String!, _id: String!, direction: Int!): [Region]
		sortRegions(_id: String!, field: String!): [Region]
		updateCollection(newMap: MapInput!, _id: String!): Boolean
		revertCollection(oldList: [RegionInput], listID: String!): Boolean
		addLandmark(map_id: String!, region_id: String!, landmark: String!): String
	}
	input FieldInput {
		_id: String
		field: String
		value: String
	}
	input MapInput {
		_id: String
		id: Int
		name: String
		owner: String
		regions: [RegionInput]
	}
	input RegionInput {
		_id: String
		id: Int
		name: String
		capital: String
		leader: String
		flag: String
		parent: String
		landmarks: [String]
	}
`;

module.exports = { typeDefs: typeDefs }