import { fetchProperties } from './scraper'
import resolvers from '../graphql/property/graphqlSchema'
import _ from 'lodash'
import axios from 'axios'
import cheerio from 'cheerio'
import models from '../postgres/models'

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
const withoutNulls = arr => _.isArray(arr) ? _.filter(arr, (v) => !_.isNil(v)) : _[_]

// Transforms array of ({key: value}) pairs to an object and returns final object
const arrayPairsToObject = arr => arr.reduce((obj, pair) => ({...obj, ...pair}), {})

// Composed function that removes null values from array of ({key: value}) pairs and returns object
const fromPairsToObject = compose(arrayPairsToObject, withoutNulls)

/**
 * Initialise database with response from scraper
 * 
 */
const addToDb = () => fetchProperties => {
    return fetchProperties.then(async (items) => {
        await Promise.all(items.map(async (item) => {
            const {title, description, address, pricing} = item
            models.Property.create({title, description, address, pricing})

        }))
})}

/**
 * Handled fulfilled request and sends JSON response
 */
const sendResponse = res => async request => {
    return await request.then(data => res.send({status: "success", data: res})).catch(({status: code = 500}) => {
        res.status(code).json({status: "failure", code, message: code == 404 ? 'Not found.' : 'Request failed.'})
    })
}

/**
 * Remove line breaks and whitespace
 * @param {string} str 
 */
const trimText = str => str.replace(/(\r\n|\n|\r)/gm, "").trim()

/**
 * Loads html string returned from url
 * sends a Cheerio parser instance of loaded HTML
 * @param {string} url
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
const fetchInnerText = $ => elem => trimText($.find(elem).text()) || null

/**
 * Fetches attribute from element
 * returns attribute value
 */
const fetchElemAttribute = attribute => elem => {
   return (elem.attr && elem.attr(attribute).text()) || null 
} 

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
const extractNumber = compose(parseInt, sanitize, fetchInnerText)

export {
    compose,
    composeAsync,
    enforceHttpsUrl,
    sanitize,
    withoutNulls,
    arrayPairsToObject,
    fromPairsToObject,
    addToDb,
    fetchHtmlFromUrl,
    fetchInnerText,
    fetchElemAttribute,
    extractFromElems,
    extractNumber,
}