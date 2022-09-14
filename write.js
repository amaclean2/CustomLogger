const colors = require("./colors");

const writeTabs = (count) => {
    let spaceString = '';
    for (let i = 0; i < count; i++) {
        spaceString += '  ';
    }

    return spaceString;
};

const usePrint = (level) => {
    return (lines, options) => {
        lines.forEach((line) => {
            if (line.length) {
                line += '\n';
                if (['error', 'fatal'].includes(level.toLowerCase())) {
                    process.stderr.write(`\x1b[31m${line}\x1b[0m`)
                } else {
                    if (level.toLowerCase() === 'debug') {
                        process.stdout.write(`\x1b[30m${line}\x1b[0m`);
                    } else {
                        // console.log('line_here', line);
                        process.stdout.write(line);
                    }
                }
            }
        });
    };
};

const buildLarge = (argument) => {
    if (argument instanceof Error) {
        return buildError(argument);
    } else if (typeof argument === 'object') {
        return buildObject(argument);
    } else if (typeof argument === 'function') {
        return buildFunction(argument);
    }
};

const buildError = (argument) => {
    return argument.stack;
};

const buildFunction = (argument) => {
    return argument;
};

const buildObject = (argument) => {
    let objectStringified = '';

    const strArg = JSON.stringify(argument);
    const parsedStrArg = strArg.split('');

    objectStringified += '\n';

    let tabCount = 0;
    let spaceReady = false;
    let key = false;

    const processStrArr = (strArray, objString) => {
        if (!strArray.length) return objString;

        const char = strArray[0];

        switch (char) {
            case '{':
            case '[':
                if (strArray[1] === '}' || strArray[1] === ']') {
                    objString += `${char}${strArray[1]}`;
                    strArray = strArray.slice(1);
                } else {
                    objString += char;
                    tabCount++;
                    spaceReady = true;
                    key = true;
                }
                break;
            case ',':
                objString += `${char} `;
                spaceReady = true;
                key = true;
                break;
            case '}':
            case ']':
                tabCount--;
                objString += `\n${writeTabs(tabCount)}${char}`;
                break;
            case ':':
                key = false;
                objString += `${char} `;
                break;
            case '"':
                if (!key) objString += char;
                break;
            default:
                const newLine = (spaceReady) ? `\n${writeTabs(tabCount)}` : '';
                objString += `${newLine}${char}`;
                spaceReady = false;
                break;
        }

        return processStrArr(strArray.slice(1), objString);
    }

    return processStrArr(parsedStrArg, objectStringified);
};

const formatter = (args) => {
    const lines = [];
    let workingLine = [];

    const addToLine = (str) => {
        if (typeof str === 'string' && str.includes('\n')) {
            const lineBreaks = str.split('\n');
            lineBreaks.forEach((line) => {
                workingLine.push(line);
                const stringifiedLine = workingLine.join(' ');
                lines.push(stringifiedLine);
                workingLine = [];
            });
        } else {
            workingLine.push(str);
        }
    }

    const sortArgumentType = (argument, idx) => {
        if (idx >= 3) {
            argument.forEach((param) => {
                sortArgumentType(param, 0)
            })
        } else if (typeof argument === 'object' || typeof argument === 'function') {
            addToLine(buildLarge(argument))
        } else if (idx === 2) {
            const color = colors[argument.toLowerCase()]
            addToLine(`${color}${argument}\x1b[0m`)
        } else {
            addToLine(argument)
        }
    }

    args.forEach(sortArgumentType);

    const stringifiedLine = workingLine.join(' ');
    lines.push(stringifiedLine);

    return lines;
}

const write = (...args) => {
    const print = usePrint(args[2]);
    const lines = formatter(args);

    print(lines);
};

module.exports = write;