const Logger = require('./index');

describe('logging things works right', () => {
    it('should output an info log to the console', async () => {
        const myLogger = new Logger('my-app');

        const output = myLogger.info('Logging test from home');

        expect(output.includes('Logging test from home')).toBe(true);
    });

    it('should output an error log to the console', async () => {
        const myLogger = new Logger('my-app');

        const output = myLogger.error('Logging error from home');

        expect(output.includes('Logging error from home')).toBe(true);
    });

    it('should output an object to the console', async () => {
        const myLogger = new Logger('my-app');
        const output = myLogger.info({ alphabet: 'soup', italy: { capital: 'rome', language: 'italian' } });

        expect(output.includes('langouage: \'italian\''));
    });

    it('should output an error block to the console', async () => {
        const myLogger = new Logger('my-app');
        const output = myLogger.error(new Error('something went wrong'));

        expect(output.includes('something went wrong')).toBe(true);
    });

    it('should output a warning message to the console', async () => {
        const myLogger = new Logger('my-app');
        const output = myLogger.warn('This may cause problems');

        expect(output.includes('problems')).toBe(true);
    });

    it('should output a debug message to the console', async () => {
        const myLogger = new Logger('my-app');
        const output = myLogger.debug('This is where the issue is');

        expect(output.includes('issue')).toBe(true);
    });
});