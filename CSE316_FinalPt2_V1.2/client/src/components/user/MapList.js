import { WNavbar, WSidebar } 	from 'wt-frontend';
import { WButton, WRow, WCol } from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import MapEntry from './MapEntry';

const MapList = (props) => {
    const entries = props.maps ? props.maps : null;

	return (
		entries ? <div className=' table-entries container-primary'>
            {
                
                entries.map((entry, index) => (entry.owner != ' ' ?
                    <MapEntry
                        data={entry} key={entry._id}
                        deleteMap={props.deleteMap}
                        editItem={props.editItem}
                        index={index}
                        setActiveMap={props.setActiveMap}
                    />:null
                ))
            }

            </div>
            : <div className='container-primary' />
	);
}

export default MapList;
