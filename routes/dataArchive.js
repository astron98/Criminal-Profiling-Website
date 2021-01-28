exports.archiveGet = (req,res,err)=>{

	var dq1 = "(select dcriminal.*,dcp.pid as `cur_loc` from dcriminal,dcp where dcriminal.cid = dcp.cid) union (select dcriminal.*,dcrc.rcid as `current location` from dcriminal,dcrc where dcriminal.cid = dcrc.cid) union (select dcriminal.*,dcw.wcode as `current location` from dcriminal,dcw where dcriminal.cid = dcw.cid) order by cid;"
	connection.query(dq1,(error,results,fields)=>{
		if(!error)
		{
			res.render("location/backup.ejs",{data:results});
			console.log("---------------delete-history.ejs rendered successfully!---------");
		} 
		else
		{
			res.send("error in the '/delh' route:",err);
		}
	});

	
	// res.end();
}


exports.deleteUser = (req,res)=>{
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
}