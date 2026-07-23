# Ref Reviews — Setup Instructions

This is your fencing referee review website. Follow these steps in order.

## 1. Install Node.js (if you haven't already)
Download from nodejs.org — pick the "LTS" version. This lets your computer run the website code.

## 2. Unzip this project
Unzip this folder anywhere on your computer (e.g., your Desktop).

## 3. Open a terminal in this folder
- **Mac**: right-click the folder → "New Terminal at Folder" (or open Terminal and type `cd ` then drag the folder in)
- **Windows**: open the folder in File Explorer, click the address bar, type `cmd`, hit Enter

## 4. Install the pieces the website needs
Type this and press Enter:
```
npm install
```
This downloads all the code libraries the site depends on (takes 1-2 minutes).

## 5. Connect it to your Supabase database
1. Find the file called `.env.local.example` in this folder.
2. Make a copy of it and rename the copy to `.env.local`.
3. Open `.env.local` in any text editor.
4. Go to your Supabase project → Project Settings → API.
5. Copy the "Project URL" and paste it after `NEXT_PUBLIC_SUPABASE_URL=`
6. Copy the "anon public" key and paste it after `NEXT_PUBLIC_SUPABASE_ANON_KEY=`
7. Save the file.

## 6. Run it on your computer to test
Type:
```
npm run dev
```
Then open your browser to **http://localhost:3000** — your site is now running, just on your computer only.

Try it out:
- Add a referee using the "+ Add a referee" button
- Click into their profile
- Leave a test review

## 7. Put it on the real internet
1. Push this folder to a new GitHub repository (GitHub has a "create new repository" button that shows you the exact commands — just follow them).
2. Go to vercel.com → "Add New Project" → pick this GitHub repo.
3. When it asks for environment variables, paste in the same two values from Step 5 (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. Click **Deploy**. In about 2 minutes you'll get a real, public web address.

## What's already built
- **Home page**: search referees by name, add a new referee if they're not listed
- **Referee profile page**: shows average star rating, all reviews, and a form to leave a new review
- Leaving a review lets you tag which tournament/event it happened at — if the event doesn't exist yet, it's created automatically

## What you might want to add next
- Login/accounts (right now anyone can post as any name — fine for testing, but you'll want real accounts before going public)
- A moderation step so reviews need admin approval before they're visible (recommended — see the earlier discussion on legal risk)
- Ability to edit/delete your own review
- Photos on referee profiles

Just come back and ask if you want help with any of these next.
