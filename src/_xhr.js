/*eslint no-console: 0*/
const chalk = require('chalk');
const _xhr = require('xhr2');
module.exports = class XHR
{
    constructor(host = '', path = '', method = 'GET')
    {
        this.host = host;
        this.path = path;
        this.method = method.toUpperCase();
        this.withCredentials = false;
        this.handleAs = 'json';
        this._lastRequest = null;
        this._lastResponse = null;
    }

    _normalize(ref = null)
    {
        if (typeof ref === 'object' && ref !== null)
        {
            Object.keys(ref).forEach(key =>
            {
                let aux = key;
                let value = ref[key];
                if (aux.lastIndexOf('_') !== -1)
                {
                    aux = aux.split('_').map((item, index) =>
                    {
                        return index ? item.charAt(0).toUpperCase() + item.substr(1) : item;
                    }).join('.').replace(/\./g, '');
                    delete ref[key];
                    ref[aux] = value;
                    key = aux;
                }
                if (typeof ref[key] === 'object')
                {
                    ref[key] = this._normalize(ref[key]);
                }
            });
        }
        return ref;
    }

    fetch()
    {
        return new Promise((resolve, reject) =>
        {
            let request = new _xhr();
            this._lastRequest = request;
            request.withCredentials = this.withCredentials;
            request.responseType = this.handleAs;
            request.onreadystatechange = () =>
            {
                if (request.readyState === _xhr.DONE)
                {
                    let lastResponse = request.response;
                    if (typeof lastResponse === 'string')
                    {
                        try
                        {
                            lastResponse = JSON.parse(lastResponse);
                        }
                        catch (e)
                        {
                            lastResponse = null;
                        }
                    }
                    this._lastResponse = this._normalize(lastResponse);
                    switch (request.status / 100)
                    {
                        case 2:
                        case 3:
                            resolve(this._lastResponse);
                            break;
                        case 4:
                        case 5:
                        default:
                            reject(this._lastResponse);
                    }
                }
            };
            let url = this.path
                ? [this.host, this.path].join('/')
                : this.host;
            console.log(`Fetching: "${chalk.blue(url)}"`);
            request.open(this.method, url);
            request.send(null);
        });
    }
};
