//import { expect } from '@jest/globals';

//const request = require('request')
const request = require('supertest');
 const { app } = require('../main.js');
// const { app } = require('../app');
const expect = require('@jest/globals').expect;

const express = require('express');
// app = express();
const { userCredentials } = require('./data.js');
const { JestAssertionError } = require('expect');

var username = "tahmeedzaman"
var password = "1234556789!"

//const register = require('../main')


describe('POST /register', () => {
    // jest.setTimeout(30000);
    it('should create a user', (done) => {

        request(app)
            .post('/register')
            .send({ 
                username: username,
                password: password 
            }).expect(302)

            .expect((res) => {
                expect(res.headers['x-auth']).not.toBeNull();
                expect(res.body._id).not.toBeNull();
                done();
            })
            .end((err) => {
                if (err) return done(err);

                // User.findOne({ username }).then((user) => {
                //     expect(user).not.toBeNull();
                //     expect(user.password).not.toBe(password);
                //     done();
                // });
            });
    });

    it('should not create user if username in use', (done) => {
        request(app)
            .post('/register')
            .send({
                username: username,
                password: password
            })
            .expect(302)
            .end(done);
    });
});



 describe('POST /login', () => {
     it('Should login user and return auth token', (done) => {
        var username = "exuser99kjhkjhjk";
        var password = "12345678!";
         request(app)
             .post('/login')
             .send({
                 username: "exuser99kjhkjhjk",
                 password: "12345678!"
             }) .expect(302)
             .expect((res) => {
                 expect(res.headers['x-auth']).not.toBeNull();
                 done();
             })
             .end((err) => {
                if (err) return done(err);
             });
             

//                 User.findById(userCredentials[1]._id).then((user) => {
//                     expect(user.tokens[1]).toHaveProperty('access', 'auth');
//                     expect(user.tokens[1]).toHaveProperty('token', res.headers['x-auth']);
//                     done();
//                 }).catch((err) => done(err));
             });
    

 /*    it('Should reject invalid login', (done) => {
         request(app)
             .post('/login')
             .send({
                 username: "bad",
                 password: "login"
             })
             .expect(400)
             .expect((res) => {
                 expect(res.headers['x-auth']).toBeUndefined();
                 done();
             })
             .end((err, res) => {
                 if (err) return done(err);
             });
            });*/
        });

//                 User.findById(userCredentials[1]._id).then((user) => {
//                     expect(user.tokens.length).toBe(1)
//                     done();
//                 }).catch((err) => done(err));
//             })*/
//     });
// //});

 describe('POST /profile', () => {
     it('should save profile information', (done) => {
         var name = "John Doe";
         var address1 = "100 Main St.";
         var address2 = "102 Main St.";
         var city = "Houston";
         var state = "TX";
         var zipcode = "77096";

         request(app)
             .post('/profile')
             .send({ name, address1, address2, city, state, zipcode })
             .expect((res) => {
                 expect(res.headers['x-auth']).not.toBeNull();
                 expect(res.body._id).not.toBeNull();
                 // expect(res.body.username).toBe(username);
                 done();
             })
             .end((err) => {
                 if (err) return done(err);

             
             });
     });
 });

 describe('POST /fuel', () => {
     it('should provide a fuel quote with user input',(done)=>{
         var gallons = "16" ;
         var address1 = "100 Main St.";
         var address2 = "102 Main St.";
         var suggestedPrice = "15"
         request(app)
             .post('/fuel')
             .send({ gallons, address1, address2, suggestedPrice })
             .expect((res) => {
                 expect(res.headers['x-auth']).not.toBeNull();
                 expect(res.body._id).not.toBeNull();
                 done();
             })
             .end((err) => {
                 if (err) return done(err);

             
             })

     });
 });
 

