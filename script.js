const express = require('express');
const bcrypt = require("bcrypt-nodejs");
const cors =  require('cors');

const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    port : 5432,
    user : 'postgres',
    password : 'root',
    database : 'app_db'
  }
});

db.select('*').from('users').then(data=>{
    console.log(data)
});

const app = express();

const database = {
    users : [
        {
            id: "126",
            name: "Osa",
            email: "osa@email.com",
            password: "password",
            entries: 0
        },
        {
            id: "122",
            name: "Peters",
            email: "peters@email.com",
            password: "password",
            entries: 0
        },
    ],

    login : [
        {
            id: '903',
            hash: '',
            email: 'osa@gmail.com'
        }
    ]
}

// app.use(express.urlencoded({extension: true}));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json(database.users);
});

app.post('/signin', (req, res) => {
    bcrypt.compare( "somethingaboutpeter", "$2a$10$Vybv0LB0EQ2nRq1nlMGsyehe5n91ZY85r9v2amkoXqK/y7M0lTqLO", function(err, res) {
        console.log('first', res);
    });
    
    bcrypt.compare("veggies", "$2a$10$Vybv0LB0EQ2nRq1nlMGsyehe5n91ZY85r9v2amkoXqK/y7M0lTqLO", function(err, res) {
        console.log('second', res);
    });

   if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
        // res.json("success");
        res.json(database.users[0]);
   } else {
       res.status(400).json("Error signing in. Please check your login details");
   }
});

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    bcrypt.hash(password, null, null, function(err, hash) {
        // Store hash in your password DB.
        console.log(hash);
    });

    db('users')
    .returning('*')
    .insert({
        name: name,
        email: email
    }).then(response => {
        res.json('done');
    })



    // database.users.push({
    //     id: "126",
    //     name: name,
    //     email: email,
    //     password: password
    // });
});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found =  false

    database.users.forEach(user => {
        if(user.id === id) {
            found = true;
            return res.json(user);
        }
    });

    if(!found){
        res.status(400).json({
            "message": "Profile not found"
        });
    }
});

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;

    database.users.forEach(user => {
        if(user.id === id) {
            found = true;
            user.entries ++;

            return res.json(user.entries);
        }
    });

    if(!found) {
        res.status(404).json()
    }
})

// Load hash from your password DB.

app.listen(3001, () => {
    console.log("App is live baby!");
});