import React, { useState } 	from 'react';
import { ADD_MAP, UPDATE_USER }			from '../../cache/mutations';
import { useMutation, useQuery } 	from '@apollo/client';
import * as queries 	from '../../cache/queries';
import * as mutations 	from '../../cache/mutations';

import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WRow, WCol } from 'wt-frontend';
import {Link} from 'react-router-dom';

const MapUpdate = (props) => {
	const [input, setInput] = useState({name: ''});
	// const [loading, toggleLoading] = useState(false);
	const [activeMap, setActiveMap] 		= useState({});
    const { loading, error, data, refetch } = useQuery(queries.GET_DB_MAPS);
	const [UpdateMapName] = useMutation(mutations.UPDATE_MAP_FIELD);
    let maps = [];

	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { maps = data.getAllMaps; }

	const refetchMaps = async (refetch) => {
		if (data) {
			maps = data.getAllMaps;
			if (activeMap._id) {
				let tempID = activeMap._id;
				let map = maps.find(map => map._id === tempID);
				setActiveMap(map);
                console.log("Active Map: " + map);
			}
		}
	}

	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
        console.log(updated);
        console.log("ACTIVE MAP: ");
        console.log(props.activeMap);
	};

    const handleSetActive = (id) => {
		const map = maps.find(map => map.id === id || map._id === id);
		console.log(maps);
		console.log("ddd");
		console.log(map);

		const headMap = map;
		const baseMap = maps.filter(map => map.id!=(maps[0]==null? undefined: maps[0].id));
		baseMap.unshift(headMap);
		setActiveMap(map);
	};

	const updateMap =  (e) => {
		console.log("Current user: " + props.user.name + " ID: " + props.user._id);
        console.log("Active Map: " + props.activeMap + " ACTIVEMAP_ID: " + props.activeMap._id);
		const { data } =  UpdateMapName({ variables: { _id: props.activeMap._id, field: "name", value: input.name }, refetchQueries: [{ query: queries.GET_DB_MAPS }] });
		console.log("Map updated:");
        console.log(data);
		 refetchMaps(refetch);
		if(data) {
			let _id = data.addMap;
			handleSetActive(_id);
		} 
	};

	return (
        // Replace div with WModal

		<div className="signup-modal" wind>
			<div className="modal-header" onClose={() => props.setShowUpdate(false)}>
				
			</div>

			<div className="modal-spacer">&nbsp;</div>
			{
				loading ? <div />
					: <div>
								<WInput 
									className="modal-input" onBlur={updateInput} name="name" labelAnimation="up" 
                                    
									barAnimation="solid" labelText="New Map Name" wType="outlined" inputType="text" 
								>
                                </WInput>
                                
                                    {"Current name: " + props.activeMap.name}
					</div>
			}
			<div className="modal-spacer">&nbsp;</div>
			<WRow className="modal-col-gap">
			<WCol size="6">
				<Link to='/'>
					<WButton className="modal-button" onClick={null} span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
						Cancel
					</WButton>
				</Link>
			</WCol>
			<WCol size="6">
				<Link to='/'>
					<WButton className="modal-button" onClick={updateMap} span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
						Update
					</WButton>
				</Link>
			</WCol>
			</WRow>
			
		</div>
	);
}

export default MapUpdate;
