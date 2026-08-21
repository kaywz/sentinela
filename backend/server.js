const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "../frontend")));


const DB_FILE = path.join(__dirname, "db.json");


// LER BANCO

function readDB() {

  if (!fs.existsSync(DB_FILE)) {

    return {
      usuarios: [],
      pacientes: [],
      triagens: [],
      consultas: []
    };

  }


  return JSON.parse(
    fs.readFileSync(DB_FILE)
  );

}



// SALVAR BANCO

function writeDB(data) {

  fs.writeFileSync(
    DB_FILE,
    JSON.stringify(data, null, 2)
  );

}



// LOGIN

app.post("/login", (req,res)=>{


const db = readDB();



const user = db.usuarios.find(u=>

u.usuario === req.body.usuario &&
u.senha === req.body.senha

);



if(!user){

return res.status(401).json({

erro:"Login inválido"

});

}



res.json(user);



});





// ATENDIMENTO - CADASTRO PACIENTE


app.post("/atendimento",(req,res)=>{


const db = readDB();



const paciente = {


id: Date.now(),

nome:req.body.nome,

cpf:req.body.cpf,

tipo:req.body.tipo,

status:"triagem",

createdAt:new Date()


};



db.pacientes.push(paciente);


writeDB(db);



res.json(paciente);



});







// TRIAGEM


app.post("/triagem",(req,res)=>{


const db = readDB();



let risco = req.body.risco;



if(req.body.temperatura >= 39){

risco="vermelho";


}else if(req.body.temperatura >= 38){


risco="amarelo";


}else if(!risco){


risco="verde";


}




const triagem = {


id:Date.now(),

nome:req.body.nome,

sintoma:req.body.sintoma,

temperatura:req.body.temperatura,

alergia:req.body.alergia,

observacao:req.body.observacao,

risco:risco,

status:"aguardando_medico",

createdAt:new Date()


};




db.triagens.push(triagem);


writeDB(db);



res.json(triagem);



});








// LISTAR TRIAGENS


app.get("/triagens",(req,res)=>{


const db = readDB();


res.json(db.triagens);



});








// LISTA DE MEDICAÇÕES


app.get("/lista-medicacoes",(req,res)=>{


res.json([


"Dipirona",

"Paracetamol",

"Ibuprofeno",

"Amoxicilina",

"Azitromicina",

"Loratadina",

"Omeprazol",

"Buscopan",

"Dramin",

"Soro fisiológico"


]);



});








// SALVAR CONSULTA MÉDICA


app.post("/consulta",(req,res)=>{


const db = readDB();



const consulta = {


id:Date.now(),

paciente:req.body.paciente,

diagnostico:req.body.diagnostico,

medicacao:req.body.medicacao,

obs:req.body.obs,

createdAt:new Date()


};



db.consultas.push(consulta);



writeDB(db);



res.json(consulta);



});









// INTERNAR PACIENTE


app.post("/internar",(req,res)=>{


const db = readDB();


const nomePaciente = req.body.paciente;



// muda na triagem

const triagem = db.triagens.find(t=>

t.nome === nomePaciente

);



if(triagem){

triagem.status="internado";

}




// muda no cadastro

const paciente = db.pacientes.find(p=>

p.nome === nomePaciente

);



if(paciente){

paciente.status="internado";

}




writeDB(db);



res.json({

mensagem:"Paciente internado"

});



});









// LIBERAR PACIENTE


app.post("/liberar",(req,res)=>{


const db = readDB();


const nomePaciente = req.body.paciente;



// muda na triagem

const triagem = db.triagens.find(t=>

t.nome === nomePaciente

);



if(triagem){

triagem.status="liberado";

}




// muda no cadastro

const paciente = db.pacientes.find(p=>

p.nome === nomePaciente

);



if(paciente){

paciente.status="liberado";

}




writeDB(db);



res.json({

mensagem:"Paciente liberado"

});



});









// LISTAR CONSULTAS


app.get("/medicacoes",(req,res)=>{


const db = readDB();


res.json(db.consultas);



});









// INICIAR SERVIDOR


app.listen(3000,()=>{


console.log(
"🏥 Hospital Pro rodando em http://localhost:3000"
);


});