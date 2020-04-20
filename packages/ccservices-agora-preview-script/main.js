const {
    Router
} = require('express');
const {
    join
} = require('path');

const Paths = {
    sdkPath: join(__dirname, 'AgoraRTCSDK-2.5.2.js'),
    sdkURL: 'ccservices-scripts/AgoraRTCSDK-2.5.2.js',
};

module.exports = {

    router: null,

    load() {
        this.hookPreviewServer();
    },

    unload() {
        this.unhookPreviewServer();
    },

    insertSDK(settings, url) {
        let newSettings = null;
        if (settings.match(/jsList/)) {
            newSettings = settings.replace(/,\s*jsList\s*:\s*\[/, '$&' + JSON.stringify(url) + ', ');
        } else {
            var str = ',\n\tjsList: [' + JSON.stringify(url) + '],\n\tlaunchScene:';
            newSettings = settings.replace(/,\s*launchScene\s*:/, str);
        }
        if (newSettings === settings) {
            Editor.warn('Failed to send My Awesome SDK to the web preview.');
        }
        return newSettings;
    },

    getSettings(req, res, next) {
        let sendVendor = res.send;
        res.send = (content) => {
            content = this.insertSDK(content, Paths.sdkURL);
            sendVendor.call(res, content);
        };
        next();
    },

    getSDK(req, res) {
        res.sendFile(Paths.sdkPath);
    },

    hookPreviewServer() {
        if (this.router) return;
        this.router = Router();
        Editor.PreviewServer.userMiddlewares.push(this.router);
        this.router.get('/settings.js', this.getSettings.bind(this));
        this.router.get('/res/raw-' + Paths.sdkURL, this.getSDK.bind(this));
    },

    unhookPreviewServer() {
        cc.js.array.remove(Editor.PreviewServer.userMiddlewares, this.router);
        this.router = null;
    },
};