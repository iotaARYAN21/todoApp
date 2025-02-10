import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const port = 3000;
const app = express();
let lst = [
    {id:1,title:"buy book"},
    {id:2,title:"else"},
];
const db = new pg.Client({
    user : "postgres",
    host : "localhost",
    database:"Todo",
    password:"12345",
    port : 5432,
});
db.connect();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.get("/",async(req,res)=>{
    const result = await db.query("SELECT * FROM items ORDER BY id ASC");
    console.log(result);
    lst=[];
    for(var i=0;i<result.rows.length;i++){
        console.log({id:result.rows[i].id,title:result.rows[i].title});
        lst.push({id:result.rows[i].id,title:result.rows[i].title});
    }
    res.render("index.ejs",{
        items : lst
    }
    );
});
app.post("/submit",async(req,res)=>{
    console.log(req.body);
    const id = req.body.updatedId;
    const title = req.body.updatedTitle;
    try{
        const result = await db.query("UPDATE items SET title=$1 WHERE id=$2   ;",[title,id]);
        
        res.redirect("/");
    }catch(err){
        console.log(err);
    }
});

app.post("/create", async(req,res)=>{
    console.log(req.body);
    const title = req.body.newItem;
    if(title.length > 0){
        try{
            const result = await db.query("INSERT INTO items (title) VALUES ($1);",[title]);
            console.log(result);
            res.redirect("/");
        }catch(err){
            console.log(err);
        }
    }else{
        console.log("Title cannot be empty!!");
        return res.status(400).send("Title cannot be empty");
    }
    // console.log(title);

});

app.post("/delete",async(req,res)=>{
    console.log(req.body);
    try{
        const result = await db.query("DELETE FROM items WHERE id=$1;",[req.body.id]);
        console.log(result);
        res.redirect("/");
    }catch(err){
        console.log(err);
    }
});
// app.post("/submit",(req,res)=>{
//     // res.redirect("/");
//     res.render("<h1>Hello World</h1>")
// })
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})