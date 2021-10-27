import { connectDB } from '../../../server'
import * as phonesService from './index';
import { strict as assert } from 'assert';
import { Colors } from '../models/colors';

describe('Endpoints', () => {
  let connection;
  let phone

  beforeAll(async () => {
    connection = await connectDB();
  });

  it('should get phones', async () => {
    let phones = (await phonesService.getPhones(undefined, undefined, undefined, undefined)).arr
    expect(phones.length).toBeGreaterThan(0)
    phone = phones[0]
  })

  it('should check pagination', async () => {
    let phones = (await phonesService.getPhones(undefined, 2, phone._id, undefined)).arr
    expect(phones.length).toEqual(2)
    let phones2 = (await phonesService.getPhones(undefined, 1, phones[0]._id, undefined)).arr
    expect(phones2.length).toEqual(1)
    expect(phones[1]._id).toEqual(phones2[0]._id)
  })

  it('should check filterByColor', async () => {
    let phones = (await phonesService.getPhones(undefined, 200, undefined, 'black')).arr
    expect(phones.filter(phone => phone.color && phone.color.toUpperCase().indexOf("BLACK") === -1).length).toEqual(0)
  })

  it('should get phone by id', async () => {
    let p = await phonesService.getPhoneById(phone._id)
    expect(p?.color).toEqual(phone.color)
  })
  it('should get phone by serial', async () => {
    let p = await phonesService.getPhone({serial: phone.serial})
    expect(p?._id).toEqual(phone._id)
  })
  
  it('should create phone and delete it', async () => {
    let randomStr = (Math.random() + 1).toString(36).substring(7);
    var hrTime = process.hrtime()
    const obj = {
      "type": "Some type that will be deleted",
      "serial": randomStr + hrTime,
      "metaData": "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a02",
    }
    const res = await phonesService.savePhone(obj)
    expect(res.type).toEqual(obj.type)

    await phonesService.deletePhoneById(res._id)
    assert(true)
  })

  it('should fail to create unique serial', async () => {
    const obj = {
      "type": "will fail becauseunique serial",
      "serial": phone.serial,
      "metaData": "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a02",
    }
    try{
      const res = await phonesService.savePhone(obj)
      assert(false)
    } catch(err){
      assert(true)
    }
    
  })

  it('should update phone with color and then remove color', async () => {
    const res = await phonesService.updatePhone( phone._id, { ...phone, color: Colors.BLUE } )
    expect(res?.color).toEqual(Colors.BLUE)
    const res2 = await phonesService.updatePhone( phone._id, { ...phone, color: null } )
    expect(res2?.color).toEqual(undefined)
    const res3 = await phonesService.updatePhone( phone._id, { ...phone, color: Colors.BLACK } )
    expect(res3?.color).toEqual(Colors.BLACK)
    phone = res3
  })

  afterAll(async () => {
    await connection.disconnect();
  });

})
