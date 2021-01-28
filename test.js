/*
var i=0;
var r = (i)=>{
	if(i!=0)
		return true;
	else
		return false;
}
*/


const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 'password';
const someOtherPlaintextPassword = 'password';

function hashing() {
  return new Promise((resolve, reject) => {
    	bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
  // Store hash in your password DB.
  		if(!err){
  			resolve(hash);
  		} else {
  			reject(err);
  		}
});
  });
}

async function msg() {
  try {
    const has = await hashing();
        const match = await bcrypt.compare(someOtherPlaintextPassword,has);
    console.log(has);
    console.log(match);
  } catch(err) {
    console.log(err);
  }
}

msg();
