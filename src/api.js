const HOST = 'https://api.nal.usda.gov/ndb'
const SEARCH_ENDPOINT = `${HOST}/search`
const REPORT_ENDPOINT = `${HOST}/V2/reports`
const API_KEY = 'fTS7p8sGvtY5i9HtukkiZQw2iAA49elj8yrXb3SG'

const requestOpts = {
  mode: 'cors'
}

const searchParams = [
  [ 'api_key', 'fTS7p8sGvtY5i9HtukkiZQw2iAA49elj8yrXb3SG' ],
  [ 'sort', 'r' ],
  [ 'ds', 'Standard Reference'],
  [ 'format', 'json' ]
]

const searchParamString = searchParams
  .map(([key, value]) =>
    `${key}=${value}`
  )
  .join('&')

const buildSearchUrl = q => `${SEARCH_ENDPOINT}?${searchParamString}&q=${q}`
const buildReportUrl = ndbno => `${REPORT_ENDPOINT}?api_key=${API_KEY}&ndbno=${ndbno}`

export const getSearchResults = value => fetch(buildSearchUrl(value), requestOpts)
export const getFoodReport = value => fetch(buildReportUrl(value), requestOpts)