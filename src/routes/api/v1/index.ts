import express from 'express';
import { phones } from './phones';

const router = express.Router();

router.use('/phones', phones);

export { router as v1 };
