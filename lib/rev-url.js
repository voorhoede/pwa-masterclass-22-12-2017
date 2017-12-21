const fs = require('fs');

const revConfig = require('./rev-config');
const revManifest = JSON.parse(fs.readFileSync(`${revConfig.outputDir}${revConfig.manifestFilename}`, { encoding: 'utf-8' }));

module.exports = function revUrl(url) {
    url = url.startsWith('/') ? url.substr(1) : url;
    if (revManifest.hasOwnProperty(url)) {
        const revUrl = revManifest[url];
        const revFile = fs.statSync(revConfig.outputDir + revUrl);
        if (revFile.isFile()) {
            const originalFile = fs.statSync(revConfig.inputDir + url);
            if (!originalFile.isFile() || revFile.mtime.getTime() > originalFile.mtime.getTime()) {
                return `/${revUrl}`;
            }
        }
    }
    return `/${url}`;
}
