const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checkRepositoryById(request, response, next) {
  const { id } = request.params;
  const repository = repositories.find((repository) => repository.id === id);
  if (!repository)
    return response.status(404).json({ error: "Repository not found!" });
  request.repository = repository;
  next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", checkRepositoryById, (request, response) => {
  const { repository } = request;
  const updatedRepository = request.body;

  delete updatedRepository.likes;

  const repositoryUpdated = { ...repository, ...updatedRepository };

  return response.json(repositoryUpdated);
});

app.delete("/repositories/:id", checkRepositoryById, (request, response) => {
  const { repository } = request;

  repositories.splice(repositories.indexOf(repository), 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checkRepositoryById, (request, response) => {
  const { repository } = request;

  const likes = ++repository.likes;

  return response.json({ likes });
});

module.exports = app;
