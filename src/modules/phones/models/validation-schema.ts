import { Schema } from "express-validator";
import { Colors } from './colors'
import * as phonesService from '../services';

export const createPhoneSchema: Schema = {
    type: {
        in: ['body'],
        isLength: {
            if: (value, { req }) => {
                const editModeId: string = req?.params?.id
                return !editModeId || (editModeId && value!==undefined)
            },
            options: { min: 3, max: 50 },
            errorMessage: 'Phone type has to be between 3 and 50 characters long'
        },
    },
    serial: {
        in: ['body'],
        isLength: {
            if: (value, { req }) => {
                const editModeId: string = req?.params?.id
                return !editModeId || (editModeId && value!==undefined)
            },
            options: { min: 3, max: 50 },
            errorMessage: 'Phone serial number has to be between 3 and 50 characters long'
        },
        custom: {
            options: (value, { req, location, path }) => {
                const editModeId: string = req?.params?.id
                return phonesService.getPhone({serial: value}).then(phoneBySerial => {
                    if (phoneBySerial) {
                        if(editModeId) {
                            if(editModeId !== phoneBySerial.id) {
                                return Promise.reject(`Can't update, phone serial number already in use`)
                            }
                        } else {
                            return Promise.reject(`Can't save, phone serial number already in use`)
                        }
                    } else {
                        if(editModeId) {
                            return phonesService.getPhoneById(editModeId).then(phoneById => {
                                if(!phoneById){
                                    return Promise.reject('Phone id does not exist')
                                }
                            })
                        }
                    }
                })
            },
        }
    },
    color: {
        in: ['body'],
        custom: {
            if: (value, { req }) => {
                return value!==undefined
            },
            options: (value,  { req }) => {
                const editModeId: string = req?.params?.id
                return (editModeId && value == null) || ((editModeId || (!editModeId && value !== null)) && Object.values(Colors).includes(value))
            },
            errorMessage: `Color should be 1 of ${Object.values(Colors)}`
        }
    },
    metaData: {
        in: ['body'],
        matches: {
            if: (value, { req }) => {
                const editModeId: string = req?.params?.id
                return !editModeId || (editModeId && value!==undefined)
            },
            options: [/^[a-fA-F0-9]{64}$/],
            errorMessage: "HASH value is not valid"
        }
    },
    
}
