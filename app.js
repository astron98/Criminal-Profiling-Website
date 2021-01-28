var express = require('express');

//all the routes
var routes = require('./routes');
var index = require('./routes/index');
var user = require('./routes/user');
var getTypes = require("./routes/getTypes");
var addDetails = require('./routes/addDetails');
var editDetails = require('./routes/editDetails');
var deleteDetails = require('./routes/deleteDetails');
var dataArchive = require('./routes/dataArchive');

var mysql = require('mysql');
var path = require('path');
var session = require('express-session');
const {check,validationResult} = require('express-validator');
var bodyParser = require('body-parser');
var app = express();

const bcrypt = require('bcrypt');
const saltRounds = 10;
// var flash=require('express-flash');

// --------------------------------------------DB connection modules--------------------------
var connection = mysql.createConnection({
	host:'localhost',
   user:'root',
   password:'qwerty1234',
   database:'criminals'
 });
module.exports = connection;

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
// app.use(express.urlencoded());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'/public')));
// app.use(flash());
// app.use(expressValidator());

 connection.connect((err)=>{
 	if(!err) {
 		console.log("The database is connected!");
 	} else {
 		console.log("Database error:"+err);
 	}
 });
 global.connection = connection;
// ---------------------------------------end of DB connection----------------------------------------

//express-session-------------

app.use(session({
	secret: 'eliot_alderson@fsociety',
	resave: false,
	saveUninitialized:true,
	cookie: {maxAge: 3600000 }
}));



//-------------------get Homepage----------------------
app.get('/home',user.dashboard);

//------------------login page------------------------
app.get('/login',routes.index);	//login (GET request)
app.post('/login', user.login );


//-----------------------signup page----------------------

app.get('/signup', user.signup);//call for signup page
app.post('/signup', user.signup);//call for signup post

app.use((req,res,next)=>{
	if(req.session.loggedin != true){
		res.render('login/login.ejs',{message:"Note: Only the Official-Authority can Sign-in!"});
	} else {
		// res.redirect('/home');
		next();
	}
});

//------------------logout page------------------------
app.get('/home/logout', user.logout);//call for logout
//-------------------------------------------------------------




// var userId1 = req.session.userId;
// request.session.loggedin = true;
// if(request.session.loggedin = true){
// 	res.redirect("login/login.ejs",{message:"please login first!"});
// }else {
//--------------------------get all criminal details--------------
app.get('/',index.getAllCriminalDetails);

//rendering the prison,rehab and watchlists seperately..
/*
1. Prison
2. Rehab
3. Watchlists
*/
app.get('/currentLoc/:loc', getTypes.getTypes);


//get route to add-criminal
app.get('/add', addDetails.addDetailsGet);
app.post('/add', addDetails.addDetailsPost);

//edit details
app.get('/edit/:cid', editDetails.editGet);
app.post('/edit/:cid', editDetails.editPost);

// ----------------------- DELETE-HISTORY{PAGE}display! --------------------------------------//
app.get("/delh", dataArchive.archiveGet);

//------------------------Delete and add to archives-----------------------------------------//
app.get('/delete/:cid/:cur_loc', deleteDetails.deleteCid);


/* //commented code (deprecated)

//show edit-user form, to edit the given user's details
// app.get('/edit/(:id)',(req,res)=>{
// 	connection.query('SELECT * FROM customers WHERE id = ?',req.params.id,(err,rows)=>{
// 		if(!err){
// 			//if user not found
// 			if(rows.length<=0){
// 				// req.flash('error:'+'Customers not found with ID='+req.params.id);
// 				res.redirect('/');
// 			} else {
// 				//if the user is found:
// 				res.render('edit.ejs',{
// 					id:rows[0].id,
// 					name:rows[0].name,
// 					email:rows[0].email
// 				});
// 			}
// 		} else {
// 			res.send(err);
// 		}
// 	});
// });

// //post route for the edit-user:
// app.post('/update/:id',(req,res)=>{
// 	var user = {
// 		// id:req.body.id,
// 		name:req.body.name,
// 		email:req.body.email
// 	}
// if(user.name.valueOf() !='' && user.email.valueOf()!=''){
// 	connection.query('UPDATE customers SET ? WHERE id='+req.params.id,user,(err,results)=>{
// 		if(err){
// 			res.redirect('/edit/'+req.params.id,{
// 				name:user.name,
// 				email:user.email
// 			});
// 		} else {
// 	console.log("--------------------------------------------------------------------");
// 	console.log(`|   Kudos!Data with ID.no:${req.params.id} is updated successfully. |`);
// 	console.log("--------------------------------------------------------------------");
// 			res.redirect('/');
// 		}
// 	});
// } else {
// 	console.log("------------------------------------------------");
// 	console.log("|Note:Please refill the [Update-form] correctly.|");
// 	console.log("------------------------------------------------");
// 	res.redirect('/edit/'+req.params.id);
// }
// });

*/

//delete user. (method --deprecated--)
app.get('/delete/:id', dataArchive.deleteUser);



//connect to server at port 
const port=3000;
app.listen(port,(err)=>{
	if(!err) {
		console.log("the server is up at port:"+port);
	} else {
		console.log("Server connection error:" + err);
	}
});