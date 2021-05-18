import { WNavbar, WSidebar } 	from 'wt-frontend';
import { WButton, WRow, WCol } from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import {Link} from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import * as mutations from '../../cache/mutations';
import * as queries from '../../cache/queries';

import { 
	UpdateListField_Transaction
	} 				from '../../utils/jsTPS';

const SubregionEntry = (props) => {
    const entry = props.data;
    let maps = [];
    let tps = props.transactionHandler;
    const[ChangeField]  =useMutation(mutations.UPDATE_REGION_FIELD)
    const{loading, error, data, refetch}   =useQuery(queries.GET_DB_MAPS)
    console.log(entry);
					// <img className="welcome-icon" src={Globe} alt="welcome image"/>
                    
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
            regions = regions[0].regions;
            console.log(regions);
            // setEntries(regions);
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


    const handleActive = async () => {
        console.log("EYOOOOO: " + entry.name);
        props.handleActive(entry);
        //
        let urlString = window.location.href;
            let region_Id = urlString.substring(urlString.lastIndexOf('/') +1);
            console.log(urlString);
            console.log(region_Id);

            maps = data.getAllMaps;
            let regions = maps.filter(map => map._id == props.activeMap._id);
            props.handleActiveMapChange(regions[0]);
        // props.handleActiveMapChange();
        tps.clearAllTransactions();
    }

    const handleActiveParentChange = async () => {
        console.log("New parent entry: ");
        console.log(entry._id);
        const result = await props.changeActiveParent(entry);
    }

    // let landmarkString = "TEST";
    const landmarkStringGenerator = () => {
        let entries = entry.landmarks;
        let result = "";
        for(let i = 0; i < entries.length; i++){
            if(entries[i]!=undefined)
                result += entries[i];
            if(i<entries.length-1&&entries[i]!=undefined)
                result+=", ";
        }
        if(entry.landmarks.length>3)
            result+=", ...";
        return result;
    }
    let landmarkString = landmarkStringGenerator();

    const deleteRegionHandler = () => {
        props.deleteRegion(entry);
    }

    const handleFieldChange = async (field) => {
        let result = window.prompt("Region " + field +":", entry[field]);
        console.log(result);
        console.log(typeof(entry._id));
        // _id, field, prev, update, callback
        if(result){
            let transaction = new UpdateListField_Transaction(props.activeMap._id, entry._id, field, entry[field], result, ChangeField);
            tps.addTransaction(transaction);
            tpsRedo();
        }
		// await refetchMaps(refetch);
        console.log("Undo Available? : " + tps.hasTransactionToUndo());
        console.log("Redo Available? : " + tps.hasTransactionToRedo());
    }
    
	const tpsRedo = async () => {
		console.log("REDOING");
		const retVal = await tps.doTransaction();
		refetchMaps(refetch);
		return retVal;
	}

    const updateFieldValue = (field) => {
        console.log(field);
    }

    const generatePicturePath = () => {
        console.log(entry.name);
        let result = "/images/The World/";
        result+= entry.name;
        result+= " Flag.png";
        console.log(result);
        return result;
    }

	return (
        <WRow className='region-entry'>
            <WButton onClick={deleteRegionHandler} wType="texted" className={'spreadsheet-entry-buttons'}>
                                    <i className="material-icons ">close</i>
            </WButton>
                {/* <label className="col-spacer-spreadsheet">&nbsp;</label> */}
            {/* <WCol size="2"> */}
                <Link to={"/spreadsheet/"+props.activeMap._id}>
                <WButton className='specific-region-name-button' wType="texted" onClick={() => {handleFieldChange("name")}}>{entry.name}
                </WButton>
                </Link>
            {/* </WCol> */}
                <label className="col-spacer-spreadsheet">&nbsp;</label>

            {/* <WCol size="2"> */}
                <WButton className='specific-region-capital-button' wType="texted" onClick={()=>{handleFieldChange("capital")}}>{entry.capital}
                
                </WButton>
                <label className="col-spacer-spreadsheet">&nbsp;</label>
            {/* </WCol> */}

            {/* <WCol size="2"> */}
                <WButton className='specific-region-leader-button' wType="texted" onClick={()=>{handleFieldChange("leader")}}>{entry.leader}
                
                </WButton>
                <label className="col-spacer-spreadsheet">&nbsp;</label>
            {/* </WCol> */}

            {/* <WCol size="2"> */}
                <WButton className='specific-region-flag-button' wType="texted" onClick={null}>
                <img className='spreadsheet-flag' src={generatePicturePath()}></img>
                
                </WButton>
            {/* </WCol> */}
                <label className="col-spacer-spreadsheet">&nbsp;</label>

            {/* <WCol size="3"> */}
                <Link to={"/"+entry._id+"/landmarks"}>
                    {entry.landmarks[0] ? <WButton className='specific-region-landmark-button' wType="texted" onClick={handleActive}>{landmarkString}</WButton>
                    :
                    <WButton className='specific-region-landmark-button-empty' wType="texted" onClick={handleActive}>{"None"}</WButton>}
                    
                </Link>
            {/* </WCol> */}
        </WRow>
	);
}

export default SubregionEntry;