import { Router } from "express";
const router = Router();
import jwt from 'jsonwebtoken';
/** import controllers */
import * as controller from '../controllers/controller.js';

/** Questions Routes API */
function authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) return res.status(401).send('Token is missing');
    
        jwt.verify(token, 'secretkey', (err, user) => {
            if (err) return res.status(403).send('Invalid token');
            req.user = user;
            next();
        });
    }
router.route('/questions',authenticateToken)
        .get(controller.getQuestions) /** GET Request */
        .post(controller.insertQuestions) /** POST Request */
        .delete(controller.dropQuestions) /** DELETE Request */

router.route('/result',authenticateToken)
        .get(controller.getResult)
        .post(controller.storeResult)
        .delete(controller.dropResult)

export default router;