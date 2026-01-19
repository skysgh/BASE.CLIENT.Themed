# Media Domain Module

The Media domain handles file uploads, downloads, and associated metadata.

## Domain Model

### Entities

1. **MediaFile** (Aggregate Root)
   - Represents an uploaded file
   - Contains metadata: filename, size, mime type, upload date
   - Has a MalwareScanResult value object

2. **MalwareScanResult** (Value Object)
   - Embedded within MediaFile (1-1 relationship)
   - Contains scan status, date, engine used, result

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Media Domain                              │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                     MediaFile                             │   │
│  │  (Aggregate Root)                                         │   │
│  │                                                           │   │
│  │  id: string                                               │   │
│  │  filename: string                                         │   │
│  │  originalFilename: string                                 │   │
│  │  mimeType: string                                         │   │
│  │  sizeBytes: number                                        │   │
│  │  storageUrl: string                                       │   │
│  │  uploadedUtc: Date                                        │   │
│  │  uploadedByUserId: string                                 │   │
│  │                                                           │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │           MalwareScanResult (Value Object)         │  │   │
│  │  │                                                    │  │   │
│  │  │  status: 'pending' | 'scanning' | 'clean' |        │  │   │
│  │  │          'infected' | 'error'                      │  │   │
│  │  │  scannedUtc: Date | null                           │  │   │
│  │  │  engine: string                                    │  │   │
│  │  │  threatName: string | null                         │  │   │
│  │  │  errorMessage: string | null                       │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Key Concept: Value Object

`MalwareScanResult` is a **Value Object** because:
- It has no identity of its own (no separate ID)
- It's immutable - a new scan creates a new result
- It's part of MediaFile's lifecycle
- It describes the MediaFile, not the other way around

This is different from an Entity which has its own identity and lifecycle.

## Usage

Other domains reference MediaFile by ID:

```typescript
// Person (Social domain)
interface Person {
  avatarMediaId?: string;  // FK to MediaFile
}

// Document attachment
interface Document {
  attachmentMediaIds: string[];  // Multiple FKs to MediaFile
}
```

## File Types

Supported categories:
- **Images**: jpg, png, gif, webp, svg
- **Documents**: pdf, doc, docx, xls, xlsx, ppt, pptx
- **Archives**: zip, tar, gz
- **Audio**: mp3, wav, ogg
- **Video**: mp4, webm, mov

## Structure

```
media/
├── models/
│   └── media.model.ts        # MediaFile, MalwareScanResult
├── dtos/
│   └── media.dto.ts
├── repositories/
│   └── media.repository.ts
├── services/
│   └── media.service.ts
├── constants/
│   └── media.constants.ts
└── README.md
```
