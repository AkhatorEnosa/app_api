const handleRegister = (req, res, bcrypt, db) => {
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
}

module.exports = {
  handleRegister
}
