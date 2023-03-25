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
        info.status = 'downloading'
        info.details = "Descargando"
        event.sender.send('audioprogress', JSON.stringify(info))
        let stream = ytdl(info.videoId, {
            quality: 'highestaudio',
        })
        const filename = sanitize(info.title) + '.mp3'
        const directory = store.get('download-folder') ?? __dirname
        ffmpeg(stream)
            .audioBitrate(160)
            .save(`${directory}/${filename}`)
            .on('end', () => {
                info.status = 'finished'
                info.details = "Finalizado"
                info.finishedAt = Date.now()
                event.sender.send('audioprogress', JSON.stringify(info))
                resolve()
            })
            .on('error',(err)=>{
                return reject(new Error(err))
            })
    })
 }

const handleYoutubeDownloadAudio = async (event, ...args) => {
    const starttime = Date.now();
    let info = {
        videoId: args[0],
        title: args[1],
        startedAt: starttime,
        finishedAt: null,
        status: 'waiting',
        details: "Esperando..."
    }
    event.sender.send('audioprogress', JSON.stringify(info))
    // Iniciar job
    async function job(cb) {
        try {
            await ffmpegSync(event, info)
        } catch (e) {
            info.status = 'error'
            info.details = "Error"
            info.finishedAt = Date.now();
            event.sender.send('audioprogress', JSON.stringify(info))
        }
        cb(null, `download ${info.videoId}`)
    }
    job.timeout = null
    q.push(job)
    q.start()
}

module.exports = {
    handleYoutubeDownloadAudio,
}