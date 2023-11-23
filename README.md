# Northcoders News API

Welcome to the NC News API! This API provides access to a wide range of endpoints allowing you to interact with articles, comments, users, and more.

### Minimum Versions Required

- Node.js: Version 12.x or higher
- PostgreSQL: Version 11.x or higher

### Hosted Version

You can access the hosted version of this API [here](https://nc-news-1l6p.onrender.com).

### Summary

The Northcoders News API serves as a platform to access articles, comments, users, and topics. It enables you to retrieve, create, update, and delete various resources within the system.

### Endpoints

The endpoint `GET /api` provides a list detailing all the available endpoints on this API and how they should be interacted with.

### Getting Started

To get the API running on your local machine, follow these steps:

#### Cloning

Clone this repository to your local machine using:

git clone https://github.com/Onion1994/my-northcoders-news.git

## Setting Up Environment Variables

To successfully run this project locally, follow these steps to create the necessary environment variables:

1. **Dev Database (.env.development):**

Create a `.env.development` file in the root directory and add the following: PGDATABASE=nc_news


2. **Test Database (.env.test):**

Similarly, create a `.env.test` file in the root directory and add: PGDATABASE=nc_news_test


### Installing Dependencies

After cloning the repository and setting up the environment variables, run the following command to install project dependencies: 

npm install

### Seeding the database

Once everything is installed, you can create the databases by running the following command: 

npm run setup-dbs

Finally, run the following command to seed the databases: 

npm run seed 

### Running Tests

Execute the following command to run tests:

npm test

This command will trigger the Jest testing framework and run the test suites.

