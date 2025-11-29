# 📖 How to Get New Firebase Credentials

## ⏱️ Time Required: 10 minutes

---

## Step 1: Open Firebase Console (1 minute)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click on your project: **focusos-dashboard-192ad**
3. You should see your project dashboard

---

## Step 2: Revoke the Exposed Key (3 minutes)

The old key `AIzaSyBH1LiQln_BUqdNflYq6NtMwEeI0aK5iPY` must be revoked.

### Option A: Delete via Service Accounts (Recommended)

1. In Firebase Console, click **⚙️ Settings** (top left)
2. Click **Project Settings**
3. Go to **Service Accounts** tab
4. Look for "API Keys" section
5. Find your Web API key
6. Click the **⋯ menu** → **Delete**
7. Confirm deletion

### Option B: Delete via APIs & Services (Google Cloud)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (same one as Firebase)
3. Go to **APIs & Services** → **Credentials**
4. Find the API key starting with `AIzaSyBH1LiQln_...`
5. Click it
6. Click **Delete**

---

## Step 3: Create a New API Key (2 minutes)

### In Firebase Console:

1. **Settings** ⚙️ → **Project Settings**
2. Go to **Service Accounts** tab
3. Click **Create API Key** button
4. Select **Create in Cloud Console** (or use Firebase's built-in creation)
5. Google Cloud Console opens
6. **APIs & Services** → **Credentials**
7. Click **Create Credentials** → **API Key**
8. Choose **Restrict Key** (recommended)
9. For **Application restrictions**: Select **Browser** (HTTP referrers)
10. Add your domain/localhost: `http://localhost:*`
11. For **API restrictions**: Select **Restrict Key** → Choose **Firebase Realtime Database API**
12. Click **Create**
13. Copy the new key

---

## Step 4: Get Your Firebase Config (3 minutes)

In Firebase Console:

1. Click **⚙️ Settings** → **Project Settings**
2. Scroll down to **"Your apps"** section
3. Click on your **Web App** (or create if missing)
4. You'll see a code snippet:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "focusos-dashboard-192ad.firebaseapp.com",
     projectId: "focusos-dashboard-192ad",
     storageBucket: "focusos-dashboard-192ad.appspot.com",
     messagingSenderId: "522359106544",
     appId: "1:522359106544:web:4df9c1308040ef59154b35"
   };
   ```
5. Copy these values

---

## Step 5: Update .env.local (2 minutes)

In your VS Code editor:

1. Open `.env.local` file (should be in project root)
2. Find this section:
   ```dotenv
   VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890abcd
   ```

3. Replace with your actual values:
   ```dotenv
   VITE_FIREBASE_API_KEY=YOUR_NEW_API_KEY_HERE
   VITE_FIREBASE_AUTH_DOMAIN=focusos-dashboard-192ad.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=focusos-dashboard-192ad
   VITE_FIREBASE_STORAGE_BUCKET=focusos-dashboard-192ad.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=522359106544
   VITE_FIREBASE_APP_ID=1:522359106544:web:4df9c1308040ef59154b35
   ```

4. **Save the file** (Ctrl+S)

---

## Step 6: Test the Connection (1 minute)

1. The dev server is already running at `http://localhost:5173`
2. **Refresh the browser** (F5 or Cmd+R)
3. Open **Browser Developer Console** (F12 → Console tab)
4. Check that you DON'T see this warning:
   ```
   ⚠️ Firebase API Key not found...
   ```
5. ✅ If no warning, you're good to go!

---

## Verification Checklist

- [ ] Old API key revoked in Firebase Console
- [ ] New API key generated and copied
- [ ] Firebase config copied from Firebase Console
- [ ] `.env.local` updated with all 6 values
- [ ] Browser refreshed
- [ ] No warning in browser console
- [ ] App is working normally

---

## Troubleshooting

### App shows "API Key not valid" error
- [ ] Check `.env.local` file exists
- [ ] Check it has correct `VITE_FIREBASE_API_KEY` value (not placeholder)
- [ ] Restart dev server: `npm run dev`
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Refresh browser (F5)

### Can't find your Firebase project
- [ ] Go to https://console.firebase.google.com/
- [ ] Look for "focusos-dashboard-192ad" in the list
- [ ] If not found, you may need to create a new project or contact project owner

### Can't find the API key in Firebase Console
- [ ] Try Google Cloud Console instead: https://console.cloud.google.com/
- [ ] Go to APIs & Services → Credentials
- [ ] Look for API keys you created

### Still having issues?
1. Delete `.env.local` completely
2. Create new file `.env.local` (empty)
3. Manually type in the values from Firebase Console
4. Save and restart dev server

---

## Security Reminders

✅ **DO:**
- Keep `.env.local` in `.gitignore` (it already is)
- Never share `.env.local` with others
- Update API key if you accidentally expose it
- Restrict API keys to specific domains

❌ **DON'T:**
- Commit `.env.local` to git
- Share `.env.local` via chat/email
- Hardcode secrets in source code
- Use the same key across different projects

---

## Next: Configure Firebase Security Rules

Once you have your app working, you should set up Firebase Security Rules to restrict access:

1. Firebase Console → Firestore Database (or Realtime Database)
2. Go to **Rules** tab
3. Set up rules to:
   - Allow users to only access their own data
   - Prevent unauthorized access
   - Restrict public access where needed

Example:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{uid}/{document=**} {
      allow read, write: if request.auth.uid == uid;
    }
  }
}
```

---

## Getting Help

- Firebase Docs: https://firebase.google.com/docs
- Authentication: https://firebase.google.com/docs/auth/where-to-start
- Firestore: https://firebase.google.com/docs/firestore
- API Key Security: https://cloud.google.com/docs/authentication/api-keys

---

**You've got this! 🚀 The security fix is almost complete - just need those credentials!**
