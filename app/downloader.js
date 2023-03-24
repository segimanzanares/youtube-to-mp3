const ytdl = require('ytdl-core')
const ffmpeg = require('fluent-ffmpeg')
const sanitize = require("sanitize-filename")
const Store = require("electron-store")
const queue = require('queue')

let q = queue({ results: [] });
q.concurrency = 1;
const store = new Store();

const ffmpegSync = (event, info) => {
    return new Promise((resolve, reject) => {
        let stream = ytdl(info.videoId, {
            quality: 'highestaudio',
        })
        const filename = sanitize(info.title) + '.mp3'
        const directory = store.get('download-folder') ?? __dirname;
        ffmpeg(stream)
            .audioBitrate(128)
            .save(`${directory}/${filename}`)
            .on('progress', progress => {
                info.details = `${progress.targetSize}kb`
                event.sender.send('audioprogress', JSON.stringify(info));
            })
            .on('end', () => {
                info.details = `Finished`;
                info.finishedAt = Date.now();
                event.sender.send('audioprogress', JSON.stringify(info));
                resolve()
            })
            .on('error',(err)=>{
                return reject(new Error(err))
            })
    })
 }

const handleYoutubeDownloadAudio = async (event, ...args) => {
    console.log("Handle download")
    console.log(args[0])
    const starttime = Date.now();
    let info = {
        videoId: args[0],
        title: args[1],
        startedAt: starttime,
        finishedAt: null,
        details: "Starting..."
    }
    // Iniciar job
    let job = async (cb) => {
        event.sender.send('audioprogress', JSON.stringify(info))
        await ffmpegSync(event, info)
        cb(null, `download ${info.videoId}`)
    }
    job.timeout = null
    q.push(job)
    q.start()
}

module.exports = {
    handleYoutubeDownloadAudio,
}