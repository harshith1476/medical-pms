# Login & Sign Up - Plain CSS

Complete CSS styling for modern, animated login and sign-up pages with purple gradient theme.

---

## 📁 Files Included

1. **`login-styles.css`** - Main CSS file (all styles and animations)
2. **`login-example.html`** - Login form example
3. **`signup-example.html`** - Sign up form example

---

## 🚀 Quick Start

### 1. **Basic Usage**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="login-styles.css">
</head>
<body>
  <!-- Your login form here -->
</body>
</html>
```

### 2. **With Google Fonts (Recommended)**

```html
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="login-styles.css">
</head>
```

---

## 🎨 Features

### ✨ Visual Effects
- ⭐ **5 Animated Floating Stars** - Rotating and moving
- 🎨 **3 Gradient Blobs** - Purple, Pink, Indigo
- 🌊 **Wave Pattern** - Animated SVG background
- 🌈 **Purple Gradient** - Professional medical theme

### 🎬 Animations
- Star rotation (6s, 8s, 10s cycles)
- Blob morphing (20s, 25s, 30s cycles)
- Wave motion (12s cycle)
- Input focus effects
- Button hover transforms
- Loading spinner

### 📱 Responsive Design
- Mobile-first approach
- Grid layout for forms
- Flexible spacing
- Touch-friendly buttons

### ♿ Accessibility
- Focus visible outlines
- Reduced motion support
- Semantic HTML structure
- ARIA-friendly

---

## 🏗️ HTML Structure

### Login Form

```html
<div class="login-wrapper">
  <div class="login-container">
    <div class="login-form-section">
      
      <!-- Background Elements -->
      <div class="star star-1"><!-- SVG --></div>
      <div class="blob blob-1"></div>
      <svg class="wave-pattern"><!-- SVG --></svg>
      
      <!-- Form Content -->
      <div class="login-content">
        <div class="login-header">
          <h1 class="login-title">Welcome Back!</h1>
          <p class="login-subtitle">Login Your Account</p>
        </div>
        
        <form class="login-form form-space-4">
          <!-- Email -->
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <div class="input-container">
              <svg class="input-icon"><!-- Icon --></svg>
              <input type="email" class="form-input" placeholder="email@example.com">
            </div>
          </div>
          
          <!-- Password -->
          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="input-container">
              <svg class="input-icon"><!-- Icon --></svg>
              <input type="password" class="form-input" placeholder="Password">
              <button type="button" class="password-toggle">
                <svg><!-- Eye Icon --></svg>
              </button>
            </div>
          </div>
          
          <!-- Remember Me & Forgot Password -->
          <div class="form-row">
            <div class="checkbox-container">
              <input type="checkbox" class="form-checkbox" id="remember">
              <label class="checkbox-label" for="remember">Remember Me</label>
            </div>
            <a href="#" class="forgot-link">Forgot Password?</a>
          </div>
          
          <!-- Submit Button -->
          <button type="submit" class="submit-btn">Login</button>
        </form>
        
        <!-- Footer -->
        <div class="form-footer">
          <p class="footer-text">
            Don't have an account?
            <button class="toggle-link">Register</button>
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

## 📋 CSS Classes Reference

### Layout Classes

| Class | Description |
|-------|-------------|
| `.login-wrapper` | Full-screen container with gradient background |
| `.login-container` | Main card container |
| `.login-form-section` | Purple gradient form area |
| `.login-content` | Form content wrapper (z-index: 10) |

### Form Classes

| Class | Description |
|-------|-------------|
| `.login-form` | Form container |
| `.form-space-4` | Form with 1rem gap between fields |
| `.form-space-5` | Form with 1.25rem gap between fields |
| `.form-grid` | 2-column grid (1 col on mobile) |
| `.form-group` | Individual form field wrapper |
| `.form-group-full` | Full-width form field in grid |

### Input Classes

| Class | Description |
|-------|-------------|
| `.form-label` | Label styling |
| `.form-input` | Text input styling |
| `.form-select` | Select dropdown styling |
| `.form-checkbox` | Checkbox styling |
| `.input-container` | Wrapper for input + icons |
| `.input-icon` | Left-side icon in input |
| `.password-toggle` | Password visibility toggle button |

### Button Classes

| Class | Description |
|-------|-------------|
| `.submit-btn` | Primary submit button |
| `.toggle-link` | Text link for form toggle |
| `.forgot-link` | Forgot password link |

### Animation Classes

| Class | Description |
|-------|-------------|
| `.star` | Floating star base class |
| `.star-1` to `.star-5` | Positioned stars |
| `.blob` | Gradient blob base class |
| `.blob-1` to `.blob-3` | Positioned blobs |
| `.wave-pattern` | Wave SVG animation |
| `.spinner` | Loading spinner |

### Error Classes

| Class | Description |
|-------|-------------|
| `.error` | Error state for inputs |
| `.error-message` | Error message text |
| `.hidden` | Hide element |

---

## 🎨 Customization

### Change Colors

Edit CSS variables in `:root`:

```css
:root {
  --purple-900: #581c87;  /* Dark purple */
  --purple-800: #6b21a8;  /* Medium purple */
  --purple-700: #7e22ce;  /* Light purple */
  /* ... more colors ... */
}
```

### Change Background Gradient

```css
.login-form-section {
  background: linear-gradient(to bottom right, #your-color-1, #your-color-2);
}
```

### Adjust Animation Speed

```css
.star-1 {
  animation: float-star 6s ease-in-out infinite; /* Change 6s */
}
```

### Disable Animations

Add to CSS:

```css
* {
  animation: none !important;
  transition: none !important;
}
```

---

## 📱 Responsive Breakpoints

| Breakpoint | CSS |
|------------|-----|
| Mobile | Default (< 768px) |
| Tablet | `@media (min-width: 768px)` |
| Desktop | `@media (min-width: 1024px)` |

---

## 🔧 JavaScript Functions

### Toggle Password Visibility

```javascript
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
  input.setAttribute('type', type);
}
```

### Form Submit with Loading State

```javascript
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const btn = document.getElementById('loginBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Signing In...';
  
  // Your API call here
  
  setTimeout(() => {
    btn.disabled = false;
    btn.textContent = 'Login';
  }, 2000);
});
```

### Form Validation

```javascript
const email = document.getElementById('email');
const emailError = document.getElementById('emailError');

if (!email.value.includes('@')) {
  email.classList.add('error');
  emailError.textContent = 'Please enter a valid email';
  emailError.classList.remove('hidden');
} else {
  email.classList.remove('error');
  emailError.classList.add('hidden');
}
```

---

## 🎯 Usage Tips

### 1. **Form Spacing**
- Use `.form-space-4` for compact forms (Login)
- Use `.form-space-5` for spacious forms (Sign Up)

### 2. **Grid Layout**
- Automatically responsive (2 cols → 1 col on mobile)
- Use `.form-group-full` for full-width fields

### 3. **Icons**
- Use `.input-icon` for left-side icons
- Use `.password-toggle` for password eye icon
- Use `.select-arrow` for dropdown arrows

### 4. **Loading States**
```html
<button class="submit-btn" disabled>
  <span class="spinner"></span> Loading...
</button>
```

### 5. **Error States**
```html
<input type="email" class="form-input error">
<span class="error-message">Invalid email</span>
```

---

## 🌟 SVG Icons

### Star Icon
```html
<svg viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 2 L15.09 8.26 L22 9.27 L17 14.14 L18.18 21.02 L12 17.77 L5.82 21.02 L7 14.14 L2 9.27 L8.91 8.26 Z"/>
</svg>
```

### User Icon
```html
<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
</svg>
```

### Lock Icon
```html
<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
</svg>
```

### Eye Icon (Show Password)
```html
<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
</svg>
```

---

## 🎨 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Purple 900 | `#581c87` | Dark gradient |
| Purple 800 | `#6b21a8` | Medium gradient |
| Purple 700 | `#7e22ce` | Button background |
| Purple 600 | `#9333ea` | Button hover |
| Purple 500 | `#a855f7` | Focus state |
| White | `#ffffff` | Text on purple |
| Gray 50 | `#f9fafb` | Page background |
| Gray 200 | `#e5e7eb` | Input border |
| Gray 400 | `#9ca3af` | Icon color |
| Gray 800 | `#1f2937` | Text color |
| Red 400 | `#f87171` | Required asterisk |

---

## 📦 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

---

## 🐛 Troubleshooting

### Animations not working?
- Check browser support for CSS animations
- Ensure `prefers-reduced-motion` is not enabled

### Icons not showing?
- SVG must have proper viewBox
- Check fill/stroke attributes

### Form not responsive?
- Ensure viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`

### Buttons not clickable?
- Check z-index stacking
- Ensure no overlapping elements

---

## 📄 License

Free to use for personal and commercial projects.

---

## 💡 Pro Tips

1. **Performance**: Use `will-change` sparingly (already optimized)
2. **Accessibility**: Always include labels with inputs
3. **Security**: Never store passwords in plain text
4. **UX**: Provide clear error messages
5. **Mobile**: Test on real devices, not just emulators

---

**Enjoy your beautiful login page! 🎉**

