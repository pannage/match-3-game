// audio.src = `../sounds/${word}.mp3`;

export function playAudio(word) {
  const audio = new Audio(`../sounds/${word}.mp3`);

  audio.load();
  audio.play();
}

export function pauseAudio() {
  audio.pause();
}
