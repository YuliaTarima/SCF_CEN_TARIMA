# YuliaDrawChat PWA

## Overview
YuliaDrawChat is a Progressive Web Application (PWA) that combines a drawing tool with a chat feature, designed to function seamlessly online and offline. Users can create drawings, download their artwork, send and receive messages, and interact with the app even when offline. The application ensures that messages created while offline are queued and sent when connectivity is restored.

## Features
- **Drawing Canvas**: Users can draw using a customizable color picker and adjustable brush size.
- **Chat Functionality**: A built-in chat interface allows users to send and receive messages.
- **Offline Support**: The app is fully functional offline, enabling users to draw and write messages without internet connectivity. Messages are queued and synced when back online.
- **PWA Installation**: Users can install the app on their devices for a more native experience.
- **Push Notifications**: The app supports push notifications to alert users of new messages.

## Technology Stack
- **Frontend**: HTML, CSS, JavaScript
- **PWA Implementation**: Service Worker, Web Manifest, IndexedDB for offline message storage
- **Design**: Responsive design with support for dark and light themes

## How to Run the Application
1. Clone the repository or download the project files.
2. Ensure all files (‘app.js’, ‘index.html’, ‘manifest.json’, ‘service-worker.js’, ‘styles.css’, and images) are in the same directory.
3. Run the back-end and then client server by navigating to the proper directory per each and running
   ```bash
   npm start
   ```
4. Client server runs via the following URL in your web browser, e.g.
   ```bash
   http://localhost:3000/
   ```
5. Backend server runs on port 6069. You can helth-check by going to the following URL in your browser:
   ```bash
   http://localhost:6069/
   ```
## App Structure
- **index.html**: The main HTML file with the app structure and links to other resources.
- **app.js**: Contains the main logic for initializing the app, UI management, drawing functionality, and chat operations.
  Collects and integrates modules from `app_modules` for overall app functionality.
    - **DrawingApp.js**: Contains the logic for the Drawing Tool.
    - **MessagingApp.js**: Contains the logic for the Messaging System.
    - **UIManager.js**: Handles initialization of app shell elements, theme detection and application, and updates connection status on the UI.
    - **PWAManager.js**: Manages PWA and Service Worker initialization.
    - **NotificationManager.js**: Handles the push notification logic.
- **manifest.json**: Defines the PWA configuration, including app icons and theme color.
- **service-worker.js**: Manages caching strategies, offline support, and background synchronization.
- **offline-page.html**: A fallback page displayed when the app is accessed offline without a cached version.
- **styles.css**: Stylesheet for app UI and responsive design.

## Key Functionalities
### Drawing Tool
- **Canvas**: A responsive canvas for drawing with mouse or touch inputs.
- **Controls**:
  - Color picker for selecting stroke color.
  - Brush size slider to adjust stroke thickness.
  - Clear button to reset the canvas.
  - Download button to save the drawing as a JPEG file.

### Messaging System
- **Message History**: Displays past messages in different styles (user, assistant, system).
- **Input Box**: Text area for typing new messages.
- **Send Button**: Sends messages, queues them when offline, and processes them when back online.
- **Local Storage**: Saves chat history and unsent messages using `localStorage` for persistence.

### Offline Capability
- **Caching**: Uses a service worker to cache essential assets for offline access.
- **Background Sync**: Ensures messages are sent automatically when the app regains connectivity.
- **Fallback Page**: Provides a user-friendly message when offline access fails.

## Installation as PWA
1. Open the app in a supported browser.
2. Click on the ‘Install’ button that appears or the browser's installation prompt.
3. Follow the on-screen instructions to add the app to your home screen or desktop.

## Push Notifications
- Users receive notifications for new messages or updates.
- Push notifications include actions for quick interaction (e.g., opening the app).

## Offline Page
The offline page (‘offline-page.html’) provides a clear message about the app's offline capabilities, allowing users to continue using essential features until connectivity is restored.

## Customization
### Themes
The app supports both light and dark themes based on the user's system preferences. Theme adjustments are made using CSS custom properties and media queries.

## Future Enhancements
- Add user authentication for personalized chat experiences.
- Implement a more sophisticated message queuing system using IndexedDB.
- Enhance the drawing tool with more features such as shapes and text overlay.

## License
This project is licensed under the MIT License. You are free to use, modify, and distribute it as needed.

---
Developed as a capstone project by Yulia Tarima.

