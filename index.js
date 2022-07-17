const express = require('express');
const app = express();
const path = require('path');
const db = require("./public/database.js")
if (typeof require !== 'undefined') XLSX = require('xlsx');

// const { v4: uuid } = require('uuid');

const workbook = XLSX.readFile('test.xlsx');

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

// para importar ficheiros e outras coisas criamos uma pasta ao iniciar o servidor, assim depois na source do script colocamos o endereço respetivo, ver aluno.js
app.use("/public", express.static('public'));

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

const insert = 'INSERT INTO user (name, student_number, final_class , institution, course, conc_date, certificate_hash, email, password) VALUES (?,?,?,?,?,?,?,?,?)'

var user = "admin";

let sql = "select * from user"
let params = []

app.get("/logout", (req, res) => {
    user = null;
    res.redirect("/");
});

app.get("/", (req, res) => {
    res.render("index.ejs", { user });
});

app.get("/new-data", (req, res) => {
    res.render("newData.ejs", { user });
});

app.get("/search", (req, res) => {
    res.render("search.ejs", { user });
});

app.get("/login", (req, res) => {
    res.render("login.ejs", { user });
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "admin") {
        user = "admin";
        res.redirect("/");
    } else {
        res.redirect("/login");
        console.log("Not a valid User")
        user = null
    }

});

app.get("/new-data/one-entry", (req, res) => {
    if (user === "admin") {
        res.render("aluno.ejs", { user });
    }
    else {
        console.log("Not a valid user")
        res.status(401).end()
    }
});

app.post("/student", (req, res) => {
    const { name, num_student, class_final, Institution, Course, conc_date, certificate } = req.body;
    db.run(insert, [name, num_student, class_final, Institution, Course, conc_date, certificate ,`${name}@example.com`,`${name}${num_student}`])
    res.redirect("/");
});

app.get("/new-data/multiple-entry", (req, res) => {
    if (user === "admin") {
        res.render("excel_import.ejs", { user });
    }
    else {
        console.log("Not a valid user")
        res.status(401).end()
    }

})

app.post("/excel_import", (req, res) => {
    const userExcelData = JSON.parse(Object.keys(req.body));
    const { name, num_student, class_final, Institution, Course, conc_date, certificate } = userExcelData;
    db.run(insert, [name, num_student, class_final, Institution, Course, conc_date, certificate ,`${name}@example.com`,`${name}${num_student}`])
    console.log(userExcelData)
});

app.get("/database", (req, res) => {
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message })
            return
        } else {
            res.render("database.ejs", { rows, user });
        }
    })
})


app.listen(3000, () => {
    console.log("http://localhost:3000/");
});
