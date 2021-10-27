import { PhoneContext } from '../models/phone-model';
import * as phonesService from '../services';
import express from "express";

export async function createNewPhone(req: express.Request, res: express.Response, next) {
  try {
    let pc: PhoneContext = req.body
    const phone = await phonesService.savePhone(pc)
    res.status(200).json( phone );
  } catch (err){
    console.error('createNewPhone', err);
    res.status(500).send({ error: "Server Error, Couldn't create phone" })
  }
}

export async function updatePhone(req: express.Request, res: express.Response, next) {
  try {
    const phoneId: string = req.params.id
    let pc: PhoneContext = req.body;
    const phone = await phonesService.updatePhone(phoneId, pc)
    res.status(200).json( phone );
  } catch (err){
    console.error('updatePhone', err);
    res.status(500).send({ error: "Server Error, Couldn't update phone" })
  }
}

export async function getPhones(req: express.Request, res: express.Response, next) {
  try {
    const {searchText, limit, fromId, filterByColor} = req.query
    const phones = await phonesService.getPhones(searchText, parseInt(limit as string) || 5, fromId, filterByColor)
    res.status(200).json( phones );
  } catch (err){
    console.error('getPhones', err);
    res.status(500).send({ error: "Server Error, Couldn't get phone" })
  }
}
export async function getPhone(req: express.Request, res: express.Response, next) {
  try {
    const phoneId: string = req.params.id
    const phone = await phonesService.getPhoneById(phoneId)
    res.status(200).json(phone)
  } catch (err){
    console.error('getPhone', err);
    res.status(500).send({ error: "Server Error, Couldn't get phone" })
  }
}

export async function deletePhone(req: express.Request, res: express.Response, next) {
  try {
    const phoneId: string = req.params.id
    await phonesService.deletePhoneById(phoneId)
    res.status(204).send()
  } catch (err){
    console.error('deletePhone', err);
    res.status(500).send({ error: "Server Error, Couldn't delete phone" })
  }
}





