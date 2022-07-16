const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text,
            student_number text,
            final_class number,
            institution text,
            course text,
            conc_date date,
            certificate_hash text,  
            email text , 
            password text
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO user (name, student_number, final_class , institution, course, conc_date, certificate_hash, email, password) VALUES (?,?,?,?,?,?,?,?,?)'
                db.run(insert, ["admin", "0", "admin_status", "admin_status", "admin_status", "01-01-1990", "admin_status" ,"admin@example.com","admin123456"])
                db.run(insert, ["user", "1", "19", "ISCAC", "MCTES", "02-10-2019" , "1" ,"user@example.com","user123456"])
            }
        });  
    }
});


module.exports = db