# Resource Security Split - Migration Guide

**Created**: 2025-01-24  
**Topic**: Deployed vs Uploaded Resource Separation  
**Status**: Active Pattern

---

## 🎯 Overview

We've split resource paths into **two security-classified categories** to establish clear boundaries between safe and risky content.

### The Split

| Resource Type | Token | Risk Level | Description |
|--------------|-------|------------|-------------|
| **Deployed** | `DEPLOYED_RESOURCES` | LOW | Static assets bundled with app |
| **Uploaded** | `UPLOADED_RESOURCES` | HIGH | User-generated content at runtime |

---

## 🔐 Why This Matters (Security First)

### Real-World Attack Scenario

**Without separation:**
```typescript
// ❌ DANGEROUS: Same path structure for everything
<img src="/assets/images/users/{{userId}}.jpg">
// User uploads malicious SVG with embedded JavaScript!
// XSS attack succeeds because browser trusts the domain
```

**With separation:**
```typescript
// ✅ SAFE: Different domains, different trust levels
// Deployed (your logo):
<img [src]="deployed.logos.light">
// → https://cdn.yourapp.com/assets/logos/logo-light.png

// Uploaded (user photo):
<img [src]="getUserPhoto(userId) | async">
// → https://uploads.yourapp.com/users/photos/123.jpg?sig=abc&exp=456
//   ↑ Different domain, signed URL, expires after 60 minutes
```

**Key Security Benefits:**
1. **Domain Separation**: Upload domain different from app domain (blocks XSS)
2. **Signed URLs**: Time-limited access with HMAC signatures
3. **Clear Classification**: Team immediately knows what's risky
4. **Auth Required**: Uploaded resources need authentication
5. **Content Scanning**: Uploaded files go through virus/malware checks

---

## 📋 Decision Matrix: Which Token to Use?

### Use `DEPLOYED_RESOURCES` When:

✅ **Static Content Bundled with Deployment:**
- Company logos (light/dark variants)
- Icon sets and flag images
- Background images and decorations
- Partner/sponsor logos
- Static documents (terms of service, privacy policy PDFs)
- Marketing materials
- UI decorations

**Characteristics:**
- Created by your team/designers
- Reviewed before deployment
- Version-controlled (in Git)
- Safe for public CDN distribution
- Can be cached aggressively
- No authentication needed

**Example:**
```typescript
constructor(@Inject(DEPLOYED_RESOURCES) public deployed: DeployedResourcePaths) {}
```
```html
<img [src]="deployed.logos.light" alt="Company Logo">
<img [src]="deployed.images.flags + 'us.png'" alt="US Flag">
```

---

### Use `UPLOADED_RESOURCES` When:

⚠️ **User-Generated Content Created at Runtime:**
- Profile photos and avatars
- User-uploaded documents
- Email attachments
- Shared photos/videos
- User-created content
- Form submissions with files
- Chat/message attachments

**Characteristics:**
- Created by end users (untrusted)
- Must be scanned for malware
- Requires authentication to access
- Should use signed URLs with expiration
- Cannot be cached aggressively
- Should be on separate domain

**Example (Current - Basic):**
```typescript
constructor(@Inject(UPLOADED_RESOURCES) private uploaded: UploadedResourcePaths) {}

getUserPhoto(userId: string): string {
  return this.uploaded.users.profiles + userId + '.jpg';
}
```

**Example (Future - Signed URLs):**
```typescript
constructor(
  @Inject(UPLOADED_RESOURCES) private uploaded: UploadedResourcePaths,
  private resourceUrlService: ResourceUrlService
) {}

getUserPhoto(userId: string): Observable<string> {
  const path = this.uploaded.users.profiles + userId + '.jpg';
  return this.resourceUrlService.getSignedUrl(path, 60); // 60 min expiry
}
```
```html
<!-- Template with async pipe for signed URLs -->
<img [src]="getUserPhoto(user.id) | async" alt="User Photo">
```

---

## 🗂️ File Structure Created

```
sites/
├── contracts/
│   ├── deployed-resource.contracts.ts    ✅ NEW: Static assets interface
│   ├── uploaded-resource.contracts.ts    ✅ NEW: User content interface
│   ├── resource.contracts.ts             ⚠️  LEGACY: For backward compatibility
│   └── index.ts
├── tokens/
│   ├── deployed-resource.tokens.ts       ✅ NEW: DEPLOYED_RESOURCES token
│   ├── uploaded-resource.tokens.ts       ✅ NEW: UPLOADED_RESOURCES + UPLOAD_CONFIG
│   ├── resource.tokens.ts                ⚠️  LEGACY: RESOURCE_PATHS token
│   └── index.ts

apps.main/
└── module.ts                             ✅ UPDATED: Provides all 3 tokens
```

---

## 🔄 Migration Paths

### Path 1: Migrate Static Content Component (Simple)

**When**: Component only uses logos, static images, or docs

**Steps:**
1. Change import:
```typescript
// Before:
import { RESOURCE_PATHS, ResourcePaths } from '../../tokens';

// After:
import { DEPLOYED_RESOURCES, DeployedResourcePaths } from '../../tokens';
```

2. Update injection:
```typescript
// Before:
constructor(@Inject(RESOURCE_PATHS) resources: ResourcePaths) {
  this.resources = resources;
}

// After:
constructor(@Inject(DEPLOYED_RESOURCES) deployed: DeployedResourcePaths) {
  this.deployed = deployed;
}
```

3. Update template:
```html
<!-- Before: -->
<img [src]="resources.logos.light">

<!-- After: -->
<img [src]="deployed.logos.light">
```

**Completed Examples:**
- ✅ Header component
- ✅ Footer component

---

### Path 2: Migrate User Content Component (Advanced)

**When**: Component displays user-uploaded photos, attachments, or documents

**Steps:**
1. Import both tokens:
```typescript
import { 
  DEPLOYED_RESOURCES, 
  DeployedResourcePaths,
  UPLOADED_RESOURCES,
  UploadedResourcePaths 
} from '../../tokens';
```

2. Inject both:
```typescript
constructor(
  @Inject(DEPLOYED_RESOURCES) public deployed: DeployedResourcePaths,
  @Inject(UPLOADED_RESOURCES) private uploaded: UploadedResourcePaths
) {}
```

3. Create helper method:
```typescript
getUserPhoto(userId: string): string {
  // Basic implementation (current)
  return this.uploaded.users.profiles + userId + '.jpg';
}

// Or with signed URLs (future):
getUserPhoto(userId: string): Observable<string> {
  const path = this.uploaded.users.profiles + userId + '.jpg';
  return this.resourceUrlService.getSignedUrl(path, 60);
}
```

4. Update template:
```html
<!-- Static content: -->
<img [src]="deployed.logos.light" alt="Company Logo">

<!-- User content (basic): -->
<img [src]="getUserPhoto(user.id)" alt="User Photo">

<!-- User content (signed URLs - future): -->
<img [src]="getUserPhoto(user.id) | async" alt="User Photo">
```

**To Be Migrated:**
- ⏳ Team component (shows user profile photos)
- ⏳ User profile page
- ⏳ Chat/messaging components

---

## 🚀 Provider Configuration

### Current Setup (apps.main/module.ts)

```typescript
providers: [
  // ✅ Deployed resources (static, safe)
  {
    provide: DEPLOYED_RESOURCES,
    useValue: {
      logos: {
        light: `${appsMainConstants.resources.open.images.logos}logo-light.png`,
        dark: `${appsMainConstants.resources.open.images.logos}logo-dark.png`
      },
      images: {
        root: appsMainConstants.resources.open.images.root,
        trustedBy: appsMainConstants.resources.open.images.trustedBy,
        flags: appsMainConstants.resources.open.images.flags,
        backgrounds: appsMainConstants.resources.open.images.backgrounds
      },
      files: {
        root: appsMainConstants.resources.open.files.root,
        markdown: appsMainConstants.resources.open.files.markdownDir,
        pdf: appsMainConstants.resources.open.files.pdfDir
      }
    }
  },

  // ✅ Uploaded resources (user-generated, risky)
  {
    provide: UPLOADED_RESOURCES,
    useValue: {
      users: {
        root: appsMainConstants.resources.sensitive.root,
        profiles: appsMainConstants.resources.sensitive.images.users,
        avatars: appsMainConstants.resources.sensitive.images.users
      },
      documents: {
        root: appsMainConstants.resources.sensitive.root,
        attachments: appsMainConstants.resources.sensitive.root + 'documents/attachments/',
        uploads: appsMainConstants.resources.sensitive.root + 'documents/uploads/'
      },
      media: {
        root: appsMainConstants.resources.sensitive.root + 'media/',
        photos: appsMainConstants.resources.sensitive.root + 'media/photos/',
        videos: appsMainConstants.resources.sensitive.root + 'media/videos/'
      }
    }
  },

  // ✅ Upload security configuration
  {
    provide: UPLOAD_CONFIG,
    useValue: {
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
      allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.pdf'],
      requireVirusScan: environment.production,
      signedUrlExpiryMinutes: 60,
      uploadDomain: environment.production 
        ? 'https://uploads.example.com'  // Production: separate domain
        : 'http://localhost:4200'        // Dev: same domain for convenience
    }
  },

  // ⚠️ LEGACY: Backward compatibility (to be removed)
  {
    provide: RESOURCE_PATHS,
    useValue: { /* same as DEPLOYED_RESOURCES */ }
  }
]
```

---

## ⚙️ Environment Configuration

### Production (environment.prod.ts)
```typescript
export const environment = {
  production: true,
  uploadsBaseUrl: 'https://uploads.yourapp.com',  // Separate domain!
  cdnBaseUrl: 'https://cdn.yourapp.com'           // For deployed assets
};
```

### Development (environment.ts)
```typescript
export const environment = {
  production: false,
  uploadsBaseUrl: 'http://localhost:4200',  // Same domain for dev convenience
  cdnBaseUrl: 'http://localhost:4200'       // Local assets
};
```

---

## 🧪 Testing Patterns

### Test with Deployed Resources
```typescript
describe('HeaderComponent', () => {
  it('should display logo from deployed resources', () => {
    const mockDeployed: DeployedResourcePaths = {
      logos: { light: '/test/logo.png', dark: '/test/logo-dark.png' },
      images: { root: '/test/', trustedBy: '/test/trusted/', flags: '/test/flags/', backgrounds: '/test/bg/' },
      files: { root: '/test/', markdown: '/test/md/', pdf: '/test/pdf/' }
    };
    
    TestBed.configureTestingModule({
      providers: [
        { provide: DEPLOYED_RESOURCES, useValue: mockDeployed }
      ]
    });
    
    const fixture = TestBed.createComponent(HeaderComponent);
    expect(fixture.componentInstance.deployed.logos.light).toBe('/test/logo.png');
  });
});
```

### Test with Uploaded Resources
```typescript
describe('TeamComponent', () => {
  it('should generate user photo URL', () => {
    const mockUploaded: UploadedResourcePaths = {
      users: { root: '/uploads/', profiles: '/uploads/profiles/', avatars: '/uploads/avatars/' },
      documents: { root: '/uploads/docs/', attachments: '/uploads/docs/att/', uploads: '/uploads/docs/up/' },
      media: { root: '/uploads/media/', photos: '/uploads/media/photos/', videos: '/uploads/media/videos/' }
    };
    
    TestBed.configureTestingModule({
      providers: [
        { provide: UPLOADED_RESOURCES, useValue: mockUploaded }
      ]
    });
    
    const fixture = TestBed.createComponent(TeamComponent);
    const component = fixture.componentInstance;
    
    expect(component.getUserPhoto('123')).toBe('/uploads/profiles/123.jpg');
  });
});
```

---

## 🔒 Security Checklist

### For DEPLOYED_RESOURCES
- [x] Resources reviewed by team before deployment
- [x] Content version-controlled in Git
- [x] Safe for public CDN distribution
- [x] No user input in paths
- [x] Can be cached aggressively (immutable with versioning)

### For UPLOADED_RESOURCES
- [ ] Virus/malware scanning implemented
- [ ] File type validation (whitelist)
- [ ] File size limits enforced
- [ ] Authentication required for access
- [ ] Signed URLs with expiration (future)
- [ ] Separate domain for uploads (production)
- [ ] Content Security Policy headers configured
- [ ] Regular security audits of uploaded content

---

## 📊 Migration Status

| Component | Type | Current Token | Target Token | Status |
|-----------|------|---------------|--------------|--------|
| Header | Static | ~~RESOURCE_PATHS~~ | DEPLOYED_RESOURCES | ✅ Complete |
| Footer | Static | ~~RESOURCE_PATHS~~ | DEPLOYED_RESOURCES | ✅ Complete |
| Team | Mixed | appsConfiguration | DEPLOYED + UPLOADED | ⏳ In Progress |
| Stats | Static | appsConfiguration | None (removed) | ✅ Complete |
| Capabilities | Static | appsConfiguration | None (removed) | ✅ Complete |
| FAQs | Static | appsConfiguration | None (removed) | ✅ Complete |

---

## 🚧 Future Enhancements

### Phase 1: Signed URLs (Next)
Create `ResourceUrlService` for time-limited access:
```typescript
@Injectable()
export class ResourceUrlService {
  getSignedUrl(path: string, expiryMinutes: number): Observable<string> {
    return this.http.post<{signedUrl: string}>('/api/resources/sign', {
      path, expiry: expiryMinutes
    }).pipe(map(r => r.signedUrl));
  }
}
```

### Phase 2: Content Security
- Implement virus scanning middleware
- Add content moderation for images
- Enforce upload quotas per user
- Add watermarking for sensitive content

### Phase 3: CDN Integration
- Configure CloudFront/Azure CDN for deployed resources
- Separate upload storage (S3/Azure Blob)
- Implement edge caching strategies

---

## ❓ FAQs

**Q: Why split resources instead of using one token?**  
**A**: Security. User-uploaded content is HIGH RISK and needs different handling (auth, scanning, signed URLs, separate domain).

**Q: Can I use both tokens in one component?**  
**A**: Yes! Header uses deployed (logo), team component will use both (logo + user photos).

**Q: What if I'm not sure which to use?**  
**A**: Ask: "Did a user upload this?" If yes → UPLOADED. If no → DEPLOYED.

**Q: Do I need to implement signed URLs now?**  
**A**: No. Basic paths work now. Signed URLs are future enhancement for better security.

**Q: Can I still use old RESOURCE_PATHS token?**  
**A**: Yes, for now (backward compatibility). But migrate to new tokens - we'll remove legacy token soon.

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-24  
**Status**: Active - Use for all new work  
**Next Review**: After team component migration complete
