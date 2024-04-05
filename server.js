import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { config } from 'dotenv';
import router from './router/route.js';
/** import connection file */
import connect from './database/conn.js';
import bcrypt  from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from './models/user.js';
const app = express()

/** app middlewares */
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
config();
/** appliation port */
const port = process.env.PORT || 8080;
/** routes */
app.use('/api',router) /** apis */

app.post('/api/register', async (req, res) => {
    // console.log(req.body);
    try {
        const { username,} = req.body;
        const password = await bcrypt.hash(req.body.password, 10);
        const user = new User({ username, password });
        await user.save();
        res.status(201).send('User created successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Login
 app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username});
    if (!user) {
        res.status(401).send('Invalid username');
    } else {
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            const token = jwt.sign({ username: user.username }, 'secretkey');
            res.status(200).json({ username,token });
        }
        else{
            res.status(401).send('Invalid password');
        }
        
    }
});

// 5. Verify JWT tokens
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


/** start server only when we have valid connection */
connect().then(() => {
    try {
        app.listen(port, () => {
            console.log(`Server connected to http://localhost:${port}`)
        })
    } catch (error) {
        console.log("Cannot connect to the server");
    }
}).catch(error => {
    console.log("Invalid Database Connection");
})

