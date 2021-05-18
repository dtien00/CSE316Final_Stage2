import { WNavbar, WSidebar } 	from 'wt-frontend';
import { WButton, WRow, WCol } from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import SubregionEntry from './SubregionEntry';
import RegionHeader from './RegionHeader';
import * as mutations from '../../cache/mutations';
import * as queries from '../../cache/queries';
import { useMutation, useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RegionSpreadSheetInnerShell from './RegionSpreadSheetInnerShell';
import { 
	SortItemsByField_Transaction,
    UpdateRegions_Transaction
	} 				from '../../utils/jsTPS';

const RegionSpreadSheet = (props) => {
    let tps = props.transactionHandler;
    let maps =[];
    const [map, setMap] = useState({});
    const[entries, setEntries] = useState([]);
    const[ctrlPressed, toggleCtrl] = useState(false);
    const[yPressed, toggleY] = useState(false);
    const[zPressed, toggleZ] = useState(false);
    // props.activeMap.regions
    const[AddRegion]    =useMutation(mutations.ADD_REGION);
    const[DeleteRegion]    =useMutation(mutations.DELETE_REGION);
	const [SortItems]				= useMutation(mutations.SORT_REGIONS);

    const{loading, error, data, refetch}   =useQuery(queries.GET_DB_MAPS)
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { maps = data.getAllMaps; }

    // Hook
        function useKeyPress(targetKey) {
        // State for keeping track of whether key is pressed
        const [keyPressed, setKeyPressed] = useState<boolean>(false);
        // If pressed key is our target key then set to true
        function downHandler({ key }) {
            if (key === targetKey) {
            setKeyPressed(true);
            }
        }
        // If released key is our target key then set to false
        const upHandler = ({ key }) => {
            if (key === targetKey) {
            setKeyPressed(false);
            }
        };
    // Add event listeners
    useEffect(()=>{refetchMaps(refetch);
        window.addEventListener("keydown");
        window.addEventListener("keyup");
        return () => {
            window.removeEventListener("keydown");
            window.removeEventListener("keyup");
          };
    },[maps]);
        return keyPressed;
    }

    // console.log("Active Region: ");
    // console.log(props.activeRegions._id);
    // console.log(props.activeMap);
    // setEntries(props.activeMap.regions);
    let innerActiveMap;

    const refetchMaps = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
			let urlString = window.location.href;
            let region_Id = urlString.substring(urlString.lastIndexOf('/') +1);
            console.log(urlString);
            console.log(region_Id);

            maps = data.getAllMaps;
            let regions = maps.filter(map => map._id == props.activeMap._id);

            // props.handleActiveMapChange(regions[0]);
            innerActiveMap = regions[0];

            regions = regions[0].regions;
            console.log(regions);
            setEntries(regions);
            if(props.activeRegions!=null){
                console.log("ACTIVE REGION AVAILABLE");
                console.log(props.activeRegions);
                regions = regions.filter(region => region.parent==props.activeRegions._id);
            }
            else{
                console.log("Active region NULL");
            }
		}
	}


    const addDefaultSubregion = async (e) => {
        console.log("Adding default subregion");
		const regions = props.activeMap.regions;
        console.log("Before:");
        console.log(regions);
		const lastID = regions.length >= 1 ? regions[regions.length - 1].id + 1 : 0;
        console.log("REGION ID: " + lastID);
        let newSubregion = {
            _id: '',
            id: lastID,
            name: 'No Name',
            capital: 'No Capital',
            leader: 'No Leader',
            flag: '[Image Here]',
            parent: ' ',
            landmarks: []
        }
		let mapID = props.activeMap._id;
        // console.log("Active map before adding: dsadas");
        // console.log(props.activeMap);
        //
            console.log("SUBREGION ID: " + newSubregion._id);
            let transaction = await new UpdateRegions_Transaction(newSubregion, newSubregion._id, mapID, 1, AddRegion, DeleteRegion);
            tps.addTransaction(transaction);
            await tpsRedo();
        // let data =  await AddRegion({variables: {_id: mapID, region: newSubregion, index: -1}});
        await refetchMaps(refetch);
		if(data) {
			let _id = data.addRegion;
			// props.handleSetActive(_id);
            // props.handleActiveMapChange(innerActiveMap);
		} 
        // props.handleActiveMapChange(props.activeMap);
        // setEntries(props.activeMap.regions.filter(map => map.parent===props.activeMap._id));
        // await refetchMaps(refetch);
        console.log("Beginning of entries");
        console.log(entries);
    }

    const changeActiveParent = (parent) => {
        // setEntries(props.activeMap.regions);
        // props.handleActiveParent(parent);
    }

    const deleteRegion = async (region) => {
        console.log("Deleting region");
        console.log(region);
        let mapID = props.activeMap._id;
        console.log("Active map before deleting: das");
        console.log(props.activeMap);
        let data = null;
        let r = window.confirm("Are you sure you want to delete?");
        //
        console.log(region._id);
        console.log(typeof(region._id));
        if (r==true){
            let transaction = await new UpdateRegions_Transaction(region, region._id, mapID, 0, AddRegion, DeleteRegion);
            tps.addTransaction(transaction);
            await tpsRedo();
            props.handleActiveMapChange(props.activeMap);
        }
        // if (r==true) data =  await DeleteRegion({variables: {regionId: region._id, _id: mapID}});
        await refetchMaps(refetch);
		if(data) {
			let _id = data.deleteRegion;
			// props.handleSetActive(null);
		} 
    }

    
    const createSortTransaction = async (field) => {
        let transaction = await new SortItemsByField_Transaction(props.activeMap._id, field, SortItems);
         tps.addTransaction(transaction);
        console.log("Undo available? " + tps.hasTransactionToUndo());
        console.log(tps.hasTransactionToUndo());
		 await refetchMaps(refetch);
         await tpsRedo();
         props.handleActiveMapChange(props.activeMap);
    }

	const tpsRedo = async () => {
		console.log("REDOING");
		const retVal = await tps.doTransaction();
		refetchMaps(refetch);
		return retVal;
	}

    
	const tpsUndo = async () => {
		console.log("REDOING");
		const retVal = await tps.undoTransaction();
		refetchMaps(refetch);
		return retVal;
	}


    let undoStyle = "material-icons spreadsheet-undo";
    if (tps.hasTransactionToUndo()) undoStyle+=" enabled";
    console.log(undoStyle)
    let redoStyle = "material-icons spreadsheet-redo";
    if (tps.hasTransactionToRedo()) redoStyle+=" enabled";
    console.log(redoStyle)

    console.log(entries);

    const onKeyDown = (event) => {
        console.log("Region sheet key pressed");
        console.log(event.keyCode);
        if (event.keyCode==17) {console.log("CTRL"); toggleCtrl(true);
        }
        else if(event.keyCode==89) {console.log("Y"); toggleY(true);
        }   
        else if(event.keyCode==90) {console.log("Z"); toggleZ(true);
        }

        if(ctrlPressed&&yPressed)   {tpsRedo(); toggleCtrl(false); toggleY(false);}
        else if(ctrlPressed&&zPressed)  {tpsUndo(); toggleCtrl(false); toggleZ(false);}

    }

	return (
        <>
        {/* <RegionSpreadSheetInnerShell tps={tps} activeMap={props.activeMap} activeRegions={props.activeRegions} setMap={setMap}></RegionSpreadSheetInnerShell> */}
        <div onKeyDown={onKeyDown}>
        <Link to={"/spreadsheet/"+props.activeMap._id}>
        <WButton onClick={addDefaultSubregion} className={'add-subregion-button'} >+
                        </WButton>
        </Link>
        <button onClick={tps.hasTransactionToUndo() ? tpsUndo : null} className={undoStyle} >undo
            </button>
        <button onClick={tps.hasTransactionToRedo() ? tpsRedo : null} className={redoStyle} >redo
            </button>
        <label className="spreadsheet-header">{props.activeMap.name}</label>
        <RegionHeader tps={props.transactionHandler} createSortTransaction={createSortTransaction}
        activeMap={props.activeMap} handleActiveMapChange={null} setEntries={setEntries}/>
            {entries ? <div className=' region-spreadsheet container-primary'>             
            {
                
                entries.map((entry, index) => (
                    <SubregionEntry
                        data={entry} key={entry._id}
                        index={index}
                        activeMap={props.activeMap}
                        handleActive={props.handleSetActive}
                        changeActiveParent={changeActiveParent}
                        deleteRegion = {deleteRegion}
                        transactionHandler = {props.transactionHandler}
                        handleActiveMapChange={props.handleActiveMapChange}
                    />
                ))
            }

            </div>
            : <div className='region-spreadsheet container-primary' />}
        </div>
        </>
	);
}

export default RegionSpreadSheet;

