const express = require('express');
const http = require('http');
const app = express();
const cors = require('cors');
const fs = require("fs");
const bcrypt = require('bcrypt');
const path = require("path");
const bodyParser = require('body-parser');
// const { user } = require('pg/lib/defaults');
const users = require('./data').userCredentials;
const server = http.createServer(app);
module.exports = { app };

// middleware
app.use(cors());
app.use(express.json()); //req.body

var sql = require("mssql");

var dbConfig = {
    server: "localhost",
    user: "test",
    password: "dylan",
    database: "FuelApplication",
    trustServerCertificate: true,
    parseJson: true
};

// ROUTES
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './client')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './client/main.html'));
});
app.get('/register', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/register.html'));
});
app.get('/profile', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/Profile_Page.html'));
});
app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/login.html'));
});

app.post('/register', async(req, res) => {
    try {
        var conn = new sql.ConnectionPool(dbConfig);
        let hashPassword = await bcrypt.hash(req.body.password, 10);

        conn.connect().then(function() {
                var request = new sql.Request(conn);
                request.query("SELECT * FROM UserCredentials WHERE UserLogin='" + req.body.username + "'").then(function(recordset) {
                        console.log(recordset);
                        if (recordset.rowsAffected != 0) {
                            res.send("<div align ='center'><h2 style='font-size: 50px'>Username unavailable, please try again</h2></div><br><br><div align='center'><a style='font-size: 30px' href='./register.html'>Back to Register</a></div>");
                            conn.close();
                        } else {
                            request.query("INSERT INTO UserCredentials (UserLogin, UserPassword) VALUES ( '" + req.body.username + "','" + hashPassword + "')").then(function(recordset) {
                                    res.send("<div align ='center'><h2 style='font-size: 50px'>Registration Successful</h2></div><br><br><div align='center'><a style='font-size: 30px' href='/login'>Log In</a></div><br><br><div align='center'><a style='font-size: 30px' href='/profile'>Finish Profile</a></div></div><br><br><div align='center'><a style='font-size: 30px' href='/register'>Register Another User</a></div>");
                                    conn.close();
                                })
                                .catch(function(err) {
                                    console.log(err);
                                    conn.close();
                                });
                        }
                    })
                    .catch(function(err) {
                        console.log(err);
                        conn.close();
                    });
            })
            .catch(function(err) {
                console.log(err);
            });
    } catch (err) {
        console.log(err.message);
        res.send("Internal server error");
    }
});

app.post('/login', async(req, res) => {
    try {
        var conn = new sql.ConnectionPool(dbConfig);
        const username = req.body.username;
        const submittedPass = req.body.password;

        conn.connect().then(function() {
                var request = new sql.Request(conn);
                request.query("SELECT UserPassword FROM UserCredentials WHERE UserLogin='" + req.body.username + "'").then(function(recordset) {
                        if (recordset.rowsAffected == 0) {
                            res.send("<div align ='center'><h2 style='font-size: 50px'>Invalid username or password, please try again.</h2></div><br><br><div align='center'><a style='font-size: 30px' href='./login.html'>Back to Login<a><div>");
                            conn.close();
                            return;
                        } else {
                            console.log(recordset.recordsets[0][0].UserPassword);
                            let hashedPassword = recordset.recordsets[0][0].UserPassword;
                            (async function() {
                                const passwordMatch = await bcrypt.compare(submittedPass, hashedPassword);
                                if (passwordMatch) {
                                    res.send(`<div align ='center'><h2 style='font-size: 50px'>Login Successful</h2></div><br><br><br><div align ='center'><h3 style='font-size: 50px'>Hello ${req.body.username}</h3></div><br><br><div align='center'><a style='font-size: 50px' href='./hub.html'>Client Portal</a></div>`);
                                } else {
                                    res.send("<div align ='center'><h2 style='font-size: 50px'>Invalid username or password, please try again.</h2></div><br><br><div align='center'><a style='font-size: 30px' href='./login.html'>Back to Login<a><div>");
                                }
                            })();
                            conn.close();
                        }
                    })
                    .catch(function(err) {
                        console.log(err);
                        conn.close();
                    });
            })
            .catch(function(err) {
                console.log(err);
            });
    } catch {
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

app.post('/fuel', async(req, res) => {
    try {
        let USER = 2;
        const found = users.some(user => user.username === parseInt(req.body.username));
        console.log(found);
        let userGall = req.body.gallons;
        let addrs = users.find((data) => req.body.address === data.address)
        let deldate = req.body.date;
        let sugGall = req.body.suggestedGallon;
        let total = req.body.total_value;

        sql.connect(config, function(err) {

            var connection = new sql.Request();
            if (err) {
                console.log(err);
                return;
            }
            connection.query("INSERT INTO FuelQuote (Gallons, DeliveryAddress, DeliveryDate, SuggestedPrice, Total) VALUES ( '" + req.body.userGall + "','" + req.body.addrs + "','" + 
            req.body.deldate + "','" + req.body.sugGall + "','" + req.body.total_value + "','" + USER + "')", function(err,recordset){
              console.log("in query function");
              if (err) {
                  console.log(err);
                  return;
              }
          });
          connection.query();               
      });


        res.send("<div align ='center'><h2 style='font-size: 50px'>Submission Successful</h2></div><br><br><div align='center'><a style='font-size: 30px' href='./fuel.html'>Log In</a></div><br><br><div align='center'><a style='font-size: 30px' href='./fuel.html'>");
       
    } catch {
        console.log(err.message);
        res.send("Internal server error");
    }
});
app.get('/history', function(req, res) {
    // try{
    let foundUser = users.find((data) => req.body.username === data.username);
    // for(const property in foundUser.requests){
    //   res.send(<td><script>users.requests[property].userGall</script></td>);
    //  res.send(<td><script>users.requests[property].addrs</script></td>);
    //  res.send(<td><script>users.requests[property].deldate</script></td>);
    // res.send(<td><script>users.requests[property].sugGall</script></td>);
    // res.send(<td><script>users.requests[property].total</script></td>);
    // }
    sql.connect(config, function(err) {

        var connection = new sql.Request();
        if (err) {
            console.log(err);
            return;
        }
        connection.query("SELECT * FROM FuelQuote;", function(err, recordset) {
            console.log("in query function");
            if (err) {
                console.log(err);
                return;
            } else {
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
