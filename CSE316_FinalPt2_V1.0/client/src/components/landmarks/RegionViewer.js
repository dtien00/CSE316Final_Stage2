import { WNavbar, WSidebar } 	from 'wt-frontend';
import { WButton, WRow, WCol } from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import SubregionEntry from '../region/SubregionEntry';
import RegionHeader from '../region/RegionHeader';
import * as mutations from '../../cache/mutations';
import LandmarkList from './LandmarkList';
import * as queries from '../../cache/queries';
import { useMutation, useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import { WModal, WMHeader, WMMain, WMFooter, WInput } from 'wt-frontend';
import { Link } from 'react-router-dom';

import Globe					from '../../transparent_globe_altered.png';

const RegionViewer = (props) => {
    const [input, setInput] = useState({ name: '' });
    const{loading, error, data, refetch}   =useQuery(queries.GET_DB_MAPS)

	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
		console.log(updated);
	};

    const addLandmark = async () => {
        console.log("Adding landmark");
        console.log("Region: " + props.activeRegion.name);
        console.log("Region Parent: " + props.activeRegion.parent);
        console.log("Active Map: " + props.activeMap.name);
        console.log(input);
        if (input.name==='') setInput({...input, name: "[Placeholder]"});
        let landmarks = props.activeRegion.landmarks;
        console.log(landmarks);
        console.log("Input's name: " + input.name);
        const succeed = await props.addLandmark(input.name);
        // landmarks.length==0 ? landmarks[0]=input.name : landmarks.push(input.name);
        console.log("After: " + props.activeRegion.landmarks);
    }

    const deleteLandmark = () => {}

    const landmarks = props.activeRegion.landmarks;

	return (
        <>
        <Link to={"/"+props.activeMap.name}>
        <button onClick={null} className={'material-icons return-to-spreadsheet-button'} >skip_previous
                        </button>
        </Link>
        
        <button onClick={null} className={'material-icons region-viewer-undo'} >undo
            </button>
        <button onClick={null} className={'material-icons region-viewer-redo'} >redo
            </button>

        <label className="region-viewer-name region-property">{"Region name: " + props.activeRegion.name}</label>
        <label className="region-viewer-parent region-property">Parent Region: To be implemented</label>
        <label className="region-viewer-capital region-property">{"Region capital: " + props.activeRegion.capital}</label>
        <label className="region-viewer-leader region-property">{"Region leader: " + props.activeRegion.leader}</label>
        <label className="region-viewer-subregions region-property">{"# of Subregions: " + props.activeMap.regions.length}</label>

        <label className="region-landmarks-label">Region Landmarks:</label>
            {/* <div className=' region-landmarks container-secondary'>
            </div> */}
            <LandmarkList landmarks={landmarks} deleteLandmark={deleteLandmark}/>

            
            <button onClick={addLandmark} className={'material-icons add-landmark-button'} >add
                        </button>
            <WInput 
				className="landmark-input" onBlur={updateInput} name="name" labelAnimation="fixed" 
				barAnimation="" placeholderText="Name" wType="outlined" inputType="text" 
                hoverAnimation="filled"
			/>
			<img className="region-viewer-icon" src={Globe} alt="welcome image"/>
        
        </>
	);
}

export default RegionViewer;

