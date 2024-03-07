# YoutubeToMp3

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.4 and Electron 6.1.1

## View Development server

Run `cd renderer && ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Run Electron App

Run `npm run electron` for start the electron application. View will be compiled and server side will be started within the Electron app.

## Build .deb package

Run `npm run make -- --targets=@electron-forge/maker-deb` to build the .deb file. The build artifacts will be stored in the `out/make/` directory.
