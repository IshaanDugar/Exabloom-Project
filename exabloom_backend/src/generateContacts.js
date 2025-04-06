import pkg from "pg";
import { faker } from "@faker-js/faker";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const generateContacts = async (numContacts) => {
  const client = await pool.connect();
  try {
    for (let i = 0; i < numContacts; i++) {
      // Generate a random phone number using faker
      // Ensure it fits within the database constraints (e.g., max length)
      const phone_number = faker.phone.number("###-###-####").substring(0, 20);

      // Insert the generated phone number into the database
      await client.query(
        "INSERT INTO contacts (phone_number, created_at, updated_at) VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
        [phone_number],
      );
    }
    console.log(`${numContacts} contacts generated successfully.`);
  } catch (error) {
    console.error("Error generating contacts:", error);
  } finally {
    client.release();
    pool.end();
  }
};

// Generate 100,000 contacts as required by the task
generateContacts(100000);
