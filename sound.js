// A simple sound manager using Howler.js

// IMPORTANT: You will need to create a 'sounds' folder and add your own sound files.
// You can find free sound effects on sites like freesound.org or zapsplat.com.

const sounds = {
    // Background music
    // background: new Howl({
    //     src: ['sounds/background.wav'],
    //     loop: true,
    //     volume: 0.3,
    //     html5: true // Helps with autoplay policies on some browsers
    // }),
    // Sound for hovering over a tile
    tileHover: new Howl({
        src: ['sounds/tilehover.mp3'],
        volume: 0.5
    }),
    // Sound for clicking/selecting a tile
    tileClick: new Howl({
        src: ['sounds/tileclick.wav'],
        volume: 0.7
    }),
    // Sound for a successful word
    success: new Howl({
        src: ['sounds/success.wav'],
        volume: 0.8
    }),
    // Sound for an error or invalid word
    error: new Howl({
        src: ['sounds/error.wav'],
        volume: 0.6
    })
};