class sceneName extends Phaser.Scene {
    constructor() {
        super("sceneKey");
    }

    preload() {
        // Preload your tilemap and tilesheet images
    }

    init() {
        this.tileset = {
            name: "terrain",
            key: "terrain-tiles"
        };
        this.noiseSeed = Math.random();  // Random seed for Perlin/Simplex noise
        noise.seed(this.noiseSeed);  // Seed the noise generator

        this.noiseSampleSize = 20;
    }

    create() {
        console.log("Scene loaded");

        // Generate the map initially
        this.generateMap();

        // Set up keyboard inputs for regenerating the map and resizing the noise sample
        this.input.keyboard.on('keydown-R', () => {
            this.noiseSeed = Math.random();  // New random seed for noise
            noise.seed(this.noiseSeed);  // Seed with new value
            this.generateMap();  // Regenerate the map with the new seed
        });

        this.input.keyboard.on('keydown-DOWN', () => {
            this.noiseSampleSize = Math.max(1, this.noiseSampleSize - 1);  // Shrink the noise sample window
            this.generateMap();  // Regenerate the map with the new size
        });

        this.input.keyboard.on('keydown-UP', () => {
            this.noiseSampleSize += 1;  // Expand the noise sample window
            this.generateMap();  // Regenerate the map with the new size
        });
    }

    // Helper function to generate a random integer between min and max
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    update() {}

  

        generateMap() {
            // Clear the existing tiles from the previous map
            this.children.removeAll(true);
            
            /*
            // Load the tilemap for the current scene
            const map = this.add.tilemap("map"); // Ensure "map" is preloaded in the preload function
            console.log(map);
            const tilesheet = map.addTilesetImage("terrain", "terrain-tiles"); // Ensure "terrain-tiles" is preloaded
            console.log(tilesheet);
           // Get the correct tilemap layer (replace "terrain-layer" with your actual layer name)
            const terrainLayer = map.createLayer("terrain-layer", tilesheet, 0, 0); // Ensure this matches the layer ID in your tilemap
            console.log(terrainLayer);
            */
            let w = 20;
            let h = 15;

            let tileGrid = [];
            for(let y = 0; y < h; y++){
                tileGrid[y] = [];
            }

            // Loop through each tile to generate the terrain based on Perlin noise
            //console.log(map.height);
            for (let y = 0; y < h; y++) {
                //console.log("looping");
                for (let x = 0; x < w; x++) {
                    // Generate a Perlin noise value based on the x, y position and sample size
                    let noiseValue = Math.abs(noise.perlin2(x / this.noiseSampleSize, y / this.noiseSampleSize));
                    console.log(noiseValue);
                    // Assign terrain based on the generated noise value
                    let tileIndex;
        
                    if (noiseValue < 0.1) {
                        //console.log("in here low");
                        tileIndex = 203; // Water tile index in the tilesheet
                    } else if (noiseValue < 0.4) {
                        //console.log("in mid");
                        tileIndex = 18; // Sand tile index in the tilesheet
                    } else {
                        //console.log("in high");
                        tileIndex = 23; // Grass tile index in the tilesheet
                    }
                    //console.log("here");
                    
                    // Place the appropriate terrain tile in the scene at (x, y) coordinates
                    //map.putTileAt(tileIndex, x, y, "terrain-layer");
                    tileGrid[y][x] = tileIndex;
                }
            }

        // Create a blank tilemap
        const map = this.make.tilemap({
            data: tileGrid,
            tileWidth: 64,
            tileHeight: 64,
            width: w,
            height: h
        });

        // Add the tileset to the map
        const tileset = map.addTilesetImage("terrain", "terrain-tiles");

        // Create a layer and link it to the tileset
        const layer = map.createLayer(0, tileset, 0, 0);
        }
}
