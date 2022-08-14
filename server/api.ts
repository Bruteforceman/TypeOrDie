import { Router } from "express";
import { ensureLoggedIn, loginUser, logoutUser, registerUser } from "./auth";
import User from "./models/user";
const router = Router(); // not sure what exactly this does

// only for testing purposes, must remove it later
router.get('/getusers', (req, res) => {
    User.find({}).then((users) => res.json(users));
});

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/whoami', ensureLoggedIn, (req, res) => {
    // it is guaranteed someone is logged in
    const username = req.session.username as string;
    res.send(`${username}@gmail.com`);
})

export default router;