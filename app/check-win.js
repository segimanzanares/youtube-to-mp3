import path from 'path';
import { spawn } from 'child_process';
import _debug from 'debug';
import { app } from 'electron';

const debug = _debug('electron-squirrel-startup');

function run(args, done) {
    const updateExe = path.resolve(path.dirname(process.execPath), '..', 'Update.exe');
    debug('Spawning `%s` with args `%s`', updateExe, args);
    spawn(updateExe, args, {
        detached: true,
    }).on('close', done);
}

function checkWinStartup() {
    if (process.platform === 'win32') {
        const cmd = process.argv[1];
        debug('processing squirrel command `%s`', cmd);
        const target = path.basename(process.execPath);

        if (cmd === '--squirrel-install' || cmd === '--squirrel-updated') {
            run(['--createShortcut=' + target + ''], app.quit);
            return true;
        }
        if (cmd === '--squirrel-uninstall') {
            run(['--removeShortcut=' + target + ''], app.quit);
            return true;
        }
        if (cmd === '--squirrel-obsolete') {
            app.quit();
            return true;
        }
    }
    return false;
}

export default checkWinStartup;