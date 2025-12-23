// Import constants defined elsewhere.
import {
  LAYOUT_WIDTH_TYPES,
  LAYOUT_POSITION_TYPES,
  LAYOUT_TOPBAR_COLOR_TYPES,
  PERLOADER_TYPES,
  LAYOUT_TYPES,
  LAYOUT_MODE,
  SIDEBAR_COLOR,
  SIDEBAR_IMAGE,
  SIDEBAR_VIEW,
  SIDEBAR_SIZE,
  SIDEBAR_VISIBILITY
} from './layout-constants';



/**
 * Interface for LayoutState
 * that the Reducer will use to to structure the initial state and change thereafter.
 */
export interface LayoutState {
  /**
   * The layout type
   * set by one of the options within the layout constant:
   * LAYOUT_TYPES {VERTICAL, HORIZONTAL, etc...}
   */
  LAYOUT: string;
  /**
   * The layout mode
   * set by one of the options within the layout constant:
   * LAYOUT_MODE {light, dark}.
   */
  LAYOUT_MODE: string;
  /**
   * The layout width 
   * set by one of the options within the layout constant:
   * LAYOUT_WIDTH_TYPES (e.g., fluid, boxed).
   */
  LAYOUT_WIDTH: string;
  /**
   * The layout position
   * set by one of the options within the layout constant:
   * LAYOUT_POSITION_TYPES (e.g., fixed, scrollable).
   */
  LAYOUT_POSITION: string;

  /**
   * The topbar color
   * set by one of the options within the layout constant:
   * LAYOUT_TOPBAR_COLOR_TYPES (e.g., light, dark).
   */
  TOPBAR: string;
  /**
   * The sidebar size
   * set by one of the options within the layout constant:
   * SIDEBAR_SIZE (e.g., lg, md, sm, sm-hover)
   */
  SIDEBAR_SIZE: string;
  /**
   * The sidebar view
   * set by one of the options within the layout constant:
   * SIDEBAR_VIEW
   * (e.g., default, compact).
   */
  SIDEBAR_VIEW: string;
  /**
   * The topbar color
   * set by one of the options within the layout constant:
   * SIDEBAR_COLOR (e.g., light, dark).
   */
  SIDEBAR_COLOR: string;

  /**
   * The sidebar image
   * set by one of the options within the layout constant:
   * SIDEBAR_IMAGE (e.g., none, image1, image2).
   */
  SIDEBAR_IMAGE: string;
  /**
   * The sidebar visibility
   * set by one of the options within the layout constant:
   * SIDEBAR_VISIBILITY (e.g., show, hide).
   */
  SIDEBAR_VISIBILITY: string;

  /**
   * The data preloader
   * set by one of the options within the layout constant:
   * PERLOADER_TYPES (e.g., enable, disable).
   */
  DATA_PRELOADER: string;
}

// IntialState
/**
 * Develop the initialState based on the interface of LayoutState
 * 
 */
export const initialLayoutState: LayoutState = {
  LAYOUT: LAYOUT_TYPES.VERTICAL,
  LAYOUT_MODE: LAYOUT_MODE.LIGHTMODE,
  LAYOUT_WIDTH: LAYOUT_WIDTH_TYPES.FLUID,
  LAYOUT_POSITION: LAYOUT_POSITION_TYPES.FIXED,
  TOPBAR: LAYOUT_TOPBAR_COLOR_TYPES.LIGHT,
  SIDEBAR_COLOR: SIDEBAR_COLOR.LIGHT,
  SIDEBAR_SIZE: SIDEBAR_SIZE.LARGE,
  SIDEBAR_VIEW: SIDEBAR_VIEW.DEFAULT,
  SIDEBAR_IMAGE: SIDEBAR_IMAGE.NONE,
  SIDEBAR_VISIBILITY: SIDEBAR_VISIBILITY.SHOW,
  DATA_PRELOADER: PERLOADER_TYPES.DISABLE
}
