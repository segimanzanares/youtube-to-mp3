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

const readTagsFromFileName = filePath => {
    const id3Tags = NodeID3.read(filePath)
    const name = path.basename(filePath, '.mp3')
    const index = name.lastIndexOf(' - ')
    let tags = {
        title: titleCase(id3Tags.title),
        artist: titleCase(id3Tags.artist),
    }
    if (index !== -1 && index < name.length - 3) {
        tags.artist = titleCase(name.substring(0, index).trim())
        tags.artist = tags.artist.replace(/(feat\.|ft\.|,)/ig, '|').split('|').map(a => a.trim()).join(' / ')
        tags.title = titleCase(name.substring(index + 3).trim())
    }
    else {
        tags.title = titleCase(name)
    }
    return tags;
}

const saveAudioTags = audioFile => {
    try {
        NodeID3.update(audioFile.tags, audioFile.path)
    } catch (err) {
        NodeID3.write(audioFile.tags, audioFile.path)
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
    const directoryPath = process.argv[2]
    fs.readdirSync(directoryPath).forEach(file => {
        if (!file.endsWith('.mp3')) {
            return
        }
        console.log({
            path: path.join(directoryPath, file),
            name: path.basename(file),
            tags: readTagsFromFileName(path.join(directoryPath, file))
        })
    })
}

module.exports = {
    readDirectoryAudioTags,
    readTagsFromFileName,
    saveAudioTags,
}