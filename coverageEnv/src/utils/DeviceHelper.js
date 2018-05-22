import MobileDetect from 'mobile-detect';

export default class DeviceHelper {
  static isMobile() {
    const md = new MobileDetect(window.navigator.userAgent);
    return md.mobile();
  }
}
