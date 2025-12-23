
/**
 * Layout Constants.
 * 
 * Note: Referenced from _state/layout/layout-reducer.ts
 */


/**
 * Layout Types
 */
const LAYOUT_TYPES = {
  VERTICAL: "vertical",
  HORIZONTAL: "horizontal",
  TWOCOLUMN: "twocolumn",
  SEMIBOX: "semibox",
}

/**
 * Layout Mode
 */
const LAYOUT_MODE = {
  LIGHTMODE: "light",
  DARKMODE: "dark",
}

/**
 * Layout Width Types
 */
const LAYOUT_WIDTH_TYPES = {
  FLUID: "fluid",
  BOXED: "boxed",
}

/**
 * Layout Position Types
 */
const LAYOUT_POSITION_TYPES = {
  FIXED: "fixed",
  SCROLLABLE: "scrollable",
}

/**
 * Layout Topbar Color Types
 */
const LAYOUT_TOPBAR_COLOR_TYPES = {
  LIGHT: "light",
  DARK: "dark",
}

/**
 * Sidebar Size
 */
const SIDEBAR_SIZE ={
  LARGE : "lg",
  MEDIUM : "md",
  SMALL : "sm",
  SMALLHOVER : "sm-hover"
}

/**
 * Sidebar View
 */
const SIDEBAR_VIEW = {
  DEFAULT: "default",
  DETACHED : "detached"
}

/**
 * Sidebar Color
 */
const SIDEBAR_COLOR = {
  LIGHT: "light",
  DARK: "dark",
  GRADIENT: "gradient",
  GRADIENT2: "gradient-2",
  GRADIENT3: "gradient-3",
  GRADIENT4: "gradient-4",
}

/**
 * Sidebar Image
 */
const SIDEBAR_IMAGE = {
  NONE: "none",
  IMAGE1 : "image-1",
  IMAGE2 : "image-2",
  IMAGE3 : "image-3",
  IMAGE4 : "image-4"
}

/**
 * Sidebar Visibility
 */
const SIDEBAR_VISIBILITY = {
  SHOW: "show"
}

/**
 * Preloader Types
 */
const PERLOADER_TYPES = {
  ENABLE: "enable",
  DISABLE: "disable"
};

// The purpose of 'export' is to make the constant available to other modules.
export {
  LAYOUT_TYPES,
  LAYOUT_MODE,
  LAYOUT_WIDTH_TYPES,
  LAYOUT_POSITION_TYPES,
  LAYOUT_TOPBAR_COLOR_TYPES,
  SIDEBAR_SIZE,
  SIDEBAR_VIEW,
  SIDEBAR_COLOR,
  SIDEBAR_IMAGE,
  SIDEBAR_VISIBILITY,
  PERLOADER_TYPES
}
