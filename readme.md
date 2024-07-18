# Node.js Assignment 7

This is a Node.js application for managing users and their to-do items. The application includes user authentication and authorization using JWT, CRUD operations for users (restricted to super admin), and CRUD operations for to-do items for each user. 

## Features

- Add a Default Super Admin User
- Create CRUD Routes for Users
- Ensure Only Super Admin Can Access User Routes
- Implement CRUD Operations for To-Do Items for Each User
- Add Proper HTTP Status Codes
- Proper Error Handling
- Logging with Winster
- Data validation with Joi
- Use of limiter-package to limit request
- Use of helmet-package to be safe from web-vulnerabilites
- Use of Cors for to allow safe domains

## Object Relational Mapping  
Using **Knex** and **pg**

## Integration of database with server  
Using **Postgre SQL** 

## User Routes

# API Documentation

## User Routes

| Endpoint    | HTTP Method | Description     |
|-------------|-------------|-----------------|
| `/users/`   | POST        | Create a user   |
| `/users/:id`| GET         | Get a user      |
| `/users/:id`| PUT         | Update a user   |
| `/users/:id`| DELETE      | Delete a user   |

## Todo Routes

| Endpoint                | HTTP Method | Description                          |
|-------------------------|-------------|--------------------------------------|
| `/todos`                | POST        | Create a todo                        |
| `/todos/all?page=&size=`| GET         | Get all todos                        |
| `/todos/:id`            | GET         | Get a todo                           |
| `/todos/:id`            | PUT         | Update a todo                        |
| `/todos/:id`            | DELETE      | Delete a todo                        |
| `/todos/:id`            | PATCH       | Update a todo's is complete status   |

## Auth Routes

| Endpoint                     | HTTP Method | Description                 |
|------------------------------|-------------|-----------------------------|
| `/auth/login`                | POST        | Login and create a session  |
| `/auth/refresh-access-token` | GET         | Refresh the access token    |

## Installation

1. Clone the repository:
   git clone https://github.com/ajay9803/node-assignment-4

2. Install packages:  
   npm install


