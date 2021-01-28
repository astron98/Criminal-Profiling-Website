exports.editGet = (req,res,err)=>{
	var cid = req.params.cid;
	console.log('The cid of the selected criminal for edit:'+cid);
	// if(!err)
	connection.query('select * from criminal where cid = ?',cid,(err,rows)=>{
		var cDetails = {
			cname:rows[0].cname,
			alias:rows[0].alias,
			mo:rows[0].mo,
			lastloc:rows[0].lastloc
		};
		res.render('edit.ejs',{cid:cid,cDetails:cDetails});
	});	
	// else 
	if(err)
	{
		console.log('#### error with EDIT-GET route while loading the edit.ejs webpage: \n'+err)
		// res.redirect('/');
	}
}


exports.editPost = (req,res, err)=>{
	var cDetails = {
		cname:req.body.cname,
		alias:req.body.alias,
		mo:req.body.mo,
		lastloc:req.body.lastloc,
		cid:req.params.cid
	};
	// var cid = req.params.cid;
	// console.log("The cid detected is given as: "+cid+","+JSON.stringify(cDetails));
	// if(!err)
	// {
		var q1 = "update criminal set cname=?,alias=?,mo=?,lastLoc=? where cid=?";
		connection.query(q1,[cDetails.cname,cDetails.alias,cDetails.mo,cDetails.lastloc,cDetails.cid
		],(err,results,fields)=>{
			// console.log(results.affectedRows);
			if(!err)
			{
				console.log("Details updated successfully!");
				res.redirect('/');
			}
			else 
			{
				console.log("ERROR with update mysql query:\n"+err);
				res.render('edit.ejs',{cid:cDetails.cid,cDetails:cDetails});
			}
		});
	// }
	// if(err) 
	// {
	// 	console.log("ERROR with the edit-POST request! \n"+err);
	// 	res.render('edit.ejs',{cid:cDetails.cid,cDetails:cDetails});
	// }
}
