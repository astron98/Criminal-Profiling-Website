//---------------------------------------delete and store details in archives----------------------
exports.deleteCid = (req,res,err)=>{
    var cur_loc = req.params.cur_loc;
    var cid=req.params.cid;
    //debugging cur_loc and cid values..
    console.log("cur_loc: ",cur_loc,"\n cid: ",cid );


    var tableName = (cur_loc.startsWith("p"))? "dcp":(cur_loc.startsWith("rc"))? "dcrc":cur_loc.startsWith("w")? "dcw": "none";

    if(cur_loc.startsWith("p"))
    {
        var c2={
        cid:cid,
        pid:cur_loc
        };
    }
    else if(cur_loc.startsWith("rc"))
    {
        var c2={
        cid:cid,
        rcid:cur_loc
        };
    }
    else if(cur_loc.startsWith("w"))
    {
        var c2={
        cid:cid,
        wcode:cur_loc
        };
    }
    
    // var o11 = [];
    
    
    //1st query
    //input values
    function query1(){
        return new Promise((resolve,reject)=>{
            connection.query("select * from criminal where cid = ? ",cid,(err,rows)=>{
                if(!err){
                    // resolve(rows);
                    //-----------------starting part of the (1st query)-----------------

                        connection.query("insert into dcriminal set ? ",rows,(err,rows,fields)=>{
                        if(!err){
                            // var dtable = "d"+tableName;

                            //debugging
                            // console.log("dtable value: "+dtable);
                            console.log("===='Deleted-criminal-details' added to the '--dcriminal--' successfully.==== \n");
                            connection.query("insert into "+tableName+ " set ? ",[c2],(err,rows,fields)=>{
                                if(!err){
                                    console.log('-----inserted ' + rows.affectedRows + ' rows----------');
                                    console.log("===='Deleted-criminal-linking-details' added to the " ,tableName, " successfully.==== \n");
                                    console.log("complete backup done...\n");

                                    //resolving the promise function....
                                    resolve();
                                } else {
                                    console.log("----error while backing up details to '"+ tableName + "'----+--- \n "+err);
                                    reject(err);
                                }
                            });
                        } else {
                            console.log("----+---error while backing up the deleted-details to 'dcriminal-table'----+---\n"+err);
                            //connection.end();
                            //res.end();
                        }
                    });

                    //-----------------end of the outer query(1st query)----------------------
                } else {
                    // reject(err)
                    console.log("error line:'339' :\n"+err);
                }	 
            }); //end of the parenthesis of the 1st query

        }) //End of the promise inside the query1-function

        
    };

    function query2(){

    //---------------------------------------work under progress(*)------------------
// if(res.finished!=true){
    return new Promise((resolve,reject)=>{

        if(cur_loc.startsWith("p")){
            console.log("ready to execute delete-cp query \n");
            connection.query('delete from cp where cid=?',cid,(err,results)=>{
                if(!err){
                    console.log("ready to execute delete-criminal query \n");
                    connection.query('delete from criminal where cid=?',cid,(err,results)=>{
                        if(!err)
                        {
                            console.log("criminal details removed.");
                            res.redirect('/');
                            resolve();
                        } else {
                            console.log(err);
                            reject(err);
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
                        
                            res.redirect('/');
                            resolve();
                        } else {
                            console.log(err);
                            reject(err);
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
                            
                            res.redirect('/');
                            resolve();
                        } else {
                            console.log(err);
                            reject(err);
                        }
                    });
                }	
            });
        } else{
            if(err){
                console.log(err)
                res.redirect('/');
                reject(err);
            }
            } //if else ladder finishes here...

    }); //End of the promise inside the query'2'-function

    

} //end of the async function (query2)..

async function resultFunc(){
    await query1();
    await query2();
    console.log("-----backed-up and deleted successfully!!!-----");

}; //end of the resultFunc()
    
    resultFunc();   //calling the resultFunc()

}
//end of the get.delete() route...
