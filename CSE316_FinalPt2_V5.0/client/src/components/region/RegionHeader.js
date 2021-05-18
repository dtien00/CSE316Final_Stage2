import React from 'react';
import * as mutations from '../../cache/mutations';
import * as queries from '../../cache/queries';
import { useMutation, useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import { 
	SortItemsByField_Transaction
	} 				from '../../utils/jsTPS';

import { WButton, WRow, WCol } from 'wt-frontend';

const RegionHeader = (props) => {
    let tps = props.tps;
    let maps = [];
    const{loading, error, data, refetch}   =useQuery(queries.GET_DB_MAPS)
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { maps = data.getAllMaps; }
	const [SortItems]				= useMutation(mutations.SORT_REGIONS);
    useEffect(()=>{refetchMaps(refetch);},[maps]);

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
            props.setEntries(regions);
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

    const createSortTransaction = async (field) => {
        let transaction = await new SortItemsByField_Transaction(props.activeMap._id, field, SortItems);
        await tps.addTransaction(transaction);
        console.log("Undo available? " + tps.hasTransactionToUndo());
        console.log(tps.hasTransactionToUndo());
		await refetchMaps(refetch);
    }

    const sortTable = (field) => {
        console.log(field);
    }

    return (
        <>
        
            <WRow className="region-header">
                <label className="col-spacer-header">&nbsp;</label>
                <WCol size="2">
                    <WButton className='table-header-section' wType="texted" onClick={()=>props.createSortTransaction("name")}>Name
                    <label className="col-spacer-header">&nbsp;</label>
                    
                    <label className="col-spacer-header">&nbsp;</label>
                    
                    </WButton>
                </WCol>

                <WCol size="2">
                    <WButton className='table-header-section' wType="texted" onClick={()=>props.createSortTransaction("capital")}>Capital
                    
                    <label className="col-spacer-header">&nbsp;</label>
                    <label className="col-spacer-header">&nbsp;</label>
                    </WButton>
                </WCol>

                <WCol size="2">
                    <WButton className='table-header-section' wType="texted" onClick={()=>props.createSortTransaction("leader")}>Leader
                    
                    <label className="col-spacer-header">&nbsp;</label>
                    
                    <label className="col-spacer-header">&nbsp;</label>
                    <label className="col-spacer-header">&nbsp;</label>
                    </WButton>
                </WCol>

                <WCol size="2">
                    <WButton className='table-header-section' wType="texted" onClick={()=>sortTable("flag")}>Flag</WButton>
                </WCol>

                <WCol size="3">
                    <WButton className='table-header-section' wType="texted" onClick={null}>Landmarks</WButton>
                </WCol>
            </WRow>
        </>
    );
};

export default RegionHeader;