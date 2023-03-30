const colors = require("./colors")

const TAB = '  '

const writeTabs = (count) => {
    return Array(count).fill(TAB).join('')
}

const usePrint = (level) => {
    return (lines) => {
        lines.forEach((line) => {
            if (line.length) {
                line += '\n'
                if (['error', 'fatal'].includes(level.toLowerCase())) {
                    process.stderr.write(`\x1b[31m${line}\x1b[0m`)
                } else {
                    if (level.toLowerCase() === 'debug') {
                        process.stdout.write(`\x1b[30m${line}\x1b[0m`)
                    } else {
                        // console.log('line_here', line)
                        process.stdout.write(line)
                    }
                }
            }
        })
    }
}

const buildLarge = (argument) => {
    if (argument instanceof Error) {
        return buildError(argument)
    } else if (typeof argument === 'object') {
        return buildObject(argument)
    } else if (typeof argument === 'function') {
        return buildFunction(argument)
    }
}

const buildError = (argument) => {
    return `${argument.stack}`
}

const buildFunction = (argument) => {
    return argument
}

const buildObject = (argument) => {
    let objectStringified = ''

    const strArg = JSON.stringify(argument)
    const splitCharStrArr = strArg.split('')

    objectStringified += '\n'

    let tabCount = 0
    let tabsReady = false
    let isKey = false

    const processStrArr = (strArray, objString) => {
        if (!strArray.length) return objString

        const char = strArray[0]

        switch (char) {
            case '{':
            case '[':
                if (strArray[1] === '}' || strArray[1] === ']') {
                    objString += `${objString.length && '\n' + writeTabs(tabCount)}${char}${strArray[1]}`
                    strArray = strArray.slice(1)
                } else {
                    const testStringOtherCharacters = strArray.join('').replace(/[\[|\]|\{|\}|\(|\)]/g, '')

                    if (!testStringOtherCharacters.length) {
                        objString += strArray.join('')
                        strArray = ''
                        break
                    }

                    objString += objString.length ? `\n${writeTabs(tabCount)}${char}` : char
                    tabCount++
                    tabsReady = true
                    isKey = true
                }
                break
            case ',':
                objString += `${char} `
                tabsReady = true
                isKey = true
                break
            case '}':
            case ']':
                tabCount--
                objString += `\n${writeTabs(tabCount)}${char}`
                break
            case ':':
                isKey = false
                objString += `${char} `
                break
            case '"':
                if (!isKey) objString += char
                break
            default:
                const newLine = (tabsReady) ? `\n${writeTabs(tabCount)}` : ''
                objString += `${newLine}${char}`
                tabsReady = false
                break
        }

        return processStrArr(strArray.slice(1), objString)
    }

    return processStrArr(splitCharStrArr, objectStringified)
}

const formatter = ({ dateFormat, name, level, message }) => {
    const lines = []
    let workingLine = []

    const addToLine = (str) => {
        if (str.includes('\n')) {
            const lineBreaks = str.split('\n')
            lineBreaks.forEach((line) => {
                workingLine.push(line)
                const stringifiedLine = workingLine.join(' ')
                lines.push(stringifiedLine)
                workingLine = []
            })
        } else {
            workingLine.push(str)
        }
    }

    addToLine(dateFormat)
    addToLine(name)

    const color = colors[level.toLowerCase()]
    addToLine(`${color}${level}\x1b[0m`)

    message.forEach((block) => {
        if (typeof block === 'object' || typeof block === 'function') {
            addToLine(buildLarge(block))
        } else {
            addToLine(block)
        }
    })


    const stringifiedLine = workingLine.join(' ')
    lines.push(stringifiedLine)

    return lines
}

const write = ({ dateFormat, name, level, message }) => {
    
    if (!( dateFormat && name && level )) {
        usePrint('error')([buildLarge(new Error(message))])
        return
    }

    const lines = formatter({ dateFormat, name, level, message })

    usePrint('level')(lines)
    return lines.join(' ')
}

module.exports = write