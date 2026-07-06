# Symphony AI Coding Instructions

This document lists persistent project-specific rules, guidelines, and structural design agreements for AI Coding Agents working on the **Symphony Ambient Player** application.

## 1. Ownership & Permissions Constraint
- **App Creator/Owner**: **Pushpraj Kumar** (`pushprajkumar640@gmail.com`) is the exclusive administrator and creator of the application.
- **Authorization Enforcement**: 
  - Only the owner is permitted to add new synth tracks, upload audio files, or delete existing songs from the main catalog.
  - Non-owner visitors can still enjoy full music playback, create local custom playlists, search, like/unlike songs, and share tracks, but they cannot structurally modify the global song catalog.

## 2. Global Cloud Sync Strategy
- **Database Engine**: Firebase Firestore is used for persistent, global data syncing.
- **Song Catalog Synchronization**: 
  - On launch, the application loads songs directly from the global Firestore collection `songs`, merging with local caches and falling back to built-in presets only if the database is completely empty.
  - When the owner adds, uploads, or deletes a song, it is written to/removed from Firestore under the document ID `String(songId)`.
- **Media Transcoding**:
  - Since standard users do not have local IndexedDB blobs uploaded by the owner, any local file uploads by the owner under **800KB** are converted to Base64 and saved inside the Firestore record as `audioBase64`.
  - When other users play these tracks, the app automatically decodes the `audioBase64` string back to an audio Blob, saves it in their local browser's IndexedDB, and streams it seamlessly.
