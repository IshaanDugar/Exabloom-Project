# Exabloom Backend Test

This project is a backend system developed for the Exabloom Technical Test. It uses PostgreSQL as the database and Express.js as the backend framework to efficiently manage a large-scale contact and messaging database.

## Table of Contents

- [Overview](#overview)
- [System Requirements](#system-requirements)
- [Setup Instructions](#setup-instructions)
- [Assumptions](#assumptions)
- [Design Decisions](#design-decisions)
- [Usage](#usage)
- [Testing Endpoints](#testing-endpoints)
- [Additional Notes](#additional-notes)

## Overview

The application sets up two primary tables in a PostgreSQL database: `contacts` and `messages`.

- **contacts:** Stores contact information (phone numbers, creation and update timestamps).
- **messages:** Stores messages associated with contacts, including a generated column for full-text search optimization.

The backend exposes two main endpoints:
- **/conversations:** Retrieves the 50 most recent conversations (one per contact) with pagination.
- **/search:** Searches conversations by phone number (using ILIKE) or message content (using optimized full-text search).

## System Requirements

- **Node.js:** Version 14.x or higher  
- **npm:** Included with Node.js  
- **PostgreSQL:** Version 12 or higher  
- **Operating System:** Linux, macOS, or Windows

## Setup Instructions

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/IshaanDugar/exabloom-backend-test.git
   cd exabloom-backend-test
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Setup Environment Variables:**
   Create a file named **.env** in the root directory with the following content:
   ```
   DATABASE_URL=postgres://postgres:your_password@localhost:5432/exabloom_test
   PORT=3000
   ```

   Replace the line ```your_password``` to the password of your SQL server.
   This file is automatically loaded by the `dotenv` package.

4. **Database Setup:**
   - **Create the Database:**  
     Using your PostgreSQL client, run:
     ```sql
     CREATE DATABASE exabloom_test;
     ```

   - **Create Tables:**
     ```sql
     -- Create contacts table--
     CREATE TABLE contacts (
       id SERIAL PRIMARY KEY,
       phone_number VARCHAR(20),
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     );

     -- Create messages table--
     CREATE TABLE messages (
       id SERIAL PRIMARY KEY,
       contact_id INTEGER,
       content TEXT,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     );
     ```

   - **Add Full-Text Search Optimization:**
     Add a generated column and index for full-text search on messages:
     ```sql
     ALTER TABLE messages
       ADD COLUMN tsv tsvector GENERATED ALWAYS AS (to_tsvector('english', content)) STORED;

     CREATE INDEX idx_messages_tsv ON messages USING gin(tsv);
     ```

5. **Populate the Database:**
   Run the scripts to generate data:
   - **Generate Contacts:**
     ```bash
     node .\src\generateContacts.js
     ```
   - **Generate Messages:**
     ```bash
     node .\src\generateMessages.js
     ```

6. **Start the Express Server:**
   ```bash
   node .\src\main.js
   ```
   The server will start on the port specified in your **.env** file (default is 3000).

## Assumptions

- The CSV file (`message_content.csv`) used for message generation contains a column with message content.
- Contacts are generated with only a phone number (no names), per project requirements.
- The generated dummy data sufficiently simulates a realistic distribution of messages.
- The system targets scalability and performance, which is why full-text search optimization has been implemented.

## Design Decisions

- **Express.js & PostgreSQL:**  
  The project adheres to the requirement of using Express for the backend and PostgreSQL for the database.

- **Full-Text Search Optimization:**  
  A generated column (`tsv`) and a GIN index on the messages table are used to optimize full-text search, reducing runtime overhead by precomputing the search vector.

- **Parameterized Queries:**  
  All SQL queries are parameterized to prevent SQL injection and to promote reuse of query plans.

- **Pagination:**  
  Endpoints implement pagination using `LIMIT` and `OFFSET` to efficiently handle large datasets.

## Usage

Once the server is running, use the following endpoints:

- **Conversations Endpoint:**  
  `http://localhost:3000/conversations`  
  Retrieves the 50 most recent conversations. Paginate by appending `?page=2`, etc.

- **Search Endpoint:**  
  `http://localhost:3000/search?searchValue=yourSearchTerm`  
  Searches for conversations matching the provided term in the phone number or message content.

## Testing Endpoints

You can test the endpoints using a web browser, Postman, or cURL:

- **Conversations Endpoint:**
  ```bash
  curl http://localhost:3000/conversations
  ```

- **Search Endpoint:**
  ```bash
  curl "http://localhost:3000/search?searchValue=123"
  ```

## Additional Notes

- **Performance Optimizations:**  
  Using a generated column for full-text search (`tsv`) along with a GIN index has significantly improved search performance by reducing computation during each query.

- **Scalability:**  
  The system is designed to handle large datasets efficiently. Future optimizations could include caching, additional indexing, or keyset pagination for extremely large result sets.

- **Error Handling:**  
  Basic error handling is implemented in the Express endpoints. Consider enhancing this for production use.

## References:
- Get started with ExpressJS and PostgreSQL:
    https://medium.com/@eslmzadpc13/how-to-connect-a-postgres-database-to-express-a-step-by-step-guide-b2fffeb8aeac 

- Read and use CSV files with NodeJS:
    https://blog.logrocket.com/complete-guide-csv-files-node-js/ 

- Create dummy contacts and information:
    https://fakerjs.dev/guide/usage.html

- Understand and implement the optimization strategies:
    https://medium.com/learning-sql/12-tips-for-optimizing-sql-queries-for-faster-performance-8c6c092d7af1 

- Implement index searching optimization:
    https://www.postgresql.org/docs/current/textsearch-indexes.html
