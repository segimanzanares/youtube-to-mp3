var queue = require('queue')
var q = queue({ results: [] })

q.on('success', function (result, job) {
    console.log('job finished processing:', job.toString().replace(/\n/g, ''))
    console.log('The result is:', result)
})

const handleYoutubeDownloadAudio = (event, ...videoID) => {
    console.log("Handle download")
    console.log(videoID)
    event.sender.send('audioprogress', `test downloaded mp3`);
    function superSlowJob(cb) {
        setTimeout(function () {
            console.log('super slow job finished')
            event.sender.send('audioprogress', `finished downloaded mp3`);
            cb(null, 'download')
        }, 4000)
    }
    superSlowJob.timeout = null
    q.push(superSlowJob)
    q.start(function (err) {
        if (err) throw err
        console.log('all new done:', q.results)
    })
}

module.exports = {
    handleYoutubeDownloadAudio,
}