# Vehicle Service & Repair Management System (VSRMS)

![Status](https://img.shields.io/badge/Status-Development-blue)
![Course](https://img.shields.io/badge/Course-SE2020-orange)

## Project Overview
VSRMS is a full-stack mobile application connecting vehicle owners with service workshops. It provides vehicle management, appointment booking, a full service history log, workshop discovery with ratings, and a location-based 'find nearest workshop' feature.

## Architecture
VSRMS follows a modern three-tier architecture:
- **Frontend (Mobile)**: React Native (Expo)
- **Backend (API)**: Node.js + Express
- **Database**: MongoDB Atlas
- **Authentication**: Asgardeo (WSO2) - OIDC / OAuth 2.0
- **Storage**: Cloudflare R2

## Directory Structure
- `vsrms-backend/`: Node.js Express API with robust JWT middleware, MongoDB Mongoose ODM, and role-based route guards.
- `vsrms-mobile/`: React Native Expo App, structured for high maintainability with React Navigation.
- `docs/`: Project documentation and technical details (including database schema).

## Getting Started
See the individual `README.md` files in `vsrms-backend` and `vsrms-mobile` for detailed setup and execution instructions.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
