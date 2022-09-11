### Welcome to my custom logger

I'm still trying to figure out how to write modules. I'll let you know when I get the hang of it

So far I'm only sure it runs in Node

To run it
```javascript
  const Logger = require('byf-custom-logger');
  
  const logger = new Logger(<appName>);
  
  logger.info('Hi there!');
```

Logging levels
- info
- debug
- trace
- warn
- error
- fatal
