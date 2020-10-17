import {
    compose,
    composeAsync,
    enforceHttpsUrl,
    fetchHtmlFromUrl,
    fetchElemAttribute,
    fetchInnerHTML,
    extractFromElems
} from './helpers'
const cheerio = require('cheerio')
const _ = require('lodash')

const BASE_URL = "https://www.rightmove.co.uk/property-for-sale/find.html?searchType=SALE&locationIdentifier=REGION%5E96885&insId=1&radius=0.0&minPrice=&maxPrice=&minBedrooms=&maxBedrooms=&displayPropertyType=&maxDaysSinceAdded=&_includeSSTC=on&sortByPriceDescending=&primaryDisplayPropertyType=&secondaryDisplayPropertyType=&oldDisplayPropertyType=&oldPrimaryDisplayPropertyType=&newHome=&auction=false"

const baseRelativeUrl = url => _.isString(url) ? `${BASE_URL}${url.replace(/^\/*?/, "/")}` : null

/**
 * Composed function that extracts url from element attribute
 * resolves it to base URL and returns URL with https
 */
const extractBaseUrlAttribute = attr => compose(enforceHttpsUrl, baseRelativeUrl, fetchElemAttribute(attr))

/**
 * Extract property information from property-for-sale page using cheerio parse
 * return property object
 */

 const extractPropertyInfo = $ => {
     const properties = new Set()
     const titles = new Set()
     const addresses = new Set()
     const list = $("#l-searchResults > div")
     list.find('div').each((index, elem) => {
        titles.add($(elem).find('h2').text())
        addresses.add($(elem).find('address').text())
     })

     return {
        titles: [...titles].sort(),
        addresses: [...addresses].sort()
     } 
     const card = $("#property-84191476")
     const child = card.find(".propertyCard")
     const wrapper = child.find(".propertyCard-wrapper")
     const content = wrapper.find(".propertyCard-content")
     return content.text()
 }

 export const fetchProperties = async () => {
     const URL = BASE_URL
     return composeAsync(extractPropertyInfo, fetchHtmlFromUrl)(URL)
 }