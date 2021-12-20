export function objToQueryString(obj) {
    const keyValuePairs = [];
    Object.keys(obj).forEach(key => {
        keyValuePairs.push(`${key}=${encodeURIComponent(obj[key])}`);
    });
    return keyValuePairs.join('&');
}