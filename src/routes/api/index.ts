import { Colors } from './../../modules/phones/models/colors';
import express from 'express';
import { v1 } from './v1';

const router = express.Router();

//localhost/api/
router.all('/', (req, res, next) => {
    res.json({ api: 'ok' });
  }
);

router.get('/colors', (req, res, next) => {
  res.json(Object.values(Colors));
}
);

router.use('/v1', v1);

export { router as api };
