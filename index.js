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

let alunos = [
    {
        nome: "Diogo",
        num_aluno: "1234",
        Instituição: "ISCAC",
        Curso: "MCTES",
        certificado: "diogo_melim.pdf"

    }
] 

app.get("/", (req,res) => {
    res.render("index.ejs", {alunos});
});

app.get("/aluno/:id", (req,res) => {
    const { id } = req.params;
    res.send(`${id}`);
});

app.get("/aluno", (req,res) => {
    res.render("aluno.ejs");
});
 
app.post("/aluno", (req,res) => {
    const { nome, num_aluno, Instituição, Curso, certificado } = req.body;
    alunos.push({nome, num_aluno, Instituição, Curso, certificado});
    res.redirect("/");
});

app.get("/excel_import", (req, res) => {
    res.render("excel_import.ejs")
})

app.listen(3000, () => {
    console.log("http://localhost:3000/");
});
