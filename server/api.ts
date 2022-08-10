import { Router } from "express";
import User from "./models/user";
const router = Router(); // not sure what exactly this does

router.get('/getusers', (req, res) => {
    User.find({}).then((users) => { // finds all users
        res.json(users);
    }).catch(err => {
        res.status(400).send(err); // sends a 400 bad request error, maybe there are better error codes for this
    });
});

router.get('/adduser', (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        avatar: req.body?.avatar // optional field
    });
    user.save().then(() => {
        res.send('New user added successfully');
    }).catch(err => {
        res.status(400).send(err);
    });
});


export default router;