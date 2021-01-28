//rendering the prison,rehab and watchlists seperately..

exports.getTypes = (req,res,err)=>{
	
	let pdetails = [],ptel=[];

	var loc = req.params.loc;
	if(loc === "p")
	{
		connection.query("select * from prison;",(err,rows)=>{
			if(!err){
				pdetails = rows;
				connection.query("select * from p_ph",(err,rows)=>{
					if(!err){
						ptel = rows;
						res.render('location/prisonsList.ejs',{data:pdetails,tdata:ptel});				
					} else {
						console.log("ERROR while fetching data from 'p_ph' table. \n"+err);
					}
				});
			} else {
				console.log("ERROR while fetching data from prison-table.\n"+err);
			}
		});
		
	}
	else if(loc === "r")
	{
		connection.query("select * from rehab;",(err,rows)=>{
			if(!err){
				var rdetails = rows;
				connection.query("select * from rcph",(err,rows)=>{
					if(!err){
						var rtel = rows;
						res.render('location/rehabList.ejs',{data:rdetails,tdata:rtel});				
					} else {
						console.log("ERROR while fetching data from 'rcph' table. \n"+err);
					}
				});
			} else {
				console.log("ERROR while fetching data from rehab-table.\n"+err);
			}
		});
	}
	else if(loc==="w")
	{
				connection.query("select * from wlist",(err,rows)=>{
					if(!err){
						var wdetails = rows;
						res.render('location/wList.ejs',{data:wdetails});				
					} else {
						console.log("ERROR while fetching data from 'wList' table. \n"+err);
					}
				});
	}
	else 
		res.render("error.ejs");
	// console.log("prisonsList is rendered successfully!");
	
}