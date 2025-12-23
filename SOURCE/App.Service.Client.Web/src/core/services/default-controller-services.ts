import { Injectable } from '@angular/core';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';
import { SystemErrorService } from './system.error.service';
import { SystemSettingsService } from './service-settings.service';
import { TranslationService } from './translation.service';




@Injectable({ providedIn: 'root' })

/**
 * Provides easy access to
 * SystemSettingsService,
 * DiagnosticsTraceService
 * SystemsErrorService
 * TranslationService
 */
export class DefaultComponentServices {

    /**
     * Cosntructor
     * @param systemSettingsService
     * @param diagnosticsTraceService
     * @param errorService
     *
     */
    constructor(
        public systemSettingsService: SystemSettingsService,
        public diagnosticsTraceService: SystemDiagnosticsTraceService,
        public errorService: SystemErrorService,
        public translationService: TranslationService) {
    }
}
