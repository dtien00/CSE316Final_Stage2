import { WNavbar, WSidebar } 	from 'wt-frontend';
import { WButton, WRow, WCol } from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import LandmarkEntry from './LandmarkEntry';

const LandmarkList = (props) => {
    const entries = props.landmarks ? props.landmarks : null;
    
					// <img className="welcome-icon" src={Globe} alt="welcome image"/>

	return (
		entries ? <div className=' landmark-entries container-secondary'>
            {
                
                entries.map((entry, index) => 
                    <LandmarkEntry
                        data={entry} key={entry}
                        deleteLandmark={props.deleteLandmark}
                        editLandmark={props.editLandmark}
                        index={index}
                        entries={entries}
                    />
                )
            }

            </div>
            : <div className='landmark-entries container-secondary' />
	);
}

export default LandmarkList;
