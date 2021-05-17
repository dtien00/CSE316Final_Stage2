import React, { useState, useEffect } 	from 'react';
import Homescreen 		from './components/homescreen/Homescreen';
import { useMutation, useQuery } 	from '@apollo/client';
import * as queries 	from './cache/queries';
import * as mutations 	from './cache/mutations';
import { jsTPS } 		from './utils/jsTPS';
import Update			from './components/modals/Update';
import Login			from './components/modals/Login';
import CreateAccount	from './components/modals/CreateAccount';
import MapCreation		from './components/modals/MapCreation';
import UserHome 		from './components/user/UserHome';
import MapDeletion		from './components/modals/MapDeletion';
import MapUpdate		from './components/modals/MapUpdate';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { WNavbar, WSidebar } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import NavbarOptions from './components/navbar/NavbarOptions';
import RegionSpreadSheet from './components/region/RegionSpreadSheet';
import RegionViewer from './components/landmarks/RegionViewer'; 


const App = () => {
	let user = null;
    let transactionStack = new jsTPS();
	const [activeMap, setActiveMap] 		= useState({});
	const [activeRegion, setActiveRegion]	= useState({});
	const [regions, setRegions]				= useState([]);
    const { loading, error, data, refetch } = useQuery(queries.GET_DB_USER);
    const[AddRegion]    =useMutation(mutations.ADD_REGION);
	const[AddLandmark]	=useMutation(mutations.ADD_LANDMARK);
	
    if(error) { console.log(error); }
	if(loading) { console.log(loading); }
	if(data) { 
		let { getCurrentUser } = data;
		if(getCurrentUser !== null) { user = getCurrentUser; }
    }
	const auth = user === null ? false : true;
	
	// exact component={user===null ? Homescreen:UserHome}

	const handleSetActiveMap = (data) => {
		// console.log("Changing active map");
		setActiveMap(data);
		// console.log(activeMap);
	}

	const addNewSubregion = async (mapID, region, opcode) => {
        let {data} = AddRegion({variables: {_id: mapID, region: region, index: opcode}});
        // reload();
		// console.log("APP.JS CALL: ");
		console.log(activeMap);
		
	}

	const setNewActiveRegion = async (data) => {
		// console.log("Changing active region");
		await setActiveRegion(data);
		// console.log(activeRegion);
		return true;
	}

	const setNewActiveParent = (data) => {
		// console.log("Changing active parent");
		setActiveRegion(data);
		// console.log(activeRegion);
		return true;
	}

	const changeActiveMap = (map) => {
		setActiveMap(map);
		// console.log("Active map:")
		// console.log(map);
		return true;
	}

	const mapName = activeMap._id;
	const regionName = activeRegion ? activeRegion._id : null ;

	// console.log("ACTIVE MAP NAME: " + mapName);
	// console.log("ACTIVE REGION NAME: " + regionName);

	const addLandmark = async (name) => {
		// console.log("Active region:");
		// console.log(activeRegion);
		// activeRegion.landmarks.push(name);
		// console.log("Region ID: " + activeRegion._id);
		// console.log(typeof(activeRegion));
		let {data} = await AddLandmark({variables:{map_id: activeMap._id, region_id: activeRegion._id, landmark: name}});
		// console.log("After region:");
		// console.log(activeRegion);
		return true;
	}

	return(
		<Router>
        	<WLayout wLayout="header-lside">
				<NavbarOptions auth={auth} user={user} fetchUser={refetch}/>
					<Switch>
						<Route 
							path="/" exact render={()=>user===null ? <Homescreen/>:<UserHome user={user} setActiveMap={handleSetActiveMap}/>}
						/>
						<Route
							path="/register"
							render={()=><CreateAccount fetchUser={refetch} />}
						/>
						<Route
							path="/update"
							render={()=><Update fetchUser={refetch}/>}
						/>
						<Route
							path="/login"
							render={()=><Login fetchUser={refetch} />}
						/>
						<Route
							path="/newMap"
							render={()=><MapCreation user={user} />}
						/>
						<Route
							path="/updateMap"
							render={()=><MapUpdate user={user} activeMap={activeMap}/>}
						/>
						<Route
							path={"/spreadsheet/" + mapName}
							render={()=><RegionSpreadSheet user={user} activeMap={activeMap} activeRegions={activeRegion}
							handleSetActive={setNewActiveRegion} addSubregion={addNewSubregion} 
							handleActiveMapChange={changeActiveMap} handleActiveParent={setNewActiveParent}
							transactionHandler={transactionStack}
							/>}
						/>
						<Route
							path={"/"+regionName+"/landmarks"}
							render={()=><RegionViewer user={user} activeMap={activeMap} activeRegion={activeRegion} 
							addLandmark={addLandmark} 
							handleActiveMapChange={changeActiveMap} setActiveRegion={setNewActiveRegion} addSubregion={addNewSubregion}
							transactionHandler={transactionStack}
							/>}
						/>
						
						<Route
									path="/mapDeletion"
									render={()=><MapDeletion user={user} activeMap={activeMap} activeRegion={activeRegion} />}
							/>

						<Route>
							
						</Route>
					</Switch>
			</WLayout>
		</Router>
	);
}

export default App;