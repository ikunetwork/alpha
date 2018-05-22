export default class Token {
  static store(token) {
    const existingTokens = JSON.parse(window.localStorage.getItem('tokens'));
    const tokens = {
      ...existingTokens,
      ...token,
    };

    window.localStorage.setItem('tokens', JSON.stringify(tokens));
  }

  static get(address) {
    const tokens = JSON.parse(window.localStorage.getItem('tokens'));
    if (tokens) {
      return tokens[address];
    }
    return null;
  }

  static remove() {
    window.localStorage.removeItem('tokens');
  }
}
