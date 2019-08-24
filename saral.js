const express = require("express");
const sqlite3 = require("sqlite3");
const app=express();
app.use(express.json())
const body=require("body-parser");
app.use(body.json());

// ===================================================================================================================================
// create database and tables

const db= new sqlite3.Database("saraldb",(err)=>{
    if (err) console.log(err,"   err in database");
    else {console.log("database created")};
})

// create table courses
db.run ("create table if not exists courses (id integer primary key autoincrement ,name text ,description text);",(err)=>{
    if (err){console.log(err,"    err in courses table creation")}
    else{console.log("successful courses table creation")}
})


// create table exersise
// db.run("create table if not exists exersise(id integer primary key autoincrement ,courseId integer,name text,content text, hint text);",(err)=>{
//     if (err) console.log(err)
//     else{console.log("successful exersise table creation")}
// })


// ====================================================================================================================================?
// get all couses
app.get("/course",(req,res)=>{
    db.all("select * from courses;",(err,data)=>{
        if (err){console.log(err,"err in allcourses")}
        else{res.send(data)}
    })
})

// ======================================================================================================================================?
// create new course
app.post("/course",(req,res)=>{
    let name=req.body.name;
    let description=req.body.description
    db.run(`insert into courses (name,description) values('${name}','${description}');`,(err)=>{
        if (err){console.log(err,"err to insert")}
        else{
            console.log("insert course successful")
            res.send("course create successful")
        }
    })
})

// =========================================================================================================================================
app.get("/course/:id",(req,res)=>{
    let id=req.params.id;
    db.all("select * from courses where id="+id+" ",(err,data)=>{
        if (err){console.log(err)}
        else{
            console.log("fatched")
            res.send(data)
        }
    })

})

// ========================================================================================================================================
app.put("/course/:id",(req,res)=>{
    let id=req.params.id;
    let name=req.body.name;
    let desc=req.body.description;
    db.run("update courses set name='"+name+"',description='"+desc+"' where id="+id+" ",(err)=>{
        if (err){console.log(err)}
        else{
            console.log("edit complete")
            res.send("successful")
        }
    })
})
// =======================================================================================================================================
app.post("/course/:id/exersise",(req,res)=>{
    let courseId=req.params.id;
    db.run(`create table if not exists exersise${courseId} (id integer primary key autoincrement ,courseId integer,name text,content text, hint text);`,(err)=>{
        if (err) {
            console.log(err)
            res.sendStatus(400)
        }
        else{
            db.run(`insert into exersise${courseId} (courseId,name,content,hint) values(${courseId},"${req.body.name}","${req.body.content}","${req.body.hint}")`,(err)=>{
                if (err) console.log(err)
                else{
                    console.log("insert exersise successful")
                    res.send("successful")
                }
            })
            console.log(`successful exersise${courseId} table creation`)
        }
    })
})

// =========================================================================================================================================?

app.get("/course/:id/exersise",(req,res)=>{
    let courseId=req.params.id;
    db.all(`select * from exersise${courseId};`,(err,data)=>{
        if (err) console.log(err)
        else {
            console.log("fatched")
            res.send(data)
        }
    })
})

// ===========================================================================================================================================
app.get("/course/:courseId/exersise/:exId",(req,res)=>{
    let courseId=req.params.courseId;
    let exId=req.params.exId;
    db.all(`select * from exersise${courseId} where id=${exId}`,(err,data)=>{
        if (err) console.log(err)
        else {
            console.log("fatched")
            res.send(data)
        }
    })
})
// ============================================================================================================================================
app.put("/course/:cId/exersise/:eId",(req,res)=>{
    let courseId=req.params.cId;
    let exId=req.params.eId;
    db.run(`update exersise${courseId} set name="${req.body.name}",content="${req.body.content}",hint="${req.body.hint}" where id=${exId}`,(err)=>{
        if (err) console.log(err)
        else {
            console.log("putted successful!")
            res.send("successful!")
        }
    })
})
// ============================================================================================================================================
app.post("/course/:cId/exersise/:eId/submission",(req,res)=>{
    let courseId=req.params.cId;
    let exId=req.params.eId;
    db.run(`create table if not exists submission${courseId}_${exId} (id integer primary key autoincrement,courseId integer,exersiseId integer,content text,username)`,(err)=>{
        if (err) console.log(err)
        else {
            console.log(`table submission${courseId}_${exId} create successful`)
            db.run(`insert into submission${courseId}_${exId} (courseId,exersiseId,content,username) values(${courseId},${exId},"${req.body.content}","${req.body.username}")`,(err)=>{
                if (err) console.log(err)
                else{
                    console.log("submission posted")
                    res.send("submission post successful")
                }
            })
        }
    })
})

// ================================================================================================================================================
app.get("/course/:cId/exersise/:eId/submission",(req,res)=>{
    let courseId=req.params.cId;
    let exId=req.params.eId;
    db.all(`select * from submission${courseId}_${exId}`,(err,data)=>{
        if (err) console.log(err)
        else{
            console.log("data fatched")
            res.send(data)
        }
    })
})


// ===================================================================================================================================================
app.listen(port=4000,()=>{
    console.log(`you server is listning on port ${port} `)
})
// =============================================================================================================================================?