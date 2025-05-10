# Akwa Ibom State Health Data Collection and Reporting System

A comprehensive web-based healthcare data management system for Akwa Ibom State, Nigeria.

## Overview

This system enables healthcare facilities throughout Akwa Ibom State to collect, store, and report on patient data across five key healthcare areas:

1. Birth Statistics
2. Death Statistics
3. Immunization
4. Antenatal Care
5. Communicable Diseases
6. Family Planning

## Features

- User management with role-based access control
- Patient registration and management
- Data collection for multiple healthcare areas
- CSV data import and export
- Data visualization and reporting
- Multi-facility access to patient records
- Mobile application for offline data collection

## Technology Stack

- **Backend**: Node.js, Express, Sequelize ORM
- **Database**: PostgreSQL
- **Frontend**: React.js, Recharts
- **Mobile**: React Native

## Prerequisites

- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-repo/akwa-ibom-health-system.git
   cd akwa-ibom-health-system
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a PostgreSQL database:
   ```
   createdb akwaibom_health
   ```

4. Set up environment variables:
   ```
   cp .env.example .env
   ```
   Edit the `.env` file with your database credentials and other configuration options.

5. Run database migrations:
   ```
   npm run migrate
   ```

6. Seed the database with initial data:
   ```
   npm run seed
   ```

7. Start the development server:
   ```
   npm run dev
   ```

## Project Structure

```
akwa-ibom-health-system/
├── src/                  # Source code
│   ├── api/              # API routes, controllers, services
│   ├── config/           # Configuration files
│   ├── models/           # Database models
│   ├── utils/            # Utility functions
│   ├── app.js            # Express app setup
│   └── server.js         # Entry point
├── tests/                # Test files
├── public/               # Static files
└── logs/                 # Application logs
```

## API Documentation

API documentation is available at `/api/docs` when the server is running.

## Running Tests

```
npm test
```

## Deployment

Instructions for deploying to production environments can be found in [DEPLOYMENT.md](DEPLOYMENT.md).

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Akwa Ibom State Health Commissioner
- Healthcare facilities in Akwa Ibom State
- Development team# IBOM-BE
