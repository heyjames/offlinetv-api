const Pool = require('pg').Pool
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
});

// localhost - development
// const pool = new Pool({
//   user: 'me',
//   host: 'localhost',
//   database: 'api',
//   password: 'password',
//   port: 5432,
// });

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

async function getLastStreamed() {
  try {
    const queryText = "SELECT * FROM last_streamed ORDER BY id ASC";
    const result = await pool.query(queryText);
    console.log("result", result.rows);
    return result;
  } catch (error) {
    console.error("My error", error);
  }
}

async function getLastStreamedById(id) {
  if (!id) return console.error("Could not get last streamed by id from last_streamed table. No id provided");
  
  pool.query('SELECT * FROM last_streamed WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    console.log("results.rows[0].date", results.rows[0].date);
    return results.rows[0].date;
  })
}

async function createLastStreamed(date) {
  if (!date) return console.error("Could not create last streamed in the last_streamed table. No date provided");
  try {
    const queryText = "INSERT INTO last_streamed (date) VALUES ($1) RETURNING id";
    const results = await pool.query(queryText, [date]);
    console.log("last_streamed created", results.rows[0].id);
  } catch (error) {
    console.error("My error", error);
  }
}

async function updateLastStreamed(date, id) {
  if (!date || !id) return console.error("Could not update last_streamed table. No date or id provided");

  pool.query(
    'UPDATE last_streamed SET date = $1 WHERE id = $2',
    [date, id],
    (error, results) => {
      if (error) {
        throw error
      }
      console.log(`User modified with ID: ${id}`);
    }
  )
}

module.exports = {
  getLastStreamed,
  getLastStreamedById,
  createLastStreamed,
  updateLastStreamed
}