global.Buffer = require('buffer').Buffer;
import { install } from 'react-native-quick-crypto';

install();


// Needed so that 'stream-http' chooses the right default protocol.
global.location = {
    protocol: 'file:',
};

global.process.version = 'v16.0.0';
if (!global.process.version) {
    global.process = require('process');
    console.log({ process: global.process });
}

process.browser = true;