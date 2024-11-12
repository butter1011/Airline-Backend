
# Airline Review Flutter Mobile App Backend

This repository contains the backend code for the Airline Review Flutter Mobile App. The backend is responsible for handling data storage, API endpoints, and business logic for the mobile application.

## Features

- User authentication and authorization
- CRUD operations for airline reviews
- Data storage and retrieval
- API endpoints for mobile app integration

## Technologies Used

- Node.js
- Express.js
- MongoDB
- JWT for authentication

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB

### Installation

1. Clone the repository:
   
   git clone https://github.com/your-username/airline-review-backend.git
   

2. Install dependencies:
   
   cd airline-review-backend
   npm install
   

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   

4. Start the server:
   
   npm start
   

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/airlines` - Get all airlines
- `GET /api/airlines/:id` - Get a specific airline
- `POST /api/reviews` - Create a new review
- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/:id` - Get a specific review
- `PUT /api/reviews/:id` - Update a review
- `DELETE /api/reviews/:id` - Delete a review

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

