const fs = require('fs')
const JackTokenizer = require('./tokenizer.js')
const CompilationEngine = require('./compilation.js')

const fileName = process.argv[2]

const isDirectory = fs.lstatSync(fileName).isDirectory()

if (isDirectory) {
    fs.readdir(fileName, (err, files) => {
        if (err) {
            throw err
        }

        files.forEach(file => {
            let tempArry = file.split('.')
            if (tempArry.pop() == 'jack') {
                let preName = tempArry.join('.')
                let data = fs.readFileSync(`${fileName}/${file}`, 'utf-8')
                
                processFileData(data, `${fileName}/${preName}`)
            } 
        })
    })
} else {
    // a.b.cと同様の形式でファイルを処理
    let tempArry = fileName.split('.')
    if (tempArry.pop() == 'jack') {
        let preName = tempArry.join('.')
        let data = fs.readFileSync(fileName, 'utf-8')
        processFileData(data, preName)
    }
}

// ファイルデータを処理する
function processFileData(data, path) {
    data = data.split(/\r\n|\n/)
    const tokens = new JackTokenizer(data, path).getTokens()
    new CompilationEngine(tokens, path)
}  

function setFileName(name, data) {
    fs.writeFile(name + '.vm', data, (err) => {
        if (err) {
            throw err
        }
    })
}