//get route for add-details
exports.addDetailsGet = (req,res,err)=>{
	// if(!err) {
		res.render("add.ejs");
	// } else {
	// 	res.render("error.ejs");
	// }
}

//post route
exports.addDetailsPost = (req,res)=>{

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
		
}