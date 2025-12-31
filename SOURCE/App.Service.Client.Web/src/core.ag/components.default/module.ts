// ag:
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HttpClient, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { MarkdownModule, provideMarkdown } from 'ngx-markdown';

// NO: Parent Module:
// import { BaseCoreAgModule } from "../module";
// Components:
import { BaseCoreCommonComponentsMarkdownComponent } from "./markdown/component";


/**
 * Module for components that will be in most
 * applications, while not being specific to a theme.
 *
 * Note:
 * For components that use theme styles, you want to
 * look instead at `BaseThemesV1ComponentsModule`
 * 
 * Note:
 * Some may be surprised by seeing Markdown as being
 * a default control, but I have the objective of
 * moving towards all resources and views developed
 * as markdown so they are the most portable over time.
 */
@NgModule({ declarations: [
        // Components, Directives, Pipes developed in this Module.
        BaseCoreCommonComponentsMarkdownComponent
    ],
    exports: [
        // No harm exporting it.
        MarkdownModule,
        // NO: Export Parent Module:
        // NO: BaseCoreAgSupportModule,
        // Components:
        BaseCoreCommonComponentsMarkdownComponent
    ], imports: [
        // Access to all basic Ag pipes, directives, etc.
        CommonModule,
        // NO: Import Parent Module:
        // NO: BaseCoreAgModule,
        // Dependencies:
        MarkdownModule.forRoot({ loader: HttpClient })], providers: [
        // declare services to dependency inject into constructors.
        provideMarkdown({ loader: HttpClient }),
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class BaseCoreAgComponentsModule { }
