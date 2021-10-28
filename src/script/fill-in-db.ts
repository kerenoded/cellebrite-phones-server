import { Colors } from './../modules/phones/models/colors';
import * as phonesService from '../modules/phones/services';
import { createHash } from 'crypto';

export const fillInDb = async () => {
    
    for(let i = 0 ; i < 10000 ; i++){
        let randomStr1 = (Math.random() + 1).toString(36).substring(7);
        let randomStr2 = (Math.random() + 1).toString(36).substring(7);
        var hrTime = process.hrtime()
        var rand = Math.floor(Math.random() * Object.keys(Colors).length);
        var randColorValue = Colors[Object.keys(Colors)[rand]];
        const obj: any = {
            "type": "random type - " + randomStr2,
            "serial": randomStr1 + hrTime,
            "color": randColorValue,
          }
          obj.metaData = hash(JSON.stringify(obj))
          try{
            const res = await phonesService.savePhone(obj)
          } catch(err){
            console.error('couldnt add phone', err)
          }
    }
}

function hash(string) {
    return createHash('sha256').update(string).digest('hex');
  }