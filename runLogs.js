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
logger.info({ a: { b: 1, c: 2, d: { e: 3, f: 4 } } })
logger.info({})
logger.info({ a: 1, b: {} })

logger.debug("Hi I'm Andrew")

const myFun = () => 2;

logger.trace(myFun());

logger.error(new Error("Ahh!"));

const data = {
    user: {
        id: 750,
        first_name: 'Test',
        last_name: 'User',
        email: 'user@email.com',
        is_premium: null,
        sex: null,
        user_site: null,
        city: null,
        bio: null,
        date_created: '2022-09-11T18:31:10.000Z',
        last_updated: '2022-09-11T18:31:10.000Z',
        activity_count: 0,
        follower_count: 0,
        following_count: 0,
        images: [],
        ticks: []
    },
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUwLCJpYXQiOjE2NjI5MjEwNzAsImV4cCI6MTY2MzA5Mzg3MH0.CHa97-F16EiLlcdDhhbeg3HQcw8_49B60CrZTN4AZeg'
};

const status = 200;

logger.info({ data, status });