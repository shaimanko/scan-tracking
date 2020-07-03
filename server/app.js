const express = require('express')

const app = express()

const mockData = require('./db')

app.get('/api/track', (req, res) => {
  // res.json(mockData)
  res.send(mockData)
})

module.exports = app
