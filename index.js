const fs = require('fs')
const path = require('path')

const write = require('./write')

function Logger({ name, dir = './logs', cacheSize = 100, verbose = false, storeLogs = false }) {
    let localPath
    if (storeLogs) {
        // storeLogs writes logs to an external file
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        }
    
        const timeFormatPath = new Date().toISOString().replace(/:/g, '-').split('.')[0]
    
        localPath = path.join(dir, `${timeFormatPath}-${name}.log`)
    }

    const cache = []
    
    const log = (level, message) => {

        // level is the type of log sent
        // message is the body of the log sent

        const dateFormat = new Date().toISOString().replace(/T/g, '').split('.')[0]
        let output

        if (['error', 'fatal', 'info', 'request', 'warn', 'debug'].includes(level)) {
            output = write({ dateFormat, name, level: level.toUpperCase(), message })
        } else {
            output = write({ message: 'supported log types are \'error\', \'fatal\', \'info\', \'warn\', \'debug\', or \'request\'.' })
        }
        // TODO: support verbose
        
        // this needs work
        if (storeLogs) cache.push(output)

        if (cache.length >= cacheSize) {
            fs.appendFileSync(localPath, cache.map((log) => `${log}\n`).join(''))

            cache = []
        }

        // I don't think this needs to be here. I'm pretty sure this function is fine
        // as a void function
        return output
    }

    const info = (...message) => log('info', message)
    const debug = (...message) => log('debug', message)
    const trace = (...message) => log('trace', message)
    const warn = (...message) => log('warn', message)
    const error = (...message) => log('error', message)
    const fatal = (...message) => log('fatal', message)
    const request = (...message) => log('request', message)

    const close = () => fs.appendFileSync(this.path, this.cache.map((log) => `${log}\n`).join(''))

    return {
        info,
        debug,
        trace,
        warn,
        error,
        fatal,
        close,
        request
    }
}

module.exports = Logger