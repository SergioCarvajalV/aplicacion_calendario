const express = require('express');
require('dotenv').config();
const { dbConnection } = require('./database/config')
const cors = require('cors');

//crear sv express

const app = express();

//BDD
dbConnection();

//cors
app.use(cors())


//dir publico
app.use( express.static('public') );

//lectura y parseo body
app.use( express.json() );

//rutas

app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));


//escuchar peticiones
app.listen(process.env.PORT, ()=>{
    console.log(`corre en puerto: ${process.env.PORT}`);
})