import express from 'express';
import { getPhones, getPhone, deletePhone, createNewPhone, updatePhone } from '../../../../modules/phones/middlewares';
import { createPhoneSchema } from '../../../../modules/phones/models/validation-schema';
import { checkSchema} from 'express-validator'
import { validate, pIdValidator, limitValidator,  fromIdValidator, searchTextValidator, filterByColorValidator} from '../../../../modules/core/validator'
const router = express.Router();

router.get('/', validate([limitValidator, fromIdValidator, searchTextValidator, filterByColorValidator]), getPhones);
router.get('/:id', validate([pIdValidator]), getPhone);
router.delete('/:id', validate([pIdValidator]), deletePhone);
router.post('/', validate(checkSchema(createPhoneSchema)), createNewPhone);
router.patch('/:id', validate([pIdValidator]), validate(checkSchema(createPhoneSchema)), updatePhone);

export { router as phones };
