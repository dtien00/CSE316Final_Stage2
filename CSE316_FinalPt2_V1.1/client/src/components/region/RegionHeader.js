import React from 'react';

import { WButton, WRow, WCol } from 'wt-frontend';

const RegionHeader = (props) => {

    const sortTable = (field) => {
        console.log(field);
    }

    return (
        <>
        
            <WRow className="region-header">
                <label className="col-spacer-header">&nbsp;</label>
                <WCol size="2">
                    <WButton className='table-header-section' wType="texted" onClick={()=>sortTable("name")}>Name
                    <label className="col-spacer-header">&nbsp;</label>
                    
                    <label className="col-spacer-header">&nbsp;</label>
                    
                    </WButton>
                </WCol>

                <WCol size="2">
                    <WButton className='table-header-section' wType="texted" onClick={()=>sortTable("capital")}>Capital
                    
                    <label className="col-spacer-header">&nbsp;</label>
                    <label className="col-spacer-header">&nbsp;</label>
                    </WButton>
                </WCol>

                <WCol size="2">
                    <WButton className='table-header-section' wType="texted" onClick={()=>sortTable("leader")}>Leader
                    
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