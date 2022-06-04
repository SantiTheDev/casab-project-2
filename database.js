const mongoose = require('mongoose')

const URI = 'mongodb://localhost/prueba_casab'

// db connection
//const URI    = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.BDNAME}.qqshxbr.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(URI,
    { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log('Database accessed'))
.catch(e => console.log('error to connect database:', e))

module.exports = mongoose 