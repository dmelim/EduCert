const express = require('express');
const app =  express();
const path = require('path');
if(typeof require !== 'undefined') XLSX = require('xlsx');

// const { v4: uuid } = require('uuid');

const workbook = XLSX.readFile('test.xlsx');

app.use(express.urlencoded({extended: true }));

app.use(express.json());

// para importar ficheiros e outras coisas criamos uma pasta ao iniciar o servidor, assim depois na source do script colocamos o endereço respetivo, ver aluno.js
app.use("/public", express.static('public'));

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

let students = [
    {
        name: "Diogo",
        num_student: "1234",
        class_final: "14",
        Institution: "ISCAC",
        Course: "MCTES",
        conc_date: "14 January 2021",
        certificate: "diogo_melim.pdf"

    }
]

var user ;

app.get("/logout", (req,res) => {
    user = null;
    res.redirect("/");
});

app.get("/", (req,res) => {
    res.render("index.ejs", {students, user});
});

app.get("/new-data", (req,res) => {
    res.render("newData.ejs", {user});
});

app.get("/search", (req,res) => {
    res.render("search.ejs", {user});
});

app.get("/login", (req,res) => {
    res.render("login.ejs", {user});
});

app.post("/login", (req, res) =>{
    const {username, password} = req.body;
    if (username === "admin" && password === "admin") {
        user = "admin";
        res.redirect("/");
    } else {
        res.redirect("/login");
        console.log("Not a valid User")
        user = null
    }
    
});

app.get("/new-data/one-entry", (req,res) => {
    if (user === "admin"){
        res.render("aluno.ejs", {user});}
    else {
        console.log("Not a valid user")
        res.status(401).send("Unauthorized")
    }
});
 
app.post("/student", (req,res) => {
    const { name, num_student, class_final, Institution, Course, conc_date, certificate } = req.body;
    students.push({name, num_student, class_final, Institution, Course, conc_date, certificate});
    res.redirect("/");
});

app.get("/new-data/multiple-entry", (req, res) => {
    if (user === "admin"){
        res.render("excel_import.ejs", {user});}
    else {
        console.log("Not a valid user")
        res.status(401).send("Unauthorized")
    }
    
})

app.post("/excel_import", (req, res) => {
    console.log(Object.keys(req.body));
    const object1 = JSON.parse(Object.keys(req.body));
    console.log(object1);
    const { name, num_student, Institution, Course, certificate } = object1;
    students.push(object1);
    res.redirect("/");
})

app.listen(3000, () => {
    console.log("http://localhost:3000/");
});
