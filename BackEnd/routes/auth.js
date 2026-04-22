const express = require('express');
const User = require('../models/User');
const router = express.Router(); 
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = process.env.JWT_SECRET || 'Aakshatisagoodb$oy';
// Route 1: Create a User using: POST "/api/auth/createuser". Doesn't require Auth
router.post('/createuser',[
    body('name','Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password','Password must be at least 5 characters').isLength({ min: 5 })
], async(req, res)=>{ 
    // If there are errors return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Check whether the user with this email exists already
    try {
        let user = await User.findOne({email: req.body.email})
        if(user){
            return res.status(400).json({error: 'Sorry a user with this email already exists'})
        }
        // Create a new user 
        const salt= await bcrypt.genSalt(10)
        const secPass= await bcrypt.hash(req.body.password,salt)
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        });

        const data={
            user:{
                id: user.id
            }
        }
        const authToken= jwt.sign(data, JWT_SECRET)
        console.log(authToken);
        // res.json(user)
        res.json({authToken})
    } catch(error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
} )
// Route 2: Authenticate a User using: POST "/api/auth/login". Doesn't require Auth
router.post('/login',[
    body('email', 'Enter a valid email').isEmail(),
    body('password','Password cannot be blank').exists()
], async(req, res)=>{ 
    // If there are errors return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const{email, password} = req.body;
    try {
        let user= await User.findOne({email});
        if(!user) {
            return res.status(400).json({error: "Please try to login with correct credentials"})
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare) {
            return res.status(400).json({error: "Please try to login with correct credentials"})
        }

        const data={
            user: {
                id: user.id
            }
        }
        const authToken= jwt.sign(data, JWT_SECRET); 
        res.json({authToken})
    } catch(error) { 
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})

// Route 3: Get logged in User details using: POST "/api/auth/getuser". Login Required
router.post('/getuser',fetchuser, async(req, res)=>{ 
try {
    
    const userId=req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error")
} }
)

module.exports = router