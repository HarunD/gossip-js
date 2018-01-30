/*
    gossip
    ... add some info and short instructions
*/

let ws = null;
let shouldLog = true;

const WS_URI = "ws://example";
const DEFAULT_CHANNEL = "general";

export default {
    setup
};

const setup = (credentials) => {
    connect(credentials)
};

const connect = credentials => {
    ws = new WebSocket(WS_URI);

    ws.onopen = () => login(credentials);
    ws.onmessage = msg => handleMessage(msg);
    ws.onclose = () => {
        console.log('gossip closed...')
    };
};

const login = credentials => {
    const {nick, password} = credentials;
    ws.send(`{nick: ${String(nick)}, secret: ${String(password)}, channel: ${DEFAULT_CHANNEL}}`);
};

const handleMessage = msg => {
    const M = JSON.parse(msg.data);
    switch (M.type) {
        case 0:
            if (shouldLog) 
                console.log(`gossip got message: ${M.data}`);
            
            // displayMessage(M.data);
            break;
        case 1:
            if (shouldLog) 
                console.log(`gossip got history: ${M.data}`);
            
            // displayHistory(M.data);
            break;
        case 2:
            if (shouldLog) 
                console.log(`gossip error occurred: ${M.error}`);
            alert(M.error);
            break;
    }
};