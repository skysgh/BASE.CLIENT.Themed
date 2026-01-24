import { Injectable } from '@angular/core';
import { ViewportScroller } from '@angular/common';

/**
 * Scroll Service
 * 
 * Provides smooth scrolling functionality to replace @nicky-lenaers/ngx-scroll-to
 * Uses native browser APIs with smooth behavior support.
 */
@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  constructor(private viewportScroller: ViewportScroller) {}

  /**
   * Scroll to element by ID with smooth behavior
   * @param elementId The ID of the element to scroll to (without #)
   * @param offset Offset in pixels from the top (default: 0)
   */
  scrollToElement(elementId: string, offset: number = 0): void {
    const element = document.getElementById(elementId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else {
      console.warn(`[ScrollService] Element with id "${elementId}" not found`);
    }
  }

  /**
   * Scroll to top of page
   */
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  /**
   * Scroll to specific position
   * @param position Position in pixels from top
   */
  scrollTo(position: number): void {
    window.scrollTo({
      top: position,
      behavior: 'smooth'
    });
  }

  /**
   * Scroll to anchor (for hash navigation)
   * @param anchor The anchor name (with or without #)
   */
  scrollToAnchor(anchor: string): void {
    const target = anchor.startsWith('#') ? anchor.substring(1) : anchor;
    this.scrollToElement(target);
  }
}
