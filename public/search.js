// var sValue = function selectedValue()
// {
//     var s,val;
//     s = document.getElementById("search-criminals");
//     val = s.options[s.selectedIndex].value;
//     return val;  
// }

function searchFunction()
	{
		var s,val,input,filter,table,tr,td,i,txtValue;
        s = document.getElementById("search-criminals");
        val = s.options[s.selectedIndex].value;
        console.log("the selected value: "+val);

        input = document.getElementById("myinput");
		filter = input.value.toUpperCase();
		table = document.getElementsByClassName('table');
		tr = table[0].getElementsByTagName('tr');
		// start from 'tr[1]' coz,tr[0] is the <thead> part...

		for(i=1;i<tr.length;i++)
		{
			td = tr[i].getElementsByTagName("td")[val];
			if(td){
				
				txtValue = td.textContent || td.innerText;
                console.log("td value:"+txtValue);
                console.log("comparison: "+txtValue.toUpperCase().includes(filter));
                if(txtValue.toUpperCase().includes(filter)!=true) {
					tr[i].style.display="none";
				} else {
					tr[i].style.display = "";

				}
			}
		}
	}