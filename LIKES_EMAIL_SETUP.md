# Like Feature Setup - Auto-Generated Browser ID Tracking

This guide explains how to set up the new automatic browser ID like system for your portfolio.

## 🎯 What Changed

Previously, likes were stored as a single global counter. Now, **each like is automatically tracked by a unique browser identifier**, allowing you to:
- Auto-detect visitors without prompts
- Prevent duplicate likes from the same browser
- See individual visitor engagement
- No email collection needed

## 📊 Database Schema

### New `likes` Table Structure

```
Column       | Type                  | Description
-------------|----------------------|-----------------------------------
id           | UUID                 | Unique identifier (auto-generated)
email        | TEXT (UNIQUE)        | Auto-generated browser ID (browser-xxxxx@...)
created_at   | TIMESTAMP            | When the like was created
updated_at   | TIMESTAMP            | Last update timestamp
created_at   | TIMESTAMP            | When the like was created
updated_at   | TIMESTAMP            | Last update timestamp
```

## 🚀 Setup Instructions

### Step 1: Update Your Database Schema

1. Open **Supabase Console** → **SQL Editor**
2. Copy the SQL from `supabase_setup.sql` (all of it)
3. Paste it into the SQL editor
4. Click **Run**

### Step 2: Test the Feature

1. Open your portfolio in a browser
2. Click the ❤️ **Like** button
3. **No prompt!** Your unique browser ID is automatically generated
4. Like count increases instantly
5. In Supabase, go to **Table Editor** → **likes** to see your browser ID was stored

### Step 3: Try the Feature Again

1. Click the like button again (when it's already liked)
2. The like is removed from database
3. Your browser ID is deleted from the `likes` table
4. Visit from another browser - it gets a new unique ID

## 💾 How It Works

### Frontend (JavaScript)

1. User clicks the ❤️ like button
2. **Automatic browser ID generation** based on:
   - Browser user agent
   - Browser language
   - Screen resolution
   - Timezone offset
3. ID is stored in browser's **localStorage** for persistence
4. System checks if ID already liked (prevents duplicates)
5. If new: browser ID is inserted into database with timestamp
6. If already liked: like is removed from database

### Backend (Supabase)

- **Real-time updates**: Any new like instantly updates the counter on all viewing clients
- **Browser ID uniqueness**: The `UNIQUE` constraint prevents duplicate browser IDs
- **Row-level security**: Public insert/delete policies allow anyone to like/unlike
- **No server-side prompts**: All detection happens on the client

## 📧 Viewing Browser IDs

To see all emails that liked your portfolio:

1. Go to **Supabase Console**
2. Navigate to **Table Editor** → **likes**
3. You'll see all emails with their timestamps

### Export likes to CSV

Run this SQL query in the **SQL Editor**:

```sql
SELECT email, created_at FROM public.likes ORDER BY created_at DESC;
```

Then click **Export** to download as CSV.

## 📧 Viewing Browser IDs

To see all browser IDs that liked your portfolio:

1. Go to **Supabase Console**
2. Navigate to **Table Editor** → **likes**
3. You'll see all browser IDs (format: `browser-xxxxx-yyyyyyy`) with timestamps

### Export likes to CSV

Run this SQL query in the **SQL Editor**:

```sql
SELECT email as browser_id, created_at FROM public.likes ORDER BY created_at DESC;
```

Then click **Export** to download as CSV.

## ⚠️ Important Notes

- **Browser fingerprinting**: Each browser generates a unique ID based on user agent, language, screen size, and timezone
- **Persistence**: Browser ID is stored in localStorage and persists across sessions
- **Privacy-friendly**: No personal data collection, no email prompts
- **Local storage**: Browser ID stored in `sp-browser-id` key
- **Real-time**: Likes update live across all open browser tabs
- **Cross-device**: Each device/browser gets a unique ID

## 🔒 Security Considerations

Current setup is very user-friendly. For production, consider:

1. **IP-based rate limiting**: Prevent spam from same IP
2. **Browser verification**: Add CAPTCHA for bot protection
3. **Database backup**: Regular backups in Supabase
4. **Data retention**: Auto-delete old likes (e.g., older than 1 year)

## ❌ Troubleshooting

### Like button doesn't work
- Check browser console for errors (F12)
- Verify Supabase credentials are correct
- Ensure RLS policies are enabled

### Can't see browser IDs in database
- Go to Supabase → **Table Editor** → **likes**
- Check if table exists (run setup SQL if not)
- Make sure you're in the correct project/workspace

### Browser ID changes after clearing cache
- This is expected! Clearing localStorage removes the saved browser ID
- A new one will be generated on next visit

### Multiple likes from same IP
- Each browser on same network gets unique ID
- This is normal behavior for shared networks

## 📝 Future Enhancements

Consider adding:
- Daily like limits per browser
- Monthly like leaderboard
- Browser platform detection (mobile vs desktop)
- Geographic analytics
- Notification email when someone likes
- Like analytics dashboard

---

**Need help?** Check the Supabase documentation: https://supabase.com/docs
