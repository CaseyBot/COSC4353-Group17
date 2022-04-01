const express = require('express');
const http = require('http');
const app = express();
const cors = require('cors');
const fs = require("fs");
const bcrypt = require('bcrypt');
const path = require("path");
const bodyParser = require('body-parser');
const { user } = require('pg/lib/defaults');
const users = require('./data').userCredentials;
//const pool = require('./db');
const server = http.createServer(app);
// middleware
app.use(cors());
app.use(express.json()); //req.body

const router = express.Router();
const sql = require("mssql");
const { equal } = require('assert');
const config = {
    user: "test",
    password:"test" ,
    dialect: "mssql",
    server: "localhost",
    port:1433,
    database: "FuelApplication",
    debug: true,  
    trustServerCertificate: true
  };


app.get("/getDBStatus", (req, res)=>{
    db.ping((err)=>{
        if(err) return res.status(500).send("DB NULL ZIP NADA");
        req.send("DB is active");
    })
});
// ROUTES
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './client')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './main.html'));
});
app.get('/register', function (req, res) {
   res.sendFile(path.join(__dirname + '/register.html'));
    });
app.get('/profile', function (req, res) {
    res.sendFile(path.join(__dirname + '/Profile_Page.html'));
    });
app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname + '/login.html'));
    });    
//app.get("/profile", function (req, res) {
//    res.sendFile(__dirname + "/Profile_Page.html");
//});
    
    
app.post('/register', async(req, res) => {
    try {            
        console.log(req.body.password);
        let foundUser = users.find((data) => req.body.username === data.username);
        //if (!foundUser) {

            let hashPassword = await bcrypt.hash(req.body.password, 10);

            let newUser = {
                id: Date.now(),
                username: req.body.username,
                password: hashPassword,
            };        
            console.log(req.body.username);
            console.log(req.body.password);

            users.push(newUser);
            console.log('User list', users);

            sql.connect(config, function (err) {

                var connection=new sql.Request();
                if (err) {
                  console.log(err);
                  return;
                  }
              connection.query("INSERT INTO UserCredentials (UserLogin, UserPassword) VALUES ( '" + newUser.username + "','" + newUser.password + "')", function(err,recordset){
                  console.log("in query function");
                  if (err) {
                      console.log(err);
                      return;
                  }
                  else {
                      res.end(JSON.stringify(recordset)); 
                  }
              });

              connection.query();
                    
          });
        //}
            res.send("<div align ='center'><h2 style='font-size: 50px'>Registration Successful</h2></div><br><br><div align='center'><a style='font-size: 30px' href='/login'>Log In</a></div><br><br><div align='center'><a style='font-size: 30px' href='/profile'>Finish Profile</a></div></div><br><br><div align='center'><a style='font-size: 30px' href='/register'>Register Another User</a></div>");
        } 
    catch {
        res.send("Internal server error");
    }

});

        

app.post('/profile',async(req ,res) => {
    try{
        let USER= 2;
       const found = users.some(user => user.username === parseInt(req.body.username));
       console.log(found);
        let account={
            name:req.body.name,
            address1:req.body.add1,
            address2:req.body.add2,
            city:req.body.city,
            state:req.body.state,
            zipcode:req.body.zip,
        };
        sql.connect(config, function (err) {
            var connection=new sql.Request();
            if (err) {
              console.log(err);
              return;
              }
          connection.query("INSERT INTO ClientInformation (FullName, Address1, Address2, City, State, ZipCode, UserID) VALUES ( '" + account.name + "','" + account.address1 + "','" + 
            account.address2 + "','" + account.city + "','" + account.state + "','" + account.zipcode + "','" + USER + "')", function(err,recordset){
              console.log("in query function");
              if (err) {
                  console.log(err);
                  return;
              }
              else {
                  res.end(JSON.stringify(recordset)); 
              }
          });

          connection.query();
                
      });
        res.send("<div align ='center'><h2 style='font-size: 50px'>Profile Finished</h2></div><br><br><div align='center'><a style='font-size: 30px' href='./login.html'>Log In</a></div><br><br>");
    }catch(err){
        res.send("Internal server error");

    }



});
app.post('/login', async(req, res) => {
    try {
        //let foundUser = users.find((data) => req.body.username === user1.username);
        //if (foundUser) {
            var someVar = [];
            sql.connect(config, function (err) {

                var connection=new sql.Request();
                if (err) {
                  console.log(err);
                  return;
                  }
              connection.query("SELECT UserPassword FROM UserCredentials WHERE UserLogin='" + req.body.username + "'" , function(err,recordset){
               // foundUser =   
                console.log("Found User");
                  if (err) {
                      console.log(err);
                      return;
                  }
                  else {
                    Object.keys(recordset).forEach(function(key) {
                        var row = recordset[key];
                        res.send(row[0]['UserPassword']);

                      });
                  }
              });
              
                
        });
         //   let submittedPass = req.body.password;
           // let storedPass = foundUser.password;
/*
          const passwordMatch = await bcrypt.compare*(submittedPass, storedPass);

            if (passwordMatch) {
               let usrname = foundUser.username;
               console.log("Success");
               res.send(`<div align ='center'><h2 style='font-size: 50px'>Login Successful</h2></div><br><br><br><div align ='center'><h3 style='font-size: 50px'>Hello ${usrname}</h3></div><br><br><div align='center'><a style='font-size: 50px' href='./hub.html'>Client Portal</a></div>`);
            } else {
                res.send("<div align ='center'><h2 style='font-size: 50px'>Invalid username or password, please try again.</h2></div><br><br><div align ='center'><a style='font-size: 30px' href='./login.html'>login again</a></div>");
            }
        } else {

            let fakePass = `$2b$$10$ifgfgfgfgfgfgfggfgfgfggggfgfgfga`;
            await bcrypt.compare(req.body.password, fakePass);

            res.send("<div align ='center'><h2 style='font-size: 50px'>Invalid username or password, please try again.</h2></div><br><br><div align='center'><a style='font-size: 30px' href='./login.html'>Back to Login<a><div>");
        }
        */
    } catch {
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
        //push to db
        }
     catch {
        res.send("Internal server error");
    }
});
app.get('/history', function(req, res){
   // try{
    let foundUser = users.find((data) => req.body.username === data.username);
   // for(const property in foundUser.requests){
     //   res.send(<td><script>users.requests[property].userGall</script></td>);
      //  res.send(<td><script>users.requests[property].addrs</script></td>);
      //  res.send(<td><script>users.requests[property].deldate</script></td>);
       // res.send(<td><script>users.requests[property].sugGall</script></td>);
       // res.send(<td><script>users.requests[property].total</script></td>);
      // }
      sql.connect(config, function (err) {

      var connection=new sql.Request();
      if (err) {
        console.log(err);
        return;
        }
    connection.query("SELECT * FROM FuelQuote;", function(err,recordset){
        console.log("in query function");
        if (err) {
            console.log(err);
            return;
        }
        else {
            res.end(JSON.stringify(recordset));
        }
    });
    connection.query();
  
});
  });
  
// set up the server listening at port 5000 (the port number can be changed)
app.listen(5500, () => {
    console.log("server has started on port 5500");
});
