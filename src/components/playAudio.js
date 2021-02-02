const audioLevel = new Audio();
const audioEffect = new Audio();

export function playAudioLevel(word) {
    audioLevel.src = `../sounds/levels-audio/${word}.mp3`;
    audioLevel.load();
    audioLevel.volume = 0.1;
    audioLevel.play();
}

export function volumeOff() {
    audioLevel.volume = 0;
}

export function volumeOn() {
    audioLevel.volume = 0.1;
}

export function pauseAudioLevel() {
    audioLevel.pause();
}

export function playAudioEffect(word) {
    audioEffect.src = `../sounds/effects-audio/${word}.mp3`;
    audioEffect.load();
    audioEffect.play();
}
