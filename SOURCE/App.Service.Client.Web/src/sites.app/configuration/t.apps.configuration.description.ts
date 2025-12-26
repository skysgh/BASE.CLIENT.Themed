/**
 * Interface for the
 * immutable description of software.
 * Pro tip:
 * Note that instead of putting
 * hard coded text,
 * one can refer to tags
 * within the i18n resources...
 */
export type TAppsConfigurationDescription = {
    /**
     * Name of the system.
     * 
     * Note: may be Resource keys to make it translate to different languages.
     */
    title: string;

    /**
     * Description of what it it is.
     * 
     * Note: may be Resource keys to make it translate to different languages.
     */
    description: string;

    /**
     * What it's for.
     * 
     * Note: may be Resource keys to make it translate to different languages.
     */
    purpose: string;
}
