# Trusted By / Partner Logos

This directory contains logos of trusted partners/clients displayed on the landing page.

## Current Logos Required:
- moe.png - Ministry of Education logo
- tec.png - Tertiary Education Commission logo

## Image Specifications:
- Format: PNG (with transparency) or SVG
- Recommended size: 200x100px
- Background: Transparent
- Color: Grayscale or brand colors

## Adding New Logos:
1. Add image file to this directory
2. Update `/api/rest/base_service_TrustedBy` data in:
   - `_custom/json-server/data.json` (for development)
   - Backend API (for production)

## Path:
Images are served from: `/assets/apps.bootstrap/media/open/images/trustedBy/`
