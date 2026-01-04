export function sanitizeUrl(input) {
  try {
    let url = input.trim();
    if (url.startsWith("http://") || url.startsWith("https://")) {
      url = new URL(url).hostname;
    }
    url = url.replace(/\/+$/, "");
    return url;
  } catch {
    return input;
  }
}
