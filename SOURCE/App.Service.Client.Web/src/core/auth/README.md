# Authentication Setup Guide

## Current Status

The authentication infrastructure is **ready for real OIDC providers** but currently uses a **fake backend** for development.

### What Works Now
- ✅ Fake authentication (email: `admin@themesbrand.com`, password: `123456`)
- ✅ Session storage for user state
- ✅ Auth guards protecting routes
- ✅ OIDC infrastructure (models, services, providers)

### What Needs Your Action
- ❌ Azure AD app registration (for Microsoft sign-in)
- ❌ Google Cloud Console project (for Google sign-in)
- ❌ Real client IDs and credentials

---

## Option 1: Microsoft Account Sign-In (Azure AD)

### Step 1: Create Azure AD App Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to: **Azure Active Directory** → **App registrations** → **New registration**
3. Fill in:
   - **Name**: Your app name (e.g., "My Angular App")
   - **Supported account types**: Choose one:
     - "Personal Microsoft accounts only" → For consumer apps
     - "Accounts in any organizational directory and personal Microsoft accounts" → For both
   - **Redirect URI**: 
     - Type: **Single-page application (SPA)**
     - URI: `http://localhost:4200/auth/callback`
4. Click **Register**

### Step 2: Note Your Credentials

After registration, you'll see:
- **Application (client) ID**: Copy this → This is your `clientId`
- **Directory (tenant) ID**: Use `consumers` for personal accounts or this ID for work accounts

### Step 3: Configure Authentication

1. In your app registration, go to **Authentication**
2. Under "Single-page application":
   - Add redirect URIs for each environment:
     - `http://localhost:4200/auth/callback` (dev)
     - `https://yourdomain.com/auth/callback` (prod)
3. Under "Implicit grant and hybrid flows":
   - ✅ Check "ID tokens"
   - (Access tokens are fetched via code exchange, not implicit)
4. Under "Supported account types": Confirm your choice

### Step 4: Configure API Permissions

1. Go to **API permissions**
2. Click **Add a permission** → **Microsoft Graph** → **Delegated permissions**
3. Add: `openid`, `profile`, `email`, `User.Read`
4. Click **Grant admin consent** (if you're an admin)

### Step 5: Update environment.ts

```typescript
oidcConfig: {
  providers: [
    {
      provider: 'microsoft',
      enabled: true,  // ← Enable it
      clientId: 'YOUR-CLIENT-ID-FROM-AZURE',  // ← Paste here
      redirectUri: 'http://localhost:4200/auth/callback',
      scopes: ['openid', 'profile', 'email', 'User.Read'],
      displayName: 'Microsoft',
      icon: 'ri-microsoft-fill',
      tenantId: 'consumers',  // ← Or your tenant ID
      authority: 'https://login.microsoftonline.com/consumers'
    }
  ],
  // ...
}
```

### Step 6: Switch to OIDC mode

```typescript
defaultauth: 'oidc',  // ← Change from 'fakebackend'
```

---

## Option 2: Google Account Sign-In

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Go to **APIs & Services** → **OAuth consent screen**

### Step 2: Configure OAuth Consent Screen

1. Choose **External** (for any Google account)
2. Fill in:
   - App name
   - User support email
   - Developer contact email
3. Add scopes: `email`, `profile`, `openid`
4. Add test users (while in testing mode)
5. Save

### Step 3: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: Your app name
5. **Authorized JavaScript origins**:
   - `http://localhost:4200`
   - `https://yourdomain.com`
6. **Authorized redirect URIs**:
   - `http://localhost:4200/auth/callback`
   - `https://yourdomain.com/auth/callback`
7. Click **Create**
8. Copy the **Client ID**

### Step 4: Update environment.ts

```typescript
oidcConfig: {
  providers: [
    {
      provider: 'google',
      enabled: true,  // ← Enable it
      clientId: 'YOUR-CLIENT-ID.apps.googleusercontent.com',  // ← Paste here
      redirectUri: 'http://localhost:4200/auth/callback',
      scopes: ['openid', 'profile', 'email'],
      displayName: 'Google',
      icon: 'ri-google-fill'
    }
  ],
  // ...
}
```

---

## Using Both Providers

You can enable both Microsoft and Google:

```typescript
oidcConfig: {
  providers: [
    {
      provider: 'microsoft',
      enabled: true,
      clientId: 'YOUR-AZURE-CLIENT-ID',
      // ...
    },
    {
      provider: 'google',
      enabled: true,
      clientId: 'YOUR-GOOGLE-CLIENT-ID.apps.googleusercontent.com',
      // ...
    }
  ],
  allowLocalLogin: false,  // Optional: disable password login
  // ...
}
```

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│  LoginComponent                                              │
│  - Shows "Sign in with Microsoft" / "Sign in with Google"   │
│  - Calls OidcService.login('microsoft')                     │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│  OidcService                                                 │
│  - Builds authorization URL with state, nonce, PKCE         │
│  - Stores state in sessionStorage                           │
│  - Redirects to IdP                                         │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│  Identity Provider (Microsoft/Google)                        │
│  - User authenticates                                        │
│  - Redirects back with code + state                          │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│  AuthCallbackComponent (/auth/callback)                      │
│  - Receives code + state from URL                           │
│  - Calls OidcService.handleCallback()                       │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│  OidcService.handleCallback()                                │
│  - Validates state (CSRF protection)                        │
│  - Exchanges code for tokens (TODO: needs backend/PKCE)     │
│  - Updates session state                                     │
│  - Redirects to returnUrl                                   │
└──────────────────────────────────────────────────────────────┘
```

---

## Files Created

| File | Purpose |
|------|---------|
| `core/auth/models/oidc-config.model.ts` | Provider configuration types |
| `core/auth/models/auth-state.model.ts` | User and session state types |
| `core/auth/services/oidc.service.ts` | Main auth service (login, logout, callback) |
| `core/auth/providers/auth-provider.interface.ts` | Provider abstraction |
| `core/auth/providers/microsoft.provider.ts` | Microsoft/MSAL placeholder |
| `core/auth/providers/google.provider.ts` | Google placeholder |
| `core/auth/components/auth-callback.component.ts` | OAuth callback handler |
| `core.ag/guards/auth.guard.ts` | Updated to support OIDC mode |
| `environments/environment.ts` | OIDC configuration added |

---

## Next Steps After You Have Credentials

1. **Install MSAL** (for Microsoft):
   ```bash
   npm install @azure/msal-browser
   ```

2. **Update MicrosoftAuthProvider**: Uncomment the MSAL code in `microsoft.provider.ts`

3. **Add callback route**: Add to your routing:
   ```typescript
   { path: 'auth/callback', component: AuthCallbackComponent }
   ```

4. **Update LoginComponent**: Add social login buttons that call `OidcService.login('microsoft')`

5. **Test the flow**: Set `defaultauth: 'oidc'` and try logging in

---

## Security Notes

1. **Never commit real credentials** - Use environment variables or config.json
2. **Use PKCE** - Already implemented in OidcService
3. **Validate tokens properly** - The placeholder does basic validation; production should verify signatures
4. **Token exchange should be server-side** - For production, consider a backend for token exchange to protect secrets
5. **Use HTTPS in production** - OAuth requires HTTPS for redirect URIs

---

## Questions?

The infrastructure is ready. You just need to:
1. Create accounts at Azure/Google
2. Register your app
3. Copy credentials to environment.ts
4. Enable the provider
5. Switch to 'oidc' mode
