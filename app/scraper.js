const _ = require('lodash')

const {
    compose,
    composeAsync,
    enforceHttpsUrl,
    sanitize,
    arrayPairsToObject,
    fromPairsToObject,
    fetchHtmlFromUrl,
    fetchElemInnerHTML,
    fetchElemAttribute,
    extractNumber,
    extractUrlAttr
} = require('./helpers')

const BASE_URL = "https://rightmove.co.uk"

const baseRelativeUrl = url => _.isString(url) ? `${BASE_URL}${url.replace(/^\/*?/, "/")}` : null

/**
 * Composed function that extracts url from element attribute
 * resolves it to base URL and returns URL with https
 */
const extractBaseUrlAttribute = attr => compose(enforceHttpsUrl, baseRelativeUrl, fetchElemAttribute(attr))