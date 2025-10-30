# Install Required Packages

## Quick Fix Steps:

1. **Open your terminal/command prompt**

2. **Navigate to the frontend folder:**
   ```bash
   cd prescripto-full-stack/frontend
   ```

3. **Install the packages:**
   ```bash
   npm install
   ```

   This will install:
   - framer-motion (for animations)
   - react-qr-code (for QR code generation)
   - html2canvas (for downloading tickets)

4. **Restart your dev server:**
   - Stop the current dev server (Ctrl+C)
   - Start it again:
     ```bash
     npm run dev
     ```

## If npm install doesn't work, try:

```bash
npm install framer-motion@^11.18.2 react-qr-code@^2.0.18 html2canvas@^1.4.1
```

## Troubleshooting:

If you still see errors:
1. Delete `node_modules` folder
2. Delete `package-lock.json`
3. Run `npm install` again
4. Restart the dev server

