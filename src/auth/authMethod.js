import decode from 'jwt-decode';

export default class authMethod {
    login = (username, password) => {
        return this.fetch('http://localhost:3001/api/credential/login/authenticate', {
            method: 'POST',
            body: JSON.stringify({
                username, password
            })
        }).then(res => {
            this.setToken(res.token);
            return res;
        })
    }
    loggedIn = () => {
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token)
    }
    isTokenExpired = (token) => {
        try {
            const decoded = decode(token);
            if(decoded.exp < Date.now() / 1000) {
                return true;
            } else return false;
        } catch(err) {
            console.log("Token expired.");
            return false;
        }
    }
    setToken = (idToken) => {
        localStorage.setItem('id_token', idToken)
    }
    getToken = () => {
        return localStorage.getItem('id_token')
    }
    logout = () => {
        localStorage.removeItem('id_token');
    }
    getConfirm = () => {
        let answer = decode(this.getToken());
        console.log("Received answer.");
        return answer;
    }
    fetch = (url, options) => {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        if(this.loggedIn()) {
            headers['Authorization'] = 'Bearer ' + this.getToken();
        }
        return fetch(url, {
            headers,
            ...options
        }).then(this._checkStatus)
        .then(response => response.json())
    }
    _checkStatus = (response) => {
        if(response.status >= 200 && response.status < 300) {
            return response
        } else {
            var error = new Error(response.statusText);
            error.response = response
            throw error
        }
    }
}