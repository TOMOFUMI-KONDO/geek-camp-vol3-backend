import dotenv from 'dotenv'
dotenv.config()
import { v4 as uuidv4 } from 'uuid'
import mysql from 'mysql'
import express from 'express'

const app = express()
const port = 3000
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const con = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
})
con.connect(function (err) {
  if (err) throw err
  console.log('Connected')
})
app.use(express.urlencoded({ extended: true }))

/*POST /users*/
app.post('/users', (req, res) => {
  const sql = 'INSERT INTO users(id,name)VALUES(?,?)'
  const id = uuidv4()
  con.query(sql, [id, req.body.name], function (err, result, fields) {
    if (err) throw err
    console.log(result)
    res.json({ userId: id, name: req.body.name })
  })
})

/*POST /groups create group*/
app.post('/groups', (req, res) => {
  const sql = 'INSERT INTO `groups`(id,name,alarm) VALUES (?,?,?)'
  const id = uuidv4()
  con.query(sql, [id, req.body.name, req.body.alarm], function (err, result, fields) {
    if (err) throw err
  })
  const sql2 = 'INSERT INTO belong_groups(user_id,group_id) VALUES (?,?)'
  con.query(sql2, [req.body.userId, id], function (err, result, fields) {
    if (err) throw err
  })
  const sql3 = 'SELECT name FROM users WHERE id = ?'
  con.query(sql3, [req.body.userId], function (err, result, fields) {
    if (err) throw err
    res.json({
      groupId: id,
      name: req.body.name,
      alarm: req.body.time,
      users: [
        {
          userId: req.body.userId,
          name: result[0].name,
        },
      ],
    })
  })
})

/*GET /groups get all groups*/
app.get('/groups', (req, res) => {
  const sql = 'SELECT * FROM `groups`'
  con.query(sql, function (err, result, fields) {
    if (err) throw err
    const base = []
    for (let i = 0; i < result.length; i++) {
      base.push({ groupId: result[i].id, name: result[i].name, alarm: result[i].alarm })
    }
    res.json({
      groups: base,
    })
  })
})

/*GET /users/{userId} Get specified user*/
app.get('/users/:userId', (req, res) => {
  const sql =
    'SELECT bg.user_id, u.name user_name, bg.group_id, g.name group_name, g.alarm FROM users u \
        JOIN belong_groups bg ON u.id = bg.user_id \
        JOIN `groups` g ON bg.group_id = g.id \
        WHERE user_id = ?'
  con.query(sql, [req.params.userId], function (err, result, fields) {
    if (err) throw err
    const base = []
    for (let i = 0; i < result.length; i++) {
      base.push({ groupId: result[i].group_id, name: result[i].group_name, alarm: result[i].alarm })
    }
    res.json({
      userId: req.params.userId,
      name: result[0].user_name,
      groups: base,
    })
  })
})

app.put('/groups/:groupId/join', (req, res) => {
  const [userId, groupId] = [req.body.userId, req.params.groupId]
  if (!userId || !groupId) res.sendStatus(400)

  const sql = 'INSERT INTO belong_groups (user_id, group_id) VALUES (?, ?)'
  con.query(sql, [req.body.userId, req.params.groupId], (error, _, __) => {
    if (error) throw error
    res.sendStatus(200)
  })
})

app.use((error, _, res, __) => {
  console.error(error)
  res.status(500).json({ error })
})

