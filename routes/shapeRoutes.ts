import express from 'express';
import {calculateArea, getPreviousCalculations} from './../controllers/shapeController';
import {protect} from './../controllers/authController'

const router = express.Router();

router.post('/calculate', protect, calculateArea)
router.get('/get-previous-calculations', protect, getPreviousCalculations)

export default  router;