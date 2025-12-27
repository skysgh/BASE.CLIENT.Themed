# How to View the Team Component

## Quick Start

1. **Start the development server:**
```sh
npm run start
```

2. **Open browser and navigate to:**
```
http://localhost:4200/pages
```

3. **Scroll down to find "The Team" section** (orange heading)

---

## Expected Result

You should see:
- ✅ **8 team member cards** with photos
- ✅ **Avatars loading** from `/assets/deployed/images/users/avatar-*.jpg`
- ✅ **Names and roles** below each photo
- ✅ **"View All Memberships" button** at bottom

---

## Verify in DevTools

**Open DevTools (F12) → Network Tab:**

Filter for `avatar` and you should see requests like:
```
✅ 200 GET /assets/deployed/images/users/avatar-2.jpg
✅ 200 GET /assets/deployed/images/users/avatar-3.jpg
✅ 200 GET /assets/deployed/images/users/avatar-10.jpg
...etc
```

**Console should show:**
```
Team Component - getUserPhotoUrl: {
  imageName: "avatar-2.jpg",
  profilesPath: "/assets/deployed/images/users/",
  fullPath: "/assets/deployed/images/users/avatar-2.jpg"
}
```

---

## If Images Don't Load

**Check:**
1. Files exist at: `src/themes/t1/assets/deployed/images/users/avatar-*.jpg`
2. Angular build copied them to: `dist/base/assets/deployed/images/users/`
3. DevTools Network shows 200 (not 404)

**Quick Fix:**
```sh
# Hard refresh browser
Ctrl + Shift + R

# Or restart dev server
npm run start
```

---

## Component Location

**File:** `sites.anon/features/pages/landing/_sharedparts/components/team/component.ts`

**Route:** Part of landing page (`/pages`)

**Section ID:** `sectionsInfo.team.id`
