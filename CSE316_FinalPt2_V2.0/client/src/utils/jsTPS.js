export class jsTPS_Transaction {
    constructor() {};
    doTransaction() {};
    undoTransaction () {};
}
/*  Handles list name changes, or any other top level details of a todolist that may be added   */
export class UpdateListField_Transaction extends jsTPS_Transaction {
    constructor(mapID, _id, field, prev, update, callback) {
        super();
        this.prev = prev;
        this.update = update;
        this.field = field;
        this.region_id = _id;
        console.log(this.region_id);
        this.mapID = mapID;
        this.updateFunction = callback;
    }
    async doTransaction() {
		const { data } = await this.updateFunction({ variables: { mapID: this.mapID, region_id: this.region_id, field: this.field, value: this.update }});
		return data;
    }
    async undoTransaction() {
        const { data } = await this.updateFunction({ variables: { mapID: this.mapID, region_id: this.region_id, field: this.field, value: this.prev }});
		return data;
    }
}

/*  Handles item reordering */
export class ReorderItems_Transaction extends jsTPS_Transaction {
    constructor(listID, itemID, dir, callback) {
        super();
        this.listID = listID;
        this.itemID = itemID;
		this.dir = dir;
		this.revDir = dir === 1 ? -1 : 1;
		this.updateFunction = callback;
	}

    async doTransaction() {
		const { data } = await this.updateFunction({ variables: { itemId: this.itemID, _id: this.listID, direction: this.dir }});
		return data;
    }

    async undoTransaction() {
		const {data} = await this.updateFunction({ variables: { itemId: this.itemID, _id: this.listID, direction: this.revDir }});
		return data;

    }
    
}

// Handles reordering of ALL items in the list based on direction (Up = 1, Down = -1)
export class SortItemsByField_Transaction extends jsTPS_Transaction {
    constructor(map_ID, field, callback){
        super();
        this.map_ID = map_ID;
        this.field = field;
        this.updateFunction = callback;
        console.log("MADE IT");
    }
    
    async doTransaction() {
		const { data } = await this.updateFunction({variables: {_id: this.map_ID, field: this.field}});
		return data;
    }

    async undoTransaction() {
		const {data} = await this.updateFunction({variables: {_id: this.map_ID, field: this.field}});
		return data;

    }

}

export class EditItem_Transaction extends jsTPS_Transaction {
	constructor(mapID, regionID, index, prev, update, callback) {
		super();
		this.mapID = mapID;
		this.regionID = regionID;
        this.index = index;
		this.prev = prev;
		this.update = update;
		this.updateFunction = callback;
        // map_id, region_id, landmark, newName
	}	
// map_id: props.activeMap._id, region_id: props.activeRegion._id, landmark: index, newName: newName
	async doTransaction() {
		const { data } = await this.updateFunction({ 
				variables:{  map_id: this.mapID, region_id: this.regionID, 
                    landmark: this.index, newName: this.update, 
						  }
			});
		return data;
    }

    async undoTransaction() {
		const { data } = await this.updateFunction({ 
				variables:{ map_id: this.mapID, region_id: this.regionID, 
                    landmark: this.index, newName: this.prev, 
						  }
			});
		return data;

    }
}

/*  Handles create/delete of list items */
export class UpdateListItems_Transaction extends jsTPS_Transaction {
    // opcodes: 0 - delete, 1 - add 
    // (props.activeMap._id, props.activeRegion._id, data, index, opcode, AddLandmark, DeleteLandmark)
    constructor(mapID, regionID, landmark, index, opcode, addfunc, delfunc) {
        super();
        this.mapID = mapID;
		this.regionID = regionID;
		this.landmark = landmark;
        this.addFunction = addfunc;
        this.deleteFunction = delfunc;
        this.opcode = opcode;
        this.index = index
    }
    async doTransaction() {
		let data;
        this.opcode === 0 ? { data } = await this.deleteFunction({
							variables: {map_id: this.mapID, region_id: this.regionID, landmark: this.index}})
						  : { data } = await this.addFunction({
                            variables:{map_id: this.mapID, region_id: this.regionID, landmark: this.landmark}})  
		// if(this.opcode !== 0) {
        //     this.item._id = this.itemID = data.addItem;
		// }
		return data;
    }
    // Since delete/add are opposites, flip matching opcode
    async undoTransaction() {
		let data;
        this.opcode === 1 ? { data } = await this.deleteFunction({
							variables: {map_id: this.mapID, region_id: this.regionID, landmark: this.index}})
                          : { data } = await this.addFunction({
							variables: {map_id: this.mapID, region_id: this.regionID, landmark: this.landmark}})
		// if(this.opcode !== 1) {
        //     this.item._id = this.itemID = data.addItem;
        // }
		return data;
    }
}


/*  Handles create/delete of list items */
export class UpdateRegions_Transaction extends jsTPS_Transaction {
    // opcodes: 0 - delete, 1 - add 
    // (props.activeMap._id, props.activeRegion._id, data, index, opcode, AddLandmark, DeleteLandmark)
    constructor(region, region_id, mapID, opcode, addfunc, delfunc) {
        super();
        this.mapID = mapID;
		this.region = region;
        this.region_id = region_id;
        this.addFunction = addfunc;
        this.deleteFunction = delfunc;
        this.opcode = opcode;
            let trimmedRegion = {
                _id: region._id,
                id: region.id,
                name: region.name,
                capital: region.capital,
                leader: region.leader,
                flag: region.flag,
                parent: region.parent,
                landmarks: region.landmarks
            };
            this.region = trimmedRegion;
        console.log("TRANSACTION SCOPE: " + this.region_id);
    }
    async doTransaction() {
		let data;
        this.opcode === 0 ? { data } = await this.deleteFunction({
							variables: {regionId: this.region_id, _id: this.mapID}})
						  : { data } = await this.addFunction({
                            variables:{_id: this.mapID, region: this.region, index: -1}})  
		// if(this.opcode !== 0) {
        //     this.item._id = this.itemID = data.addItem;
		// }
        if(data) {
			let _id = data.addRegion;
			this.region_id = _id;
		} 
		return data;
    }
    // Since delete/add are opposites, flip matching opcode
    async undoTransaction() {
		let data;
        this.opcode === 1 ? { data } = await this.deleteFunction({
							variables: {regionId: this.region_id, _id: this.mapID}})
                          : { data } = await this.addFunction({
							variables: {_id: this.mapID, region: this.region, index: -1}})
		// if(this.opcode !== 1) {
        //     this.item._id = this.itemID = data.addItem;
        // }
        if(data) {
			let _id = data.addRegion;
			this.region_id = _id;
		} 
		return data;
    }
}



export class AlterCollection_Transaction extends jsTPS_Transaction {
    constructor(listID, sortingParameter, oldList, callback, reversecallback){
        super();
        this.listID = listID;
        this.field = sortingParameter;
        this.oldList = oldList;
        this.updateFunction = callback;
        this.undoFunction = reversecallback;
    }

    async doTransaction() {
        const data = await this.updateFunction({variables:{_id: this.listID, field: this.field}});
        // this.oldList = await this.updateFunction({variables:{_id: this.listID, field: this.field}});
        // console.log("HYPE");
        // console.log(data);
		return data;
    }
    async undoTransaction() {

        const trimmedItems = this.oldList.map(x => {
            const newItem = {
                _id: x._id,
                id: x.id,
                description: x.description,
                due_date: x.due_date,
                assigned_to: x.assigned_to,
                completed: x.completed
            };
            return newItem;
        });

		const {data} = await this.undoFunction({variables:{oldList: trimmedItems, listID: this.listID}});
		return data;
    }
}



export class jsTPS {
    constructor() {
        // THE TRANSACTION STACK
        this.transactions = [];
        // KEEPS TRACK OF WHERE WE ARE IN THE STACK, THUS AFFECTING WHAT
        // TRANSACTION MAY BE DONE OR UNDONE AT ANY GIVEN TIME
        this.mostRecentTransaction = -1;
        // THESE VARIABLES CAN BE TURNED ON AND OFF TO SIGNAL THAT
        // DO AND UNDO OPERATIONS ARE BEING PERFORMED
        this.performingDo = false;
        this.performingUndo = false;
    }
    
    /**
     * Tests to see if the do (i.e. redo) operation is currently being
     * performed. If it is, true is returned, if not, false.
     * 
     * return true if the do (i.e. redo) operation is currently in the
     * process of executing, false otherwise.
     */
    isPerformingDo() {
        return this.performingDo;
    }
    
    /**
     * Tests to see if the undo operation is currently being
     * performed. If it is, true is returned, if not, false.
     * 
     * return true if the undo operation is currently in the
     * process of executing, false otherwise.
     */
    isPerformingUndo() {
        return this.performingUndo;
    }
    
    /**
     * This function adds the transaction argument to the top of
     * the transaction processing system stack and then executes it. Note that it does
     * When this method has completed transaction will be at the top 
     * of the stack, it will have been completed, and the counter have
     * been moved accordingly.
     * 
     * param transaction The custom transaction to be added to
     * the transaction processing system stack and executed.
     */
    addTransaction(transaction) {
        // ARE THERE OLD UNDONE TRANSACTIONS ON THE STACK THAT FIRST
        // NEED TO BE CLEARED OUT, i.e. ARE WE BRANCHING?
        console.log("ADDING TRANSACTION IN JSTPS")
        if ((this.mostRecentTransaction < 0)|| (this.mostRecentTransaction < (this.transactions.length-1))) {
            for (let i = this.transactions.length-1; i > this.mostRecentTransaction; i--) {
                this.transactions.splice(i, 1);
            }
        }

        // AND NOW ADD THE TRANSACTION
        this.transactions.push(transaction);
        // AND EXECUTE IT
        // this.doTransaction();        
    }

    /**
     * This function executes the transaction at the location of the counter,
     * then moving the TPS counter. Note that this may be the transaction
     * at the top of the TPS stack or somewhere in the middle (i.e. a redo).
     */
     async doTransaction() {
		let retVal;
        if (this.hasTransactionToRedo()) {   
            this.performingDo = true;
            let transaction = this.transactions[this.mostRecentTransaction+1];
			retVal = await transaction.doTransaction();
			this.mostRecentTransaction++;
			this.performingDo = false;
            
        }
        console.log('transactions: ' + this.getSize());
        console.log('redo transactions:' + this.getRedoSize());
        console.log('undo transactions:' + this.getUndoSize());
		console.log(' ')
		return retVal;
    }
    
    /**
     * This function checks to see if there is a transaction to undo. If there
     * is it will return it, if not, it will return null.
     * 
     * return The transaction that would be executed if undo is performed, if
     * there is no transaction to undo, null is returned.
     */
    peekUndo() {
        if (this.hasTransactionToUndo()) {
            return this.transactions[this.mostRecentTransaction];
        }
        else
            return null;
    }
    
    /**
     * This function checks to see if there is a transaction to redo. If there
     * is it will return it, if not, it will return null.
     * 
     * return The transaction that would be executed if redo is performed, if
     * there is no transaction to undo, null is returned.
     */    
    peekDo() {
        if (this.hasTransactionToRedo()) {
            return this.transactions[this.mostRecentTransaction+1];
        }
        else
            return null;
    }

    /**
     * This function gets the most recently executed transaction on the 
     * TPS stack and undoes it, moving the TPS counter accordingly.
     */
     async undoTransaction() {
		let retVal;
        if (this.hasTransactionToUndo()) {
            this.performingUndo = true;
            let transaction = this.transactions[this.mostRecentTransaction];
			retVal = await transaction.undoTransaction();
            this.mostRecentTransaction--;
			this.performingUndo = false;
        }
        console.log('transactions: ' + this.getSize());
        console.log('redo transactions:' + this.getRedoSize());
        console.log('undo transactions:' + this.getUndoSize());
        console.log(' ')
		return(retVal);
    }

    /**
     * This method clears all transactions from the TPS stack
     * and resets the counter that keeps track of the location
     * of the top of the stack.
     */
    clearAllTransactions() {
        // REMOVE ALL THE TRANSACTIONS
        this.transactions = [];
        
        // MAKE SURE TO RESET THE LOCATION OF THE
        // TOP OF THE TPS STACK TOO
        this.mostRecentTransaction = -1;        
    }
    
    /**
     * Accessor method that returns the number of transactions currently
     * on the transaction stack. This includes those that may have been
     * done, undone, and redone.
     * 
     * return The number of transactions currently in the transaction stack.
     */
    getSize() {
        return this.transactions.length;
    }
    
    /**
     * This method returns the number of transactions currently in the
     * transaction stack that can be redone, meaning they have been added
     * and done, and then undone.
     * 
     * return The number of transactions in the stack that can be redone.
     */
    getRedoSize() {
        return this.getSize() - this.mostRecentTransaction - 1;
    }

    /**
     * This method returns the number of transactions currently in the 
     * transaction stack that can be undone.
     * 
     * return The number of transactions in the transaction stack that
     * can be undone.
     */
    getUndoSize() {
        return this.mostRecentTransaction + 1;
    }
    
    /**
     * This method tests to see if there is a transaction on the stack that
     * can be undone at the time this function is called.
     * 
     * return true if an undo operation is possible, false otherwise.
     */
    hasTransactionToUndo() {
        return this.mostRecentTransaction >= 0;
    }
    
    /**
     * This method tests to see if there is a transaction on the stack that
     * can be redone at the time this function is called.
     * 
     * return true if a redo operation is possible, false otherwise.
     */
    hasTransactionToRedo() {
        return this.mostRecentTransaction < (this.transactions.length-1);
    }
        
    /**
     * This method builds and returns a textual summary of the current
     * Transaction Processing System, this includes the toString of
     * each transaction in the stack.
     * 
     * return A textual summary of the TPS.
     */
    // toString() {
    //     let text = "<br>" +"--Number of Transactions: " + this.transactions.length + "</br>";
    //     text += "<br>" + "--Current Index on Stack: " + this.mostRecentTransaction + "</br>";
    //     text += "<br>" + "--Current Transaction Stack:" + "</br>";
    //     for (let i = 0; i <= this.mostRecentTransaction; i++) {
    //         let jsT = this.transactions[i];
    //         text += "<br>" + "----" + jsT.toString() + "</br>";
    //     }
    //     return text;
    // }
}