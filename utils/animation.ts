/*
 * Animations settings / preset for the moving elements of the website
 * useful for the ease in out movement in transitions or the spring/boing movement for example
 * we set this up here once so we don't have to repeat it somewhere else and so the animations stay the same everywhere
 * there is a LOT of comments on this one sorry
 * some part are very much vibecoded because i couldn't figures good formula for the physics or good way to handle error propagation due to uncertainty in calculations
 */

export const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2; //start slowly, accelerate in the middle, slow at the end, cubic formula founded online

export const BOUNCE_STIFFNESS = 190; //the speed at which we pulled the target
export const BOUNCE_DAMPING = 11.6; //how hardly we stop/slow the movement at the end (the boing boing idk how to describe it lmao)
export const ANTICIPATION_DURATION = 0.16; //the duration of the dezoom before the zoom

export interface SpringState {
  value: number; //for example it can be the size of the model we are trying to animate
  velocity: number; //and this is the current speed of the target
}

export const HOVER_REST = 1; //idle size when there is nothing (1 = default so its tungtungtunglogic)
export const HOVER_PLATEAU = 1.25; // size at the end of the zoom, +25%
export const HOVER_DIP = 0.6; //size at the dezoom before the zoom (anticipation we saw earlier), -40%

export interface HoverBounceState extends SpringState { //same parameters
  squashUntil: number; // timer for the dezoom phase
  wasHovered: boolean; //detect when the hover start with the mouse
}

export function createHoverBounce(): HoverBounceState { //create the initial state with default size, null speed, etc
  return { value: HOVER_REST, velocity: 0, squashUntil: 0, wasHovered: false };
}

export function integrateHoverBounce(bounce: HoverBounceState,hovered: boolean,strength: number,t: number,delta: number,): number { //called for every hoverable elements, calculate the size of the target we need
  if (hovered && !bounce.wasHovered) { //when mouse detected we start the animation with the dezoom
    bounce.squashUntil = t + ANTICIPATION_DURATION;
    bounce.velocity = 0; //we set the speed back at 0
  }
  bounce.wasHovered = hovered; //updating the state of the animation

  if (t < bounce.squashUntil) { //if we still in the dezoom phase
    const progress = 1 - (bounce.squashUntil - t) / ANTICIPATION_DURATION; //time since the dezoom started from 0 to 1 (like a pourcentage)
    const dip = HOVER_REST + (HOVER_DIP - HOVER_REST) * strength;
    bounce.value = HOVER_REST + (dip - HOVER_REST) * easeInOut(progress);
    bounce.velocity = 0;
  } else { //if the dezoom is ended we start the zoom
    const plateau = HOVER_REST + (HOVER_PLATEAU - HOVER_REST) * strength; //size we want
    integrateSpring(bounce, hovered ? plateau : HOVER_REST, BOUNCE_STIFFNESS, BOUNCE_DAMPING, delta); //if hovered the spring zoom till the maximum plateau, if not to idle
  }
  return bounce.value; //at the end we return the final size to use
}

export function integrateSpring(spring: SpringState, target: number, stiffness: number, damping: number, delta: number, maxStep = 0.5,): void { //da engine, take all the parameters
  let remaining = Math.min(delta, maxStep); //max time to treat it is 0.5sec, delta is the time elapsed since last frame
  while (remaining > 0) { // we fragment the animation in different parts rathan than running int all at once
    const dt = Math.min(remaining, 1 / 60);  //one part is max 0.016s (1/60s), if the last part is less than this value we take whats left, we do this to ensure a precise and stable calculation and to avoid approximations involved in a big one step calculation
    const accel = stiffness * (target - spring.value) - damping * spring.velocity; //the farther away from the target the greater the force is just like a damn spring being stretched
    spring.velocity += accel * dt; //updating the speed: current speed + (acceleration * the time elapsed)
    spring.value += spring.velocity * dt; //updating the position / distance traveled : current pos + (speed * time elapsed) (from the highschool formula v = d/t lmao it gave me ptsd)
    remaining -= dt; //we delete the time we just calculated and we keep the loop until there is no time and the animation is done
  }
}
