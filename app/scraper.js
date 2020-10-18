import { without } from 'lodash'
import {
    compose,
    composeAsync,
    enforceHttpsUrl,
    fetchHtmlFromUrl,
    fetchElemAttribute,
    fetchInnerText,
    extractUrlAttr,
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
     const $page = $("#l-searchResults > div")

     const items = new Set()

     $page.find('div').each((index, elem) => {
        items.add({
            title: fetchInnerText($(elem))("h2"),
            address: fetchInnerText($(elem))("address"),
            description: fetchInnerText($(elem))("span"),
            price: fetchInnerText($(elem))(".propertyCard-priceValue"),
            //images: compose(extractUrlAttr, fetchElemAttribute("src")(`${$(elem).find(".propertyCard-img").find("img")}`))
        })
     })

    return _.filter([...items], (item) => !Object.values(item).includes(null))

 }

 export const fetchProperties = async () => {
     const URL = BASE_URL
     return composeAsync(extractPropertyInfo, fetchHtmlFromUrl)(URL)
 }