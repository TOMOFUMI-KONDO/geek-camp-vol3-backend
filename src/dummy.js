import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import mysql from 'mysql'
import { v4 as uuidv4 } from 'uuid'

const app = express()
const port = 3000

const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
})
connection.connect(function (err) {
  if (err) throw err
  console.log('Connected')
})

app.use(express.urlencoded({ extended: true }))

app.post('/users', (req, res) => {
  res.status(201).json({
    userId: uuidv4(),
    name: req.body.name,
  })
})

app.get('/users/:userId', (req, res) => {
  res.status(200).json({
    userId: req.params.userId,
    name: `Tomo-${req.params.userId}`,
    groups: [
      {
        groupId: uuidv4(),
        name: 'Best Friends',
        alarm: '12:33:00',
      },
      {
        groupId: uuidv4(),
        name: 'My Family',
        alarm: '07:00:00',
      },
    ],
  })
})

app.get('/groups', (req, res) => {
  res.status(200).json({
    groups: [
      {
        groupId: uuidv4(),
        name: 'Best Friends',
        alarm: '12:33:00',
      },
      {
        groupId: uuidv4(),
        name: 'My Family',
        alarm: '07:00:00',
      },
    ],
  })
})

app.post('/groups', (req, res) => {
  res.status(201).json({
    groupId: uuidv4(),
    name: req.body.name,
    alarm: req.body.alarm,
    users: [
      {
        userId: req.body.userId,
        name: 'Tomo',
      },
    ],
  })
})

app.put('/groups/:groupId/join', (req, res) => {
  res.status(200).json({
    groupId: req.params.groupId,
    name: 'Best Friends',
    alarm: '12:33:00',
    users: [
      {
        userId: req.body.userId,
        name: 'Tomo',
      },
    ],
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
