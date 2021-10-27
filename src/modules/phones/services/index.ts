import { PhoneContext } from './../models/phone-model';
import Phone from "../models/phone-model";
import mongoose, { AnyObject } from 'mongoose';

var phonesProjection = { 
	__v: false
};

export const deletePhoneById = async (id) => {
	await Phone.deleteOne({_id: id})
};
export const getPhoneById = async (id) => {
	const phone = await Phone.findById({_id: id}, phonesProjection)
	return phone
};
export const getPhone = async (obj) => {
	const phone = await Phone.findOne(obj, phonesProjection)
	return phone
};
export const getPhones = async (searchText, limit = 25, fromId, filterByColor) => {
	var obj: AnyObject = { }
	if(filterByColor){
		const regex = new RegExp(filterByColor, 'i')
		obj['color'] = { '$regex': regex }
	}
	if(searchText){
		const regex = new RegExp(searchText, 'i')
		obj['$or'] = [ { 'type': { '$regex': regex } }, { 'serial': { '$regex': regex } }, { 'metaData': { '$regex': regex } } ]
		//obj['$text'] = { '$search': searchText, '$caseSensitive' :false }
	}
	const phonesCount = await Phone.count( { ...obj } )

	if(fromId){
		obj['_id'] = { '$lt': fromId}
	}
	const phones = await Phone.find( obj, phonesProjection ).sort({ '_id': -1 }).limit(limit)
	return { arr: phones, total: phonesCount }
};
export const savePhone = async (pc) => {
	delete pc._id
	const phone = await new Phone(pc).save()
	return phone
};
export const updatePhone = async (phoneId, pc: PhoneContext) => {
	const updateObj: any = { type: pc.type, metaData: pc.metaData, serial: pc.serial }
	if(pc.color === null){
		updateObj['$unset'] = { color: 1 }
	}else{
		updateObj.color = pc.color
	}
	const phone = await Phone.findByIdAndUpdate( { _id: phoneId }, updateObj, { new: true } ).select('-__v');
	return phone
};
