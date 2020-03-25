const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
require("dotenv").config();

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


app.get("/", function(req, res){
    res.sendFile(__dirname + "/src/signup.html")
});

app.post("/", function(req, res){
    console.log("post request has been received");
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:firstName,
                    LNAME:lastName
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data);
    const apiKey = process.env.API_KEY;
    const listId = process.env.LIST_ID;
    const username = process.env.USERNAME;

    const url = "https://us19.api.mailchimp.com/3.0/lists/" + listId;
    const options = {
        method:"POST",
        auth:username + ":" + apiKey
    }

    const request = https.request(url, options, function(response){

        if(response.statusCode === 200){
            res.sendFile(__dirname + "/src/success.html");
        }else{
            res.sendFile(__dirname + "/src/failure.html")
        }
        response.on("data", function(data){
            console.log(JSON.parse(data))
        });
    });
    request.write(jsonData);
    request.end(); 
});

app.post("/failure", function(req, res){
    res.redirect("/");
})

app.listen(3000, function(){
    console.log("server is running on port 3000");
})