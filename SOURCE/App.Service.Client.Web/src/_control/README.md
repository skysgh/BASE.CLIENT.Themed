# _control Directory

This folder provides **centralized documentation** for build-time and environment configuration.

## Configuration Locations

| Config Type | Location | Description |
|-------------|----------|-------------|
| **Environment** | `src/environments/` | Build-time environment variables |
| **System** | `src/core/assets/data/system/` | System-wide settings |
| **Account** | `src/core/assets/data/accounts/` | Account configurations |
| **App Settings** | `angular.json` | Build configuration |

## Why Not Move Environments Here?

Angular expects `environments/` in specific locations. Moving them would require:
- Updating `angular.json` file replacement rules
- Potential build issues

Instead, this folder serves as a **documentation hub** and **redirect**.

## Quick Links

### Environments
- [environment.ts](../environments/environment.ts) - Development
- [environment.prod.ts](../environments/environment.prod.ts) - Production

### System Config
- [system-settings.json](../core/assets/data/system/) - System settings

### Account Config
- [default.json](../core/assets/data/accounts/default.json) - Default account

## For 3rd Party Developers

If you're building an applet, you likely don't need to touch these files.
Focus on your applet in `src/sites.app.lets/your-applet/`.
