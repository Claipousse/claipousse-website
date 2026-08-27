export const SLIDE_DURATION = 0.5; //camera slide between menu and hub.
export const ZOOM_DURATION = 0.5; //zoom in/out & black fade when entering/exiting the mypc CRT screen
export const CLOSE_FADE_DURATION = 0.5; //black fade when clicking shutdown in mypc
export const CLOSE_FADE_OUT_DURATION = 0.25; // black fade when exiting mypc, faster than the entering one
const REVEAL_GAP = 0.2; //delay between the end of the black fade and the spawn of the boot screen in my pc
export const BOOT_DELAY = SLIDE_DURATION + ZOOM_DURATION + REVEAL_GAP; //entering to the boot screen in my pc
export const MYPC_RETURN_DURATION = ZOOM_DURATION + SLIDE_DURATION; //returning to the main menu
export const LINKS_GROWTH_DELAY = SLIDE_DURATION * 0.7; //delay before the link board start zooming
export const MYROOM_SPIN_DELAY = LINKS_GROWTH_DELAY; //delay before the key start spinning
export const MYROOM_SPIN_DURATION = 1.5; //key spinning
export const GALLERY_CLOSE_DURATION = 0.7; //closing gallery
export const LINKS_CLOSE_DURATION = 0.85; //closing links
export const MYROOM_CLOSE_DURATION = LINKS_CLOSE_DURATION; //closing my room

//tungtungtung sacode