# 🔒 Security Guide - Focus Dashboard

## ⚠️ CRITICAL: Your API Key Was Exposed

Your Firebase API key was committed to git history in commit `bb6fb7e6`:
```
API Key: AIzaSyBH1LiQln_BUqdNflYq6NtMwEeI0aK5iPY
```

### Immediate Actions Required

#### 1. **REVOKE THE EXPOSED KEY** (DO THIS NOW!)
```
1. Go to https://console.firebase.google.com/
2. Select your project: focusos-dashboard-192ad
3. Settings → Project Settings → Service Accounts → Database Secrets
4. Find the exposed key and REVOKE it immediately
5. Create a NEW API key
```

#### 2. **Generate New Credentials**
```
1. In Firebase Console, go to Settings → Project Settings
2. Scroll to "Your apps" section
3. Click on your Web app (or create a new one)
4. Copy the entire firebaseConfig object
```

#### 3. **Update .env.local**
Replace the placeholder values in `.env.local` with your NEW credentials:
```dotenv
VITE_FIREBASE_API_KEY=YOUR_NEW_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890abcd
```

#### 4. **Warn Others**
If this is a collaborative project:
- Notify all team members that the key was exposed
- They should update their `.env.local` files
- They should not use the old key

---

## 📋 Best Practices for Secrets Management

### ✅ DO:
- ✅ Keep secrets in `.env.local` (which is .gitignored)
- ✅ Use environment variables via `import.meta.env.VITE_*`
- ✅ Add validation to check for missing keys
- ✅ Rotate keys regularly
- ✅ Use minimal permissions for each key
- ✅ Document which keys are needed (in `.env` template)

### ❌ DON'T:
- ❌ Commit `.env.local` to git
- ❌ Hardcode secrets in source code
- ❌ Share secrets via chat/email
- ❌ Use the same key across multiple environments
- ❌ Commit secrets accidentally in commits
- ❌ Leave exposed keys unrevoked

---

## 🔐 Secret Management Architecture

```
.env (COMMITTED to git)
├─ Template values only
├─ REPLACE_WITH_YOUR_... placeholders
└─ Documentation of available variables

.env.local (NOT committed - .gitignored)
├─ Your actual development credentials
├─ Unique to your machine
└─ Never shared

.env.production (Production only)
├─ Production credentials
├─ Managed via CI/CD secrets
└─ Never in git
```

---

## 🛡️ Vite Environment Variables

Our setup uses Vite's environment variables:

```typescript
// Only these are exposed to browser (VITE_ prefix required)
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

// These are NOT exposed (not prefixed with VITE_)
const secret = import.meta.env.SECRET_KEY; // ❌ Won't work in browser
```

### Why This Matters:
- `VITE_*` variables are embedded in the frontend bundle
- ⚠️ **They ARE visible to anyone who inspects your site**
- Only non-sensitive config should use `VITE_*`

### For Truly Secret Credentials:
- Create a backend API
- Keep secrets on the backend
- Call the API from the frontend

---

## 📖 How to Handle Firebase Safely

### Current Setup (Frontend-Only)
```
Frontend calls Firebase directly
├─ Uses VITE_FIREBASE_API_KEY
├─ Restricted by Firebase Security Rules
└─ Users see config but can't abuse it (due to rules)
```

**Security Rules in Firebase Console:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/{document=**} {
      allow read, write: if request.auth.uid == uid;
    }
    match /public/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Better Setup (With Backend)
```
Frontend calls your backend API
├─ Backend uses SECRET Firebase admin key
├─ Frontend uses public API key
└─ More secure, better control
```

---

## 🔍 How to Check for Exposed Secrets

### 1. Check Git History
```bash
# Search for API key patterns
git log -p --all | grep -i "apikey\|api_key\|secret"

# Check specific file history
git log --all -- .env.local
```

### 2. Check Current Files
```bash
# Make sure .env files are in .gitignore
cat .gitignore | grep -E "\.env|\.env\.local"
```

### 3. GitHub Security Alert
- GitHub scans for exposed credentials
- Check your repository settings
- If found, revoke credentials immediately

---

## 🚨 Recovery Steps If Exposed

### If You Suspect Exposure:

1. **Immediately revoke the key** (Firebase Console)
2. **Generate a new key**
3. **Update .env.local**
4. **Commit the code changes** (with new env file placeholders)
5. **Force push to remove from history** (dangerous - use with care)

### To Remove from Git History (Advanced):
```bash
# Using git-filter-repo (recommended)
git-filter-repo --replace-text <(echo "AIzaSyBH1LiQln_BUqdNflYq6NtMwEeI0aK5iPY==>REDACTED")

# Force push (only if it's your repo)
git push --force-with-lease
```

---

## 📝 Team Practices

### For Individual Developers:
- Create your own Firebase project
- Use your own `.env.local`
- Never share credentials
- Rotate keys regularly

### For Teams:
- Use shared Firebase project
- Manage credentials via CI/CD secrets
- Use role-based access control
- Audit who accessed what

### For Deployment:
- Use platform secrets (Vercel, Railway, etc.)
- Never commit to git
- Rotate regularly
- Log access

---

## 🔔 Monitoring & Alerts

### Firebase Console Alerts:
- Security Rules violations
- Unusual API usage
- Failed authentication attempts
- Storage quota warnings

### Your App Logs:
- Monitor API errors
- Check for `auth/api-key-not-valid` errors
- Review access patterns

---

## 📚 Additional Resources

- [Firebase Security Rules](https://firebase.google.com/docs/database/security)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-modes.html)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

## ✅ Checklist: Secure Your Project

- [ ] Revoke the exposed API key in Firebase Console
- [ ] Generate a new API key
- [ ] Update `.env.local` with new credentials
- [ ] Verify `.env.local` is in `.gitignore`
- [ ] Test the app with new credentials
- [ ] Commit changes to git
- [ ] Review git history for other exposed secrets
- [ ] Set up GitHub secret scanning (if not already enabled)
- [ ] Document this incident for future reference

---

## Questions?

If you're unsure about anything, check the `.env` file for the template or refer to Firebase documentation.

**Remember: Security is an ongoing process, not a one-time fix.** 🔒
