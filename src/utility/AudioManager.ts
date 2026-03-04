import Sound from 'react-native-sound';

class AudioManager {
  private static instance: AudioManager | null = null;
  public currentAudio: Sound | null = null;

  public static getInstance(): AudioManager {
    if (this.instance === null) {
      this.instance = new AudioManager();
    }
    return this.instance;
  }

  public setAudio(audio: Sound): void {
    if (this.currentAudio && this.currentAudio !== audio) {
      this.currentAudio.pause();
    }
    this.currentAudio = audio;
  }

  public reset(): void {
    this.currentAudio = null;
  }
}

export default AudioManager;
