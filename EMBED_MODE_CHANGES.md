# Embed Mode Implementation - Summary

## ✅ Changes Made

### 1. **File: `app/book/page.tsx`**
   - Added `useEffect` to detect `?embed=1` query parameter
   - When embed mode is active:
     - Sets `html` and `body` to `height: 100%`, removes margins/padding
     - Removes outer layout wrapper (no background gradient, no container padding)
     - Removes header "Finaliser votre réservation"
     - Removes "Retour" button
     - Centers content with white background
     - Makes form full-width within max-width container
   - Normal mode remains unchanged

### 2. **File: `app/booking/page.tsx`**
   - Added `useEffect` to detect `?embed=1` query parameter
   - When embed mode is active:
     - Sets `html` and `body` to `height: 100%`, removes margins/padding
     - Removes header "Mandry Booking"
     - Removes outer layout wrapper (no background gradient)
     - Centers content with white background
   - Preserves `embed=1` parameter when redirecting to `/book`
   - Normal mode remains unchanged

### 3. **File: `VERCEL_DEPLOYMENT_CHECKLIST.md`**
   - Updated Framer iframe URL examples to use `/book?embed=1`
   - Added note explaining embed mode features

## 🎯 How It Works

### Embed Mode Detection
```typescript
const isEmbed = searchParams.get('embed') === '1';
```

### HTML/Body Styling (via useEffect)
```typescript
useEffect(() => {
  if (isEmbed) {
    document.documentElement.style.height = '100%';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.body.style.height = '100%';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'auto';
  }
  // Cleanup on unmount
}, [isEmbed]);
```

### Conditional Rendering
- **Embed mode**: Minimal wrapper, white background, centered content
- **Normal mode**: Full layout with gradient background, headers, navigation

## 📋 Usage

### For Framer Iframe:
```
https://mandry-booking.vercel.app/book?embed=1
```

### Features in Embed Mode:
- ✅ No outer layout/navbar
- ✅ No extra padding/margins
- ✅ No background gradient (white background)
- ✅ HTML/Body set to 100% height
- ✅ Content fills viewport height
- ✅ Responsive and centered
- ✅ Preserves embed mode through navigation flow

## 🔍 Testing

1. **Normal mode**: Visit `/book` or `/booking` (should show full layout)
2. **Embed mode**: Visit `/book?embed=1` or `/booking?embed=1` (should show minimal layout)
3. **Flow test**: 
   - Start at `/booking?embed=1`
   - Search for vehicles
   - Click "Réserver" on a vehicle
   - Should redirect to `/book?embed=1` (embed mode preserved)

## ✅ Verification

- [x] Build successful (`npm run build`)
- [x] No TypeScript errors
- [x] No breaking changes to existing routes
- [x] API routes (`/api/*`) unaffected
- [x] Normal mode unchanged
- [x] Embed mode properly styled
