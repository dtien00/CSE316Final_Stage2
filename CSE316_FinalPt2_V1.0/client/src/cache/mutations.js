import { gql } from "@apollo/client";

export const LOGIN = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			email 
			_id
			name
			password
		}
	}
`;

export const REGISTER = gql`
	mutation Register($email: String!, $name: String!, $password: String!) {
		register(email: $email, name: $name, password: $password) {
			_id
			email
			name
			password
		}
	}
`;
export const LOGOUT = gql`
	mutation Logout {
		logout 
	}
`;

export const ADD_REGION = gql`
	mutation AddRegion($region: RegionInput!, $_id: String!, $index: Int!) {
		addRegion(region: $region, _id: $_id, index: $index)
	}
`;

export const DELETE_REGION = gql`
	mutation DeleteRegion($regionId: String!, $_id: String!) {
		deleteRegion(regionId: $regionId, _id: $_id) {
			_id
			id
			name
			capital
			leader
			flag
			landmarks
		}
	}
`;

export const UPDATE_REGION_FIELD = gql`
	mutation UpdateRegionField($_id: String!, $regionId: String!, $field: String!, $value: String!, $flag: Int!) {
		updateRegionField(_id: $_id, regionId: $regionId, field: $field, value: $value, flag: $flag) {
			_id
			id
			name
			capital
			leader
			flag
			landmarks
		}
	}
`;

export const REORDER_REGIONS = gql`
	mutation ReorderRegions($_id: String!, $regionId: String!, $direction: Int!) {
		reorderRegions(_id: $_id, regionId: $regionId, direction: $direction) {
			_id
			id
			name
			capital
			leader
			flag
			landmarks
		}
	}
`;

export const ADD_MAP = gql`
	mutation AddMap($map: MapInput!) {
		addMap(map: $map) 
	}
`;

export const ADD_LANDMARK= gql`
	mutation AddLandmark($map_id: String!, $region_id: String!, $landmark: String!){
		addLandmark(map_id: $map_id, region_id: $region_id, landmark: $landmark)
	}
`

export const DELETE_MAP = gql`
	mutation DeleteMap($_id: String!) {
		deleteMap(_id: $_id)
	}
`;

export const UPDATE_MAP_FIELD = gql`
	mutation UpdateMapField($_id: String!, $field: String!, $value: String!) {
		updateMapField(_id: $_id, field: $field, value: $value)
	}
`;

// export const SET_LIST_TO_TOP = gql`
// 	mutation setListToTop($_id: String!) {
// 		setListToTop(_id: $_id)
// 	}
// `;

export const SORT_REGIONS = gql`
	mutation SortRegions($_id: String!, $field: String!){
		sortRegions(_id: $_id, field: $field) {
			_id
			id
			name
			capital
			leader
			flag
			landmarks
		}
	}
`;

export const UPDATE_COLLECTION = gql`
	mutation UpdateCollection($newMap: [RegionInput], $_id: String!) {
		updateCollection(newMap: $newMap, _id: $_id)
	}
`;

export const REVERT_COLLECTION = gql`
	mutation RevertCollection($oldList: [RegionInput], $listID: String!) {
		revertCollection(oldList: $oldList, listID: $listID)
	}
`;

export const UPDATE_USER = gql`
	mutation UpdateUser($name: String!, $email: String!, $password: String!, $currentEmail: String!){
		updateUser(name: $name, email: $email, password: $password, currentEmail: $currentEmail){
			email 
			_id
			name
			password
		}
	}
`;