import auroraSpriteSheet from '../assets/sprites/characters/aurora.png'

import tilemapPng from '../assets/multi_Tileset.json'
import roomJson from '../assets/multiplayer_map.json'

import CharacterFactory from "../src/characters/character_factory";
import Footsteps from "../assets/audio/footstep_ice_crunchy_run_01.wav";
import Vector2 from "phaser/src/math/Vector2";

import { FURNITURES } from "../src/utils/furniture_procedural_generator/furniture-imports"
import placeFurniture from '../src/utils/furniture_procedural_generator/furniture-builder';

let HideNSeekScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function HideNSeekScene() {
        Phaser.Scene.call(this, {key: 'HideNSeekScene'});
    },
    characterFrameConfig: {frameWidth: 31, frameHeight: 31},
    slimeFrameConfig: {frameWidth: 32, frameHeight: 32},

    preload: function() {
        this.load.image("tiles", tilemapPng);
        this.load.tilemapTiledJSON("map", roomJson);

        this.load.spritesheet('aurora', auroraSpriteSheet, this.characterFrameConfig);
        this.load.audio('footsteps', Footsteps);

        this.furnitureSprites = [];
        for (let i = 0; i < 22; i++) {
            const name = `furniture-${i + 1}`;
            this.furnitureSprites.push(name);
            this.load.image(name, FURNITURES[i]);
        }
    },

    create: function () {
        const map = this.make.tilemap({key: "map"});

        const tileset = map.addTilesetImage("Dungeon_Tileset", "tiles");

        // Parameters: layer name (or index) from Tiled, tileset, x, y
        const belowLayer = map.createStaticLayer("Floor", tileset, 0, 0);
        const worldLayer = map.createStaticLayer("Walls", tileset, 0, 0);
        const aboveLayer = map.createStaticLayer("Upper", tileset, 0, 0);
        this.tileSize = 32;

        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.characterFactory = new CharacterFactory(this);

        this.player = this.characterFactory.buildCharacter('aurora', 350, 350, {player: true});
        this.player.speed = new Vector2(1);
        this.physics.add.collider(this.player, worldLayer);

        worldLayer.setCollisionBetween(1, 500);
        aboveLayer.setDepth(10);

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);

        console.log(map.getTileAtWorldXY(350, 350, false, this.cameras.main, belowLayer));
        console.log(map.getTileAt(10, 10, false, belowLayer));
        placeFurniture(this, map, belowLayer)
    }, 

    update: function () {
        this.player.update();
    },

    tilesToPixels(tileX, tileY) {
        return [tileX*this.tileSize, tileY*this.tileSize];
    }

});

export default HideNSeekScene
