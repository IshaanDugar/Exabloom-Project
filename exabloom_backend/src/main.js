import express from "express";
import pkg from "pg";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

const { Pool } = pkg;

// Should use environment variables only or a more secure credential management system
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create an Express app
const app = express();
app.use(express.json());

/**
  GET /conversations
 * Retrieves the 50 most recent conversations (latest message per contact).

 * Query Parameters:
 * - page: The page number for pagination (default: 1)
 
 * Response:
 * - conversations: Array of conversation objects with latest message
 * - pagination: Object containing pagination metadata
 */

app.get("/conversations", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 50;
  const offset = (page - 1) * limit;

  try {
    // This query finds the latest message from each contact
    // using a Common Table Expression to first get the max timestamp
    // for each contact, then joining back to get the full message details
    const conversationsQuery = `
      WITH LatestMessages AS (
        SELECT contact_id, MAX(created_at) AS latest_time
        FROM messages
        GROUP BY contact_id
      )
      SELECT 
        m.id, 
        m.contact_id, 
        c.phone_number, 
        m.content, 
        m.created_at
      FROM messages m
      JOIN LatestMessages lm 
        ON m.contact_id = lm.contact_id 
       AND m.created_at = lm.latest_time
      JOIN contacts c 
        ON c.id = m.contact_id
      ORDER BY m.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(conversationsQuery, [limit, offset]);

    // Count total unique conversations for pagination metadata
    const countQuery = `
      SELECT COUNT(DISTINCT contact_id) AS total_conversations 
      FROM messages
    `;
    const countResult = await pool.query(countQuery);
    const totalConversations = parseInt(
      countResult.rows[0].total_conversations,
    );

    res.json({
      conversations: result.rows,
      pagination: {
        page,
        limit,
        total: totalConversations,
        totalPages: Math.ceil(totalConversations / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /search
 * Searches for conversations containing the specified search term
 *
 * Query Parameters:
 * - searchValue: Term to search for in phone numbers or message content (required)
 * - page: The page number for pagination (default: 1)
 *
 * Response:
 * - conversations: Array of matching conversation objects
 * - pagination: Object containing pagination metadata
 */
app.get("/search", async (req, res) => {
  const { searchValue } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = 50;
  const offset = (page - 1) * limit;

  // Handling and validation of searchValue
  if (!searchValue) {
    return res
      .status(400)
      .json({ error: "Please provide a searchValue query parameter." });
  }

  try {
    // Add wildcards for partial phone number matching
    const phoneTerm = `%${searchValue}%`;

    // We'll use this value with plainto_tsquery for text search
    const tsQuery = searchValue;

    // This query searches across both phone numbers and message content
    // Note: the plainto_tsquery is a function that converts the search term into a tsquery
    const searchQuery = `
      SELECT 
        m.id, 
        m.contact_id, 
        c.phone_number, 
        m.content, 
        m.created_at
      FROM messages m
      JOIN contacts c ON m.contact_id = c.id
      WHERE c.phone_number ILIKE $1 
         OR m.tsv @@ plainto_tsquery('english', $2)
      ORDER BY m.created_at DESC
      LIMIT $3 OFFSET $4
    `;
    const result = await pool.query(searchQuery, [
      phoneTerm,
      tsQuery,
      limit,
      offset,
    ]);

    // Count total matches for pagination
    const countQuery = `
      SELECT COUNT(*) AS total_matches
      FROM messages m
      JOIN contacts c ON m.contact_id = c.id
      WHERE c.phone_number ILIKE $1 
         OR m.tsv @@ plainto_tsquery('english', $2)
    `;
    const countResult = await pool.query(countQuery, [phoneTerm, tsQuery]);
    // Filtering the result to get the total matches
    const totalMatches = parseInt(countResult.rows[0].total_matches);

    // Using pagination
    res.json({
      conversations: result.rows,
      pagination: {
        page,
        limit,
        total: totalMatches,
        totalPages: Math.ceil(totalMatches / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server (just including 3000 incase the env variable is not set)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    `Access conversations at: http://localhost:${PORT}/conversations`,
  );
  console.log(
    `Search endpoint: http://localhost:${PORT}/search?searchValue=yourSearchTerm`,
  );
});
