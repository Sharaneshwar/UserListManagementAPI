# User List Management and Email Sending API

## Overview

This project provides a RESTful API for managing lists of users with customizable properties and sending emails to these users. It is built using Node.js, Express.js, and MongoDB.

## Features

- **List Creation**: Admins can create lists with a title and custom properties.
- **User Addition**: Admins can add users to a list via CSV upload. The CSV must contain headers and at least the `name` and `email` fields.
- **Unique Emails**: No duplicate emails within a list.
- **Error Handling**: Provides detailed feedback if user additions fail.
- **Email Sending**: Sends personalized emails to all users in a list.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Nodemailer (for sending emails)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/Sharaneshwar/UserListManagementAPI.git
    cd UserListManagementAPI
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your environment variables:
    ```env
    MONGODB_URI=******
    APP_PASSWORD=******
    ```

4. Start the server:
    ```sh
    npm start
    ```

## Postman Documentation Link
[https://documenter.getpostman.com/view/35017233/2sA3QmDF23](https://documenter.getpostman.com/view/35017233/2sA3QmDF23)

## Deployed URL
[https://userlistmanagementapi-production.up.railway.app/](https://userlistmanagementapi-production.up.railway.app/)
