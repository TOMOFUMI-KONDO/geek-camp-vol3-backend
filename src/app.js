import dotenv from 'dotenv'
dotenv.config()
import { v4 as uuidv4 } from 'uuid'
import mysql from 'mysql'
import express from 'express'
//const express = require('express')
const app = express()
const port = 3000
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

//const mysql = require('mysql');
const con = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
})
con.connect(function (err) {
  if (err) throw err
  console.log('Connected')
}) //接続
app.use(express.urlencoded({ extended: true })) //必須 expressの使い易い形にする

//更新
app.put('/:id', (req, res) => {
  //nameを変更している
  const sql = 'UPDATE users set name = ? WHERE id = ?'
  con.query(sql, [req.body.name, req.params.id], function (err, result, fields) {
    if (err) throw err
    console.log(result)
    res.redirect('/')
  })
})
/*
デリート
app.delete('/:id',(req,res)=>{
	const sql = "DELETE FROM users WHERE id = ?";
	con.query(sql,[req.params.id],function(err,result,fields){
		if (err) throw err;
		console.log(result)
		res.redirect('/');
	})
});
*/

//データを入れる
/*完成*/
app.post('/users', (req, res) => {
  const sql = 'INSERT INTO users(id,name)VALUES(?,?)'
  const id = uuidv4()
  con.query(sql, [id, req.body.name], function (err, result, fields) {
    if (err) throw err
    console.log(result) //デバック
    res.json({ userId: id, name: req.body.name })
  })
})

/*
データ入手
app.get('/', (request, response) => {
	const sql = "select * from users"
	con.query(sql, function (err, result, fields) {
	if (err) throw err;
	response.send(result)
	});
});*/

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
