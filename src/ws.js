import dotenv from 'dotenv'
dotenv.config()

import ws from 'ws'
import mysql from 'mysql'

const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
})
connection.connect(function (err) {
  if (err) throw err
  console.log('DB connected.')
})

const wss = new ws.Server({ port: 5000 })

const setTurnedOff = (userId, groupId) => {
  const sql1 = 'UPDATE belong_groups SET is_turned_off = true WHERE user_id = ? AND group_id = ?'
  connection.query(sql1, [userId, groupId], (error, result, fields) => {
    if (error) throw error
    console.log('Set is_turned_off true.')
  })
}

wss.on('connection', (ws) => {
  console.log('WebSocket connected.')
  ws.send('successfully connected')

  ws.on('message', (message) => {
    const [userId, groupId] = message.split(',')
    if (!userId || !groupId) {
      ws.send('invalid request')
      return
    }

    setTurnedOff(userId, groupId)

    const sql2 = 'SELECT is_turned_off FROM belong_groups WHERE group_id = ?'
    connection.query(sql2, [groupId], (error, result, fields) => {
      if (error) throw error

      const allAwake = result.find((r) => !r.is_turned_off) === undefined

      if (allAwake) {
        console.log('All people awake.')
        wss.clients.forEach((c) => {
          if (c.readyState === ws.OPEN) c.send(`all awake`)
        })
      } else {
        console.log('There are still sleeping people.')
        ws.send(`remain sleeper`)
      }
    })
  })

  ws.on('close', () => console.log('Disconnected.'))
})
