import pkg from "pg";
import csv from "csv-parser";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const CSV_FILE = "./message_content.csv";

async function loadCSV() {
  return new Promise((resolve, reject) => {
    const results = [];

    // Read the CSV file and parse it using the csv-parser documentation syntax.
    fs.createReadStream(CSV_FILE)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        // Log the first row to see the actual column names
        if (results.length > 0) {
          console.log("CSV columns:", Object.keys(results[0]));
        }
        resolve(results);
      })
      .on("error", (error) => reject(error));
  });
}

async function generateMessages() {
  try {
    // Load CSV data into an array of rows
    const csvData = await loadCSV();
    console.log(`Loaded ${csvData.length} rows from CSV`);

    // If CSV is empty or has no rows, provide default messages
    if (csvData.length === 0) {
      console.error("CSV file is empty or not loaded correctly!");
      return;
    }

    // Determine the correct field name by checking the first row
    const firstRow = csvData[0];
    const contentField =
      "content" in firstRow
        ? "content"
        : "message_content" in firstRow
          ? "message_content"
          : Object.keys(firstRow)[0]; // Fallback to first column

    console.log(`Using field "${contentField}" for message content`);

    const totalMessagesRequired = 5000000;
    const batchSize = 1000;
    let messagesInserted = 0;

    while (messagesInserted < totalMessagesRequired) {
      const queries = [];
      for (
        let i = 0;
        i < batchSize && messagesInserted < totalMessagesRequired;
        i++
      ) {
        // Pick a random row from the CSV data
        const randomIndex = Math.floor(Math.random() * csvData.length);
        // Use the detected field name
        const messageContent = csvData[randomIndex][contentField];

        // Skip this iteration if messageContent is null or undefined
        if (!messageContent) {
          console.warn("Found null message content, skipping");
          continue;
        }

        // Randomly assign a contact_id between 1 and 100,000
        const contact_id = Math.floor(Math.random() * 100000) + 1;

        // Prepare the insert query
        queries.push({
          text: "INSERT INTO messages (contact_id, content, created_at) VALUES ($1, $2, CURRENT_TIMESTAMP)",
          values: [contact_id, messageContent],
        });

        messagesInserted++;
      }

      // Execute the batch inserts within a transaction for safety
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        for (let query of queries) {
          await client.query(query);
        }
        // If the above queries succeed, commit the transaction
        await client.query("COMMIT");
        console.log(
          `Inserted batch. Total messages inserted: ${messagesInserted}`,
        );
        // Otherwise, rollback the transaction
      } catch (err) {
        await client.query("ROLLBACK");
        console.error("Error inserting batch:", err);
        break;
      } finally {
        client.release();
      }
    }
    console.log("Finished inserting messages.");
  } catch (err) {
    console.error("Error generating messages:", err);
  } finally {
    pool.end();
  }
}

generateMessages();
