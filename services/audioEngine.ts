/**
 * Web Audio API Noise Generator
 * Generates white, brown, and pink noise procedurally - zero file downloads needed.
 */

type NoiseType = 'white' | 'brown' | 'pink';

export class NoiseGenerator {
  private ctx: AudioContext | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private _isPlaying = false;

  get isPlaying(): boolean {
    return this._isPlaying;
  }

  private createBuffer(type: NoiseType): AudioBuffer {
    const ctx = this.ctx!;
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * 4; // 4-second buffer (will loop)
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    switch (type) {
      case 'white':
        for (let i = 0; i < length; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        break;

      case 'brown': {
        let last = 0;
        for (let i = 0; i < length; i++) {
          const white = Math.random() * 2 - 1;
          last = (last + 0.02 * white) / 1.02;
          data[i] = last * 3.5; // amplify
        }
        break;
      }

      case 'pink': {
        // Paul Kellet's refined method for pink noise
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < length; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
          b6 = white * 0.115926;
        }
        break;
      }
    }

    return buffer;
  }

  play(type: NoiseType, volume: number = 0.8): void {
    this.stop();

    this.ctx = new AudioContext();
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = volume;
    this.gainNode.connect(this.ctx.destination);

    const buffer = this.createBuffer(type);
    this.sourceNode = this.ctx.createBufferSource();
    this.sourceNode.buffer = buffer;
    this.sourceNode.loop = true;
    this.sourceNode.connect(this.gainNode);
    this.sourceNode.start();

    this._isPlaying = true;
  }

  pause(): void {
    if (this.ctx && this._isPlaying) {
      this.ctx.suspend();
      this._isPlaying = false;
    }
  }

  resume(): void {
    if (this.ctx && !this._isPlaying) {
      this.ctx.resume();
      this._isPlaying = true;
    }
  }

  setVolume(volume: number): void {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  stop(): void {
    if (this.sourceNode) {
      try { this.sourceNode.stop(); } catch {}
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }
    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
    this._isPlaying = false;
  }
}

/** Check if a sound URL is a generated noise type */
export function isGeneratedNoise(url: string): boolean {
  return url.startsWith('generate:');
}

/** Extract noise type from URL like 'generate:white' */
export function getNoiseType(url: string): NoiseType {
  return url.split(':')[1] as NoiseType;
}
