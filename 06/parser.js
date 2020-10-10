const table = require('./symbol-table')
const {addEntry, contains, getAddress} = table
let {ramAddress} = table
const code = require('./code')
const {dest, comp, jump} = code

// AまたはC命令が発生するたびにカウンタ+1
let pc = -1

function parser(instructions, isFirst) {
    return advance(instructions, isFirst)
}

function hasMoreCommands(instructions) {
    return instructions.length > 0? true : false
}

// 指示のコメントと一致する
const reg3 = /(\/\/).+/
function advance(instructions, isFirst) {
    let current, type, binaryOut = ''
    while (hasMoreCommands(instructions)) {
        current = instructions.shift().trim()

        if (isInstructionInvalid(current)) {
            continue
        }
        //  指示の右側にコメントがある場合は、それを削除
        current = current.replace(reg3, '').trim()
        type = commandType(current)

        // isFirst最初の解析では命令は解析されず、シンボルのみが収集される 形式：（xxx）
        switch (type) {
            case 'C':
                if (!isFirst) {
                    let d = dest(current)
                    let c = comp(current)
                    let j = jump(current)
                    binaryOut += '111' + c + d + j + '\r\n'
                } else {
                    pc++
                }
                
                break
            case 'A':
                if (!isFirst) {
                    let token = symbol(current, type)
                    let binary
                    if (isNaN(parseInt(token))) {
                        if (contains(token)) {
                            binary = int2Binary(getAddress(token))
                        } else {
                            binary = int2Binary(ramAddress)
                            addEntry(token, ramAddress++)
                        }
                    } else {
                        binary = int2Binary(token)
                    }
                    binaryOut += binary + '\r\n'
                } else {
                    pc++
                }
                
                break
            case 'L':
                if (isFirst) {
                    let token = symbol(current, type)
                    addEntry(token, pc + 1)
                }
                break
        }
    }

    return binaryOut
}
// 戻り命令タイプ
function commandType(instruction) {
    if (instruction.charAt(0) === '@') {
        return 'A'
    } else if (instruction.charAt(0) === '(') {
        return 'L'
    } else {
        return 'C'
    }
}
// （xxx）から@xxxまたはxxxを抽出
const reg1 = /^\((.+)\)$/
function symbol(instruction, type) {
    if (type === 'A') {
        return instruction.substr(1)
    } else if (type === 'L') {
        return instruction.replace(reg1, '$1')
    }
}
// 10進数をバイナリ命令に変換する
function int2Binary(num) {
    let str = parseInt(num).toString(2)

    while (str.length !== 16) {
        str = '0' + str
    }

    return str
}
// コメントで始まる文を一致させる
const reg2 = /^(\/\/)/
// 命令が有効か
function isInstructionInvalid(instruction) {
    if (instruction == '' || reg2.test(instruction)) {
        return true
    }

    return false
}

module.exports = parser