const express = require('express');
const rotas = require('./Rotas.js');



module.exports =  app => {
    app.use(express.json(), rotas);
}
