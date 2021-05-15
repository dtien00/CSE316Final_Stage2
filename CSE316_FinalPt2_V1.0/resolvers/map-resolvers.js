const ObjectId = require('mongoose').Types.ObjectId;
const Map = require('../models/map-model');


// The underscore param, "_", is a wildcard that can represent any value;
// here it is a stand-in for the parent parameter, which can be read about in
// the Apollo Server documentation regarding resolvers

module.exports = {
	Query: {
		/** 
		 	@param 	 {object} req - the request object containing a user id
			@returns {array} an array of todolist objects on success, and an empty array on failure
		**/
		getAllMaps: async (_, __, { req }) => {
			const _id = new ObjectId(req.userId);
			if(!_id) { return([])};
			const maps = await Map.find({owner: _id});
			if(maps) return (maps);

		},
		/** 
		 	@param 	 {object} args - a todolist id
			@returns {object} a todolist on success and an empty object on failure
		**/
		getMapById: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const map = await Map.findOne({_id: objectId});
			if(map) return map;
			else return ({});
		},

	},
	Mutation: {
		/** 
		 	@param 	 {object} args - a map id and an empty region object
			@returns {string} the objectID of the region or an error message
		**/
		addRegion: async(_, args) => {
			//Revision #2
			console.log("adding new region");
			const { _id, region , index } = args;
			const mapId = new ObjectId(_id);
			const objectId = new ObjectId();
			const found = await Map.findOne({_id: mapId});
			console.log(found);
			if(!found) return ('Map not found');
			if(region._id === '') region._id = objectId;
			console.log("Region ID: " + region);
			let regions = found.regions;
			console.log("Regions: " + regions);

			region.parent = mapId;

			//Revision #2
			if(index < 0) regions.push(region);
  			else regions.splice(index, 0, region);

			//Creates a new Map
			// const length = Map.length;
			// console.log("LENGTH " + length);
			
			const updated = await Map.updateOne({_id: mapId}, { regions: regions });
			
			// const result = await Map.findOne({_id: mapId});
			// console.log("UPDATED MAP: " + result);

			if(updated) return (region._id);

			else return ('Could not add region');
		},
		/** 
		 	@param 	 {object} args - an empty map object
			@returns {string} the objectID of the map or an error message
		**/
		addMap: async (_, args) => {
			const { map } = args;
			const objectId = new ObjectId();
			const { id, name, owner, regions } = map;
			const newMap = new Map({
				_id: objectId,
				id: id,
				name: name,
				owner: owner,
				regions: regions
			});
			const updated = newMap.save();
			if(updated) return objectId;
			else return ('Could not add map');
		},
		/** 
		 	@param 	 {object} args - a map objectID and region objectID
			@returns {array} the updated region array on success or the initial 
							 array on failure
		**/
		deleteRegion: async (_, args) => {
			const  { _id, regionId } = args;
			const mapId = new ObjectId(_id);
			const found = await Map.findOne({_id: mapId});
			let mapRegions = found.regions;
			mapRegions = mapRegions.filter(region => region._id.toString() !== regionId);
			const updated = await Map.updateOne({_id: regionId}, { regions: mapRegions })
			if(updated) return (mapRegions);
			else return (found.regions);

		},
		/** 
		 	@param 	 {object} args - a map objectID 
			@returns {boolean} true on successful delete, false on failure
		**/
		deleteMap: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const deleted = await Map.deleteOne({_id: objectId});
			if(deleted) return true;
			else return false;
		},
		/** 
		 	@param 	 {object} args - a map objectID, field, and the update value
			@returns {boolean} true on successful update, false on failure
		**/
		updateMapField: async (_, args) => {
			const { field, value, _id } = args;
			const objectId = new ObjectId(_id);
			const updated = await Map.updateOne({_id: objectId}, {[field]: value});
			if(updated) return value;
			else return "";
		},
		/** 
			@param	 {object} args - a map objectID, a region objectID, field, and
									 update value. Flag is used to interpret the completed 
									 field,as it uses a boolean instead of a string
			@returns {array} the updated region array on success, or the initial region array on failure
		**/
		updateRegionField: async (_, args) => {
			// console.log("YESSSSSSS");
			const { _id, regionId, field,  flag } = args;
			let { value } = args
			const mapId = new ObjectId(_id);
			const found = await Map.findOne({_id: listId});
			let mapRegions = found.regions;
			if(flag === 1) {
				if(value === 'complete') { value = true; }
				if(value === 'incomplete') { value = false; }
			}
			mapRegions.map(region => {
				if(region._id.toString() === regionId) {	
					
					region[field] = value;
				}
			});
			const updated = await Map.updateOne({_id: mapId}, { regions: mapRegions })
			if(updated) return (mapRegions);
			else return (found.regions);
		},
		/**
			@param 	 {object} args - contains map id, region to swap, and swap direction
			@returns {array} the reordered region array on success, or initial ordering on failure
		**/
		reorderRegions: async (_, args) => {
			// console.log("SUCCESS");
			const { _id, regionId, direction } = args;
			const mapId = new ObjectId(_id);
			const found = await Map.findOne({_id: listId});
			let mapRegions = found.regions;
			const index = mapRegions.findIndex(region => region._id.toString() === regionId);
			// move selected item visually down the list
			if(direction === 1 && index < mapRegions.length - 1) {
				let next = mapRegions[index + 1];
				let current = mapRegions[index]
				mapRegions[index + 1] = current;
				mapRegions[index] = next;
			}
			// move selected item visually up the list
			else if(direction === -1 && index > 0) {
				let prev = mapRegions[index - 1];
				let current = mapRegions[index]
				mapRegions[index - 1] = current;
				mapRegions[index] = prev;
			}
			const updated = await Map.updateOne({_id: mapId}, { regions: mapRegions })
			if(updated) return (mapRegions);
			// return old ordering if reorder was unsuccessful
			mapRegions = found.regionss;
			return (found.regions);

		},

		//EXPERIMENT
		sortRegions: async (_, args) => {
			const {_id, field} = args;
			const mapId = new ObjectId(_id);
			const found = await Map.findOne({_id: mapId});
			const newMap = [...found.regions];
			if(field=='default')
				return newMap;
			
			const updated = await Todolist.updateOne({_id: listId}, {items: newList});
			// const experimentList = await Todolist.update({_id: listId}, {$unset:{"__typename":""}});
			console.log("completed");
			console.log(typeof(newList));
			console.log(newList);
			return newList;
			// return experimentList;

		},

		updateCollection: async (_, args) => {
			const {regions, _id} = args;
			const mapId = _id;
			const newRegions = regions;
			console.log("reached");
			// const updated = await Todolist.replaceOne({_id: listId}, newItems)
			// console.log("_ID: ", _id);
			// const updated = await Todolist.updateOne({_id: listId}, {items: newList});
			return true;
			/*console.log("REACHED");
			const {newList, _id} = args;
			console.log("UPDATING COLLECTION ASASAS");
			const updated = await Todolist.updateOne({_id: _id}, {items: newList});
			if(updated)
				return true;
			return false;*/

		},


		revertCollection: async (_, args) => {
			const {oldList, listID} = args;
			console.log("reverted");
			const listIDO = ObjectId(listID);
			const found = await Todolist.findOne({_id: listIDO});
			const updated = await found.updateOne({items: oldList});
			console.log("OLD LIST ", oldList);
			console.log("UPDATED LIST ", found);
			if(updated)
				return true;
			return false;
		},

		addLandmark: async(_, args) => {
			const{map_id, region_id, landmark} = args;
			console.log("Adding new Landmark");
			const found = await Map.findOne({_id: map_id});
			let mapRegions = found.regions;
			console.log(mapRegions);
			console.log("Finding single");
			console.log(region_id);
			let mapRegion = mapRegions.find((region) => region._id == region_id);
			console.log(mapRegion);
			console.log("LANDMARKS: " + mapRegion.landmarks);
			mapRegion.landmarks.push(landmark);
			console.log("LANDMARKS AFTER: " + mapRegion.landmarks);
			console.log(mapRegion);
			
			const updated = await Map.updateOne({_id: map_id}, { regions: mapRegions });
			if (updated) return true;
			return false;
		}


	}
}