# Project Documentation - Simple Profiles Manager
This documentation provides instructions on installation and usage of the simple profiles manager, a React app created with create-react-app.

## Installation
To get started with the profiles manager, follow the steps below:

### Make sure you have the following installed on your system:
 - Node.js (version v16.13.0 or later)
 - npm (version 8.1.0 or later)

### Steps
1. Clone the repository or download the project files.
2. Open a terminal or command prompt and navigate to the project directory.
3. Install project dependencies by running the following command:
```bash
npm install
```

4. Register for a Firebase account at https://firebase.google.com if you haven't already done so.
5. Create a new Firebase project and obtain the Firebase configuration details.
6. Create an `.env` file in the project root directory and fill it with your Firebase configuration information using the following format:
```makefile
REACT_APP_API_KEY=your_api_key
REACT_APP_AUTH_DOMAIN=your_auth_domain
REACT_APP_DATABASE_URL=your_database_url
REACT_APP_PROJECT_ID=your_project_id
REACT_APP_STORAGE_BUCKET=your_storage_bucket
REACT_APP_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_APP_ID=your_app_id
```
Replace your_api_key, your_auth_domain, etc., with the corresponding values from your Firebase project.

## Deployment
To deploy the profiles manager to Firebase hosting, follow these steps:

1. Install the Firebase CLI globally by running the following command:
```bash
npm install -g firebase-tools
```
2. Log in to Firebase using your Google account by running the following command and following the authentication prompts:
```bash
firebase login
```
3. Build the React app by running the following command:
```bash
npm run build
```
4. Test the deployment locally by running the following command:
```bash
firebase serve
```
5. If everything works fine, proceed to deploy the app to Firebase hosting by running the following command:
```bash
firebase deploy --only hosting
```
After the deployment is complete, you will receive a hosting URL where your profiles manager app is accessible.

## Usage
Follow the steps below to use the profiles manager app:
1. In the Firebase console, create a user who will be the administrator of the profiles manager.
2. Set the necessary security rules for Firestore Database and Storage. Use the following rules as an example:
```php
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow write: if request.auth.uid == "user_id";
      allow read;
    }
  }
}
```
Replace "user_id" with the ID of the created user.

3. Access the /auth page of the deployed app and sign in with the created account.
4. After successful authentication, the admin panel will be available (top-right corner). From the admin panel, you can create profiles. Additional hidden features for profile editing and deletion will be available on the website.
