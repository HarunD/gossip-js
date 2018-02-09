/*
    gossip
    ... add some info and short instructions
*/

import axios from "axios";

export default class Gossip {
    _url = "";
    _ax;
    _isSSL;

    // TODO - create axios instance
    constructor(apiBase, isSSL) {
        this._url = apiBase;
        this._ax = axios.create({
            baseURL: apiBase, timeout: 1000,
            // headers: {'X-Custom-Header': 'foobar'}
        });
        this._isSSL = isSSL;
    }

    getChannels = () => {};

    // pass axios instance to channel
    newChannel = (name, secret) => new Chat(this._url, name, secret, this._isSSL);

    // Or new private chat should be intialized over existing channel connection
    // (returns chan name and secret or something)
    newPvt = () => {};
}

class Chat {
    _ws;
    _isSSL;
    _ax;

    _name = "";
    _secret = "";
    _url = "";

    _closed = false;

    onmessage = (msg) => {};
    onhistory = (history) => {};
    onnotice = (notice) => {};
    onerror = (err) => {};
    onconnect = () => {};
    onclose = () => {};

    constructor(url, name, secret, isSSL) {
        this._url = url;
        this._name = name;
        this._isSSL = isSSL;

        this._ax = axios.create({
            baseURL: url, timeout: 1000,
            // headers: {'X-Custom-Header': 'foobar'}
        });

        if (secret) {
            this._secret = secret;
        };
    }

    connect = (nick, secret) => {
        const P = this._isSSL
            ? "wss://"
            : "ws://";
        this._ws = new WebSocket(P + this._url + "/agent/connect");

        this._ws.onopen = () => {
            this._init(nick, secret);
            this.onconnect();
        }

        this._ws.onmessage = this._onMessage;
        this._ws.onclose = () => {
            if (!this._closed) {
                this._ws = new WebSocket(P + this._url + "/agent/connect"); // TODO - exp retry ??
                this.onclose();
            }
        }
    };

    _init = (nick, secret) => {
        if (secret === "") {
            // TODO - try to fetch it from local store
        }
        this
            ._ws
            .send(JSON.stringify({nick: nick, secret: secret, channel: this._name}));
    };

    send = (text, meta) => {
        var msg = {
            text: text,
            meta: meta
        };

        this
            ._ws
            .send(JSON.stringify({type: 0, data: msg}));
    };

    getHistory = last_seq => {};

    getMembers = () => {
        //
    };

    registerNick = nickReq => {
        // TODO - Upon registration store nick secret to local store
    };

    close = () => {
        this._closed = true;
        this
            ._ws
            .close();
    };

    _onMessage = msg => {
        const M = JSON.parse(msg.data);
        switch (M.type) {
                // TODO - enum?
            case 0:
                // if (shouldLog) console.log(`gossip got message: ${M.data}`);
                this.onmessage(M.data);
                break;
            case 1:
                // if (shouldLog) console.log(`gossip got history: ${M.data}`);
                this.onhistory(M.data);
                break;
            case 2:
                // if (shouldLog) console.log(`gossip error occurred: ${M.error}`);
                this.onerror({text: M.error, from: "gossip"});
                break;
        }
    };
}