const express = require('express');
const bcrypt = require("bcrypt-nodejs");
const cors =  require('cors');

const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const image = require('./controllers/image');
const profile = require('./controllers/profile');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    port : 5432,
    user : 'oakhator',
    password : '',
    database : 'app_db'
  }
});

// db.select('*').from('users').then(data=>{
//     console.log(data)
// });

const app = express();

// app.use(express.urlencoded({extension: true}));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json("success");
});

app.post('/signin', (req, res) => { signin.handleSignIn(req, res, bcrypt, db)});

app.post('/register', (req, res)=> { register.handleRegister(req, res, bcrypt, db) });

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)});

app.put('/image', (req, res) => {image.handleImage(req, res, db)});

app.post('/imageUrl', (req, res) => {image.handleApiCall(req, res)});

// Load hash from your password DB.

app.listen(3001, () => {
    console.log("App is live baby!");
});
