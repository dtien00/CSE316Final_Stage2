import React from 'react';

import { WButton, WRow, WCol } from 'wt-frontend';

const TableHeader = (props) => {

    // console.log("UNDO AVAILABLE? : " + props.tps.hasTransactionToUndo());
    // console.log("REDO AVAILABLE? : " + props.tps.hasTransactionToRedo());

    const undoAvailable = props.tps.hasTransactionToUndo();
    const redoAvailable = props.tps.hasTransactionToRedo();

    const buttonStyle = props.disabled ? ' table-header-button-disabled ' : 'table-header-button';

    const undoButtonStyle = undoAvailable ? 'enabled-button-undo-redo' : 'table-header-button-disabled';
    const undoClickStyle = undoAvailable ? 'ripple-light' : null;
    // if(undoButtonStyle=='table-header-button'){
    //     console.log("CHECKING");
    //     undoButtonStyle = undoAvailable ? 'enabled-button' : 'table-header-button-disabled';
    // }

    const redoButtonStyle = redoAvailable ? 'enabled-button-undo-redo' : 'table-header-button-disabled';
    const redoClickStyle = redoAvailable ? 'ripple-light' : null;
    // if(redoButtonStyle=='table-header-button'){
    //     console.log("CHECKING GO");
    //     redoButtonStyle = redoAvailable ? 'enabled-button' : 'table-header-button-disabled';
    // }

    // console.log("UNDO STYLE: " + undoButtonStyle);
    // console.log("REDO STYLE: " + redoButtonStyle);

    const clickDisabled = () => { };

    const sortByField = () => {
        console.log("TableHeader");
        props.sortByField('description');
    }

    return (
        <WRow className="table-header">
            <WCol size="3">
                <WButton className='table-header-section' wType="texted" onClick={() => {props.sortByField('description')}}>Task
                <label className="col-spacer-header">&nbsp;</label>
                
                <label className="col-spacer-header">&nbsp;</label>
                
                <label className="col-spacer-header">&nbsp;</label>
                
                <label className="col-spacer-header">&nbsp;</label>
                
                <label className="col-spacer-header">&nbsp;</label>
                
                <label className="col-spacer-header">&nbsp;</label>
                
                </WButton>
            </WCol>

            <WCol size="2">
                <WButton className='table-header-section' wType="texted" onClick={() => {props.sortByField('due_date')}}>Due Date
                
                <label className="col-spacer-header">&nbsp;</label>
                <label className="col-spacer-header">&nbsp;</label>
                </WButton>
            </WCol>

            <WCol size="2">
                <WButton className='table-header-section' wType="texted" onClick={() => {props.sortByField('completed')}}>Status
                
                <label className="col-spacer-header">&nbsp;</label>
                
                <label className="col-spacer-header">&nbsp;</label>
                <label className="col-spacer-header">&nbsp;</label>
                </WButton>
            </WCol>

            <WCol size="2">
                <WButton className='table-header-section' wType="texted" onClick={() => {props.sortByField('assigned_to')}}>Assigned</WButton>
            </WCol>


            <WCol size="2">
                <div className="table-header-buttons">
                    
                    <WButton className="sidebar-buttons undo-redo" onClick={undoAvailable ? props.undo:clickDisabled} wType="texted" 
                     className={undoButtonStyle} clickAnimation={undoClickStyle} shape="rounded">
                        <i className="material-icons">undo</i>
                    </WButton>
                    
                    <label className="col-spacer-header">&nbsp;</label>
                    
                    <WButton className="sidebar-buttons undo-redo" onClick={redoAvailable ? props.redo:clickDisabled} wType="texted" clickAnimation={redoClickStyle} shape="rounded"
                    className={redoButtonStyle}>
                        <i className="material-icons">redo</i>
                    </WButton>
                    <WButton onClick={props.disabled ? clickDisabled : props.addItem} wType="texted" className={`${buttonStyle}`}>
                        <i className="material-icons add-box">add_box</i>
                    </WButton>
                    <WButton onClick={props.disabled ? clickDisabled : ()=>
                        {
                            props.setShowDelete();
                        }
                        } wType="texted" className={`${buttonStyle}`}>
                        <i className="material-icons delete-box">delete_outline</i>
                    </WButton>
                    <WButton onClick={props.disabled ? clickDisabled : () => 
                        {
                            props.tps.clearAllTransactions();
                            props.setActiveList({});
                        }
                        } wType="texted" className={`${buttonStyle}`}>
                        <i className="material-icons close-box">close</i>
                    </WButton>
                </div>
            </WCol>

        </WRow>
    );
};

export default TableHeader;