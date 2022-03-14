const express = require('express');
const http = require('http');
const app = express();
const cors = require('cors');
const fs = require("fs");
const bcrypt = require('bcrypt');
const path = require("path");
const bodyParser = require('body-parser');
const users = require('./data').userCredentials;
//const pool = require('./db');
const server = http.createServer(app);

// middleware
app.use(cors());
app.use(express.json()); //req.body

// ROUTES
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './client')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './client/main.html'));
});

app.post('/register', async(req, res) => {
    try {
        let foundUser = users.find((data) => req.body.username === data.username);
        if (!foundUser) {

            let hashPassword = await bcrypt.hash(req.body.password, 10);

            let newUser = {
                id: Date.now(),
                username: req.body.username,
                password: hashPassword,
            };
            users.push(newUser);
            console.log('User list', users);
            res.send("<div align ='center'><h2 style='font-size: 50px'>Registration Successful</h2></div><br><br><div align='center'><a style='font-size: 30px' href='./login.html'>Log In</a></div><br><br><div align='center'><a style='font-size: 30px' href='./register.html'>Register Another User</a></div>");
        } else {
            res.send("<div align ='center'><h2 style='font-size: 50px'>Username unavailable, please try again</h2></div><br><br><div align='center'><a style='font-size: 30px' href='./register.html'>Back to Register</a></div>");
        }
    } catch {
        res.send("Internal server error");
    }
});

app.post('/login', async(req, res) => {
    try {
        let foundUser = users.find((data) => req.body.username === data.username);
        if (foundUser) {

            let submittedPass = req.body.password;
            let storedPass = foundUser.password;

            const passwordMatch = await bcrypt.compare(submittedPass, storedPass);

            if (passwordMatch) {
                let usrname = foundUser.username;
                res.send(`<div align ='center'><h2 style='font-size: 50px'>Login Successful</h2></div><br><br><br><div align ='center'><h3 style='font-size: 50px'>Hello ${usrname}</h3></div><br><br><div align='center'><a style='font-size: 50px' href='./hub.html'>Client Portal</a></div>`);
            } else {
                res.send("<div align ='center'><h2 style='font-size: 50px'>Invalid username or password, please try again.</h2></div><br><br><div align ='center'><a style='font-size: 30px' href='./login.html'>login again</a></div>");
            }
        } else {

            let fakePass = `$2b$$10$ifgfgfgfgfgfgfggfgfgfggggfgfgfga`;
            await bcrypt.compare(req.body.password, fakePass);

            res.send("<div align ='center'><h2 style='font-size: 50px'>Invalid username or password, please try again.</h2></div><br><br><div align='center'><a style='font-size: 30px' href='./login.html'>Back to Login<a><div>");
        }
    } catch {
        res.send("Internal server error");
    }
});
app.post('/profile',async(req ,res) => {
    try{
    let newData = new userModel(req.body)
    let account={
        "name":req.body.name,
        "address1":req.body.add1,
        "address2":req.body.add2,
        "city":req.body.city,
        "state":req.body.state,
        "zipcode":req.body.zip,
    }
    let newObj = {};

    userModel.findByIdAndUpdate({'username':req.body.username}, { $set: account }, { upsert: true, new: true })
    }
    catch{

        res.send("Internal server error");
    }
});
app.post('/fuel', async(req,res) => {
    try {
        let userGall = req.body.gallons;
        let addrs = users.find((data) => req.body.address === data.address)
        let deldate = req.body.date;
        let sugGall = req.body.suggestedGallon;
        let total = req.body.total_value;

        res.send("<div align ='center'><h2 style='font-size: 50px'>Submission Successful</h2></div><br><br><div align='center'><a style='font-size: 30px' href='./fuel.html'>Log In</a></div><br><br><div align='center'><a style='font-size: 30px' href='./fuel.html'>");

        }
    } catch {
        res.send("Internal server error");
    }
});


// set up the server listening at port 5000 (the port number can be changed)
app.listen(5500, () => {
    console.log("server has started on port 5500");
});
