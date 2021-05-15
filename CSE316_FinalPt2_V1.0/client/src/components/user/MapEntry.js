import { WNavbar, WSidebar } 	from 'wt-frontend';
import { WButton, WRow, WCol } from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import {Link} from 'react-router-dom';

const MapEntry = (props) => {
    const {data} = props;

    // props.deleteMap(data, props.index)
    return (
        <>
         <WRow className='table-entry'>
            <WCol size="6">
                <Link to={"/spreadsheet/" + props.data._id}>
                        <WButton onClick={()=>props.setActiveMap(data)} className={'specific-map-button'} >{data.name}
                        </WButton>
                </Link>
			<div className="modal-spacer">&nbsp;</div>
            </WCol>
            <WCol size="3">
                <div className='button-group'>
                    <Link to="/mapDeletion">
                        <WButton onClick={null} wType="texted" className={'table-entry-buttons'}>
                                    <i className="material-icons ">delete_outline</i>
                        </WButton>
                    </Link>
                    <Link to="/updateMap">
                        <WButton onClick={() => props.setActiveMap(data)} wType="texted" className={'table-entry-buttons'}>
                                    <i className="material-icons ">edit</i>
                        </WButton>
                    </Link>
                </div>
            </WCol>
        </WRow>
        </>
    );
};

export default MapEntry;