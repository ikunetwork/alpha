export default class UrlHelper {
  static getParams() {
    const queryDict = {};
    window.location.search
      .substr(1)
      .split('&')
      .forEach(item => {
        const [key, val] = item.split('=');
        queryDict[key] = val;
      });
    return queryDict;
  }
}
