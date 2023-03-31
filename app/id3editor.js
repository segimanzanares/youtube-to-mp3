const NodeID3 = require('node-id3')
const fs = require('fs')
const path = require('path');

const readDirectory = directoryPath => {
    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err)
        }
        files.forEach(function (file) {
            if (!file.endsWith('.mp3')) {
                return;
            }
            console.log(file)
            readId3Tags(path.join(directoryPath, file))
        })
    })
}

const readId3Tags = filePath => {
    const id3Tags = NodeID3.read(filePath)
    const name = path.basename(filePath, '.mp3')
    const index = name.lastIndexOf('-')
    let tags = {
        title: titleCase(id3Tags.title),
        artist: titleCase(id3Tags.artist),
    }
    if (index !== -1 && index < name.length - 1) {
        tags.artist = titleCase(name.substring(0, index).trim())
        tags.artist = tags.artist.replace(/(feat\.|ft\.|,)/ig, '|').split('|').map(a => a.trim()).join(' / ')
        tags.title = titleCase(name.substring(index + 1).trim())
    }
    console.log(tags)
}

const titleCase = (str) => {
    if (!str) {
        return str
    }
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

if (process.argv.length > 2) {
    readDirectory(process.argv[2])
}
