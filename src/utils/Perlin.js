import PerlinGenerator from './PerlinGenerator';

export default class PerlinNoise {
  constructor(seedX = 1, seedY = 1) {
    this.octaves = 4;
    this.fallout = 0.5;
    // Aseguramos que siempre haya un generador inicializado
    this.setSeed(seedX, seedY);
  }

  updateDetail(octaves, fallout) {
    this.octaves = octaves;
    if (fallout !== null) {
      this.fallout = fallout;
    }
  }

  setSeed(x, y) {
    this.generator = new PerlinGenerator(x, y);
  }

  noise(x, y) {
    // Verificación adicional para asegurar que el generador exista
    if (!this.generator) {
      this.setSeed(1, 1);
    }
    
    let effect = 1;
    let k = 1;
    let sum = 0;

    for (let i = 0; i < this.octaves; ++i) {
      effect *= this.fallout;
      sum += effect * (1 + this.generator.noise2d(k * x, k * y)) / 2;
      k *= 2;
    }
    return sum;
  }
}