import nodeid3 from 'node-id3';
import { readdirSync } from 'fs';
import { join, basename } from 'path';

const { read, update, write } = nodeid3;

export const readDirectoryAudioTags = (directoryPath) => {
    let filesTags = [];
    readdirSync(directoryPath).forEach(file => {
        if (!file.endsWith('.mp3')) {
            return
        }
        filesTags.push({
            path: join(directoryPath, file),
            name: basename(file),
            tags: readId3Tags(join(directoryPath, file))
        })
    })
    return filesTags
}

const readId3Tags = (filePath) => {
    const id3Tags = read(filePath)
    return {
        title: id3Tags.title,
        artist: id3Tags.artist,
        album: id3Tags.album,
        year: id3Tags.year,
        image: id3Tags.image,
        genre: id3Tags.genre,
    }
}

export const readTagsFromFileName = (filePath) => {
    const id3Tags = read(filePath)
    const name = basename(filePath, '.mp3')
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

export const saveAudioTags = (audioFile) => {
    if (audioFile.tags.image) {
        audioFile.tags.image.imageBuffer = Buffer.from(audioFile.tags.image.imageBuffer)
    }
    try {
        update(audioFile.tags, audioFile.path)
    } catch (err) {
        write(audioFile.tags, audioFile.path)
    }
}

const titleCase = (str) => {
    if (!str) {
        return str
    }
    return str.replace(/\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}