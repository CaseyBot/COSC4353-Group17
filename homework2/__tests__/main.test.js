const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../');
const { User } = require('./../main');
const { userCredentials } = require('../data');


describe('POST /register', () => {
    it('should create a user', (done) => {
        var username = "exuser";
        var password = "12345678!";

        request(app)
            .post('/register')
            .send({ username, password })
            .expect((res) => {
                expect(res.headers['x-auth']).not.toBeNull();
                expect(res.body._id).not.toBeNull();
                expect(res.body.username).toBe("exuser");
            })
            .end((err) => {
                if (err) return done(err);

                User.findOne({ username }).then((user) => {
                    expect(user).not.toBeNull();
                    expect(user.password).not.toBe(password);
                    done();
                });
            });
    });

    it('should not create user if username in use', (done) => {
        request(app)
            .post('/register')
            .send({
                username: userCredentials[0].username,
                password: "12345670"
            })
            .expect(400)
            .end(done);
    });
});


describe('POST /login', () => {
    it('Should login user and return auth token', (done) => {
        request(app)
            .post('/login')
            .send({
                username: userCredentials[1].username,
                password: userCredentials[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).not.toBeNull();
            })
            .end((err, res) => {
                if (err) return done(err);

                User.findById(userCredentials[1]._id).then((user) => {
                    expect(user.tokens[1]).toHaveProperty('access', 'auth');
                    expect(user.tokens[1]).toHaveProperty('token', res.headers['x-auth']);
                    done();
                }).catch((err) => done(err));
            })
    });

    it('Should reject invalid login', (done) => {
        request(app)
            .post('/login')
            .send({
                username: "bad",
                password: "login"
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeUndefined();
            })
            .end((err, res) => {
                if (err) return done(err);

                User.findById(userCredentials[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(1)
                    done();
                }).catch((err) => done(err));
            })
    });
});

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
});
