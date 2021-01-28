exports.getAllCriminalDetails = (req,res)=>{
	if(req.session.loggedin = true){
    var q1 = "(select criminal.*,cp.pid as `cur_loc` from criminal,cp where criminal.cid = cp.cid) union (select criminal.*,crc.rcid as `current location` from criminal,crc where criminal.cid = crc.cid) union (select criminal.*,cw.wcode as `current location` from criminal,cw where criminal.cid = cw.cid) order by cid;"
    connection.query(q1,(err,rows)=>{
      if(err){
        console.log("criminal details rendering error: "+ err);
        res.render("error.ejs");
      } else {
        // console.log("data of the rows:"+rows);
      res.render("index.ejs",{data:rows});
      console.log("-----------Criminals list rendered successfully!-------------");
      }
    });	
  } else {
    res.redirect("/signup");
  }	
}

exports.index = function(req, res){
    var message = '';
  res.render('login/login.ejs',{message: message});
 
};