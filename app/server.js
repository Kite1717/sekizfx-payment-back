const express = require('express');
const app = express();
const { sequelize } = require('./models/index');
var cors = require('cors')
// Settings
const PORT = process.env.PORT || 4000;
app.use(cors())
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use(require('./routes'));


//Start
app.listen(PORT, function () {
  console.log(`Example app listening on PORT : ${PORT}`);

  sequelize.authenticate().then(() => {
      console.log('We have connected to the database');
  })
});