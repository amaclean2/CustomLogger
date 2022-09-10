const fs = require('fs');
const path = require('path');

const colors = require('./colors');

function Logger(name, dir = "./logs", cacheSize = 100) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    const timeFormatPath = new Date().toISOString().replace(/:/g, '-').split('.')[0];

    const localPath = path.join(dir, `${timeFormatPath}-${name}.log`);

    const cache = [];

    const log = (level, message) => {
        const dateFormat = new Date().toISOString().replace(/T/g, '').split('.')[0];
        const output = `${dateFormat} ${name} ${level.toUpperCase()} ${message}`;

        console.log(dateFormat, name, `${colors[level]}${level.toUpperCase()}\x1b[0m`, message);

        cache.push(output);

        if (cache.length >= cacheSize) {
            fs.appendFileSync(localPath, cache.map((log) => `${log}\n`).join(''));

            cache = [];
        }

        return output;
    };

    const info = (message) => log('info', message)
    const debug = (message) => log('debug', message)
    const trace = (message) => log('trace', message)
    const warn = (message) => log('warn', message)
    const error = (message) => log('error', message)
    const fatal = (message) => log('fatal', message)

    const close = () => fs.appendFileSync(this.path, this.cache.map((log) => `${log}\n`).join(''));

    return {
        info,
        debug,
        trace,
        warn,
        error,
        fatal,
        close
    };
};

module.exports = Logger;