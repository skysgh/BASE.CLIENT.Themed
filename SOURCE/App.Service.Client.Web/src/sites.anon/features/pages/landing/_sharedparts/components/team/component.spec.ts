/**
 * Team Component Tests
 * 
 * Example test demonstrating:
 * - How to use test-helpers
 * - How to mock services
 * - How to test components with observables
 * - How to test template rendering
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

// Component under test
import { BaseAppsPagesLandingIndexTeamComponent } from './component';

// Test utilities
import {
  setupCoreTestBed,
  MockResourceUrlService,
  mockTeamMembers
} from '../../../../../../../core/testing/core-test-helpers';

// Services
import { ResourceUrlService } from '../../../../../../../core/services/resource-url.service';
import { ServiceDeliveryTeamMemberRepositoryService } from '../../../../../../../core/services/services/repositories/service-delivery-team-members.repository.service';
import { PRIVATE_NAVIGATION } from '../../../../../../../core/tokens/private-navigation.token';

describe('TeamComponent', () => {
  let component: BaseAppsPagesLandingIndexTeamComponent;
  let fixture: ComponentFixture<BaseAppsPagesLandingIndexTeamComponent>;
  let mockResourceUrlService: jasmine.SpyObj<ResourceUrlService>;
  let mockTeamRepository: jasmine.SpyObj<ServiceDeliveryTeamMemberRepositoryService>;

  beforeEach(async () => {
    // Create spy objects for services
    mockResourceUrlService = jasmine.createSpyObj('ResourceUrlService', [
      'getTeamMemberPhotoUrl'
    ]);
    
    mockTeamRepository = jasmine.createSpyObj('ServiceDeliveryTeamMemberRepositoryService', [
      'getPage'
    ]);

    // Configure test bed with our component
    await setupCoreTestBed(
      [BaseAppsPagesLandingIndexTeamComponent],
      {
        providers: [
          { provide: ResourceUrlService, useValue: mockResourceUrlService },
          { provide: ServiceDeliveryTeamMemberRepositoryService, useValue: mockTeamRepository }
        ],
        schemas: [NO_ERRORS_SCHEMA] // Ignore unknown child components
      }
    ).compileComponents();

    // Set up default mock behaviors
    mockResourceUrlService.getTeamMemberPhotoUrl.and.returnValue(
      of('/mock/team/avatar-1.jpg')
    );
    
    mockTeamRepository.getPage.and.returnValue(
      of(mockTeamMembers)
    );

    // Create component
    fixture = TestBed.createComponent(BaseAppsPagesLandingIndexTeamComponent);
    component = fixture.componentInstance;
  });

  // ============================================================================
  // BASIC TESTS
  // ============================================================================

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have navigation injected', () => {
    expect(component.nav).toBeDefined();
    expect(component.nav.teams).toBeDefined();
    expect(component.nav.teams.root).toBe('/teams');
  });

  // ============================================================================
  // SERVICE INTEGRATION TESTS
  // ============================================================================

  describe('getUserPhotoUrl', () => {
    it('should call ResourceUrlService.getTeamMemberPhotoUrl', (done) => {
      const imageName = 'avatar-2.jpg';
      
      component.getUserPhotoUrl(imageName).subscribe(url => {
        expect(mockResourceUrlService.getTeamMemberPhotoUrl)
          .toHaveBeenCalledWith(imageName);
        expect(url).toBe('/mock/team/avatar-1.jpg');
        done();
      });
    });

    it('should return observable string', (done) => {
      component.getUserPhotoUrl('test.jpg').subscribe(url => {
        expect(typeof url).toBe('string');
        done();
      });
    });
  });

  // ============================================================================
  // DATA FETCHING TESTS
  // ============================================================================

  describe('ngOnInit', () => {
    it('should fetch team members on init', () => {
      fixture.detectChanges(); // Triggers ngOnInit
      
      expect(mockTeamRepository.getPage).toHaveBeenCalledWith(1);
    });

    it('should populate team$ observable', (done) => {
      fixture.detectChanges(); // Triggers ngOnInit
      
      component.team$.subscribe(team => {
        expect(team).toEqual(mockTeamMembers);
        expect(team.length).toBe(2);
        done();
      });
    });
  });

  // ============================================================================
  // TEMPLATE RENDERING TESTS (Optional - more complex)
  // ============================================================================

  describe('template rendering', () => {
    it('should display team section title', () => {
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      const title = compiled.querySelector('h3 span');
      
      // Note: Will show translation key since we're using mock TranslationService
      expect(title?.textContent).toContain('[BASE.TEAMS.THE_TEAM]');
    });

    it('should render team member cards', (done) => {
      fixture.detectChanges();
      
      // Wait for async pipe to resolve
      setTimeout(() => {
        fixture.detectChanges();
        
        const compiled = fixture.nativeElement;
        const cards = compiled.querySelectorAll('.card');
        
        // Should render 2 team members (from mockTeamMembers)
        expect(cards.length).toBeGreaterThanOrEqual(2);
        done();
      }, 100);
    });
  });

  // ============================================================================
  // ERROR HANDLING TESTS
  // ============================================================================

  describe('error handling', () => {
    it('should handle empty team data gracefully', (done) => {
      mockTeamRepository.getPage.and.returnValue(of([]));
      
      fixture.detectChanges();
      
      component.team$.subscribe(team => {
        expect(team).toEqual([]);
        expect(team.length).toBe(0);
        done();
      });
    });

    it('should handle missing image names', (done) => {
      const teamWithNoImage = [{
        ...mockTeamMembers[0],
        imageName: ''
      }];
      
      mockTeamRepository.getPage.and.returnValue(of(teamWithNoImage));
      fixture.detectChanges();
      
      component.getUserPhotoUrl('').subscribe(url => {
        expect(url).toBeDefined();
        done();
      });
    });
  });

  // ============================================================================
  // CONFIGURATION TESTS
  // ============================================================================

  describe('configuration', () => {
    it('should have appsConfiguration defined', () => {
      expect(component.appsConfiguration).toBeDefined();
    });

    it('should have groupConfiguration defined', () => {
      expect(component.groupConfiguration).toBeDefined();
    });

    it('should have sectionsInfo defined', () => {
      expect(component.sectionsInfo).toBeDefined();
      expect(component.sectionsInfo.team).toBeDefined();
    });
  });
});
