const HOST = 'https://api.nal.usda.gov/ndb'
const SEARCH_ENDPOINT = `${HOST}/search`
const REPORT_ENDPOINT = `${HOST}/V2/reports`
const API_KEY = 'fTS7p8sGvtY5i9HtukkiZQw2iAA49elj8yrXb3SG'

const requestOpts = {
  mode: 'cors'
}

const searchParams = [
  [ 'api_key', API_KEY ],
  [ 'sort', 'r' ],                // sort by relevance
  [ 'ds', 'Standard Reference'],  // don't search branded database
  [ 'format', 'json' ]            // obvioulys
]

const reportParams = [
  [ 'api_key', API_KEY ],
  [ 'type', 'f' ]                 // full report
]

const buildParamString = params =>
  params.map(([key, value]) =>
    `${key}=${value}`
  )
  .join('&')

const buildSearchUrl = q => `${SEARCH_ENDPOINT}?${buildParamString(searchParams)}&q=${q}`
const buildReportUrl = ndbno => `${REPORT_ENDPOINT}?${buildParamString(reportParams)}&ndbno=${ndbno}`

export const getSearchResults = value => fetch(buildSearchUrl(value), requestOpts)
export const getFoodReport = value => fetch(buildReportUrl(value), requestOpts)