const NodeID3 = require('node-id3')
const fs = require('fs')
const path = require('path');

const readDirectoryAudioTags = directoryPath => {
    let filesTags = [];
    fs.readdirSync(directoryPath).forEach(file => {
        if (!file.endsWith('.mp3')) {
            return
        }
        filesTags.push({
            path: path.join(directoryPath, file),
            name: path.basename(file),
            tags: readId3Tags(path.join(directoryPath, file))
        })
    })
    return filesTags
}

const readId3Tags = filePath => {
    const id3Tags = NodeID3.read(filePath)
    return {
        title: titleCase(id3Tags.title),
        artist: titleCase(id3Tags.artist),
    }
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
    readTagsFromDirectory(process.argv[2])
}

module.exports = {
    readDirectoryAudioTags,
}