import { WNavbar, WSidebar } 	from 'wt-frontend';
import { WButton, WRow, WCol } from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import {Link} from 'react-router-dom';

const LandmarkEntry = (props) => {
    const {data} = props;


    return (
        <>
         <WRow className='landmark-entry'>
            <WCol size="9">
                        <WButton onClick={null} className={'specific-landmark-button'} >{props.data}
                        </WButton>
			<div className="modal-spacer">&nbsp;</div>
            </WCol>
            <WCol size="3">
                <div className='landmark-button-group'>
                        <WButton onClick={() => props.deleteLandmark(data, props.index)} wType="texted" className={'table-entry-buttons'}>
                                    <i className="material-icons ">delete_outline</i>
                        </WButton>

                        <WButton onClick={() => props.editLandmark(data)} wType="texted" className={'table-entry-buttons'}>
                                    <i className="material-icons ">edit</i>
                        </WButton>
                </div>
            </WCol>
        </WRow>
        </>
    );
};

export default LandmarkEntry;