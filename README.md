# Northcoders News API

## Setting Up Environment Variables

To successfully run this project locally, follow these steps to create the necessary environment variables:

1. **Dev Database (.env.development):**

Create a `.env.development` file in the root directory and add the following: PGDATABASE=nc_news


2. **Test Database (.env.test):**

Similarly, create a `.env.test` file in the root directory and add: PGDATABASE=nc_news_test


### Installing Dependencies

After cloning the repository and setting up the environment variables, run the following command to install project dependencies: npm install

Once everything is set up, you can create the databases by running the following command: npm run setup-dbs

Finally, run the following command to seed the databases: npm run seed


