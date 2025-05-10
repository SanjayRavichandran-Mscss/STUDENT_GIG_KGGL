import mysql from 'mysql'

const db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password:"san@123",
    database:"studentgig"
})

db.connect((err,res)=>{
    if(err) console.log("db error", err)
    else console.log("Db connected")   
})

export default db