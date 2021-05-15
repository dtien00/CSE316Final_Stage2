import React from 'react';
import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WRow, WCol } from 'wt-frontend';

const Logo = (props) => {
    
    const handleHomeScreen = () => {
        console.log("Teee");
        console.log("Current user: " + props.user);
    };

    return (
        <WButton className="logo" onClick={handleHomeScreen} wType="texted" hoverAnimation="text-primary"> 
        The World Data Mapper
        </WButton>
    );
};

export default Logo;