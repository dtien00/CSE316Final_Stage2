import React        from 'react';
import SidebarEntry from './SidebarEntry';

const SidebarList = (props) => {

    const activeList = props.todolists.filter(list => list.id===props.activeid);

    const mediumHandlerSetActive = (id) => {
        props.tps.clearAllTransactions();
        props.handleSetActive(id);
    }


    return (
        <>
            {activeList.map(todo => (
                    <SidebarEntry
                        handleSetActive={props.handleSetActive} activeid={props.activeid}
                        id={todo.id} key={todo.id} name={todo.name} _id={todo._id}
                        updateListField={props.updateListField}
                        textColor={'yellow'}
                    />
                ))}
            {
                props.todolists &&
                props.todolists.map(todo => (todo.id===props.activeid ? null:
                    <SidebarEntry
                        handleSetActive={mediumHandlerSetActive} activeid={props.activeid}
                        id={todo.id} key={todo.id} name={todo.name} _id={todo._id}
                        updateListField={props.updateListField}
                        textColor={'white'}
                    />
                ))
            }
        </>
    );
};

export default SidebarList;