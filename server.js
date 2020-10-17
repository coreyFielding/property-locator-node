const path = require("path");
const express = require("express");
const logger = require('morgan')
import { sendResponse } from './app/helpers'
import {fetchProperties} from "./app/scraper";

const root = __dirname
const app = express()
const PORT = process.env.PORT || 8080;

app.set('port', PORT)
app.use(logger('dev'))
app.use(express.static(path.join(root, 'public')))

app.get('/', async (req, res, next) => {
  sendResponse(res)(fetchProperties())
})

app.get('/property', (req, res, next) => {
  res.send(sendResponse(res)(fetchProperties()))
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}...`);
});
