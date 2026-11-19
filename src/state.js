/** Shared between the DOM (main.js) and the 3D world (world.js). */
export const S = {
  f: 0,          // scroll progress across sections, 0..5
  hotGroup: -1,  // hovered skill group
  activeJ: 0,    // active experience item
  activeP: 0,    // project currently in view
  service: 0,    // service selected in the services explorer
  wave: 0,       // set to 1 to make him wave
};

/** true: tech logos (3D and 2D) show their real brand colours. false: monochrome chrome/grey look. */
export const BRAND_LOGOS = true;

/** Section order drives every 3D keyframe. */
export const SECTIONS = ['top', 'services', 'work', 'skills', 'experience', 'contact'];
