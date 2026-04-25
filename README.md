# The SIM website

_This is the website of the Studio for Interrelated Media (SIM) program at the Massachusetts College for Art and Design (MassArt)._


# History

The first website for SIM was developed by Matt Karl.

## The basics

**What is this thing?**

This is the website for the SIM program at MassArt. The purpose of the website is to help students find their classmates through a directory of names and faces, as well as to help faculty keep a record of each student's grades throughout the program.

**The basic features are:**

- A directory of names & faces of both students and faculty.
- A calendar of Thursday class meeting times, locations, and agendas.
- An admin dashboard to manage students and other data.

## Setup

**Server/environment:**

- [ ] Ubuntu 24+
- [ ] Git 2.53+

**Dependencies:**

- [ ] Node 20+
- [ ] Next.js 15+
- [ ] PostgreSQL 14+
- [ ] Nginx 1.26+

**Keys & credentials:**

Credentials are stored in the `.env` file (copy from `.env.example`).

```
NEXTAUTH_URL="https://localhost:3000/" // Set to production domain for the live website.
AUTH_TRUST_HOST=true
NEXTAUTH_SECRET=
AUTH_GOODLE_ID=
AUTH_GOODLE_SECRET=
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/DATABASE"
```

This website the Google API to manage user authentication, as a developer project created on the SIM Google account `@gmail.com`. You will need to create your own developer project for your local installation.

## Installation & deployment

```bash
# 1. Clone the repository
git clone https://github.com/aefader00/sim-next-app.git

# 2. Navigate to the project folder
cd sim-next-app

# 3. Set up environment variables
cp .env.example .env
nano .env

# 4. Install dependencies
npm install --global yarn
yarn install

# 5. Set up the database
sudo -u postgres psql
> CREATE USER sim WITH PASSWORD 'sim';
> CREATE DATABASE sim OWNER sim;
> GRANT ALL PRIVILEGES ON DATABASE sim TO sim;
> \c sim
> GRANT ALL ON SCHEMA public TO sim;

# 6. Link database to app

yarn prisma migrate deploy
yarn prisma db seed
yarn prisma generate 

# 7. Build the frontend
yarn build

# 8. Start the application
yarn start
```

**Access the application:**

- Development: `http://localhost:3000` (or your configured port!)
- Production: `https://massartsim.org`

## Common maintenance tasks

### How to update the application

```bash
# Pull the latest code.
git pull

# Install any new dependencies.
yarn install

# Run database migrations
yarn prisma migrate deploy

# Rebuild the application
yarn build

# Restart the application
pm2 restart massartsim.xyz
```

### How to update the .env

```bash
pm2 restart massartsim.xyz --update-env
```

### How to check app status & logs

```bash
# Check service status
pm2 list

# View logs (last 50 lines)
pm2 logs massartsim.xyz --lines 50

# Follow error logs
pm2 logs massartsim.xyz --err
```

### Backing up the database

```bash
pg_dump -U sim sim > backup_$(date +%Y%m%d).sql
```

### Restoring the database

```bash
sudo -u postgres dropdb --force sim
sudo -u postgres createdb sim
psql -U sim -d sim -f database/backups/[backup].sql
```

### Editing the database

```bash
sudo -u sim psql
> UPDATE "Table" SET value = '' WHERE value = '';
```

## Project structure

```
sim-next-app/
├── database /            # Database files
│   ├── migrations/       # History of database migrations
│   ├── schema.prisma     # Structure for the database
│   ├── seed.ts           # Default information for a new database
├── src/                  # Main code files
│   ├── app/              # Website pages
│   ├── components/       # Reusable code chunks
│   ├── actions.js        # Next.js server actions
│   ├── database.ts       # Prisma client init
│   └── utilities.js      # Utility functions
├── public/               # Static files (CSS, JS, images)
│   ├── faces/            # Photos of students' faces uploaded by faculty
├── .env                  # Environment variables (DO NOT COMMIT!)
├── .env.example          # Environment template
├── .gitignore
├── package.json          # Project information, dependencies and scripts
└── README.md             # This file!
```

A closer look at the pages of the website...

```
sim-next-app/src/app/
├── admin /                         # Pages for faculty use
│   ├── semesters/                  # All semesters
│	│   ├── [id]/                   # Dynamic path for a selected semester
│	│	│   ├── edit/               # Edit selected semester
│	│   ├── add/                    # Add a new semester
├── thursdays /                     # Calendar of all Thursdays
│   ├── [thursday_id]/              # Dynamic path for a selected semester
│	│   ├── edit/                   # Edit selected Thursday
│	│   ├── groups/                 # All groups attached to this class
│	│	│   ├── [group_id]/         # Dynamic path for a selected semester
│	│	│	│   ├── [edit]/         # Edit selected group
│	│	│	│   ├── works/          # All works attached to this group
│	│	│	│	│   ├── [id]/       # Dynamic path for a selected work
│	│	│	│	│	│   ├── edit/   # Edit selected work
│	│	│	│	│   ├── add/        # Add a new work
│	│	│   ├── add/                # Add new group
├── users /                         # Directory of names and faces
│   ├── [username]/                 # Dynamic path for a selected user
│	│   ├── edit/                   # Edit selected user
│	├── add/                        # Add new user
├── globals.css                     # Website-wide styles
├── layour.js                       # Website-wide layout (NavBar, etc.)
└── page.js                         # Home page. All page folders have a page.js.
```

## Common tasks for faculty

### Adding a user

To add a user, click on the "Add user" button on either the Names & Faces page or the admin dashboard page. You can also navigate to "/users/add".

The most important field is their email. Users will use their Google accounts to log in, so you need to whitelist which addresses are allowed to access the website.

You must fill also out information about the user like their name and pronouns. You will also need to upload a photo of their face.

### Editing a user

To edit a user, click on the "Settings" button on their profile or the pencil button on the admin dashboard.

You need to be an admin to be able to edit users that are not yourself.

### Adding a semester

Go to the admin dashboard, click on the "Add" button next to the "Semesters" section.

Add a name for the semester, typically something like "FA26."

Select the dates of the first and last Thursday of the semester. The website will find every Thursday between and including those dates and create an database entry that you can add productions and presentations to.

Select which users are present in the semester. All users in the most recent semester are auto-selected.

### Removing a user from a semester

If a user unenrolls from the semester but intends to reenroll in the future, you can "deactivate" the student without deleting their user by removing them from the semester.

Go to the admin dashboard, click on the pencil button next to name of the semester you want to edit.

Deselect the users.

### Add a group production to a Thursday

To add a production, go to the Thursdays page and search for the Thursday when the group will be produced. Click on the "Add" button next to "Groups".

Add the name and location of the group.

If a production is delayed, you are able to edit the selected Thursday later.

Select the producers of the group. This is important data, as this production will be counted for their semester total on the admin dashboard.

Create all presentations of the production.

### Add a student's presentation to a group

Start to either add or edit a production and scroll down to the "Presentations" section.

Add the name and a description of the presentation.

Add all presenters of the presentation. This is important data, as this presentation will be counted for their semester total on the admin dashboard and listed on the presenter's profile.

### View student's progress through a semester.

Go to the admin dashboard.

Search for the student you want to inspect. The dashboard defaults to the most recent semester, so remember to change that filter if you want to look at previous semesters.

The "Works Made" column contains all of the presentations by that user in the semester.

The "Groups Produced" column contains all of the productions by that user in the semester, divided into the first half and second half of the semester.
