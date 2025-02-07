export default class Game {
  constructor() {
    this.layers = {};
  }

  add(entities, layerId = 10) {
    this.layers[layerId] = (this.layers[layerId] || []).concat(entities);
  }

  remove(entity, layerId = 10) {
    this.layers[layerId] = (this.layers[layerId] || [])
      .filter(e => e != entity);
  }

  gS(layerFilter = () => true) {
    const layerIds = Object.keys(this.layers).sort().filter(layerFilter);
    const sprites = layerIds
      .sort((a, b) => parseInt(a) - parseInt(b))
      .flatMap(layerId => {
        const layer = this.layers[layerId];

        return layer.flatMap(o => o.gS());
      });

    return sprites.flat().filter(s => s.isAlive());
  }

  /*
    getClosest(player, 'monster');
  */
  getClosest(source, type) {
    const sprites = this.gS(l => l.type !== "t");
    const spritesOfType = sprites.filter(s => s !== source && s.type === type);
    const getDistance = (a, b) =>
      Math.sqrt(
        Math.pow(Math.abs(a.x - b.x), 2) + Math.pow(Math.abs(a.y - b.y), 2)
      );
    const sortedSprites = spritesOfType.sort((a, b) => {
      return getDistance(source, a) - getDistance(source, b);
    });

    return (
      sortedSprites[0] && {
        distance: getDistance(source, sortedSprites[0]),
        sprite: sortedSprites[0]
      }
    );
  }

  findCurrentPlatform(playerX) {
    return this.entities.find(entity => {
      return (
        entity.type === "platform" &&
        entity.x <= playerX &&
        entity.x + entity.width >= playerX
      );
    });
  }
}
