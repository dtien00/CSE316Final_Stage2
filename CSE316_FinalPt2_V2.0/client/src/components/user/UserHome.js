import React, { useState, useEffect } 	from 'react';
import MapList							from './MapList';
import DeleteMap		from '../modals/MapDeletion';
import Globe							from '../../transparent_globe_altered.png'
import MapCreation		from '../modals/MapCreation';
import { useMutation, useQuery } 	from '@apollo/client';
import * as queries 	from '../../cache/queries';
import * as mutations 	from '../../cache/mutations';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import {Link} from 'react-router-dom';
import { WNavbar, WSidebar } 	from 'wt-frontend';
import { WButton, WRow, WCol } from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';

const UserHome = (props) => {
	let maps = [];
	const [activeMap, setActiveMap] 		= useState({});
    const { loading, error, data, refetch } = useQuery(queries.GET_DB_MAPS);
	const [AddMap] 							= useMutation(mutations.ADD_MAP);
	const [DeleteMap]						= useMutation(mutations.DELETE_MAP);
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { maps = data.getAllMaps; }
    
					// <img className="welcome-icon" src={Globe} alt="welcome image"/>
					
	const refetchMaps = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
			maps = data.getAllMaps;
			if (activeMap._id) {
				let tempID = activeMap._id;
				let map = maps.find(map => map._id === tempID);
				setActiveMap(map);
			}
		}
	}
					// Creates a default item and passes it to the backend resolver.
	// The return id is assigned to the item, and the item is appended
	//  to the local cache copy of the active todolist. 
	const createNewMap = async () => {
		const length = maps.length
		const id = length >= 1 ? maps[length - 1].id + Math.floor((Math.random() * 100) + 1) : 1;
		console.log("Current user: " + props.user.name + " ID: " + props.user._id);
		let map = {
			_id: '',
			id: id,
			name: 'NewMap',
			owner: props.user._id,
			regions: [],
		}
		const { data } = await AddMap({ variables: { map: map }, refetchQueries: [{ query: queries.GET_DB_MAPS }] });
		console.log("Map added");
		await refetchMaps(refetch);
		if(data) {
			let _id = data.addMap;
			handleSetActive(_id);
		} 
	};

	const handleSetActive = (id) => {
		//Renders the boolean value for the all lists to be false
		// todolists.map((list) => (list.isTopList=false));

		// todolists.map((list) => (console.log(list.isTopList)));
		//Finds the new todolist to be the top one
		const map = maps.find(map => map.id === id || map._id === id);
		console.log(maps);
		console.log("ddd");
		console.log(map);
		// console.log("ACTIVE ID " + map.id);

		const headMap = map;
		const baseMap = maps.filter(map => map.id!=(maps[0]==null? undefined: maps[0].id));

		// console.log("ACTIVE Map: " + headMap);
		// console.log("BASE Map : " + baseMap);
		baseMap.unshift(headMap);
		// console.log("NEW LIST: " + baseMap);
		// let index = 0;
		// for(let i =0; i<todolists.length; i++){
		// 	if(todolists[i].id===id||todo._id===id)
		// 		index = i;
		// }
		setActiveMap(map);
	};

	const deleteMap = (item, index) => { 
		console.log("DELETING: " + item._id);
		DeleteMap({ variables: { _id: item._id }, refetchQueries: [{ query: queries.GET_DB_MAPS }] });
		refetch();
		setActiveMap({});
	};

	return (
        <> 
		<div>
			<label className="map-header-section">     Maps     </label>
			<MapList deleteMap={deleteMap} maps={maps} user={props.user} setActiveMap={props.setActiveMap}/>

			<Link to="/newMap">
				<button className="add-map-button" onClick={null} span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
					Add Map
				</button>
			</Link>
		</div>
			<img className="user-home-icon" src={Globe} alt="welcome image"/>
			<Router>
				<Switch>
				<Route
							path="/newMap"
							render={()=><MapCreation user={props.user} />}
					/>
				</Switch>
			</Router>
		</>
	);
}

export default UserHome;
