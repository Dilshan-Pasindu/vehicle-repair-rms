# VSRMS Mobile Application

## Vehicle Service & Repair Management System Frontend

This is the React Native (Expo) frontend for the VSRMS application.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the Expo development server:
   ```bash
   npx expo start
   ```

3. Open the app:
   - Press `a` in the terminal to open in Android Emulator
   - Press `i` to open in iOS Simulator
   - Scan the QR code with the Expo Go app on your physical device

## Project Structure

- `src/api` - Axios network configuration
- `src/components` - Reusable UI components
- `src/navigation` - React Navigation navigators
- `src/screens` - Application screens grouped by feature domain (auth, vehicles, workshops, etc.)

## Configuration

The API connection is configured in `src/api/axios.js`. According to project requirements, no environment variables are used on the frontend — the `BASE_URL` is configured directly in the Axios utility.
