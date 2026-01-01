# Access App.Part

Platform applet for **access control** - geographical and compliance restrictions.

## Scope

This app.part handles:
- **Embargo Lists** - Countries where service is blocked
- **Country Exclusions** - Specific country restrictions  
- **Geo-Access Rules** - Regional access policies (future)

## HARD BREAST Views

This module follows the HARD BREAST pattern:
- **H**ub - Central access management dashboard
- **A**nalytics - Access patterns and trends (future)
- **R**eports - Compliance reports (future)
- **D**ashboard - Widgets showing embargo stats
- **B**rowse - List all embargoed countries
- **R**ead - View embargo details
- **E**dit - Modify embargo entry
- **A**dd - Add new country to embargo
- **S**tate Transition - Enable/disable embargo
- **T**rash - Remove from embargo list

## Routes

```
/system/access/
├── hub              - Access management hub
├── dashboard        - Stats widgets
├── embargos/        - Embargo management
│   ├── list         - Browse all embargoes (B)
│   ├── :id          - View embargo detail (R)
│   ├── :id/edit     - Edit embargo (E)
│   ├── add          - Add new embargo (A)
│   └── :id/toggle   - Enable/disable (S)
└── countries/       - Country reference (future)
```

## Models

### EmbargoDto
```typescript
interface EmbargoDto {
  id: string;
  countryCode: string;      // ISO 3166-1 alpha-2 (e.g., 'RU', 'KP')
  countryName: string;
  reason: string;           // Legal/compliance reason
  legalReference?: string;  // Link to regulation
  effectiveFrom: string;
  effectiveTo?: string;     // null = indefinite
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## Dashboard Widgets

1. **Embargo Count** - "3 countries embargoed"
2. **Available Countries** - "Available in 197 countries"
3. **Recent Changes** - Timeline of embargo changes
4. **Compliance Status** - Green/Yellow/Red indicator

## Related

- **Operations** (`/system/operate`) - Originally contained embargo (moved here)
- **Compliance** (`/system/compliance`) - Legal documents
- **Billing** (`/system/billing`) - Regional pricing (affected by access)
