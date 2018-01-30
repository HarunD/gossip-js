"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/*
    gossip
    ... add some info and short instructions
*/

var ws = null;
var shouldLog = true;

var WS_URI = "ws://example";
var DEFAULT_CHANNEL = "general";

exports.default = {
    setup: setup
};


var setup = function setup(credentials) {
    connect(credentials);
};

var connect = function connect(credentials) {
    ws = new WebSocket(WS_URI);

    ws.onopen = function () {
        return login(credentials);
    };
    ws.onmessage = function (msg) {
        return handleMessage(msg);
    };
    ws.onclose = function () {
        console.log('gossip closed...');
    };
};

var login = function login(credentials) {
    var nick = credentials.nick,
        password = credentials.password;

    ws.send("{nick: " + String(nick) + ", secret: " + String(password) + ", channel: " + DEFAULT_CHANNEL + "}");
};

var handleMessage = function handleMessage(msg) {
    var M = JSON.parse(msg.data);
    switch (M.type) {
        case 0:
            if (shouldLog) console.log("gossip got message: " + M.data);

            // displayMessage(M.data);
            break;
        case 1:
            if (shouldLog) console.log("gossip got history: " + M.data);

            // displayHistory(M.data);
            break;
        case 2:
            if (shouldLog) console.log("gossip error occurred: " + M.error);
            alert(M.error);
            break;
    }
};
