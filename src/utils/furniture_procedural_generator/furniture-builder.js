export default function placeFurniture(scene, map, furnitureLayer) {

    let previousPlacedFurniture = {
        spriteIndex: -1,
        tileX: -1,
        tileY: -1
    }

    let firstTile = {i: -1, j: -1};
    
    for (let i = 0; i < map.width; i++) {
        for (let j = 0; j < map.height; j++) {
            const tile = map.getTileAt(i, j, false, furnitureLayer);
            if (tile !== null && firstTile.i === -1) {
                firstTile = {i: tile.x, j: tile.y};
            }
        }
    }

    const tile = map.getTileAt(firstTile.i, firstTile.j, false, furnitureLayer);
    let processedTiles = [];
    let addedSprites = [];
    tryPlaceSprite(scene, map, furnitureLayer, tile, previousPlacedFurniture, processedTiles, addedSprites);
}

function tryPlaceSprite(
    scene, map, furnitureLayer, 
    tile, previousSpriteData, 
    processedTiles, addedSprites) {
    
    if (tile === null) {
        return;
    }

    if (processedTiles.includes(tile)) {
        return;
    }

    processedTiles.push(tile);

    const leftTile = map.getTileAt(tile.x - 1, tile.y, false, furnitureLayer);
    const rightTile = map.getTileAt(tile.x + 1, tile.y, false, furnitureLayer);
    const bottomTile = map.getTileAt(tile.x, tile.y + 1, false, furnitureLayer);

    let shouldPlaceSprite = Math.random() * 10 < 5 
        && leftTile !== null && rightTile !== null && bottomTile !== null
        && previousSpriteData.tileX - tile.getCenterX() !== 0
        && previousSpriteData.tileY - tile.getCenterY() !== 0;
        
    let newPlacedSpriteData = null;
    if (shouldPlaceSprite) {
        let randomFurnitureInd;
        if (previousSpriteData.spriteIndex === -1) {
            randomFurnitureInd = Math.floor(Math.random() * 22);
        } else {
            let indexProbabilities = [];
            for (let i = 0; i < 6; i++) {
                indexProbabilities.push((previousSpriteData.spriteIndex + 1) % 23);
            }
            for (let i = 0; i < 4; i++) {
                indexProbabilities.push((previousSpriteData.spriteIndex + 2) % 23);
            }
            for (let i = 0; i < 2; i++) {
                indexProbabilities.push((previousSpriteData.spriteIndex + 3) % 23);
            }
            for (let i = 0; i < 24; i++) {
                indexProbabilities.push(i);
            }
            var randomInd = Math.floor(Math.random() * indexProbabilities.length);
            randomFurnitureInd = indexProbabilities[randomInd];
        }
        const sprite = scene.physics.add.sprite(tile.getCenterX(), tile.getCenterY(), scene.furnitureSprites[randomFurnitureInd]).setImmovable();
        scene.physics.add.collider(scene.player, sprite)
        newPlacedSpriteData = {
            spriteIndex: randomFurnitureInd,
            tileX: tile.getCenterX(),
            tileY: tile.getCenterY()
        }
    }

    const spriteData = newPlacedSpriteData === null ? previousSpriteData : newPlacedSpriteData;
    tryPlaceSprite(scene, map, furnitureLayer, leftTile, spriteData, processedTiles, addedSprites);
    tryPlaceSprite(scene, map, furnitureLayer, rightTile, spriteData, processedTiles, addedSprites);
    tryPlaceSprite(scene, map, furnitureLayer, bottomTile, spriteData, processedTiles, addedSprites);
}