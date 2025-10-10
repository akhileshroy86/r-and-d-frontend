# Quick Test Guide - Staff Management & Login

## 🚀 Quick Demo (2 minutes)

### Test Staff Login
1. **Go to main page** → Click "Staff Login"
2. **Login with demo credentials:**
   - Email: `john.smith@gmail.com`
   - Password: `john`
3. **Success!** → Should redirect to Staff Dashboard

### Test Password Change
1. **In Staff Dashboard** → Click Settings (⚙️ icon)
2. **Go to Security tab** → Click "Change Password"
3. **Change password:**
   - Current: `john`
   - New: `john123`
   - Confirm: `john123`
4. **Success!** → Password changed message

### Test New Password
1. **Logout** → Go back to main page
2. **Login again:**
   - Email: `john.smith@gmail.com`
   - Password: `john123` (new password)
3. **Success!** → Login works with new password

### Test Admin Staff Management
1. **Go to main page** → Click "Admin Login"
2. **Admin credentials:**
   - Email: `admin@hospital.com`
   - Password: `admin123`
3. **Add new staff:**
   - Name: `Test User`
   - Email: `test.user@gmail.com`
   - Phone: `+91 1234567890`
4. **Note the success message** showing generated password: `test`

## ✅ Expected Results

- ✅ Staff can login with auto-generated password (first name from Gmail)
- ✅ Staff can change password in dashboard settings
- ✅ New password works for subsequent logins
- ✅ Admin can add staff and see generated credentials
- ✅ Password generation follows pattern: `firstname@domain.com` → password: `firstname`

## 🔧 Technical Details

- **Password Generation**: First name from Gmail address (before first dot)
- **Storage**: localStorage with key `staffCredentials`
- **Authentication**: Integrated with existing auth system
- **Security**: Password validation, current password verification