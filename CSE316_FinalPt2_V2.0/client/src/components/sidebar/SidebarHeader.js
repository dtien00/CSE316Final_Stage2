import React                    from 'react';
import { WButton, WRow, WCol }  from 'wt-frontend';

const SidebarHeader = (props) => {
    
    const mediumCreateNewList = () => {
        props.tps.clearAllTransactions();
        props.createNewList();
    }

    const addListButtonStyle = props.activeid ? 'sidebar-buttons disabled':'sidebar-buttons';
    const clickAnimationStyle = props.activeid ? undefined : "ripple-light";
    console.log(addListButtonStyle);

    return (
        <WRow className='sidebar-header'>
            <WCol size="7">
                <WButton wType="texted" hoverAnimation="text-primary" className={'sidebar-header-name'}>
                    Todolists
                </WButton>
            </WCol>

            <WCol size="5">
                {
                    props.auth && <div className="sidebar-options">
                        <WButton className={addListButtonStyle} onClick={props.activeid ? undefined:mediumCreateNewList} clickAnimation={clickAnimationStyle} shape="rounded" color="primary">
                            <i className="material-icons">add</i>
                        </WButton>
                    </div>
                }
            </WCol>

        </WRow>

    );
};

export default SidebarHeader;