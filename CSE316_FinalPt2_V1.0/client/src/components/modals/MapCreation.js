import React, { useState } 	from 'react';
import { ADD_MAP, UPDATE_USER }			from '../../cache/mutations';
import { useMutation, useQuery } 	from '@apollo/client';
import * as queries 	from '../../cache/queries';
import * as mutations 	from '../../cache/mutations';

import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WRow, WCol } from 'wt-frontend';
import {Link} from 'react-router-dom';

const MapCreation = (props) => {
	const [input, setInput] = useState({name: ''});
	// const [loading, toggleLoading] = useState(false);
	const [activeMap, setActiveMap] 		= useState({});
    const { loading, error, data, refetch } = useQuery(queries.GET_DB_MAPS);
	const [AddMap] = useMutation(ADD_MAP);
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
			}
		}
	}

	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
        console.log(updated);
	};

    const handleSetActive = (id) => {
		const map = maps.find(map => map.id === id || map._id === id);
		console.log(maps);

		const headMap = map;
		const baseMap = maps.filter(map => map.id!=(maps[0]==null? undefined: maps[0].id));
		baseMap.unshift(headMap);
		setActiveMap(map);
	};

	const createMap = async (e) => {
		const length = maps.length
		const id = length >= 1 ? maps[length - 1].id + Math.floor((Math.random() * 100) + 1) : 1;
		console.log("Current user: " + props.user.name + " ID: " + props.user._id);
		let map = {
			_id: '',
			id: id,
			name: input.name,
			owner: props.user._id,
			regions: [],
		}
		const { data } = await AddMap({ variables: { map: map }, refetchQueries: [{ query: queries.GET_DB_MAPS }] });
		console.log("Map added:");
		await refetchMaps(refetch);
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
									barAnimation="solid" labelText="Map Name" wType="outlined" inputType="text" 
								/>
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
					<WButton className="modal-button" onClick={createMap} span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
						Create
					</WButton>
				</Link>
			</WCol>
			</WRow>
			
		</div>
	);
}

export default MapCreation;
