/**
 * ResourceUrlService Tests (CORE TIER)
 * 
 * ✅ TIER ISOLATION: This test file only imports from core tier
 * 
 * Tests:
 * - User avatar URL generation (dev mode)
 * - Team member photo URL generation (dev mode)
 * - User document URL generation (dev mode)
 * - Deployed asset URL generation
 * - Production mode behavior (mocked)
 * - Tier-agnostic path structure
 */

import { TestBed } from '@angular/core/testing';
import {} from '@angular/common/http/testing';

// ✅ CORE TIER IMPORTS ONLY
import { ResourceUrlService } from './resource-url.service';
import { setupCoreTestBed } from '../testing/core-test-helpers';
import { environment } from '../../environments/environment';

describe('ResourceUrlService (Core Tier)', () => {
  let service: ResourceUrlService;

  beforeEach(() => {
    // ✅ Use core-specific test bed setup
    setupCoreTestBed([], {
      providers: [ResourceUrlService]
    });

    service = TestBed.inject(ResourceUrlService);
  });

  // ============================================================================
  // BASIC TESTS
  // ============================================================================

  describe('service creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have getUserAvatarUrl method', () => {
      expect(service.getUserAvatarUrl).toBeDefined();
    });

    it('should have getTeamMemberPhotoUrl method', () => {
      expect(service.getTeamMemberPhotoUrl).toBeDefined();
    });

    it('should have getUserDocumentUrl method', () => {
      expect(service.getUserDocumentUrl).toBeDefined();
    });

    it('should have getDeployedAssetUrl method', () => {
      expect(service.getDeployedAssetUrl).toBeDefined();
    });

    it('should have isProductionMode method', () => {
      expect(service.isProductionMode).toBeDefined();
    });
  });

  // ============================================================================
  // DEVELOPMENT MODE TESTS (TIER-AGNOSTIC PATHS)
  // ============================================================================

  describe('getUserAvatarUrl (dev mode)', () => {
    it('should return tier-agnostic path for user avatar', (done) => {
      service.getUserAvatarUrl('avatar-5.jpg').subscribe(url => {
        // ✅ Tier-agnostic: /assets/media/ (not /assets/sites.anon/media/)
        expect(url).toBe('/assets/media/sensitive/images/users/avatar-5.jpg');
        expect(url).not.toContain('sites.anon');
        done();
      });
    });

    it('should handle different avatar filenames', (done) => {
      service.getUserAvatarUrl('profile-photo-123.png').subscribe(url => {
        expect(url).toBe('/assets/media/sensitive/images/users/profile-photo-123.png');
        done();
      });
    });

    it('should return observable string', (done) => {
      service.getUserAvatarUrl('test.jpg').subscribe(url => {
        expect(typeof url).toBe('string');
        done();
      });
    });
  });

  describe('getTeamMemberPhotoUrl (dev mode)', () => {
    it('should return tier-agnostic path for team photo', (done) => {
      service.getTeamMemberPhotoUrl('avatar-2.jpg').subscribe(url => {
        // ✅ Same structure as user avatars (consistent!)
        expect(url).toBe('/assets/media/sensitive/images/users/avatar-2.jpg');
        expect(url).not.toContain('sites.anon');
        done();
      });
    });

    it('should handle different team member photos', (done) => {
      service.getTeamMemberPhotoUrl('team-lead.jpg').subscribe(url => {
        expect(url).toBe('/assets/media/sensitive/images/users/team-lead.jpg');
        done();
      });
    });

    it('should return observable string', (done) => {
      service.getTeamMemberPhotoUrl('test.jpg').subscribe(url => {
        expect(typeof url).toBe('string');
        done();
      });
    });
  });

  describe('getUserDocumentUrl (dev mode)', () => {
    it('should return tier-agnostic path for user document', (done) => {
      service.getUserDocumentUrl('user123', 'report.pdf').subscribe(url => {
        // ✅ Tier-agnostic path
        expect(url).toBe('/assets/media/sensitive/documents/report.pdf');
        expect(url).not.toContain('sites.anon');
        done();
      });
    });

    it('should handle different document types', (done) => {
      service.getUserDocumentUrl('user456', 'contract.docx').subscribe(url => {
        expect(url).toBe('/assets/media/sensitive/documents/contract.docx');
        done();
      });
    });

    it('should return observable string', (done) => {
      service.getUserDocumentUrl('user', 'file.txt').subscribe(url => {
        expect(typeof url).toBe('string');
        done();
      });
    });
  });

  // ============================================================================
  // DEPLOYED ASSETS (SYNCHRONOUS)
  // ============================================================================

  describe('getDeployedAssetUrl', () => {
    it('should return direct path for deployed assets', () => {
      const url = service.getDeployedAssetUrl('images/logo.svg');
      expect(url).toBe('/assets/deployed/images/logo.svg');
    });

    it('should handle nested paths', () => {
      const url = service.getDeployedAssetUrl('icons/social/twitter.svg');
      expect(url).toBe('/assets/deployed/icons/social/twitter.svg');
    });

    it('should not be an observable', () => {
      const url = service.getDeployedAssetUrl('test.jpg');
      expect(typeof url).toBe('string');
      // Observable would have 'subscribe' method
      expect((url as any).subscribe).toBeUndefined();
    });
  });

  // ============================================================================
  // PRODUCTION MODE DETECTION
  // ============================================================================

  describe('isProductionMode', () => {
    it('should return false in development mode', () => {
      // We're running tests in dev mode
      expect(service.isProductionMode()).toBe(false);
    });

    it('should match environment.production', () => {
      expect(service.isProductionMode()).toBe(environment.production);
    });
  });

  // ============================================================================
  // PRODUCTION MODE BEHAVIOR (MOCKED)
  // ============================================================================

  describe('production mode (mocked)', () => {
    beforeEach(() => {
      // Mock environment.production = true
      spyOnProperty(environment, 'production', 'get').and.returnValue(true);
    });

    it('should throw error for signed URLs (Phase 3 not implemented)', (done) => {
      service.getUserAvatarUrl('avatar.jpg').subscribe(
        () => {
          fail('Should have thrown error');
        },
        (error) => {
          expect(error.message).toContain('Signed URLs not implemented yet');
          expect(error.message).toContain('Phase 3');
          done();
        }
      );
    });

    it('should indicate production mode', () => {
      expect(service.isProductionMode()).toBe(true);
    });
  });

  // ============================================================================
  // PATH STRUCTURE VALIDATION
  // ============================================================================

  describe('path structure consistency', () => {
    it('should use /assets/media/ prefix for all media', (done) => {
      service.getUserAvatarUrl('avatar.jpg').subscribe(url1 => {
        service.getTeamMemberPhotoUrl('team.jpg').subscribe(url2 => {
          service.getUserDocumentUrl('user', 'doc.pdf').subscribe(url3 => {
            // All should start with /assets/media/
            expect(url1).toMatch(/^\/assets\/media\//);
            expect(url2).toMatch(/^\/assets\/media\//);
            expect(url3).toMatch(/^\/assets\/media\//);
            done();
          });
        });
      });
    });

    it('should use /sensitive/ for user-generated content', (done) => {
      service.getUserAvatarUrl('avatar.jpg').subscribe(url1 => {
        service.getTeamMemberPhotoUrl('team.jpg').subscribe(url2 => {
          // Both should include /sensitive/
          expect(url1).toContain('/sensitive/');
          expect(url2).toContain('/sensitive/');
          done();
        });
      });
    });

    it('should NOT include tier names in paths', (done) => {
      service.getUserAvatarUrl('avatar.jpg').subscribe(url1 => {
        service.getTeamMemberPhotoUrl('team.jpg').subscribe(url2 => {
          service.getUserDocumentUrl('user', 'doc.pdf').subscribe(url3 => {
            // None should contain tier names
            expect(url1).not.toContain('sites.anon');
            expect(url1).not.toContain('sites.app');
            expect(url1).not.toContain('core');
            
            expect(url2).not.toContain('sites.anon');
            expect(url3).not.toContain('sites.anon');
            done();
          });
        });
      });
    });
  });

  // ============================================================================
  // EDGE CASES
  // ============================================================================

  describe('edge cases', () => {
    it('should handle empty filename', (done) => {
      service.getUserAvatarUrl('').subscribe(url => {
        expect(url).toBe('/assets/media/sensitive/images/users/');
        done();
      });
    });

    it('should handle filename with special characters', (done) => {
      service.getUserAvatarUrl('user@123!.jpg').subscribe(url => {
        expect(url).toContain('user@123!.jpg');
        done();
      });
    });

    it('should handle filename with spaces', (done) => {
      service.getUserAvatarUrl('my avatar.jpg').subscribe(url => {
        expect(url).toContain('my avatar.jpg');
        done();
      });
    });

    it('should handle filename with unicode characters', (done) => {
      service.getUserAvatarUrl('头像.jpg').subscribe(url => {
        expect(url).toContain('头像.jpg');
        done();
      });
    });

    it('should handle very long filename', (done) => {
      const longName = 'a'.repeat(255) + '.jpg';
      service.getUserAvatarUrl(longName).subscribe(url => {
        expect(url).toContain(longName);
        done();
      });
    });
  });
});
