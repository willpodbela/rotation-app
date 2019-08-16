class Auth {
  
  static authenticateToken(token) {
    sessionStorage.setItem("token", token)
  }

  static isUserAuthenticated() {
    return sessionStorage.getItem("token") !== null
  }

  static deauthenticateUser() {
    sessionStorage.removeItem("token")
  }

  static getToken() {
    return sessionStorage.getItem("token")
  }
  
  static basicAuthHeader() {
    let headers = new Headers();
        
    let username = process.env.REACT_APP_API_AUTH_NAME;
    let password = process.env.REACT_APP_API_AUTH_PASSWORD;
    headers.append('Authorization', 'Basic ' + Buffer.from(username + ":" + password).toString('base64'));
    
    return headers
  }

}

export default Auth
