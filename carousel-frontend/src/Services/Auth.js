import cookie from "react-cookies";
import CryptoJS from "crypto-js";

const appSecret = "carousel-secret";
const appCookie = "carousel";

class Auth {
  encodeData(data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), appSecret).toString();
  }
  decodeData(data) {
    var bytes = CryptoJS.AES.decrypt(data, appSecret);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
  saveData = async (data) => {  
    console.log(data);
    let userData = {
      loggedIn: true,
      token: data.accessToken.toString(),
      id: data.user.id.toString(),
      email: data.user.email ? data.user.email.toString() : null,
      name: data.user.name ? data.user.name.toString() : "Unnamed",
      role: data.user.role ? data.user.role.toString() : null,
      slug: data.user.slug ? data.user.slug.toString() : null,
      business_name: data.user.business_name ? data.user.business_name.toString() : null,
      business_address: data.user.business_address ? data.user.business_address.toString() : null,
      business_license: data.user.business_license ? data.user.business_license.toString() : null,
      // step: data.user.step ? data.user.step.toString() : null,
      inviteTeamData: data.inviteTeamData ? data.inviteTeamData : null,
    };
    await cookie.save(appCookie, this.encodeData(userData), { path: "/", expires: 0 });
  };
  getSingle(name) {
    if (cookie.load(appCookie) !== undefined) {
      let userData = this.decodeData(cookie.load(appCookie));
      return Object.assign([], userData)[name];
    } else {
      return false;
    }
  }
  updateSingle(name, value) {
    if (cookie.load(appCookie) !== undefined) {
      let userData = this.decodeData(cookie.load(appCookie));
      userData[`${name}`] = "" + value.toString();
      cookie.save(appCookie, this.encodeData(userData), { path: "/", expires: 0 });
    } else {
      return false;
    }
  }
  isLoggedIn() {
    return this.getSingle("loggedIn") ?? false;
  }
  logout() {
    cookie.remove(appCookie);
    document.cookie = `${appCookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    localStorage.setItem("token", '');
    localStorage.setItem("name", '');
    localStorage.setItem("role", '');
  }
}

export default Auth;
