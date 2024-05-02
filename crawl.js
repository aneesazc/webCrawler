import { JSDOM } from "jsdom"

function normalizeURL(url) {
    const urlObj = new URL(url)
    let fullPath = `${urlObj.host}${urlObj.pathname}`
    if (fullPath.slice(-1) === '/') {
      fullPath = fullPath.slice(0, -1)
    }
    return fullPath
}



function getURLsFromHTML(htmlBody, baseURL) {
    const dom = new JSDOM(htmlBody)
    const document = dom.window.document
    const links = document.querySelectorAll("a")
    const urls = []
    for (const link of links) {
      const url = new URL(link.href, baseURL)
      urls.push(url.href)
    }
    return urls
}

async function crawlPage(baseURL, currentURL = baseURL, pages = {}) {
    

    const baseURLObj = new URL(baseURL)
    const currentURLObj = new URL(currentURL)
    if (baseURLObj.host !== currentURLObj.host) {
      return pages
    }

    const normalizedcurrentURL = normalizeURL(currentURL)
    if (pages[normalizedcurrentURL] > 0) {
        pages[normalizedcurrentURL]++
      return pages
    } 
    
    pages[normalizedcurrentURL] = 1

    console.log(`crawling ${currentURL}`)

    try {
        const htmlBody = await fetchAndParse(currentURL)
        const urls = getURLsFromHTML(htmlBody, currentURL)
        for (const url of urls) {
            await crawlPage(baseURL, url, pages)
        }
    } catch (err) {
        console.log(`Error: ${err.message}`)
    }

    return pages

    
  }

async function fetchAndParse(currentURL){
    let res
    try {
      res = await fetch(currentURL)
    } catch (err) {
      throw new Error(`Got Network error: ${err.message}`)
    }
  
    if (res.status > 399) {
      console.log(`Got HTTP error: ${res.status} ${res.statusText}`)
      return
    }
  
    const contentType = res.headers.get('content-type')
    if (!contentType || !contentType.includes('text/html')) {
      console.log(`Got non-HTML response: ${contentType}`)
      return
    }
  
    return res.text()
}


export { normalizeURL, getURLsFromHTML, crawlPage }