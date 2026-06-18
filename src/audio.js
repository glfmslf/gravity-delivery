const MUSIC_PATTERN = [196, 247, 294, 247, 220, 262, 330, 262];

export function createAudio({
  AudioContext = globalThis.AudioContext || globalThis.webkitAudioContext,
  setTimer = globalThis.setInterval,
  clearTimer = globalThis.clearInterval,
} = {}) {
  let context = null;
  let muted = false;
  let musicTimer = 0;
  let musicStep = 0;

  function getContext() {
    if (!AudioContext) {
      return null;
    }

    if (!context) {
      context = new AudioContext();
    }

    if (context.state === "suspended") {
      context.resume();
    }

    return context;
  }

  function playTone({ frequency, duration, type = "sine", volume = 0.06, slideTo = frequency }) {
    if (muted) {
      return;
    }

    const audioContext = getContext();
    if (!audioContext) {
      return;
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(slideTo, now + duration);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  function playMusicStep() {
    const frequency = MUSIC_PATTERN[musicStep % MUSIC_PATTERN.length];
    musicStep += 1;
    playTone({
      frequency,
      slideTo: frequency * 1.01,
      duration: 0.38,
      type: "triangle",
      volume: 0.018,
    });
  }

  function stopMusic() {
    if (!musicTimer) {
      return;
    }

    clearTimer(musicTimer);
    musicTimer = 0;
  }

  return {
    unlock() {
      getContext();
    },
    isMuted() {
      return muted;
    },
    toggleMuted() {
      muted = !muted;
      if (muted) {
        stopMusic();
      }

      return muted;
    },
    startMusic() {
      if (muted || musicTimer || !getContext()) {
        return;
      }

      playMusicStep();
      musicTimer = setTimer(playMusicStep, 480);
    },
    stopMusic,
    flip() {
      playTone({ frequency: 260, slideTo: 520, duration: 0.1, type: "triangle" });
    },
    hit() {
      playTone({ frequency: 150, slideTo: 70, duration: 0.16, type: "sawtooth", volume: 0.05 });
    },
    delivery() {
      playTone({ frequency: 440, slideTo: 660, duration: 0.13, type: "square", volume: 0.04 });
    },
    pickup() {
      playTone({ frequency: 620, slideTo: 920, duration: 0.1, type: "sine", volume: 0.05 });
    },
    success() {
      playTone({ frequency: 520, slideTo: 780, duration: 0.18, type: "triangle", volume: 0.05 });
    },
    failed() {
      playTone({ frequency: 220, slideTo: 90, duration: 0.24, type: "triangle", volume: 0.05 });
    },
  };
}
