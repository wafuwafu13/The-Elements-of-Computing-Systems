const table = require('./symbol-table')
const fs = require('fs')
const parser = require('./parser')

let fileName = process.argv[2]

fs.readFile(fileName, 'utf-8', (err, data) => {
    if (err) {
        throw err
    }
    // 行ごとの指示
    data = data.split('\r\n')

    // コレクションシンボルを初めて解決する
    parser([...data], true)

    // 実際の解析手順
    const binaryOut = parser(data)

    fileName = fileName.split('.')[0]

    fs.writeFile(fileName + '.hack', binaryOut, (err) => {
        if (err) {
            throw err
        }
    })
})
