//---------------------------------------------signup page call------------------------------------------------------
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.signup = function(req, res){
   message = '';
   if(req.method == "POST"){
      var post  = req.body;
      var username= post.user_name;
      var name = post.name;
      var password= post.password;
      // var fname= post.first_name;
      // var lname= post.last_name;
      // var mob= post.mob_no;
      var encryptedPassword="";
function first(){
   return new Promise((resolve,reject)=>{
      bcrypt.hash(password,10,(err,hash)=>{
         //store hash in database
         if(!err){
         resolve(hash);
         } else {
            reject(err);
         }
      });

   }); 
}

function second(password){
   return new Promise((resolve,reject)=>{
      var details = {
         username: username,
         password: password,
         name:name
      }

      var sql = "INSERT INTO `agents_login` set ?";

      var query = connection.query(sql,[details],function(err, result) {
         if(!err){
         message = "Succesfully! Your account has been created.";
         resolve();
         res.render('login/signup.ejs',{message: message});
      } else {
               console.log("error while signup!\n"+err);
               res.render('login/signup',{details:details,message:"username is already used!"});
               reject(err);
               // res.redirect('');
            }
            });
         });
      }

         async function execution(){
            try{
               encryptedPassword = await first();
               await second(encryptedPassword);
            } catch(err) {
               console.log("err in async/await in signup function.. \n",err);
               res.render('login/signup',{details:details,message:"error with the async/await!"});
            }
            
         }
      execution();

   } else {
      res.render('login/signup.ejs');
   }
};

//-----------------------------------------------login page call------------------------------------------------------
// exports.login = function(req, res){
//    var message = ' ';
//    var sess = req.session; 

//    if(req.method == "POST"){
//       var post  = req.body;
//       var name= post.user_name;
//       var pass= post.password;


     
//       var sql="SELECT id, name, username FROM `agents_login` WHERE `username`='"+name+"' and password = '"+pass+"'";                           
//       connection.query(sql, function(err, results){ 
//       if(!err){     
//          if(results.length>0){
//          	req.session.loggedin = true;
//             req.session.userId = results[0].id;
//             req.session.user = results[0];
//             console.log(" the loggedin agent:",JSON.stringify(req.session.user));
//             res.redirect('/home');
//          }
//          else{
//             message = 'Wrong Credentials.';
//             res.render('login/login.ejs',{message: message});
//          }
//       } else {
//          console.log("Error in mysql-query while executing login-check! \n"+err);
//          res.render('login/login.ejs',{message:"something went wrong! login again!"});
//       }    
//       });
//    } else {
//       res.render('login/login.ejs',{message: "Please Login!"});
//    }
           
// };
//-----------------------------------------without encryption-----------------------------------------


//-----------------------------------------with encryption-----------------------------------------
exports.login = function(req, res){
   var message = ' ';
   var sess = req.session; 

   if(req.method == "POST"){
      var post  = req.body;
      var name= post.user_name;
      var pass= post.password;
      
      var sql="SELECT id, name, username,password FROM `agents_login` WHERE `username`= ?";                           
      connection.query(sql,[name],function(err, results){ 
      if(!err){    
         //var rows =[];
         //rows =  results[0];
         
      function sec2(pass,output){
         return new Promise((resolve,reject)=>{
            if(pass == output.password){
            req.session.loggedin = true;
            req.session.userId = output.id;
            req.session.user = output;
            console.log(" the loggedin agent:",JSON.stringify(req.session.user));
            res.redirect('/home');
            resolve();
         }
         else{
            message = 'Wrong Credentials.';
            res.render('login/login.ejs',{message: message});
            // reject(err);
         }
         });
      }
      
      async function executer(output){
            try{
               // var match = await bcrypt.compare(pass,output.password);
               await sec2(pass,output);
            } catch(err){
               console.log("async/await login error: \n",err);
               res.render('login/login.ejs',{message: message});
            }
               
      }
       executer(results[0]);  
         
      } else {
         console.log("Error in mysql-query while executing login-check! \n"+err);
         res.render('login/login.ejs',{message:"something went wrong! login again!"});
      }    
      });
   } else {
      res.render('login/login.ejs',{message: "Please Login!"});
   }
           
};

//-----------------------------------------------dashboard(homepage) page functionality----------------------------------------------
           // Its the homepage
exports.dashboard = function(req, res, next){
           
   var user =  req.session.user,
   userId = req.session.userId;
   console.log('ddd='+JSON.stringify(user));
   if(req.session.loggedin!=true && userId == null){
      res.redirect("/login");
      return;
   } else{

   var sql="SELECT id,username,name FROM `agents_login` WHERE `id`='"+userId+"'";

   connection.query(sql, function(err, results){
   	if(!err && results.length>0){
      res.render('dashboard.ejs', {user:results[0].username});    
   	} else{
   		console.log("error in the dashboard mysql-query function! \n",err);
         res.redirect('/home');
   	}
   });    
   }   
};

//------------------------------------logout functionality----------------------------------------------
exports.logout=function(req,res){
   req.session.destroy(function(err) {
      res.render("login/login.ejs",{message:"please login to visit the website!"});
   });
};