---
title: Projet React - link->https://wtspweb.osc-fr1.scalingo.io/frontend 
author:  
- Abdelhadi Nasmane
- Yassine Rjeb
--- 

## Specifications

### Desired Features

Authentication

✅ Account Creation: Users can create an account by providing their name, email address, and password.

✅ Login: Users can log in using their email address and password.
Group Management

✅ Create Groups: Users can create new groups by specifying a name.

❌ Join Groups: Users cannot yet search for existing groups and request to join them.

✅ Manage Members: Group owners can add or remove members.

❌ Manage Groups: Group owners cannot yet modify the group name or delete the group.

#### Messagerie

✅ Échange de messages : Les utilisateurs peuvent envoyer des messages textuels aux autres membres d'un groupe.

✅ Affichage chronologique : Les messages sont affichés dans l'ordre chronologique de leur envoi.

❌ Suppression des messages : Les utilisateurs ne peuvent pas encore supprimer leurs propres messages, et les propriétaires de groupes ne peuvent pas encore supprimer tous les messages du groupe.

### Use Cases

![Use Case Diagram](screens/dev0.png)

### Screenshots

#### Main Page
![Main Page](screens/dev1.png)

#### Account Creation with Invalid Information
![Account Creation with Invalid Information](screens/dev2.png)

#### Account Creation
![Account Creation](screens/dev3.png)

#### Login + Home Page
![Home Page](screens/dev4.png)

#### Group Creation
![Group Creation](screens/dev5.png)

#### Group Management
![Group Management](screens/dev6.png)

#### Adding Members
![Adding Members](screens/dev7.png)

#### Group Conversation
![Group Conversation](screens/dev8.png)

#### Sending a Message
![Sending a Message](screens/dev9.png)

#### Message Reception (Uchiha Madara speech 1)
![Message Reception (Uchiha Madara speech 1)](screens/dev10.png)

#### Message Reception (Uchiha Madara speech 2)
![Message Reception (Uchiha Madara speech 2)](screens/dev11.png)

### Implemented API

Swagger documentation link: https://wtspweb.osc-fr1.scalingo.io/doc/

## Code Architecture

### FrontEnd

#### Authentication Components (connect-components):
These components handle the user interface for authentication and account creation.

- **Acceuil.jsx**: This component represents the page displayed after a successful login.
- **CreateAccount.jsx**: This component allows users to create a new account by providing their name, email address, and password.
- **LoginView.jsx**: This component manages the login process for existing users, allowing them to enter their email and password.

#### Group Management Components (groups-components):
These components manage the user interface for group management, including creation, deletion, and member management.

- **GroupsManager.jsx**: This component allows users to manage the groups they own. It includes sub-components such as:
  - **SelectMembers.jsx**: Handles the list of users available to be added to a group.
  - **DeleteMembers.jsx**: Manages the removal of group members.
- **SelectMembers.jsx**: Allows users to select members to add to an existing group.
- **DeleteMembers.jsx**: Allows users to remove members from their group, consisting of multiple **DeleteMember.jsx** components, each representing a member.
- **DeleteMember.jsx**: Represents a member belonging to a group.
- **JoinedGroups.jsx**: Displays the list of groups the user is a member of, consisting of multiple **JoinedGroup.jsx** components, each representing a group.
- **JoinedGroup.jsx**: Represents a group the user is a member of.
- **OwnedGroups.jsx**: Displays the list of groups the user has created, consisting of multiple **OwnedGroup.jsx** components, each representing a group.
- **OwnedGroup.jsx**: Represents a group the user has created.

#### Messaging Components (messages-components):
These components manage the user interface for sending and receiving messages in groups.

- **MessagesManager.jsx**: Displays the list of messages in a specific group and allows users to send new messages.
- **Message.jsx**: Represents an individual message in a group conversation. It displays the message content and potentially the sender's name.
- **PostMessage.jsx**: Allows users to write and send a new message in the group conversation.

### Backend

#### Database Schema

![DB schema](screens/dev22.png)

#### Backend Code Architecture

##### Backend (backend/src):

###### Controllers (controllers):
This folder contains files that define the business logic of the backend application.
Each controller file typically corresponds to a specific entity or feature.
For example, **groups.js** contains functions for managing group operations such as creation, retrieval, updating, and deletion.

###### Models (models):
This folder defines the data models representing entities stored in the database.
The models define data structures and relationships, facilitating CRUD operations.
For example, **groups.js** defines the schema for a group with its attributes.

###### Routes (routes):
This folder defines the API routes for the application.
Each route file generally corresponds to a set of routes for a specific entity or feature.
For example, **groups.js** defines the routes for group-related operations.

###### Utilities (util):
This folder contains reusable utilities or functions that are not specific to any particular feature but are needed throughout the backend application.
For example, **logger.js** includes functions for logging messages to the console.

###### Main Files (app.js and server.js):
These files are the entry points for the backend application.
They are responsible for starting the Express server, defining routes, handling errors, and managing incoming HTTP requests.

### Role and Permission Management

#### Backend Side
Currently, access is open to all.

#### Frontend Side
The backend only provides the necessary information, avoiding exposure of sensitive data. However, the endpoint providing this information remains open per the backend assignment's requirements.

# Testing

## Backend

### Authentication & User Management

#### **Login and User Listing Test**
This test verifies that a user can successfully log in and retrieve the list of users. It also checks scenarios where the token is missing or invalid.

#### **Account Creation, Password Update, and Login with Old Password**
This test ensures that a user can create an account, log in, update their password, and checks that login with the old password fails after an update.

#### **Login with Invalid Credentials**
This test covers scenarios where a user attempts to log in with missing credentials, an incorrect email, or an incorrect password.

#### **User Creation with Invalid Information**
This test verifies failure cases during user registration due to invalid details, such as an invalid email, username, or weak password.

### Administration Features

#### **Administrative Operations Test**
This test covers user management actions such as updating user details (password, email, username, isAdmin) and deleting users.

#### **Token Usage by Deleted Users**
This test checks if a deleted user attempts to use their token, ensuring proper security handling.

### Group Management

#### **Group Creation and Member Management**
This test verifies the ability to create a group, add members, and list members. Some member management tests were commented out after implementing WebSockets.

### Messaging

#### **Message Creation and Retrieval**
This test ensures that users can send and retrieve messages within a group. Some messaging-related tests were commented out after implementing WebSockets.

### **Test Coverage**
These tests provide 100% coverage of backend files developed before the addition of WebSockets.

---

## Frontend

### **Authentication**

#### **User Registration Test**
This test verifies the registration process by filling out the form with valid information, such as a username, a randomly generated unique email, and a valid password. It ensures that a success message appears after registration and that the email is pre-filled on the login page.

#### **Registering with an Existing Email**
This test checks the scenario where a user attempts to sign up with an already registered email, ensuring the proper error message is displayed.

#### **Registration with Invalid Information**
This test validates various failure cases where the user provides invalid registration details, such as an invalid username, email, or password. It ensures that the appropriate error messages are displayed.

#### **Login with Invalid Information**
This test verifies cases where a user provides invalid login credentials, such as an incorrect email format or weak password, and ensures that appropriate error messages are shown.

#### **Login with Incorrect Credentials**
This test ensures that login attempts with a valid email but incorrect password result in a proper failure message.

#### **Successful Login**
This test verifies that a user can log in successfully using previously registered credentials and is redirected to the homepage.

### **Group Features**

#### **User Registration, Login, and Group Management**
This test ensures that a user can register, log in, and manage groups. It verifies that after creating a group, it appears in both the user's created groups list and joined groups list. It also ensures that the group management elements are present and that the member list is initially empty. The test further validates that a user can add and remove members, updating the list accordingly.

### **Messaging Features**

#### **User Registration, Login, and Messaging**
This test validates the messaging functionality by ensuring that:
1. A user registers, logs in, and creates a group.
2. The messaging interface appears when selecting the created group.
3. A message can be sent successfully.
4. A second user is registered and added to the group.
5. The second user can send messages.
6. The first user can see messages from the second user, ensuring correct display of messages and sender information.

---

## **Integration & Deployment**

### **Continuous Integration Jobs**

#### **Linting (JavaScript)**
- Runs ESLint to analyze backend JavaScript code.
- Generates a lint report (`lintes_report.txt`).

#### **Super Test**
- Runs backend tests and documentation validation.
- Generates a test coverage report (`testCover_report.txt`).

#### **Static Security Analysis (Semgrep)**
- Scans backend code for security vulnerabilities using Semgrep.
- Generates a security report (`testSecurity_report.txt`).

#### **CSS Linting**
- Runs a CSS linter on `App.css`.
- Generates a lint report (`lintcss_report.txt`).
- The linter used is slightly outdated, leading to warnings about using IDs as selectors.

#### **Frontend Testing (Cypress)**
- Cleans the database.
- Starts backend and frontend locally.
- Runs Cypress tests to validate frontend functionality.

#### **Badges Generation**
- Generates status badges for test and CI/CD results to display in the project.

#### **Deployment (Scalingo)**
- Configures the environment.
- Installs dependencies.
- Builds the frontend production version.
- Deploys backend and frontend to Scalingo.

---

## **Local Installation & Setup**

### **Backend Setup**
1. Open a terminal:
   ```sh
   cd /path/to/repo
   cd backend
   npm install
   npm run updatedb
   npm run startdev
   ```

### **Frontend Setup**
1. Open another terminal:
   ```sh
   cd /path/to/repo
   cd frontend
   npm install
   npm run dev
   ```

### **Accessing the Application**
- Open your browser and navigate to:  
  **[http://localhost:5173](http://localhost:5173)**
