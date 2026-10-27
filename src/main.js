import './style.css';
import { sound } from './systems/audio.js';
import { SplashScene } from './scenes/SplashScene.js';
import { RoleSelectScene } from './scenes/RoleSelectScene.js';
import { HiringScene } from './scenes/HiringScene.js';
import { CharacterSelectScene } from './scenes/CharacterSelectScene.js';
import { TutorialScene } from './scenes/TutorialScene.js';
import { CollectorScene3D } from './scenes/CollectorScene3D.js';
import { DriverScene3D } from './scenes/DriverScene3D.js';
import { SummaryScene } from './scenes/SummaryScene.js';

class GameEngine {
  constructor() {
    this.container = document.querySelector('#scene-root');
    this.currentScene = null;
    this.gameState = {
      selectedRole: null, // 'collector' | 'driver'
      education: null,
      character: null,
      truckColor: null,
      collectorResult: null,
      driverResult: null
    };

    this.scenes = {
      splash: SplashScene,
      roleSelect: RoleSelectScene,
      hiring: HiringScene,
      characterSelect: CharacterSelectScene,
      tutorial: TutorialScene,
      collector: CollectorScene3D,
      driver: DriverScene3D,
      summary: SummaryScene
    };

    this.initGlobalControls();
  }

  initGlobalControls() {
    const muteBtn = document.querySelector('#btn-mute-toggle');
    const updateMuteIcon = () => {
      muteBtn.textContent = sound.isMuted() ? '🔇' : '🔊';
    };

    muteBtn.addEventListener('click', () => {
      sound.toggleMute();
      updateMuteIcon();
    });

    updateMuteIcon();

    // Home / Menu Button
    document.querySelector('#btn-home-toggle').addEventListener('click', () => {
      sound.playClick();
      if (confirm('প্রধান মেনুতে ফিরে যেতে চান? বর্তমান গেম সেশন রিসেট হবে।')) {
        sound.restoreBGMVolume(); // মেনুতে ফিরে নিলে গান full volume হবে
        this.changeScene('splash');
      }
    });
  }

  changeScene(sceneName) {
    if (this.currentScene && typeof this.currentScene.destroy === 'function') {
      this.currentScene.destroy();
    }

    const SceneClass = this.scenes[sceneName];
    if (!SceneClass) {
      console.error(`Scene ${sceneName} not found!`);
      return;
    }

    this.currentScene = new SceneClass(this);
    this.container.innerHTML = '';
    this.currentScene.render(this.container);
  }

  start() {
    this.changeScene('splash');
  }
}

// Boot application
window.addEventListener('DOMContentLoaded', () => {
  const engine = new GameEngine();
  engine.start();
});
