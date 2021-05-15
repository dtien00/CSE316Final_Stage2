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
    let maps = [];
    const [input, setInput] = useState({ name: '' });
    const [DeleteLandmark] = useMutation(mutations.DELETE_LANDMARK)
    const{loading, error, data, refetch}   =useQuery(queries.GET_DB_MAPS)
    const [landmarks, setLandmarks] = useState(props.activeRegion.landmarks);
    // props.activeRegion.landmarks
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { maps = data.getAllMaps; }
    
	const refetchMaps = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
            let urlString = window.location.href;
            let smallerURL = urlString.substring(0, urlString.lastIndexOf('/') );
            console.log(urlString);
            console.log(smallerURL);

            let regionURL = smallerURL.substring(smallerURL.lastIndexOf('/')+1);
            console.log("Region URL: " + regionURL);

            maps = data.getAllMaps;
            let regions = maps.filter(map => map._id == props.activeMap._id);
            regions = regions[0].regions;
            console.log(regions);
            let region = regions.find(region => region._id == regionURL);

            setLandmarks(region.landmarks);
            console.log("LANDMARKS KKK: " + landmarks);
            if(props.activeRegions!=null){
                console.log("ACTIVE REGION AVAILABLE");
                console.log(props.activeRegions);
            }
            else{
                console.log("Active region NULL");
            }
		}
	}

	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
		console.log(updated);
	};

    const addLandmark = async () => {
        console.log("Adding landmark");
        let landmarkName = input.name;
        if (landmarkName=="") landmarkName="[Placeholder]";
        let landmarks = props.activeRegion.landmarks;
        console.log(landmarks);
        console.log("Input's name: " + landmarkName);
        let succeed = null;
        if(landmarks.indexOf(landmarkName)>-1){
            if(landmarkName=="[Placeholder]") window.alert("Please assign a name for the placeholder before making another empty one");
            else window.alert("That landmark already exists.");
            console.log("uh oh");
        }
        else{
            succeed = await props.addLandmark(landmarkName);
            console.log("Operating");
        }
        console.log("SUCCEED??? " + succeed);
		await refetchMaps(refetch);
        // landmarks.length==0 ? landmarks[0]=input.name : landmarks.push(input.name);
        console.log("After: " + props.activeRegion.landmarks);
        if(succeed) {
			let _id = succeed.deleteLandmark;
			props.handleActiveMapChange(props.activeMap);
		} 
        console.log("Beginning of landmarks");
        console.log(landmarks);
    }

    const deleteLandmark = async (data, index) => {
        console.log("Deleting landmark");
        console.log(data);
        console.log(index);

        const updated = null;
        let result = window.confirm("Are you sure you want to delete?");
        if (result==true) await DeleteLandmark({variables: {map_id: props.activeMap._id, region_id: props.activeRegion._id, landmark: index}});
		await refetchMaps(refetch);
    }


	return (
        <>
        <Link to={"/spreadsheet/"+props.activeMap._id}>
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

