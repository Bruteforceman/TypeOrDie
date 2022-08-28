import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { config } from "dotenv"
import { Request, Response, NextFunction } from 'express';
import { compare, hash } from 'bcrypt';
import User from './models/user';
config();

// handles both authentication and authorization

// AUTHENTICATION

// use 403 http code for failed authentication
// 403 is the http code for Forbidden status

export async function registerUser(req : Request, res : Response) {
    const username = req.body.username;
    const password = req.body.password;
    const email    = req.body.email;
    const hashedPassword = await hash(password, 5); // 5 is the number of salt rounds

    if (await User.exists({ username: username }) !== null) {
        return res.json({ success: false, message: 'Username already exists' });
    }
    if (await User.exists({ email : email }) !== null) {
        return res.json({ success: false, message: 'Another account with the same email already exists' });
    }
    const newUser = new User ({
        username: username,
        password: hashedPassword,
        email: email,
        top_score: 0
    });
    newUser.save().then(() => {
        req.session.username = username;
        res.json({ success: true, message: 'New user successfully registered' });
    });
}
export async function loginUser(req : Request, res : Response) {
    const username = req.body.username;
    const password = req.body.password;
    const user = await User.findOne({ username: username });
    if(user !== null && await compare(password, user.password)) {
        req.session.username = user.username;
        res.json({ success: true, message: 'User successfully authenticated' });
    } else {
        req.session.username = null;
        res.json({ success: false, message: `Username and password don't match` });
    }
}

export function logoutUser(req : Request, res : Response) {
    req.session.username = null;
    res.json({ success: true, message: 'Logged out' })
}

export function ensureLoggedIn(req : Request, res : Response, next : NextFunction) {
    if(req.session.username != null) { // checks for both null and undefined
        next();
    } else {
        res.json({ success: false, message: 'You must be logged in to access this page' });
    }
}

export async function updatetopscore(req: Request, res: Response){
    const username = req.body.username;
    const user = await User.findOne({ username: username });
    if(user !== null){ 
        if(req.body.top_score > user.top_score){     
            user.top_score = req.body.top_score;
            user.save();
        }
        res.json({ success: true, message: `Updated top score` });
    }
}