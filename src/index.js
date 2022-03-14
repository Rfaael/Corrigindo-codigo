const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

let repositories = [];

//middleware para verificar se o repositorio existe
function ifRepositoryExists(request, response, next) {
  const {id} = request.headers || request.params;


  const findRepoResponse = repositories.find(repo => repo.id === id);

  if(findRepoResponse){
    return response.status(404).json({error: "repository alredy exists...."});
  }


  request.repository = findRepoResponse;
  next()
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", ifRepositoryExists,(request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

//update dentro de um repositorio
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const {title, techs, url} = request.body;

  const repository = repositories.find(repo => repo.id === id);

  if(!repository){
    return response.status(404).json({error: "mensagem de erro"})
  }

  repository.title = title ? title:repository.title;
  repository.techs = techs ? techs:repository.techs;
  repository.url = url ? url:repository.url;


  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  //const {repository} = request;

  const repoIndex = repositories.findIndex(repo => repo.id === id);
 
  if(repoIndex == -1){
    return response.status(404).json({error: "Mensagem de erro"});
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).end();
});

app.post("/repositories/:id/like",  (request, response) => {
  const { id } = request.params;

  //id do repositorio dentro de repositories
  let repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex == -1){
    return response.status(404).json({error: "Mensagem de erro"});
  }

  const repo = repositories[repositoryIndex];

  repo.likes++;

  let likes = repo.likes

  return response.json({likes});
});

module.exports = app;
