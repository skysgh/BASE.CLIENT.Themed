import { ServiceTrustedBy } from "../data/service-trustedby.model";

/**
 * The template ready model
 * of a ServiceTrustedBy.
 */
export class ServiceTrustedByVTO  {
  /** the name of the company*/
  public title!: string;

  /** the filename (with extension, minus its path, which is added by template)*/
  public imageName!: string;

}
