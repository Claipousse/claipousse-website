//list of the delay and timing we use to spawn elements when we click on the white screen at the start

export const BUBBLE_DURATION = 1.8; //time during the bubble expand to the corner until all the screen reveal itself
export const CENTER_DELAY = 0.2; //delay until the claipousse 3d model in the center and the text below spawn
export const CORNER_DELAY = 1.2; //delay until the 4 models in the corners start spawning
export const CORNER_STAGGER = 0.36; //each models separate their spawn by 0.36s
export const CORNER_COUNT = 4; //4 models to spawn
export const MUSIC_ICON_DELAY = 2.98; //finally, we spawn the music icon at the end by additionning each precedent delay (+ a 0.7 bonus delay)
export const SPAWN_SETTLE = 1.2; //delay for when a element who spawn stabilize (useful for fixing a bug but else its useless)
