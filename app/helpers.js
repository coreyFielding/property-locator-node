const _ = require('lodash')
const axios = require("axios")
const cheerio = require('cheerio')

// Compose function arguments in descending order to an overall function
const compose = (...fns) => arg => {
    return _.flattenDeep(fns).reduceRight((current, fn) => {
        if (_.isFunction(fn)) return fn(current)
        throw new TypeError("compose() expects only functions as parameters.")
    }, arg)
}

const composeAsync = (...fns) => arg => {
    return _.flattenDeep(fns).reduceRight(async (current, fn) => {
        if (_.isFunction(fn)) return fn(await current)
        throw new TypeError("compose() expects only functions as parameters.")
    }, arg)
}

// Enforces URL is https and returns new URL string
const enforceHttpsUrl = (url) => _.isString(url) ? url.replace(/^(https?:)?\/\//, "https://") : null

// Remove non-numeric characters
const sanitize = number => {
    _.isString(number) ? number.replace(/[^0-9-.]/g, "") : _.isNumber(number) ? number : null
}

// Filters null values from array
const withoutNulls = arr => _.isArray(arr) ? arr.filter(val => !_.isNull(val)) : _[_]

// Transforms array of ({key: value}) pairs to an object and returns final object
const arrayPairsToObject = arr => arr.reduce((obj, pair) => ({...obj, ...pair}), {})

// Composed function that removes null values from array of ({key: value}) pairs and returns object
const fromPairsToObject = compose(arrayPairsToObject, withoutNulls)

/**
 * Handled fulfilled request and sends JSON response
 */
const sendResponse = res => async request => {
    return await request.then(data => res.json({status: "success", data})).catch(({status: code = 500}) => {
        res.status(code).json({status: "failure", code, message: code == 404 ? 'Not found.' : 'Request failed.'})
    })
}

/**
 * Loads html string returned from url
 * sends a Cheerio parser instance of loaded HTML
 */
const fetchHtmlFromUrl = async url => {
    return await axios.get(enforceHttpsUrl(url)).then(res => cheerio.load(res.data)).catch(error => {
        error.status = (error.response && error.response.status) || 500
        throw error
    })
}

/**
 * Fetches inner HTML of element
 * return trimmed text
 */
const fetchInnerHTML = elem => (elem.text && elem.text().trim()) || null

/**
 * Fetches attribute from element
 * returns attribute value
 */
const fetchElemAttribute = attr => elem => (elem.attr && elem.attr(attr)) || null

/**
 * Extract array of values from collection of elements
 * using extractor function and returns array
 */
const extractFromElems = extractor => transform => elems => $ => {
    const results = elems.map((i, el) => extractor($(el))).get()
    return _.isFunction(transform) ? transform(results) : results
}

/**
 * Composed function that extracts number text from element
 * sanitises the number and returns parsed int
 */
const extractNumber = compose(parseInt, sanitize, fetchInnerHTML)

/**
 * Composed function that extracts url string from element attribute
 * returns url with https scheme
 */
const extractUrlAttr = attr => {
    compose(enforceHttpsUrl, fetchElemAttribute(attr))
}

export {
    compose,
    composeAsync,
    enforceHttpsUrl,
    sanitize,
    withoutNulls,
    arrayPairsToObject,
    fromPairsToObject,
    sendResponse,
    fetchHtmlFromUrl,
    fetchInnerHTML,
    fetchElemAttribute,
    extractFromElems,
    extractNumber,
    extractUrlAttr
}