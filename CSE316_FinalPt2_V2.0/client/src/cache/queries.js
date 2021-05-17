import { gql } from "@apollo/client";

export const GET_DB_USER = gql`
	query GetDBUser {
		getCurrentUser {
			_id
			name
			email
			password
		}
	}
`;

export const GET_DB_MAPS = gql`
	query GetDBMaps {
		getAllMaps {
			_id
			id
			name
			owner
			regions {
				_id
				id
				name
				capital
				leader
				flag
				landmarks
			}
		}
	}
`;

export const GET_DB_MAP_BY_ID = gql`
	query GetMapById {
		getMapById {
			_id
			id
			name
			owner
			regions {
				_id
				id
				name
				capital
				leader
				flag
				landmarks
			}
		}
	}
`;

