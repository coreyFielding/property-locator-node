const path = require("path");
const express = require("express");
const logger = require('morgan')
const cors = require("cors");

import { sendResponse } from './app/helpers'
import {fetchProperties} from "./app/scraper";

const root = __dirname
const app = express()
const PORT = process.env.PORT || 5000;

app.set('port', PORT)
app.use(logger('dev'))
app.use(express.static(path.join(root, 'public')))
app.use(cors());

app.get('/', async (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  sendResponse(res)(fetchProperties())
})


app.listen(PORT, () => {
  console.log(`port ${PORT}...`);
});
