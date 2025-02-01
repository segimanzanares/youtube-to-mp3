const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const path = require('path');

module.exports = {
    packagerConfig: {
        asar: false,
        ignore: [
            "renderer",
            ".nvmrc",
            ".gitignore",
            ".editorconfig",
            ".vscode"
        ]
    },
    rebuildConfig: {},
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {
                name: "Youtube2MP3",
                authors: "Segi Manzanares",
                description: "App for downloading mp3 audio from Youtube videos.",
                iconUrl: path.join(__dirname, "/app/assets/images/icon.png"),
                //setupIcon: path.join(__dirname, "/app/assets/images/icon.ico")
            }
        },
        {
            name: '@electron-forge/maker-zip',
            platforms: ['darwin'],
        },
        {
            name: '@electron-forge/maker-deb',
            config: {
                options: {
                    productName: "Youtube 2 MP3",
                    description: "App for downloading mp3 audio from Youtube videos.",
                    depends: [
                        "ffmpeg"
                    ],
                    icon: "./app/assets/images/icon.png",
                    maintainer: "Segi Manzanares",
                    homepage: "https://github.com/segimanzanares"
                }
            }
        },
        {
            name: '@electron-forge/maker-rpm',
            config: {},
        },
    ],
    plugins: [
        /*{
          name: '@electron-forge/plugin-auto-unpack-natives',
          config: {},
        },*/
        // Fuses are used to enable/disable various Electron functionality
        // at package time, before code signing the application
        new FusesPlugin({
            version: FuseVersion.V1,
            [FuseV1Options.RunAsNode]: false,
            [FuseV1Options.EnableCookieEncryption]: true,
            [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
            [FuseV1Options.EnableNodeCliInspectArguments]: false,
            [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
            [FuseV1Options.OnlyLoadAppFromAsar]: false,
        }),
    ],
};
