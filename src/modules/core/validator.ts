import {  validationResult, ValidationChain, param, Result,ValidationError, query ,oneOf} from 'express-validator'

export const pIdValidator: ValidationChain = param('id').isMongoId() 

export const limitValidator: ValidationChain = query('limit').optional().isInt().withMessage('Limit must be a number')
export const fromIdValidator: ValidationChain = query('fromId').optional().isMongoId().withMessage('Id is not valid')
export const searchTextValidator: ValidationChain = query('searchText').optional().isLength({ max: 100 }).withMessage('Search text has to be up to 100 characters long')
export const filterByColorValidator: ValidationChain = query('filterByColor').optional().isLength({ min: 2, max: 25 }).withMessage('Filter by color has to be between 2 and 25 characters long')

export const validate = validations => {
    return async (req, res, next) => {
      await Promise.all(validations.map(validation => validation.run(req)));
  
      const errors: Result<ValidationError> = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }
  
      res.status(422).json({ errors: errors.array() });
    };
};

