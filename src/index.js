



const fs = require('fs');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${server.address().port}`);
});

// Read resource data from resources.json
const getResources = () => {
  const rawData = fs.readFileSync(__dirname + '/data/resources.json');
  return JSON.parse(rawData);
};

// Endpoint: GET /resources
app.get('/resources', (req, res) => {
  const resources = getResources();
  res.status(200).json(resources);
});

// Endpoint: GET /resources?category=Books
app.get('/resources', (req, res) => {
  const { category } = req.query;
  if (category) {
    const resources = getResources().filter(resource => resource.category === category);
    res.status(200).json(resources);
  } else {
    res.status(400).json({ error: 'Category parameter is missing' });
  }
});

// Endpoint: GET /resources/sort
app.get('/resources/sort', (req, res) => {
  const resources = getResources();
  res.status(200).json(resources);
});

// Endpoint: GET /resources/sort?sortBy=name
app.get('/resources/sort', (req, res) => {
  const { sortBy } = req.query;
  if (sortBy) {
    const resources = getResources().sort((a, b) => (sortBy === 'name' ? a.name.localeCompare(b.name) : 0));
    res.status(200).json(resources);
  } else {
    res.status(400).json({ error: 'sortBy parameter is missing' });
  }
});

// Endpoint: GET /resources/group
app.get('/resources/group', (req, res) => {
  const resources = getResources();
  const groupedResources = resources.reduce((acc, resource) => {
    acc[resource.category] = acc[resource.category] || [];
    acc[resource.category].push(resource);
    return acc;
  }, {});
  res.status(200).json(groupedResources);
});

module.exports = { app, server };
