### 🚀 Lite Version Updates
**Date:** 23 January 2026

#### 🧩 Onboarding
- **Fixed:** Question header font styling.
- **Fixed:** Question subheader font styling.
- **Fixed:** Logic for question ordering.
- **Fixed:** Progress count (now dynamically calculates total question count).

#### 👋 Welcome Page
- **Fixed:** Issue with skipping the welcome page.
- **Fixed:** Added container "box" to improve text readability.
- **Fixed:** Updated general text content.
- **Fixed:** Removed text underline from the Garden Name.
- [x] Add image of the Bandicoot holding a food basket (worms/bugs).
- [x] Update copy to reflect game goals and explain the mascot.
  - *Note: Check if adding the image/copy breaks the current page design layout.*


#### 🗺️ Map Page
- **Fixed:** Back button functionality (now correctly navigates back to Welcome Page).
- **Fixed:** Header text font.
- [] update


#### 📸 Camera
- **Fixed:** Camera distortion and aspect ratio issues (implemented smart crop).

### Complete page
- Added complete page



### 🚀 Lite Version Updates
**Date:** 27 January 2026

### Authentication
- [x] Implement NextAuth
- [x] Add middleware/proxy
- [x] Update sign-in flow
- [x] Update registration flow
- [x] Add user onboarding check (route to `/lite/start`)
- [x] Update `currentUserContext`
- *Note: Bcrypt is temporarily disabled.*

### Feedback Page
- [x] Added database table
- [x] Added form function

#### 🗺️ Map Page
- [x] Add user_checkpoints table to database
- [x] update all function in currentUserContext that uses userCheckpoints
- [x] Update to save game progress to the database
- [x] Remove addGem function
- [x] Calculate user gems in addCheckpointGems base on gems collected. 

### Welcome Page
- Update copy and remove the real-life bandicoot image.


### 🚀 Lite Version Updates
**Date:** 28 January 2026
### Inside App
- Change Terms and Privacy popup button to close

### App Loader
- Added `appRouter` to handle navigation state and initialization.

### Proxy.ts
- Updated restriction logic to exclude `.gif` and other media file types from blocking rules.


### Map
- fix flag position of cp_020,cp_029

### Todos
- [x] Add logic to trigger map completed
- [x] Add logic for map time completion
- [x] Update complete page accordingly

### 🚀 Lite Version Updates
**Date:** 29 January 2026

### Welcome Page
- Close the gaps at the top of the title
- Move copy of the 2nd paragraph. (continues text) must be inline
- Update App Icon