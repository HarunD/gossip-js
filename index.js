/*
    gossip
    ... add some info and short instructions
*/

import axios from "axios";

export default class Gossip {
    _url = "";
    _ax;

    // TODO - create axios instance
    constructor(apiBase) {
        this._url = apiBase;
        this._ax = axios.create({
            baseURL: apiBase, timeout: 1000,
            // headers: {'X-Custom-Header': 'foobar'}
        })
    }

    getChannels = () => {}

    // pass axios instance to channel
    newChannel = (name, secret) => new Chat(this._ax, name, secret);

    // Or new private chat should be intialized over existing channel connection
    // (returns chan name and secret or something)
    newPvt = () => {};
}

class Chat {
    _ws;
    _ax;

    _name = "";
    _secret = "";

    _closed = false;

    onmessage = (msg) => {};
    onhistory = (history) => {};
    onnotice = (notice) => {};
    onerror = (err) => {};
    onclose = () => {};

    constructor(ax, name, secret) {
        this._ax = ax;
        this._name = name;

        if (secret) 
            this._secret = secret;
        }
    
    connect = (nick, secret) => {
        this._ws = new WebSocket(url + "/agent/connect");

        this._ws.onopen = () => this._init(nick, secret);
        this._ws.onmessage = this._onMessage;
        this._ws.onclose = () => {
            if (!this._closed) {
                this._ws = new WebSocket(url + "/agent/connect"); // TODO - exp retry ??
                if (this.onclose) 
                    this.onclose();
                }
            }
    }

    _init = (nick, secret) => {
        if (secret === "") {
            // TODO - try to fetch it from local store
        }
        ws.send(`{"nick": "${nick}", secret: ${secret}, channel: ${this._name}}`);
    }

    getMembers = () => {
        //
    }

    registerNick = nickReq => {
        // TODO - Upon registration store nick secret to local store
    }

    close = () => {
        this._closed = true;
        this
            .ws
            .close();
    }

    _onMessage = msg => {
        const M = JSON.parse(msg.data);
        switch (M.type) {
                // TODO - enum?
            case 0:
                // if (shouldLog) console.log(`gossip got message: ${M.data}`);
                if (this.onmessage) 
                    this.onmessage(M.data);
                break;
            case 1:
                // if (shouldLog) console.log(`gossip got history: ${M.data}`);
                if (this.onhistory) 
                    this.onhistory(M.data);
                break;
            case 2:
                // if (shouldLog) console.log(`gossip error occurred: ${M.error}`);
                alert(M.error); // TODO - What to do here
                break;
        }
    }
}