import mysql from 'mysql'
import dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') dotenv.config()

const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
})

connection.connect((err) => {
  if (err) throw err
  console.log('Connected.')
})

connection.query(
  'CREATE TABLE IF NOT EXISTS users (\
      id VARCHAR(255) PRIMARY KEY,\
      name VARCHAR(255) NOT NULL\
  )',
  (err, _, __) => {
    if (err) throw err
    console.log('Created table users.')
  }
)

connection.query(
  'CREATE TABLE IF NOT EXISTS `groups` (\
      id VARCHAR(255) PRIMARY KEY, \
      name VARCHAR(255) NOT NULL, \
      alarm TIME NOT NULL\
  )',
  (err, _, __) => {
    if (err) throw err
    console.log('Created table groups.')
  }
)

connection.query(
  'CREATE TABLE IF NOT EXISTS belong_groups (\
      user_id VARCHAR(255),\
      group_id VARCHAR(255),\
      is_turned_off BOOLEAN DEFAULT false\
      PRIMARY KEY(user_id, group_id),\
      FOREIGN  KEY (user_id) REFERENCES users(id),\
      FOREIGN  KEY (group_id) REFERENCES `groups`(id)\
  )',
  (err, _, __) => {
    if (err) throw err
    console.log('Created table belong_groups.')
  }
)

connection.end()
