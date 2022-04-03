const express = require('express');
const http = require('http');
const app = express();
const cors = require('cors');
const fs = require("fs");
const bcrypt = require('bcrypt');
const path = require("path");
const bodyParser = require('body-parser');
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
app.get('/history', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/quote_history.html'));
});

let userID = 1;

app.post('/register', async(req, res) => {
    try {
        var conn = new sql.ConnectionPool(dbConfig);
        let hashPassword = await bcrypt.hash(req.body.password, 10);

        conn.connect().then(function() {
                var request = new sql.Request(conn);
                request.query("SELECT * FROM UserCredentials WHERE UserLogin='" + req.body.username + "'").then(function(recordset) {
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
                            let hashedPassword = recordset.recordsets[0][0].UserPassword;
                            (async function() {
                                const passwordMatch = await bcrypt.compare(submittedPass, hashedPassword);
                                if (passwordMatch) {
                                    conn.connect().then(function() {
                                            var request = new sql.Request(conn);
                                            request.query("SELECT UserID FROM UserCredentials WHERE UserLogin='" + req.body.username + "'").then(function(recordset) {
                                                    console.log(recordset.recordsets[0][0].UserID);
                                                    userID = recordset.recordsets[0][0].UserID;
                                                })
                                                .catch(function(err) {
                                                    console.log(err);
                                                    conn.close();
                                                });
                                        })
                                        .catch(function(err) {
                                            console.log(err);
                                            conn.close();
                                        })
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

app.post('/profile', async(req, res) => {
    try {
        var conn = new sql.ConnectionPool(dbConfig);

        conn.connect().then(function() {
                var request = new sql.Request(conn);
                request.query("INSERT INTO ClientInformation VALUES ( '" + req.body.name + "','" + req.body.add1 + "','" +
                        req.body.add2 + "','" + req.body.city + "','" + req.body.state + "','" + req.body.zip + "','" + userID + "')").then(function(recordset) {})
                    .catch(function(err) {
                        console.log(err);
                        conn.close();
                    });
            })
            .catch(function(err) {
                console.log(err);
            });
        res.send("<div align ='center'><h2 style='font-size: 50px'>Profile Finished</h2></div><br><br><div align='center'><a style='font-size: 30px' href='./login.html'>Log In</a></div><br><br>");
    } catch (err) {
        res.send("Internal server error");
    }
});

app.post('/fuel', async(req, res) => {
    try {
        var conn = new sql.ConnectionPool(dbConfig);

        conn.connect().then(function() {
                var request = new sql.Request(conn);
                request.query("SELECT Address1 FROM ClientInformation WHERE UserID=" + userID).then(function(recordset) {
                        let userAddress = recordset.recordsets[0][0].Address1;
                        console.log(userAddress);
                        request.query("INSERT INTO FuelQuote VALUES ( '" + req.body.gallons + "','" + userAddress + "','" + req.body.date + "','" +
                                req.body.suggestedPrice + "','" + req.body.total_value + "','" + userID + "')").then(function(recordset) {

                            })
                            .catch(function(err) {
                                console.log(err);
                                conn.close();
                            });
                    })
                    .catch(function(err) {
                        console.log(err);
                        conn.close();
                    })
            })
            .catch(function(err) {
                console.log(err);
            });

        res.send("<div align ='center'><h2 style='font-size: 50px'>Submission Successful</h2></div><br><br><div align='center'><a style='font-size: 30px' href='./hub.html'>Back To Hub</a></div><br><br><div align='center'><a style='font-size: 30px' href='./fuel.html'>");

    } catch (err) {
        console.log(err.message);
        res.send("Internal server error");
    }
});

app.get('/history', function(req, res) {
    try {
        var conn = new sql.ConnectionPool(dbConfig);
        var request = new sql.Request(conn);

        conn.connect().then(function() {
                request.query("SELECT * FROM FuelQuote WHERE UserID =" + userID).then(function(recordset) {
                        // var myArr = new Array();
                        // var gal = recordset.recordsets[0][0].Gallons;
                        // var addr = recordset.recordsets[0][0].DeliveryAddress;
                        // var date = recordset.recordsets[0][0].DeliveryDate;
                        // var price = recordset.recordsets[0][0].SuggestedPrice;
                        // var total = recordset.recordsets[0][0].Total;
                        // myArr.push({ 'gal': gal, 'addr': addr, 'date': date, 'price': price, 'total': total });
                        // res.json(recordset.recordsets[0]);
                        res.json(recordset.recordsets)
                            // res.json('list', { page_title: "History", data: rows });
                        conn.close();
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
        console.log("hi");
        console.log(err.message);
    }

});

// set up the server listening at port 5000 (the port number can be changed)
app.listen(5500, () => {
    console.log("server has started on port 5500");
});
