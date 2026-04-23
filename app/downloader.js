import sanitize from "sanitize-filename";
import Store from "electron-store";
import Queue from 'queue';
import log from 'electron-log/node.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';
import { platform } from 'os';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const q = new Queue({ results: [] });
q.concurrency = 1;
const store = new Store();
let downloads = [];
const activeProcesses = new Map();

const getYtDlpBin = () => {
    if (platform() === 'win32') {
        const paths = [
            'yt-dlp.exe',
            'C:\\yt-dlp\\yt-dlp.exe',
        ];
        return paths.find(p => existsSync(p)) ?? 'yt-dlp.exe';
    }
    return 'yt-dlp';
};

const getNodePath = () => {
    const nvmBin = process.env.NVM_BIN;
    if (nvmBin) {
        const nvmNode = `${nvmBin}/node`;
        if (existsSync(nvmNode)) return nvmNode;
    }
    try {
        return execFileSync('which', ['node']).toString().trim();
    } catch {
        return '/usr/bin/node';
    }
};

const ffmpegSync = (event, info) => {
    return new Promise((resolve, reject) => {
        const index = downloads.findIndex(d => d.videoId === info.videoId);
        if (index !== -1 && downloads[index].status === 'canceled') {
            return resolve();
        }

        info.status = 'downloading';
        info.details = 'Descargando';
        event.sender.send('audioprogress', JSON.stringify(info));

        const filename = sanitize(info.title) + '.mp3';
        const directory = store.get('download-folder') ?? __dirname;
        const outputPath = `${directory}/${filename}`;

        const ytDlp = execFile(getYtDlpBin(), [
            `https://www.youtube.com/watch?v=${info.videoId}`,
            '--extract-audio',
            '--audio-format', 'mp3',
            '--audio-quality', '0',
            '-o', outputPath,
            '--no-playlist',
            '--no-continue',
            '--newline',
            '--progress',
            '--progress-template', '%(progress._percent_str)s|%(progress._speed_str)s|%(progress._eta_str)s',
            '--js-runtimes', `node:${getNodePath()}`,
            '--ffmpeg-location', '/usr/bin/',
        ], {
            env: {
                ...process.env,
                PATH: `${process.env.PATH}:/usr/bin:/usr/local/bin:${process.env.NVM_BIN ?? ''}`,
            }
        });
        activeProcesses.set(info.videoId, ytDlp);

        ytDlp.stdout.on('data', (data) => {
            const line = data.toString().trim();
            if (!line) return;

            // Parsear líneas de progreso con el template definido
            // Formato: "45.3%|1.23MiB/s|00:12"
            const parts = line.split('|');
            if (parts.length === 3 && parts[0].includes('%')) {
                const percent = parts[0].trim();
                const speed = parts[1].trim();
                const eta = parts[2].trim();

                info.status = 'downloading';
                info.details = `${percent} · ${speed} · ETA ${eta}`;
                event.sender.send('audioprogress', JSON.stringify(info));
            }
        });

        ytDlp.stderr.on('data', (data) => {
            console.error('[yt-dlp stderr]', data.toString());
        });

        ytDlp.on('close', (code) => {
            // Limpiar referencia al proceso
            activeProcesses.delete(info.videoId);

            if (code === 0) {
                info.status = 'finished'
                info.details = "Finalizado"
                info.finishedAt = Date.now()
                event.sender.send('audioprogress', JSON.stringify(info));
                resolve();
            } else {
                // Código 1 puede ser cancelación
                const wasCanceled = downloads.find(d => d.videoId === info.videoId)?.status === 'canceled';
                if (wasCanceled) {
                    resolve();
                } else {
                    reject(new Error(`yt-dlp salió con código ${code}`));
                }
            }
        });

        ytDlp.on('error', (err) => {
            reject(new Error(`No se pudo ejecutar yt-dlp: ${err.message}`));
        });
    });
};

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
            log.error(e);
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
        event.sender.send('audioprogress', JSON.stringify(downloads[index]));
        const proc = activeProcesses.get(videoId);
        if (proc) {
            proc.kill('SIGTERM');
            activeProcesses.delete(videoId);
        }
        return true
    }
    return false
}