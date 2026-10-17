// Web Audio API procedural sound generator (100% offline, zero asset downloads required)

class SoundEngine {
  private ctx: AudioContext | null = null;
  private rainGain: GainNode | null = null;
  private noiseGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Create pink/brown noise buffer for natural rain sound
  private createNoiseBuffer(): AudioBuffer {
    const bufferSize = this.ctx!.sampleRate * 2;
    const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      data[i] = (b0 + b1 + b2) * 0.11;
    }
    return buffer;
  }

  setRainVolume(volume: number) {
    this.initContext();
    if (!this.rainGain) {
      this.rainGain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx!.currentTime);

      const buffer = this.createNoiseBuffer();
      const noiseSource = this.ctx!.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;
      noiseSource.connect(filter);
      filter.connect(this.rainGain);
      this.rainGain.connect(this.ctx!.destination);
      noiseSource.start();
    }
    this.rainGain.gain.setValueAtTime(volume, this.ctx!.currentTime);
  }

  setWhiteNoiseVolume(volume: number) {
    this.initContext();
    if (!this.noiseGain) {
      this.noiseGain = this.ctx!.createGain();
      const buffer = this.ctx!.createBuffer(1, this.ctx!.sampleRate * 2, this.ctx!.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.05;
      }

      const noiseSource = this.ctx!.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;
      noiseSource.connect(this.noiseGain);
      this.noiseGain.connect(this.ctx!.destination);
      noiseSource.start();
    }
    this.noiseGain.gain.setValueAtTime(volume, this.ctx!.currentTime);
  }

  stopAll() {
    if (this.rainGain) this.rainGain.gain.setValueAtTime(0, this.ctx?.currentTime || 0);
    if (this.noiseGain) this.noiseGain.gain.setValueAtTime(0, this.ctx?.currentTime || 0);
  }
}

export const proceduralSoundEngine = new SoundEngine();
