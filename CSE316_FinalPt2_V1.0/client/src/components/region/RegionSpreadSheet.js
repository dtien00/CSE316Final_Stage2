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

const RegionSpreadSheet = (props) => {
    let maps =[];
    const [map, setMap] = useState({});
    const [mapPath, setMapPath] = useState([]);
    const[entries, setEntries] = useState(props.activeMap.regions);
    const[AddRegion]    =useMutation(mutations.ADD_REGION);
    const{loading, error, data, refetch}   =useQuery(queries.GET_DB_MAPS)
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { maps = data.getAllMaps; }
    useEffect(()=>{refetchMaps(refetch);},[maps]);

    // console.log("Active Region: ");
    // console.log(props.activeRegions._id);
    // console.log(props.activeMap);
    // setEntries(props.activeMap.regions);

    const refetchMaps = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
			let urlString = window.location.href;
            let region_Id = urlString.substring(urlString.lastIndexOf('/') +1);
            console.log(urlString);
            console.log(region_Id);

            maps = data.getAllMaps;
            let regions = maps.filter(map => map._id == props.activeMap._id);
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
        console.log("Active map before adding: dsadas");
        console.log(props.activeMap);
        let data =  await AddRegion({variables: {_id: mapID, region: newSubregion, index: -1}});
        await refetchMaps(refetch);
		if(data) {
			let _id = data.addRegion;
			props.handleSetActive(_id);
		} 
        // setEntries(props.activeMap.regions.filter(map => map.parent===props.activeMap._id));
        console.log("Beginning of entries");
        console.log(entries);
    }

    const changeActiveParent = (parent) => {
        // setEntries(props.activeMap.regions);
        props.handleActiveParent(parent);
    }

	return (
        <>
        <div>
        <Link to={"/spreadsheet/"+props.activeMap._id}>
        <WButton onClick={addDefaultSubregion} className={'add-subregion-button'} >+
                        </WButton>
        </Link>
        <button onClick={null} className={'material-icons spreadsheet-undo'} >undo
            </button>
        <button onClick={null} className={'material-icons spreadsheet-redo'} >redo
            </button>
        <label className="spreadsheet-header">{props.activeMap.name}</label>
        <RegionHeader/>
            {entries ? <div className=' region-spreadsheet container-primary'>             
            {
                
                entries.map((entry, index) => (
                    <SubregionEntry
                        data={entry} key={entry._id}
                        index={index}
                        activeMap={props.activeMap}
                        handleActive={props.handleSetActive}
                        changeActiveParent={changeActiveParent}
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

