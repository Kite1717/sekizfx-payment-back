const express = require('express');
const app = express();
const { sequelize } = require('./models/index');
const bodyParser = require('body-parser'); 

var cors = require('cors')
// Settings
const PORT = process.env.PORT || 4200;
app.use(cors())
// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use(require('./routes'));


//Start
app.listen(PORT, function () {
  console.log(`Example app listening on PORT : ${PORT}`);

  sequelize.authenticate().then(() => {
      console.log('We have connected to the database');
  })
});