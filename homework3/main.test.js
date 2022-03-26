const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./');
const { User } = require('./main');



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
                expect(res.body.username).toBe(username);
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

    it('should return validation errors if request is invaild', (done) => {
        request(app)
            .post('/register')
            .send({
                username: "asdvsdf",
                password: "sd3"
            })
            .expect(400)
            .end(done);
    });

    it('should not create user if username in use', (done) => {
        request(app)
            .post('/register')
            .send({
                username: users[0].username,
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
                username: users[1].username,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).not.toBeNull();
            })
            .end((err, res) => {
                if (err) return done(err);

                User.findById(users[1]._id).then((user) => {
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
                username: users[1].username,
                password: users[1].password + '1'
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeUndefined();
            })
            .end((err, res) => {
                if (err) return done(err);

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(1)
                    done();
                }).catch((err) => done(err));
            })
    });
});