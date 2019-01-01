const express = require("express");
const cors = require('cors');
const app = express();

var indexRouter = require('./index');
var speciesRouter = require('./species');

app.use(cors())

app.use("/api/index", indexRouter)

app.use("/api/species", speciesRouter)

module.exports = app