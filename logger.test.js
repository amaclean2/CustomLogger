const Logger = require('./index')

describe('logging things works right', () => {
    test('should output an info log to the console', async () => {
        const myLogger = new Logger({ name: 'my-app' })

        const output = myLogger.info('Logging test from home')

        expect(output.includes('Logging test from home')).toBe(true)
    })

    test('should output an error log to the console', async () => {
        const myLogger = new Logger({ name: 'my-app' })

        const output = myLogger.error('Logging error from home')

        expect(output.includes('Logging error from home')).toBe(true)
        expect(output.includes('ERROR')).toBe(true)
    })

    test('should output an object to the console', async () => {
        const myLogger = new Logger({ name: 'my-app' })
        const output = myLogger.info({ alphabet: 'soup', italy: { capital: 'rome', language: 'italian' } })

        expect(output.includes('langouage: \'italian\''))
    })

    test('should output an empty object to the console', async () => {
        const myLogger = new Logger({ name: 'my-app' })
        const output = myLogger.info({})

        expect(output.includes('{}')).toBe(true)
    })

    test('should output an empty array to the console', async () => {
        const myLogger = new Logger({ name: 'my-app' })
        const output = myLogger.info([])

        expect(output.includes('[]')).toBe(true)
    })

    test('should output a nested array to the console', async () => {
        const myLogger = new Logger({ name: 'my-app' })
        const output = myLogger.info([[{}, 'abc']])

        expect(output.includes('{}')).toBe(true)
    })

    test('should output an error block to the console', async () => {
        const myLogger = new Logger({ name: 'my-app' })
        const output = myLogger.error(new Error('something went wrong'))

        expect(output.includes('ERROR')).toBe(true)
        expect(output.includes('something went wrong')).toBe(true)
    })

    test('should output a warning message to the console', async () => {
        const myLogger = new Logger({ name: 'my-app' })
        const output = myLogger.warn('This may cause problems')

        expect(output.includes('problems')).toBe(true)
    })

    test('should output a debug message to the console', async () => {
        const myLogger = new Logger({ name: 'my-app' })
        const output = myLogger.debug('This is where the issue is')

        expect(output.includes('issue')).toBe(true)
    })
})