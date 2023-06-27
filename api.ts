import { Router } from "express";
import { ensureLoggedIn, loginUser, logoutUser, registerUser, updatetopscore } from "./auth";
import User from "./models/user";
const router = Router(); // not sure what exactly this does

// always add a success : boolean
// field in your json responses. 
// this makes a life a lot easier in the front-end


// only for testing purposes, must remove it later
router.get('/getusers', (req, res) => {
    User.find({}).then((users) => res.json(users));
});

router.get('/gettop', (req, res) => {
    const users = User.find({}).then((users) => res.json(
        users.filter((user) => {
            return (user.top_score !== undefined && user.top_score > 0)
        }).sort((user1, user2) => { 
            if( user1.top_score > user2.top_score)
                return -1;
            else
                return 1;
        }).map((user) => ({
            username: user.username,
            top_score: user.top_score
        }))
    ))
});


router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.put('/topscore', updatetopscore);
router.get('/whoami', ensureLoggedIn, async (req, res) => {
    // it is guaranteed someone is logged in
    const username = req.session.username as string;
    const user = (await User.findOne({ username: username }))!; // user shouldn't be null
    res.send({ username: user.username, 
                email: user.email,
                success: true });
})

export default router;