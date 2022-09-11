const colors = require("./colors");

const writeTabs = (count) => {
    let spaceString = '';
    for (let i = 0; i < count; i++) {
        spaceString += '  ';
    }

    return spaceString;
};

const usePrint = (level) => {
    return (argument, options) => {
        if (['error', 'fatal'].includes(level.toLowerCase())) {
            process.stderr.write(`\x1b[31m${argument}\x1b[0m`)
        } else {
            if (level.toLowerCase() === 'debug') {
                process.stdout.write(`\x1b[30m${argument}\x1b[0m`);
            } else {
                process.stdout.write(argument)
            }
        }
    };
};

const write = (...args) => {
    const print = usePrint(args[2]);

    const writeObject = (argument) => {

        const strArg = JSON.stringify(argument);
        const parsedStrArg = strArg.split('');
    
        print('\n');
    
        let tabCount = 0;
        let spaceReady = false;
        let key = false;
    
        const processStrArr = (strArray) => {
            if (!strArray.length) return;
    
            const char = strArray[0];
    
            switch (char) {
                case '{':
                case '[':
                    if (strArray[1] === '}' || strArray[1] === ']') {
                        print(`${char}${strArray[1]}`);
                        strArray = strArray.slice(1);
                    } else {
                        print(char);
                        tabCount++;
                        spaceReady = true;
                        key = true;
                    }
                    break;
                case ',':
                    print(`${char} `);
                    spaceReady = true;
                    key = true;
                    break;
                case '}':
                case ']':
                    tabCount--;
                    print(`\n${writeTabs(tabCount)}${char}`);
                    break;
                case ':':
                    key = false;
                    print(`${char} `);
                    break;
                case '"':
                    if (!key) print(char);
                    break;
                default:
                    const newLine = (spaceReady) ? `\n${writeTabs(tabCount)}` : '';
                    print(`${newLine}${char}`);
                    spaceReady = false;
                    break;
            }
    
            processStrArr(strArray.slice(1));
        }
    
        processStrArr(parsedStrArg);
    };
    
    const writeFunction = (argument) => {
        print(argument);
    };

    const writeError = (argument) => {
        print(argument.stack);
    };
    
    const writeLarge = (argument) => {
        if (argument instanceof Error) {
            writeError(argument);
        } else if (typeof argument === 'object') {
            writeObject(argument);
        } else if (typeof argument === 'function') {
            writeFunction(argument);
        }
    };

    args.forEach((argument, idx) => {
        if (typeof argument === 'object' || typeof argument === 'function') {
            writeLarge(argument);
        } else if (idx === 2) {
            const color = colors[argument.toLowerCase()];
            print(`${color}${argument}\x1b[0m `);
        } else {
            print(`${argument} `);
        }
    });
    print('\n');
};

module.exports = write;