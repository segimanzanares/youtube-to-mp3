//import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import sanitize from "sanitize-filename";
import Store from "electron-store";
import Queue from 'queue';
import ytdl from '@distube/ytdl-core';

const q = new Queue({ results: [] })
q.concurrency = 1
const store = new Store()
let downloads = []

const ffmpegSync = (event, info) => {
    return new Promise((resolve, reject) => {
        const index = downloads.findIndex(d => d.videoId === info.videoId)
        if (index !== -1 && downloads[index].status === 'canceled') {
            return resolve()
        }
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
            .on('error', (err) => {
                return reject(new Error(err))
            })
    })
 }

export const handleYoutubeDownloadAudio = async (event, videoId, title) => {
    const starttime = Date.now();
    let info = {
        videoId: videoId,
        title: title,
        startedAt: starttime,
        finishedAt: null,
        status: 'waiting',
        details: "Esperando..."
    }
    downloads.push(info)
    event.sender.send('audioprogress', JSON.stringify(info))
    // Iniciar job
    async function job(cb) {
        try {
            await ffmpegSync(event, info)
        } catch (e) {
            console.error(e);
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
    return info
}

export const handleCancelDownload = (event, videoId) => {
    const index = downloads.findIndex(d => d.videoId === videoId)
    if (index !== -1 && downloads[index].status === 'waiting') {
        downloads[index].status = 'canceled'
        downloads[index].details = 'Cancelado'
        event.sender.send('audioprogress', JSON.stringify(downloads[index]))
        return true
    }
    return false
}

/*export default {
    handleYoutubeDownloadAudio,
    handleCancelDownload,
}*/