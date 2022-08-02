const express = require('express');
const bcrypt = require("bcrypt-nodejs");
const cors =  require('cors');

const knex = require('knex');
const { response } = require('express');

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

app.post('/signin', (req, res) => {
     
    const { email, password } = req.body;

   db.select('email', 'hash').from('login')
   .where('email', '=' , email )
   .then(data => {
    const isValid = bcrypt.compareSync(password, data[0].hash);
        if(isValid) {
            db.select('*').from('users')
            .where('email', '=', email)
            .then(user => {
                res.json(user[0])
            })
            .catch(err => res.status(400).json("Unable to get user"));
        } else {
            res.status(400).json("Wrong credentials");
        }
   })
   .catch(err => res.status(400).json("wrong credentials"))
});

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const hash = bcrypt.hashSync(password);

    db.transaction(trx =>  {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return  trx('users')
            .returning('*')
            .insert({
                name: name,
                email: loginEmail[0].email
            })
            .then(user => {
                res.json(user[0]);
            })
            .catch(err => {
                res.status(400).json(err);
            });
        })
        .then(trx.commit)
        .catch(trx.rollback)
    });
});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    // let found =  false

    db.select('*').from('users').where({ id })
    .then(user => {
        if(user.length) {
            res.json(user[0]);
        } else {
            res.status(400).json("User not found");
        }
    })
    .catch(err => res.status(400).json("Error getting user"));
});

app.put('/image', (req, res) => {
    const { id } = req.body;
    
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json("Unable to get entries at this time"));
})

// Load hash from your password DB.

app.listen(3001, () => {
    console.log("App is live baby!");
});
