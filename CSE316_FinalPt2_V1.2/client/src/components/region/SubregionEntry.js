import { WNavbar, WSidebar } 	from 'wt-frontend';
import { WButton, WRow, WCol } from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import {Link} from 'react-router-dom';

const SubregionEntry = (props) => {
    const data = props.data;
    console.log(data);
					// <img className="welcome-icon" src={Globe} alt="welcome image"/>

    const handleActive = () => {
        console.log("EYOOOOO: " + data.name);
        props.handleActive(data);
    }

    const handleActiveParentChange = async () => {
        console.log("New parent data: ");
        console.log(data._id);
        const result = await props.changeActiveParent(data);
    }

    // let landmarkString = "TEST";
    const landmarkStringGenerator = () => {
        let entries = data.landmarks;
        let result = "";
        for(let i = 0; i < entries.length; i++){
            if(entries[i]!=undefined)
                result += entries[i];
            if(i<entries.length-1&&entries[i]!=undefined)
                result+=", ";
        }
        if(data.landmarks.length>3)
            result+=", ...";
        return result;
    }
    let landmarkString = landmarkStringGenerator();

    const deleteRegionHandler = () => {
        props.deleteRegion(data);
    }

	return (
        <WRow className='region-entry'>
            <WButton onClick={deleteRegionHandler} wType="texted" className={'spreadsheet-entry-buttons'}>
                                    <i className="material-icons ">close</i>
            </WButton>
                {/* <label className="col-spacer-spreadsheet">&nbsp;</label> */}
            <WCol size="2">
                <Link to={"/spreadsheet/"+props.activeMap._id}>
                <WButton className='specific-region-name-button' wType="texted" onClick={handleActiveParentChange}>{data.name}
                <label className="col-spacer-spreadsheet">&nbsp;</label>
                </WButton>
                </Link>
            </WCol>

            <WCol size="2">
                <WButton className='specific-region-button' wType="texted" onClick={null}>{data.capital}
                
                </WButton>
            </WCol>

            <WCol size="2">
                <WButton className='specific-region-button' wType="texted" onClick={null}>{data.leader}
                
                </WButton>
            </WCol>

            <WCol size="2">
                <WButton className='specific-region-button' wType="texted" onClick={null}>{data.flag}</WButton>
            </WCol>

            <WCol size="3">
                <Link to={"/"+data._id+"/landmarks"}>
                    {data.landmarks[0] ? <WButton className='specific-region-landmark-button' wType="texted" onClick={handleActive}>{landmarkString}</WButton>
                    :
                    <WButton className='specific-region-landmark-button-empty' wType="texted" onClick={handleActive}>{"None"}</WButton>}
                    
                </Link>
            </WCol>
        </WRow>
	);
}

export default SubregionEntry;