const fs = require('fs')
const {parser} = require('./parser')

const fileName = process.argv[2]
// ディレクトリかどうかを判断
const isDirectory = fs.lstatSync(fileName).isDirectory()

// ファイルを入力するための最後の文字列
let assembleOut = ''
// 最終出力のファイル名
let outputFileName


if (isDirectory) {
    outputFileName = fileName
    fs.readdir(fileName, (err, files) => {
        if (err) {
            throw err
        }

        // ディレクトリ内のファイルをループ
        files.forEach(file => {
            let tempArry = file.split('.')
            if (tempArry.pop() == 'vm') {
                let preName = tempArry.join('.')
                let data = fs.readFileSync(`${fileName}/${file}`, 'utf-8')
                processFileData(data, preName)
            } 
        })

        setFileName()
    })
} else {
    // a.b.cと同様の形式でファイルを処理
    let tempArry = fileName.split('.')
    tempArry.pop() 
    let preName = tempArry.join('.')
    outputFileName = preName
    let data = fs.readFileSync(fileName, 'utf-8')
    processFileData(data, preName)

    setFileName()
}

// ファイルデータを処理
function processFileData(data, preName) {
    data = data.split('\r\n')
    assembleOut += parser(data, preName)
}

// 出力ファイル
function setFileName() {
    fs.writeFile(outputFileName + '.asm', assembleOut, (err) => {
        if (err) {
            throw err
        }
    })
}