// Dependencies:
import { createAction, props } from '@ngrx/store';


// Define const Actions invoked later by reducer.

/**
 * Define as const the 'Set Layout' Action,
 * Takes one argument, layout.
 * @param layout layout
 */
export const changelayout = createAction('[Layout] Set Layout', props<{ layout: string }>());
/**
 * Define as const the 'Set Mode' Action,
 * Takes one argument, mode.
 * @param mode mode
 */
export const changeMode = createAction('[Layout] Set Mode', props<{ mode: string }>());
/**
 * Define as const the 'Set LayoutWidth' Action,
 * Takes one argument, layoutWidth.
 * @param layoutWidth layoutWidth
 */
export const changeLayoutWidth = createAction('[Layout] Set LayoutWidth', props<{ layoutWidth: string }>());
/**
 * Define as const the 'Set LayoutPosition' Action,
 * Takes one argument, layoutPosition.
 * @param layoutPosition layoutPosition
 */
export const changeLayoutPosition = createAction('[Layout] Set LayoutPosition', props<{ layoutPosition: string }>());
/**
 * Define as const the 'Set TopbarColor' Action,
 * Takes one argument, topbarColor.
 * @param topbarColor topbarColor
 */
export const changeTopbar = createAction('[Layout] Set TopbarColor', props<{ topbarColor: string }>());
/**
 * Define as const the 'Set SidebarSize' Action,
 * Takes one argument, sidebarSize.
 * @param sidebarSize sidebarSize
 */
export const changeSidebarSize = createAction('[Layout] Set SidebarSize', props<{ sidebarSize: string }>());
/**
 * Define as const the 'Set SidebarView' Action,
 * Takes one argument, sidebarView.
 * @param sidebarView sidebarView
 */
export const changeSidebarView = createAction('[Layout] Set SidebarView', props<{ sidebarView: string }>());
/**
 * Define as const the 'Set SidebarColor' Action,
 * Takes one argument, sidebarColor.
 * @param sidebarColor sidebarColor
 */
export const changeSidebarColor = createAction('[Layout] Set SidebarColor', props<{ sidebarColor: string }>());
/**
 * Define as const the 'Set SidebarImage' Action,
 * Takes one argument, sidebarImage.
 * @param sidebarImage sidebarImage
 */
export const changeSidebarImage = createAction('[Layout] Set SidebarImage', props<{ sidebarImage: string }>());
/**
 * Define as const the 'Set SidebarVisibility' Action,
 * Takes one argument, sidebarvisibility.
 * @param sidebarvisibility sidebarvisibility
 */
export const changeSidebarVisibility = createAction('[Layout] Set SidebarVisibility', props<{ sidebarvisibility: string }>());
/**
 * Define as const the 'Set Preloader' Action,
 * Takes one argument, Preloader.
 * @param Preloader Preloader
 */
export const changeDataPreloader = createAction('[Layout] Set Preloader', props<{ Preloader: string }>());

