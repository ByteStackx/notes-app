# Notes App

A modern React Native notes application built with Expo and TypeScript.

## Features

### Authentication
- User registration and login with email validation
- Secure password validation and confirmation
- User profile management

### Notes Management
- Create, read, update, and delete notes
- Organize notes by category (work, study, personal)
- Search notes by title, content, or category
- Sort notes by creation date (newest first or oldest first)

### User Interface
- Clean and intuitive mobile-first design
- Safe area support for notches and status bars
- Responsive layout with proper padding and spacing
- Floating action button for quick note creation
- Circular profile button in header for easy profile access
- Search and sort controls with 3:1 ratio layout

### Pages
- **Home**: View all notes with search and sort functionality
- **Add Note**: Create new notes with category selection
- **Edit Note**: Update existing notes
- **View Notes**: Detailed note view
- **Profile**: User profile management and settings
- **Login/Register**: Authentication screens

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Routing**: Expo Router
- **Storage**: AsyncStorage for local data persistence
- **Icons**: @expo/vector-icons (Material Icons)
- **State Management**: React Context API

## Project Structure

```
app/
  ├── _layout.tsx          # Root layout with navigation
  ├── index.tsx            # Entry point with auth redirect
  ├── home.tsx             # Home page with notes list
  ├── add-note.tsx         # Create new note
  ├── edit-note.tsx        # Edit existing note
  ├── view-notes.tsx       # View note details
  ├── login.tsx            # Login page
  ├── register.tsx         # Registration page
  └── profile.tsx          # User profile page

components/
  ├── CustomButton.tsx     # Reusable button component
  ├── CustomInput.tsx      # Reusable input field component
  ├── SearchBar.tsx        # Note search component
  ├── SortButton.tsx       # Sort control component
  ├── ScreenContainer.tsx  # Safe area wrapper component
  └── index.ts             # Component exports

context/
  └── AuthContext.tsx      # Authentication context

types/
  └── index.ts             # TypeScript type definitions

utils/
  ├── storage.ts           # AsyncStorage utility functions
  └── validation.ts        # Form validation utilities

assets/
  └── images/              # App images and icons
```

## Getting Started

### Prerequisites
- Node.js and npm
- Expo CLI

### Installation

```bash
npm install
```

### Running the App

```bash
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## Download

[Download from Google Drive](https://drive.google.com/drive/folders/1AFwuSr9TWEiMKrCORq06ETUjg9V6PHSE?usp=sharing)