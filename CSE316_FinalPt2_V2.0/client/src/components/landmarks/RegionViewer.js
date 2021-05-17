import { WNavbar, WSidebar } 	from 'wt-frontend';
import { WButton, WRow, WCol } from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import SubregionEntry from '../region/SubregionEntry';
import RegionHeader from '../region/RegionHeader';
import * as mutations from '../../cache/mutations';
import LandmarkList from './LandmarkList';
import { jsTPS } 		from '../../utils/jsTPS';
import * as queries from '../../cache/queries';
import { useMutation, useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import { WModal, WMHeader, WMMain, WMFooter, WInput } from 'wt-frontend';
import { Link } from 'react-router-dom';

import { useHistory, withRouter } from 'react-router-dom'; 

import { 
	UpdateListItems_Transaction, 
	EditItem_Transaction
	} 				from '../../utils/jsTPS';
import Globe					from '../../transparent_globe_altered.png';

const RegionViewer = (props) => {
    const history = useHistory();
    let maps = [];
    let priorityRegion = null;
    // let transactionHandler = props.transactionHandler;
    const [input, setInput] = useState({ name: '' });
    const [DeleteLandmark] = useMutation(mutations.DELETE_LANDMARK)
    const [EditLandmark] = useMutation(mutations.EDIT_LANDMARK)
    const [AddLandmark] = useMutation(mutations.ADD_LANDMARK)
    const{loading, error, data, refetch}   =useQuery(queries.GET_DB_MAPS)
    const [landmarks, setLandmarks] = useState([]);
    // props.activeRegion.landmarks
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { maps = data.getAllMaps; }
    useEffect(()=>{refetchMaps(refetch);},[maps, priorityRegion]);

    let innerActiveMap = data.getAllMaps.filter(map => map._id == props.activeMap._id)[0];
    priorityRegion = props.activeRegion;
    console.log(priorityRegion);


	const refetchMaps = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
            let urlString = window.location.href;
            let smallerURL = urlString.substring(0, urlString.lastIndexOf('/') );

            let regionURL = smallerURL.substring(smallerURL.lastIndexOf('/')+1);

            maps = data.getAllMaps;
            let regions = maps.filter(map => map._id == props.activeMap._id);
            maps = regions[0];
			// props.handleActiveMapChange(maps);
            innerActiveMap=regions[0];

            regions = regions[0].regions;
            let region = regions.find(region => region._id == regionURL);

            console.log("Refetched region");
            console.log(region);
            console.log(region.landmarks);
            await setLandmarks(region.landmarks);
            priorityRegion = region;
            if(priorityRegion!=null){
                console.log("ACTIVE REGION AVAILABLE");
                console.log(priorityRegion);
            }
            else{
                console.log("Active region NULL");
                // props.setActiveRegion(region);
            }
		}
	}

	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
		console.log(updated);
        e.target.value='';
	};

    const addLandmark = async (includedLandmark) => {
        await refetchMaps(refetch);
        let landmarkName = (includedLandmark ? input.name : includedLandmark);
        // let landmarkName = input.name;
        console.log("New landmark: " + landmarkName);
        if (landmarkName=="") landmarkName="[Placeholder]";
        let succeed = null;
        if(landmarks.indexOf(landmarkName)>-1){
            if(landmarkName=="[Placeholder]") window.alert("Please assign a name for the placeholder before making another empty one");
            else window.alert("That landmark already exists.");
		    // await refetchMaps(refetch);
        }
        else{
            
		    // let {data} = await AddLandmark({variables:{map_id: props.activeMap._id, region_id: props.activeRegion._id, landmark: landmarkName}});
		    // await refetchMaps(refetch);
            
            let opcode = 1;
            let transaction = await new UpdateListItems_Transaction(props.activeMap._id, priorityRegion._id, landmarkName, -1, opcode, AddLandmark, DeleteLandmark);
            await props.transactionHandler.addTransaction(transaction);
            tpsRedo();
            console.log("Operating");
        }
        if(succeed) {
			let _id = succeed.deleteLandmark;
		} 
        await refetchMaps(refetch);
        setInput({name:''});
    }

    const createDeleteLandmarkTransaction = async (data, index) => {
        let result = window.confirm("Are you sure you want to delete?");
        console.log("Map: " + props.activeMap._id);
        console.log("Region: " + priorityRegion._id);
        console.log("Data");
        console.log(data);
        console.log(index);
        if (result==true) {
            let opcode = 0;
            let transaction = await new UpdateListItems_Transaction(props.activeMap._id, priorityRegion._id, data, index, opcode, AddLandmark, DeleteLandmark);
            await props.transactionHandler.addTransaction(transaction);
            tpsRedo();
        }
        console.log("Undo available2? " + props.transactionHandler.hasTransactionToUndo());
        console.log(props.transactionHandler.hasTransactionToUndo());
		await refetchMaps(refetch);
    }
    
	const tpsRedo = async () => {
        console.log("Redo available Redo Function? " + props.transactionHandler.hasTransactionToRedo());
		const retVal = await props.transactionHandler.doTransaction();
		await refetchMaps(refetch);
		return retVal;
	}

    const tpsUndo = async () => {
        console.log("Undo available Undo Function? " + props.transactionHandler.hasTransactionToUndo());
		const retVal = await props.transactionHandler.undoTransaction();
		await refetchMaps(refetch);
		return retVal;
	}

    const editLandmark = async (data, index) => {
        console.log("Editing landmark");
        console.log(index);
        console.log(data);
        var newName = window.prompt("New landmark name:", data);
        console.log(newName);
        if(newName=="") newName="[Placeholder]" ;
        if(landmarks.indexOf(newName)>-1){
            window.alert("That landmark already exists.");
        }
        else{
            if(newName=="") newName="[Placeholder]" 
            // await EditLandmark({variables: {map_id: props.activeMap._id, region_id: props.activeRegion._id, landmark: index, newName: newName}});
            let transaction = await new EditItem_Transaction(props.activeMap._id, priorityRegion._id, index, data, newName, EditLandmark);
            await props.transactionHandler.addTransaction(transaction);
            tpsRedo();
        }
		await refetchMaps(refetch);
    }

    const onKeyDown = async (e) => {
        console.log("Entered clicked?");
        console.log(e.keyCode);
        if(e.keyCode===13) {
            const { name, value } = e.target;
            const updated = { ...input, [name]: value };
            await setInput(updated);
            console.log("yes?" + updated);
            addLandmark(updated.name);
        }
        // else updateInput(e);
    }

    let undoStyle = "material-icons region-viewer-undo";
    if (props.transactionHandler.hasTransactionToUndo()) undoStyle+="-enabled";
    let redoStyle = "material-icons region-viewer-redo";
    if (props.transactionHandler.hasTransactionToRedo()) redoStyle+="-enabled";

    console.log(props.activeMap.regions);
    console.log(props.activeRegion);

    let regionIndex = innerActiveMap.regions.map(function(e){return e._id}).indexOf(priorityRegion._id);
    console.log("INDEX : " + regionIndex);

    let prevR = "material-icons region-viewer-prev";
    let prevRegionAvailable = regionIndex>0;
    console.log(prevRegionAvailable);
    if  (prevRegionAvailable) prevR+=" enabled";
    console.log(prevR);

    let nextR = "material-icons region-viewer-next";
    let nextRegionAvailable = regionIndex<innerActiveMap.regions.length-1 && regionIndex>=0;
    console.log(nextRegionAvailable);
    if  (nextRegionAvailable) nextR+=" enabled";
    console.log(nextR);

    const loadNextRegion = async () => {
        if(nextRegionAvailable){
            history.push("/"+(innerActiveMap.regions[regionIndex+1]._id)+"/landmarks");
            props.transactionHandler.clearAllTransactions();
        }
        await refetchMaps(refetch);
        console.log(priorityRegion);
        props.setActiveRegion(priorityRegion);
        return null

    }

    const loadPrevRegion = async () => {
        if(prevRegionAvailable){
            history.push("/"+(innerActiveMap.regions[regionIndex-1]._id)+"/landmarks");
            props.transactionHandler.clearAllTransactions();
        }
        await refetchMaps(refetch);
        console.log(priorityRegion);
        props.setActiveRegion(priorityRegion);
        return null
    }

	return (
        <>
        <Link to={"/spreadsheet/"+props.activeMap._id}>
        <button onClick={()=>{props.transactionHandler.clearAllTransactions()}} className={'material-icons return-to-spreadsheet-button'} >skip_previous
                        </button>
        </Link>
        

            <button onClick={()=>{loadNextRegion()}} className={nextR} >navigate_next
                    </button>
                    {/* <label>{props.activeRegion._id}</label> */}
            <button onClick={()=>{loadPrevRegion()}} className={prevR} >navigate_before
                        </button>

        <button onClick={tpsUndo} className={undoStyle} >undo
            </button>
        <button onClick={props.transactionHandler.hasTransactionToRedo() ? tpsRedo:null} className={redoStyle} >redo
            </button>
            
            {/* <button onClick={nextRegionAvailable ? nextRegion : null} className={nextR} >navigate_next
            </button>
            <button onClick={prevRegionAvailable ? prevRegion : null} className={prevR} >navigate_before
            </button> */}
            {/* <label className={"region-viewer-guider"}>{1+props.activeMap.regions.indexOf(props.activeRegion)+"/"+props.activeMap.regions.length}</label> */}

        <label className="region-viewer-name region-property">{"Region name: " + priorityRegion.name}</label>
        <label className="region-viewer-parent region-property">Parent Region: To be implemented</label>
        <label className="region-viewer-capital region-property">{"Region capital: " + priorityRegion.capital}</label>
        <label className="region-viewer-leader region-property">{"Region leader: " + priorityRegion.leader}</label>
        <label className="region-viewer-subregions region-property">{"# of Subregions: " + props.activeMap.regions.length}</label>

        <label className="region-landmarks-label">Region Landmarks:</label>
            {/* <div className=' region-landmarks container-secondary'>
            </div> */}
            <LandmarkList landmarks={landmarks} deleteLandmark={createDeleteLandmarkTransaction} editLandmark={editLandmark}/>

            
            <button onClick={addLandmark} className={'material-icons add-landmark-button'} >add
                        </button>
            <WInput 
				className="landmark-input" onKeyDown={onKeyDown} onBlur={updateInput} name="name" labelAnimation="fixed" 
				barAnimation="" placeholderText="Name" wType="outlined" inputType="text" 
                hoverAnimation="filled"
			/>
			<img className="region-viewer-icon" src={Globe} alt="welcome image"/>
        
        </>
	);
}

export default RegionViewer;

