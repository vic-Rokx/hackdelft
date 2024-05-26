import sqlite3 from 'sqlite3';

// Create a new SQLite database
const db = new sqlite3.Database('test_database.db');

db.serialize(() => {
    // Create a dummy table with the specified columns
    db.run(`
    CREATE TABLE IF NOT EXISTS test_table (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      turbidity_ntu REAL,
      inlet_pressure_bar REAL,
      inlet_pressure_psi REAL,
      number_of_stacks INTEGER,
      type_of_stack TEXT,
      recovery_percent REAL,
      stages INTEGER,
      ph_range TEXT
    )
  `);

    // Insert some dummy data into the table
    const stmt = db.prepare(`
    INSERT INTO test_table (
      turbidity_ntu,
      inlet_pressure_bar,
      inlet_pressure_psi,
      number_of_stacks,
      type_of_stack,
      recovery_percent,
      stages,
      ph_range
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

    const data = [
        [0.5, 1.0, 14.5, 2, 'TypeA', 70.0, 3, '6-8'],
        [0.7, 1.2, 17.4, 3, 'TypeB', 75.0, 4, '7-9'],
        [1.0, 1.5, 21.7, 2, 'TypeC', 80.0, 3, '6-7'],
        [0.3, 1.0, 14.7, 1, 'TypeA', 65.0, 2, '7-8'],
        [0.8, 1.3, 18.9, 3, 'TypeB', 78.0, 4, '6-8']
    ];

    data.forEach(row => stmt.run(...row));

    stmt.finalize();

    // Query the data to verify
    db.each("SELECT * FROM test_table", (err, row) => {
        if (err) {
            console.error(err.message);
        }
        console.log(row);
    });
});

// Close the database connection
db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Closed the database connection.');
});
