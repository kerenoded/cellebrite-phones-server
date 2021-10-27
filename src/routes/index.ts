import { Router } from 'express';
import { api } from './api';
const router = Router();

router.use('/api', api);

export { router as routes };
