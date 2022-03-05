# Phaser 3 with GothicVania assets

A fork of [Phaser 3 TypeScript](https://github.com/photonstorm/phaser3-typescript-project-template) that uses assets from ansimuz's [GothicVania](https://ansimuz.itch.io/) asset pack as well as Tiled to create levels

# Available commands

| npm install	Install | project dependencies |
| npm run watch |	Build project and open web server running project, watching for changes |
| npm run dev |	Builds project and open web server, but do not watch for changes |
| npm run build |	Builds code bundle with production settings (minification, no source maps, etc..) |


# Integration with Tiled

[Tiled](mapeditor.org) is a 2D level editor that helps you develop the content of your game. Its primary feature is to edit tile maps of various forms, but it also supports free image placement as well as powerful ways to annotate your level with extra information used by the game. Tiled focuses on general flexibility while trying to stay intuitive.

The maps need to be saved as a JSON file in dist/assets/map, and the tilesets need to be loaded from dist/assets/tileset. To add a background; add a custom property to map, name the property "background(x)" (x correlates with background layer), set the value of the property as a string, and then name the string from dist/assets/background selections.

# todo

-the speaking mechanic needs to be refactored and redone

-add more playable characters

-add online multiplayer functionality

-design levels and design bosses

-write a generative multiplayer story with branching storylines correlated with player outcomes
