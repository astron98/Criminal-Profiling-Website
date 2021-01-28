var express = require('express');
var mysql = require('mysql');
var path = require('path');
const {check,validationResult} = require('express-validator');
var bodyParser = require('body-parser');
var app = express();
// var flash=require('express-flash');

// --------------------------------------------DB connection modules--------------------------
var connection = mysql.createConnection({
	host:'localhost',
   user:'root',
   password:'djlolkj790',
   database:'customers'
 });

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded());
// app.use(flash());
// app.use(expressValidator());

 connection.connect((err)=>{
 	if(!err) {
 		console.log("The database is connected!");
 	} else {
 		console.log("Database error:"+err);
 	}
 });
// ---------------------------------------end of DB connection----------------------------------------

//--------------------------get homepage--------------
app.get('/',(req,res)=>{
	var q1 = "(select criminal.*,cp.pid as `cur_loc` from criminal,cp where criminal.cid = cp.cid) union (select criminal.*,crc.rcid as `current location` from criminal,crc where criminal.cid = crc.cid) union (select criminal.*,cw.wcode as `current location` from criminal,cw where criminal.cid = cw.cid) order by cid;"
	connection.query(q1,(err,rows)=>{
		if(err){
			console.log("homepage error: "+ err);
			res.render("error.ejs");
		} else {
			// console.log("data of the rows:"+rows);
		res.render("index.ejs",{data:rows});
		console.log("--------------------------------------Criminals list rendered successfully!---------------------------");
		}
	});		
});

//--------------------------get the add criminal page--------------
app.get('/add',(req,res,err)=>{
	
		res.render("add.ejs");
	
});



//post route for the add-user
app.post('/add',(req,res)=>{
	// var errors = req.validationResult(req);
	var criminal = {
		cid:req.body.cid,
		cname:req.body.cname,
		alias:req.body.alias,
		mo:req.body.mo,
		lastLoc:req.body.last_loc	
	};

	var location = req.body.cur_loc;
	var loc_id=req.body.current_loc_id;

	var clist = {
		cid:req.body.cid,
		cname:req.body.cname,
		alias:req.body.alias,
		mo:req.body.mo,
		lastLoc:req.body.last_loc,
		cur_loc:location,
		current_loc_id:loc_id

	};

	
	console.log("current location of the criminal:"+location);

	var qAdd="insert into criminal set ?"
	connection.query(qAdd,criminal,(err,results)=>{
		if(err){
			console.log("(can't add criminal details),error with post request at /add \n or enter correct details! \n "+err);
			res.render("add.ejs");
		} 
		else 
		{
			//when there is no error then:
			if(location=="prison") 
				{
					var pq="insert into cp values(?,?)"
					// res.render("location/prison.ejs",{cid:cid});
					connection.query(pq,[criminal.cid,loc_id],(err,results)=>{
						if(!err && results.length!=0)
						{
							console.log("prison linking is successfull");
							res.redirect('/');
						}
						else {
							console.log(err);
							connection.query('delete from criminal where cid=?',criminal.cid,(err,resullts)=>{
								if(!err){
									res.render('add.ejs',{clist:clist});
								} 
								else {
									console.log(err);
								}
							});
						}
					});
				}
			else if(location=="rehab") 
			{
					var rcq="insert into crc values(?,?)"
					// res.render("location/prison.ejs",{cid:cid});
					connection.query(rcq,[criminal.cid,loc_id],(err,results)=>{
						if(!err && results.length!=0)
						{
							console.log("rehab linking is successfull");
							res.redirect('/');
						}
						else {
							console.log(err);

							connection.query('delete from criminal where cid=?',criminal.cid,(err,resullts)=>{
								if(!err){
									res.render('add.ejs',{clist:clist});
								} 
								else {
									console.log(err);
								}
							});
						}
					});
			} 
			else if(location=="watchlist")
			{	
				var wq="insert into cw values(?,?)"
					// res.render("location/prison.ejs",{cid:cid});
					connection.query(wq,[criminal.cid,loc_id],(err,results)=>{
						if(!err && results.length!=0)
						{
							console.log("watchlist linking is successfull");
							res.redirect('/');
						}
						else {
							console.log(err);
							connection.query('delete from criminal where cid=?',criminal.cid,(err,resullts)=>{
								if(!err){
									res.render('add.ejs',{clist:clist});
								} 
								else {
									console.log(err);
								}
							});
							
						}
					});	
			} else {
				console.log(err);
			}
		}
	});
		
});

app.get('/delete/:cid/:cur_loc',(req,res,err)=>{
	var cur_loc = req.params.cur_loc;
	var cid=req.params.cid;
	//var initial_char= cid
if(cur_loc.startsWith("p")){
	connection.query('delete from cp where cid=?',cid,(err,results)=>{
		if(!err){
			connection.query('delete from criminal where cid=?',cid,(err,results)=>{
				if(!err)
				{
					console.log("criminal details removed.");
					//res.end();
					res.redirect('/');
				} else {
					console.log(err);
				}
			});
		}	
	});
} else if(cur_loc.startsWith("rc")){
	connection.query('delete from crc where cid=?',cid,(err,results)=>{
		if(!err){
			connection.query('delete from criminal where cid=?',cid,(err,results)=>{
				if(!err)
				{
					console.log("criminal details removed.");
					//res.end();
					res.redirect('/');
				} else {
					console.log(err);
				}
			});
		}	
	});
}else if(cur_loc.startsWith("w")){
	connection.query('delete from cw where cid=?',cid,(err,results)=>{
		if(!err){
			connection.query('delete from criminal where cid=?',cid,(err,results)=>{
				if(!err)
				{
					console.log("criminal details removed.");
					// res.end();
					res.redirect('/');
				} else {
					console.log(err);
				}
			});
		}	
	});
} else{
	if(err){
		console.log(err)
		res.redirect('/');
	}
}
});




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

//DELETE USER
app.get('/delete/:id',(req,res)=>{
	var ID = req.params.id;
	console.log(typeof(ID));
	if(!Number.isInteger(Number(ID)))
	{
		console.log(`"the passed id="${ID}" parameter to the url is not Integer",please type an integer!`);
		res.redirect('/');

	} else {

	connection.query('DELETE FROM customers WHERE id= '+ID,(err,results)=>{
		// console.log("the results object: "+results);
	if(results.affectedRows>0){	
		if(err){
			console.log("Error while deletion! "+err);
			res.redirect('/');
		} else {

			console.log("--------------------------------------------------------------------");
			console.log(`|   Data with ID.no:${req.params.id} is Deleted successfully. |`);
			console.log("--------------------------------------------------------------------");
			res.redirect('/');
		}
	} else {
		console.log("id not found");
		res.redirect('/');
	}
	});
}	
});

const port=3000;
app.listen(port,(err)=>{
	if(!err) {
		console.log("the server is up at port:"+port);
	} else {
		console.log("Server connection error:" + err);
	}
});