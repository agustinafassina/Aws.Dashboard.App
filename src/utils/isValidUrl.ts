export function isValidUrl(url: string): boolean {
  if (!/^(https?:\/\/|www\.)/i.test(url)) return false
  if (url.endsWith('.')) return false
  if (/^www[^.]/i.test(url)) return false
  if (/^ww[^w]\./i.test(url)) return false
  if (/^wwww+\./i.test(url)) return false
  if (/^www\.\./i.test(url)) return false
  if (/^www\.$/i.test(url)) return false
  if (/^www\.@/.test(url)) return false
  if (/^www\.[^a-zA-Z0-9-]/.test(url)) return false
  if (/^www\.[^\x20-\x7E]+/.test(url)) return false
  if (/^www\.[a-zA-Z0-9-]*[^a-zA-Z0-9-.][a-zA-Z0-9-]*\./.test(url)) return false

  let parsedUrl: URL | null = null
  try {
    if (/^www\./i.test(url)) {
      parsedUrl = new URL('http://' + url)
    } else {
      parsedUrl = new URL(url)
    }
  } catch {
    return false
  }

  if (!/^[a-zA-Z0-9.-]+$/.test(parsedUrl.hostname)) return false
  if (/\.\./.test(parsedUrl.hostname)) return false
  if (/^www\./i.test(url) && !/\.[a-zA-Z]{2,}$/.test(parsedUrl.hostname))
    return false

  return true
}
