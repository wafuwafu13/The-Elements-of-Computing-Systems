const {writeArithmetic, writePushPop} = require('./code-writer')

function parser(commands, fileName) {
    let output = ''
    while (hasMoreCommands(commands)) {
        // コマンドを1つずつポップアップ
        let command = commands.shift().trim()
        // コマンドが有効な場合
        if (isValidCommand(command)) {
            output += advance(command, fileName)
        }
    }

    return output
}

// 指示のコメントと一致する
const reg1 = /(\/\/).+/

function advance(command, fileName) {
    let output
    command = command.replace(reg1, '').trim()
    let type = commandType(command)

    switch (type) {
        case 'push':
        case 'pop':
            output = writePushPop(command, type, fileName)
            break
        case 'arith':
            output = writeArithmetic(command)
            break
    }

    return output
}

function hasMoreCommands(commands) {
    return commands.length > 0? true : false
}

const rePush = /^(push)/
const rePop = /^(pop)/

function commandType(command) {
    if (rePush.test(command)) {
        return 'push'
    } else if (rePop.test(command)) {
        return 'pop'
    } else {
        return 'arith'
    }
}

// 文章をコメントスイッチと一致させる
const reg2 = /^(\/\/)/

function isValidCommand(command) {
    if (command === '' || reg2.test(command)) {
        return false
    } 
    return true
}

module.exports = {
    parser
}