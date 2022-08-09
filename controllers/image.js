const Clarifai = require('clarifai') ;

const app = new Clarifai.App({
  apiKey: 'f7a7eaa7139c41edae3fbfaddd32739a'
 });

 const handleApiCall = (req, res) => {
  app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
  .then(data => res.json(data))
  .catch(err => res.status(400).json("Unable to commmunicate with API."));
 }

const handleImage = (req, res, db) => {
    const { id } = req.body;
    
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json("Unable to get entries at this time"));
}

module.exports = {
  handleImage,
  handleApiCall
}
