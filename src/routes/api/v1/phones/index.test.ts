import { Colors } from './../../../../modules/phones/models/colors';
import request from 'supertest'
import { setUpServer } from '../../../../server'

describe('Endpoints', () => {
  let server;
  let specificPhone;

  beforeAll(async () => {
      server = await setUpServer();
  });

  it('should get phones and 1 specific', async () => {
    const resPhones = await request(server).get('/api/v1/phones')
    expect(resPhones.statusCode).toEqual(200)
    expect(resPhones.body.arr.length).toBeGreaterThan(0)
    let id = resPhones.body.arr[0]._id
    
    const resOnePhone = await request(server).get('/api/v1/phones/' + id)
    expect(resOnePhone.statusCode).toEqual(200)
    specificPhone = resOnePhone.body
    
  })

  it('should check phones pagination', async () => {
    const twoPhones = await request(server).get('/api/v1/phones?limit=2')
    expect(twoPhones.statusCode).toEqual(200)
    expect(twoPhones.body.arr.length).toEqual(2)
    const secondPhone = await request(server).get('/api/v1/phones?limit=1&fromId=' + twoPhones.body.arr[0]._id)
    expect(secondPhone.statusCode).toEqual(200)
    expect(secondPhone.body.arr.length).toEqual(1)
    expect(secondPhone.body.arr[0]._id).toEqual(twoPhones.body.arr[1]._id)
  })

  it('should check text search', async () => {
    const phones = await request(server).get('/api/v1/phones?limit=1&searchText=' + specificPhone.type)
    expect(phones.statusCode).toEqual(200)
    expect(phones.body.arr.length).toEqual(1)
    expect(phones.body.arr[0].type).toEqual(specificPhone.type)
  })

  it('should check filter By Color', async () => {
    const phones = await request(server).get('/api/v1/phones?filterByColor=' + specificPhone.color)
    expect(phones.statusCode).toEqual(200)
    expect(phones.body.arr.length).toBeGreaterThan(0)
    expect(phones.body.arr[0].color).toEqual(specificPhone.color)
  })

  it('should get error not valid id', async () => {
    const resErrorId = await request(server).get('/api/v1/phones/123')
    expect(resErrorId.statusCode).toEqual(422)
    expect(resErrorId.body).toHaveProperty('errors')
  })

  it('should update a specific phone', async () => {
    let randomStr = (Math.random() + 1).toString(36).substring(7);
    const resUpdatedPhone = await request(server).patch('/api/v1/phones/' + specificPhone._id).send({
      "type": randomStr,
    })
    expect(resUpdatedPhone.statusCode).toEqual(200)
    expect(resUpdatedPhone.body.type).toEqual(randomStr)
  })

  it('should fail to update because of color', async () => {
    const resUpdatedPhone = await request(server).patch('/api/v1/phones/' + specificPhone._id).send({
      "color": 'unknownColor',
    })
    expect(resUpdatedPhone.statusCode).toEqual(422)
    expect(resUpdatedPhone.body).toHaveProperty('errors')
    expect(resUpdatedPhone.body.errors[0].param).toEqual('color')
  })

  it('should create a specific phone and delete it', async () => {
    let randomStr = (Math.random() + 1).toString(36).substring(7);
    var hrTime = process.hrtime()
    const res = await request(server).post('/api/v1/phones/').send({
      "type": "object which is going to be deleted after",
      "serial": randomStr + hrTime,
      "color": Colors.BLACK,
      "metaData": "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a02",
      "shouldntbeAdded":"ccc"
    })
    expect(res.statusCode).toEqual(200)
    expect(res.body.shouldntbeAdded).toEqual(undefined)
    expect(res.body.color).toEqual(Colors.BLACK)

    const resDeleted = await request(server).delete('/api/v1/phones/' + res.body._id)
    expect(resDeleted.statusCode).toEqual(204)
  })

  it('should fail to create because unique key', async () => {
    const res = await request(server).post('/api/v1/phones/').send({
      "type": "fail save because same serial number",
      "serial": specificPhone.serial,
      "color": Colors.BLACK,
      "metaData": "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a02",
    })
    expect(res.statusCode).toEqual(422)
    expect(res.body).toHaveProperty('errors')
    expect(res.body.errors[0].param).toEqual('serial')
  })

  it('should fail to create because metaData', async () => {
    let randomStr = (Math.random() + 1).toString(36).substring(7);
    var hrTime = process.hrtime()
    const res = await request(server).post('/api/v1/phones/').send({
      "type": "should fail because meta data not valid",
      "serial": randomStr + hrTime,
      "metaData": "123",
    })
    expect(res.statusCode).toEqual(422)
    expect(res.body).toHaveProperty('errors')
    expect(res.body.errors[0].param).toEqual('metaData')
  })

  it('should fail to create because few reasons (type length and metaData is missing)', async () => {
    let randomStr = (Math.random() + 1).toString(36).substring(7);
    var hrTime = process.hrtime()
    const res = await request(server).post('/api/v1/phones/').send({
      "type": "so",
      "serial": randomStr + hrTime,
    })
    expect(res.statusCode).toEqual(422)
    expect(res.body).toHaveProperty('errors')
    expect(res.body.errors.length).toEqual(2)
  })

  afterAll(async () => {
    await server.close();
  });
})