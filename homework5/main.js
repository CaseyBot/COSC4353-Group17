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
// const { arrayBuffer } = require('stream/consumers');
// import { arrayBuffer } from 'stream-consumers';

var dbConfig = {
    server: "localhost",
    user: "test",
    password: "dylan",
    database: "FuelApplication",
    trustServerCertificate: true,
    parseJson: true,

};
let Results;
// ROUTES
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './client')));
app.engine('html', require('ejs').renderFile);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './client/main.html'));
});
app.get('/register', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/register.html'));
});
app.get('/profile', function(req, res) {
    res.render(__dirname + "/client/Profile_Page.html", { userName: userName, useradd1: useradd1, useradd2: useradd2, usercity:usercity, userstate:userstate, userzip:userzip });
});
app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/login.html'));
});
app.get('/fuel_quote', function(req, res) {
    res.render(__dirname + "/client/fuel.html", { userAddr: userAddr, inState: inState, hasHistory: hasHistory });
});

function retrieveHistory(quoteid) {
    var conn = new sql.ConnectionPool(dbConfig);
    conn.connect().then(function() {
            var quotes1 = [];
            var adds1 = [];
            var dates = [];
            var prices = [];
            var tots = [];
            var all = new Array(4);
            all[0] = new Array();
            all[1] = new Array();
            all[2] = new Array();
            all[3] = new Array();
            all[4] = new Array();
            var request = new sql.Request(conn);
            request.query("SELECT Gallons,DeliveryAddress, DeliveryDate,SuggestedPrice,Total  FROM FuelQuote WHERE UserID='" + userID + "'").then(function(recordset) {
                    if (recordset.rowsAffected == 0) {
                        hasHistory = "no";
                    } else {
                        hasHistory = "yes";
                    }

                    for (let i = 0; i < recordset.rowsAffected; i++) {

                        all[0] = all[0].concat(recordset.recordsets[0][i].Gallons);
                        all[1] = all[1].concat(recordset.recordsets[0][i].DeliveryAddress);
                        all[2] = all[2].concat(recordset.recordsets[0][i].DeliveryDate);
                        all[3] = all[3].concat(recordset.recordsets[0][i].SuggestedPrice);
                        all[4] = all[4].concat(recordset.recordsets[0][i].Total);

                    }
                    quoteid(all);
                })
                .catch(function(err) {
                    console.log(err);
                    conn.close();
                });

        })
        .catch(function(err) {
            console.log(err);
        });
}

app.get('/history', function(req, res) {
    var quotes = [];

    retrieveHistory(function(quotes) {
        res.render(__dirname + "/client/quote_history.html", { quotes: quotes });
    });

});
app.get('/main', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/main.html'));
});

app.get('/register_success', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/register_success.html'));
});
app.get('/register_fail', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/register_fail.html'));
});
app.get('/login_fail', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/login_fail.html'));
});
app.get('/login_success', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/login_success.html'));
});
app.get('/profile_finish', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/profile_finish.html'));
});
app.get('/fuel_success', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/fuel_success.html'));
});

let userAddr = "here";
let userID = 1;
let inState = "test";
let hasHistory = "test";
let userAddr = "here";
let userID = 1;
let inState = "test";
let hasHistory = "test";
let userName="";
let useradd1 = "";
let useradd2="";
let usercity="";
let userstate="";
let userzip="";
app.post('/register', async(req, res) => {
    try {
        var conn = new sql.ConnectionPool(dbConfig);
        let hashPassword = await bcrypt.hash(req.body.password, 10);
         userName="";
         useradd1 = "";
         useradd2="";
         usercity="";
         userstate="";
         userzip=""
        conn.connect().then(function() {
                var request = new sql.Request(conn);
                request.query("SELECT * FROM UserCredentials WHERE UserLogin='" + req.body.username + "'").then(function(recordset) {
                        if (recordset.rowsAffected != 0) {
                            res.redirect('/register_fail');
                            conn.close();
                        } else {
                            request.query("INSERT INTO UserCredentials (UserLogin, UserPassword) VALUES ( '" + req.body.username + "','" + hashPassword + "')").then(function(recordset) {
                                    res.redirect('/register_success');
                                    conn.close();
                                })
                                .catch(function(err) {
                                    console.log(err);
                                    conn.close();
                                });
                            request.query("SELECT UserID FROM UserCredentials WHERE UserLogin='" + req.body.username + "' AND UserPassword='" + hashPassword + "'").then(function(record) {
                                userID = record.recordsets[0][0].UserID;
                            })
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
                            res.redirect('/login_fail');
                            conn.close();
                            return;
                        } else {
                            let hashedPassword = recordset.recordsets[0][0].UserPassword;
                            (async function() {
                                const passwordMatch = await bcrypt.compare(submittedPass, hashedPassword);
                                let use = 0;
                                if (passwordMatch) {
                                    conn.connect().then(function() {
                                            var request = new sql.Request(conn);
                                            request.query("SELECT UserID FROM UserCredentials WHERE UserLogin='" + req.body.username + "'").then(function(recordset) {
                                                    userID = recordset.recordsets[0][0].UserID;
                                                    request.query("SELECT * FROM ClientInformation WHERE UserID='" + userID + "'").then(function(recordset) {
                                                        userAddr = recordset.recordsets[0][0].Address1 + ', ' + recordset.recordsets[0][0].City + ', ' + recordset.recordsets[0][0].StateID + ', ' + recordset.recordsets[0][0].ZipCode;
                                                    })
                                                    request.query("SELECT * FROM FuelQuote WHERE UserID='" + userID + "'").then(function(recordset) {
                                                        if (recordset.rowsAffected == 0) {
                                                            hasHistory = "no";
                                                        } else {
                                                            hasHistory = "yes";
                                                        }
                                                    })
                                                    request.query("SELECT * FROM ClientInformation WHERE UserID='" + userID + "'").then(function(recordset) {
                                                         userName = recordset.recordsets[0][0].FullName;
                                                         useradd1 = recordset.recordsets[0][0].Address1;
                                                        useradd2 = recordset.recordsets[0][0].Address2;
                                                        usercity = recordset.recordsets[0][0].City;
                                                        userstate = recordset.recordsets[0][0].State;
                                                        userzip= recordset.recordsets[0][0].ZipCode;
                                                        
                                                        if (recordset.recordsets[0][0].StateID.localeCompare("TX") == 0) {
                                                            inState = "yes";
                                                        } else {
                                                            inState = "no";
                                                        }
                                                    })
                                                })
                                                .catch(function(err) {
                                                    console.log(err);
                                                    conn.close();
                                                });
                                        })
                                        .catch(function(err) {
                                            console.log(err);
                                        });

                                    res.redirect('/login_success');
                                } else {
                                    res.redirect('/login_fail');
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

        userAddr = req.body.add1 + ', ' + req.body.city + ', ' + req.body.state + ', ' + req.body.zip;

        conn.connect().then(function() {
                var request = new sql.Request(conn);
                request.query("SELECT * FROM ClientInformation WHERE UserID=" + userID).then(function(recordset) {
                    if (recordset.rowsAffected == 0) {
                request.query("INSERT INTO ClientInformation(FullName, Address1, Address2, City, State, ZipCode, UserID) VALUES ( '" + req.body.name + "','" + req.body.add1 + "','" +
                        req.body.add2 + "','" + req.body.city + "','" + req.body.state + "','" + req.body.zip + "','" + userID + "')").then(function(recordset) {
                            userName = req.body.name;
                            useradd1 = req.body.add1;
                            useradd2 = req.body.add2;
                            usercity = req.body.city;
                            userstate = req.body.state;
                            userzip= req.body.zip;
                        if ("TX".localeCompare(req.body.state) == 0) {
                            inState = "yes";
                        } else {
                            inState = "no";
                        }
                    })
                    .catch(function(err) {
                        console.log(err);
                        conn.close();
                    });
                        }else{
                                //populate database then change the current entry 
                            request.query("UPDATE ClientInformation SET FullName='" + req.body.name + "',Address1='" +  req.body.add1 + "',Address2='" + req.body.add2 
                            + "', City='" + req.body.city + "', State='" + req.body.state + "',ZipCode='" + req.body.zip  + "' WHERE UserID ='" + userID  + "'").then(function(recordset) {
                                userName = req.body.name;
                                useradd1 = req.body.add1;
                                useradd2 = req.body.add2;
                                usercity = req.body.city;
                                userstate = req.body.state;
                                userzip= req.body.zip;
                                if ("TX".localeCompare(req.body.state) == 0) {
                                inState = "yes";
                            } else {
                                inState = "no";
                            }
                        })
                        .catch(function(err) {
                            console.log(err);
                            conn.close();
                        }); 
                        }

                             });
            })
            .catch(function(err) {
                console.log(err);
            });
        res.redirect('/profile_finish');
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
        res.redirect('/fuel_success');

    } catch (err) {
        console.log(err.message);
        res.send("Internal server error");
    }
});

// set up the server listening at port 5000 (the port number can be changed)
app.listen(5500, () => {
    console.log("server has started on port 5500");
});
