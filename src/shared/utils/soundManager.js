import { Howl } from 'howler';

let spinSound = null;

/**
 * Initialize and play the spin sound effect
 */
export function playSpinSound() {
  try {
    if (!spinSound) {
      spinSound = new Howl({
        src: ['/sounds/spin.mp3'],
        volume: 0.5,
        preload: true,
      });
    }
    
    spinSound.play();
  } catch (error) {
    console.warn('Failed to play spin sound:', error);
  }
}
