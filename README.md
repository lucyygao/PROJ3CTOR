# SURF 2021 - PROJ3CTOR
While we live in a 3-dimensional world, often it is easier to visualize and brainstorm in 2-dimensional environments. PROJ3CTOR was created to try and combine the simple, precise intuitiveness of 2D sketching and the more robust, dynamic interaction afforded by 3D spaces. Created over the summer of 2021, PROJ3CTOR is a 3D modeling application that creates 3D volumes from the intersection of input from two 2D screens. It uses implicit surfaces and point rendering, and is written in Javascript, Babylon.js, and HTML/CSS. Access the tool at `./html/implicit.html` or [this website](https://www.its.caltech.edu/~lgao/html/implicit.html).

## Instructions
#### FRONT VIEW
> Click and drag to draw on this screen first. Input from this screen will be extruded straight outwards and shown live on the 3D viewer. On mouseup, the boundaries of the sketch will show up as a dashed, grey box on the perpendicularly positioned second screen to help the user determine where to begin drawing.

#### SIDE VIEW
> Draw on this screen with the help of the outline from the first screen. Anything on this screen will be projected perpendicularly outwards as well, intersecting the input from the first screen.

#### BABYLON.JS 3D VIEWER
> Use the sliders and buttons on the bottom left container to adjust the object (deformations, material color, point size, scaling, etc.). Other display settings can be switched using the container on the bottom right. Click and drag to rotate the object, or use `ctrl + click + drag` to pan.

After drawing on both screens, either continue drawing on the entire screens or toggle `SELECT` to only edit part of the 3D volume. White boxes will show up on the volume to signal where the selection is. Reducing point size with the slider on the bottom left of the screen or changing the display mode to `INVISIBLE` may be helpful. Click `EXPORT VOLUME` at the top to download a .obj file with all of the coordinates being rendered.

## Files
This repository contains all files I created and edited during my SURF research project, so some are not applicable to PROJ3CTOR, and instead are quick demonstrations or explorations for familiarization. Below outlined are the important files for PROJ3CTOR:
- `./html/implicit.html` - the front-end of PROJ3CTOR, uses HTML/CSS
- `./html/about.html` - linked from the main page, is an about page
- `./html/demo.html` - linked from the main page, contains screenshots and instructions on how to use PROJ3CTOR
- `./javascript/implicitsurfaces/screen3d.js` - everything that deals with 3D and Babylon.js, includes point rendering and deformations
- `./javascript/implicitsurfaces/screen1.js` - powers the `FRONT VIEW` screen
- `./javascript/implicitsurfaces/screen2.js` - controls the `SIDE VIEW` screen
- `./javascript/implicitsurfaces/button.js` - for the buttons on the main page
- `./javascript/implicitsurfaces/export.js` - exporting the volume after it's been rendered

## Future Work
Hopefully, future work will increase functionality of this tool. I would like to add:
- UI improvements and features
- working `clear`, `redo`, and `undo` functions
- marching cubes to make surfaces smoother (was worked on in `./javascript/implicitsurfaces/marching.js` and `./javascript/implicitsurfaces/marching2.js`, but is unfinished
- make export include faces and triangles

## Credits
*This project was created under the mentorship of Santiago Lombeyda and George Djorgovski for SURF 2021.*
