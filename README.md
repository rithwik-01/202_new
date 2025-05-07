# BookTableBuddy

BookTableBuddy is a comprehensive restaurant table booking application that connects diners with restaurants, providing an easy-to-use platform for making, managing, and tracking reservations.

## Project Overview

BookTableBuddy is designed to streamline the restaurant reservation process, offering features for three main user roles:
- **Customers**: Search for restaurants, make reservations, manage bookings, and leave reviews
- **Restaurant Managers**: Manage restaurant profiles, tables, reservation schedules, and customer bookings
- **Administrators**: Oversee the platform, approve restaurant registrations, and view system analytics

## Team Titans

Team Titans is a group of software engineers who developed this application as a project for a software engineering course.

## Features

### Customer Features
- User registration and authentication
- Restaurant search with filters (location, cuisine, date, time, party size)
- Table reservation at available time slots
- Reservation management (view, modify, cancel)
- Post-dining review submission
- User profile management

### Restaurant Manager Features
- Restaurant registration and profile management
- Table configuration and management
- Reservation management dashboard
- Daily reservation schedule view
- Customer reservation tracking
- Restaurant analytics dashboard

### Admin Features
- User management
- Restaurant approval process
- System-wide analytics
- Platform monitoring

## Technology Stack

### Frontend
- **Framework**: React.js
- **State Management**: Context API
- **Styling**: Tailwind CSS
- **Routing**: React Router

### Backend
- **Framework**: Django & Django REST Framework
- **API**: RESTful API endpoints
- **Authentication**: JWT (JSON Web Tokens)

### Database
- **DBMS**: PostgreSQL
- **Schema**: Relational database design for users, restaurants, bookings, and reviews

## Architecture

BookTableBuddy follows a modern client-server architecture with:
- **Presentation Layer**: React.js frontend with responsive design
- **Application Layer**: Django backend with RESTful API
- **Data Layer**: PostgreSQL database

Refer to the [Architecture Diagrams](./project_artifacts/Architecture-Diagrams.md) for detailed component and deployment diagrams.

## User Interface

The application features a clean, intuitive user interface designed for ease of use across different devices. Key screens include:

- Home Page with search functionality
- Restaurant search results
- Restaurant details page
- Reservation booking interface
- User dashboards (customer, restaurant, admin)
- Authentication screens

Refer to the [UI Wireframes](./project_artifacts/UI-Wireframes.md) for detailed screen designs.

## Installation and Setup

### Prerequisites
- Node.js (v14+)
- Python (v3.8+)
- PostgreSQL

### Frontend Setup
```bash
# Navigate to frontend directory
cd BookTableBuddy/frontend

# Install dependencies
npm install

# Start development server
npm start
```

### Backend Setup
```bash
# Navigate to backend directory
cd BookTableBuddy/backend

# Install Python dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start development server
python manage.py runserver
```

## API Documentation

The application exposes several RESTful API endpoints for:
- User authentication and management
- Restaurant data
- Reservation booking and management
- Reviews
- Analytics

A detailed API collection is available in the `BookTable_API_Collection.json` file, which can be imported into Postman.

## Design Decisions

### Authentication Strategy
- JWT-based authentication for secure, stateless user sessions
- Role-based access control for three distinct user types

### Database Design
- Normalized relational database schema to maintain data integrity
- Efficient indexing for common queries like restaurant searches and reservation lookups

### User Experience
- Mobile-responsive design to accommodate users on various devices
- Intuitive reservation flow minimizing steps to complete a booking
- Real-time availability updates to prevent double bookings

### Security Considerations
- Password hashing and secure credential storage
- Data validation on both client and server sides
- HTTPS for all communications

## Development Workflow

This project follows a feature-based development workflow:
1. Feature branches created from the `development` branch
2. Pull requests with code review before merging
3. CI/CD pipeline for automated testing
4. Staging environment for pre-production testing
5. Production deployment after QA approval

## Future Enhancements

Planned future enhancements include:
- Mobile app versions (iOS/Android)
- Integration with payment processing for premium features
- Waitlist management for fully booked restaurants
- AI-powered restaurant recommendations
- Integration with third-party dining rewards programs

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Django and React.js communities for their excellent documentation
- Team members for their dedication and contributions
