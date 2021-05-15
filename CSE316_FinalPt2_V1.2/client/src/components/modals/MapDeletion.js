import React, { useState } 	from 'react';
import { ADD_MAP, UPDATE_USER }			from '../../cache/mutations';
import { useMutation, useQuery } 	from '@apollo/client';
import * as queries 	from '../../cache/queries';
import * as mutations 	from '../../cache/mutations';

import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WRow, WCol } from 'wt-frontend';
import {Link} from 'react-router-dom';

const MapDeletion = (props) => {
    let maps = [];
	const [activeMap, setActiveMap] 		= useState({});
    const { loading, error, data, refetch } = useQuery(queries.GET_DB_MAPS);
	const [DeleteMap]						= useMutation(mutations.DELETE_MAP);

	const refetchMaps = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
			maps = data.getAllMaps;
			if (props.activeMap._id) {
				let tempID = props.activeMap._id;
				let map = maps.find(map => map._id === tempID);
				setActiveMap(map);
			}
		}
	}
	const deleteMap = (item, index) => { 
		console.log("DELETING: " + props.activeMap._id);
		DeleteMap({ variables: { _id: props.activeMap._id }, refetchQueries: [{ query: queries.GET_DB_MAPS }] });
		refetch();
		setActiveMap({});
	};

	return (
        // Replace div with WModal

		<div className="delete-map-modal" wind>
			<div className="modal-header" onClose={() => props.setShowUpdate(false)}>
				{"Delete map " + props.activeMap.name + "? This cannot be undone"}
			</div>

			<div className="modal-spacer">&nbsp;</div>

			<WRow className="modal-col-gap">
			<WCol size="6">
				<Link to='/'>
					<WButton className="cancel-button modal-button " onClick={null} span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
						Cancel
					</WButton>
				</Link>
			</WCol>
			<WCol size="6">
				<Link to='/'>
					<WButton className="delete-confirm modal-button " onClick={deleteMap} span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
						Delete
					</WButton>
				</Link>
			</WCol>
			</WRow>
			
		</div>
	);
}

export default MapDeletion;
