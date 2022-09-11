const Logger = require(".");

const logger = new Logger('my-app');

logger.info([1, 2, 3])
logger.debug([1, 2, 3, [4, 5]])
logger.info(['abc', 'def', 'ghi'])
logger.trace([])
logger.info([1, 2, 3, [], 4, 5])

logger.info({ a: 1 })
logger.info({ a: 1, b: 2 })
logger.info({ a: 'abc' })
logger.info({ a: { b: 1, c: 2, d: { e: 3, f: 4 }}})
logger.info({})
logger.info({ a: 1, b: {}})

logger.debug("Hi I'm Andrew")

const myFun = () => 2;

logger.trace(myFun());

logger.error(new Error("Ahh!"));