var ejs = require("ejs");
var mysql = require('./mysql');
var userdata;
var selectedProfile=0;
var isviewProfile = false;



exports.welcome = function(req, res){
	  res.render('HomePage');
};

exports.basicSignUp = function(req,res){
	
	var email = req.param("email");
	var password = req.param("password");
	var firstname = req.param("firstname");
	var lastname = req.param("lastname");
	var fullname = firstname+" "+lastname;
	
	
/*	var day = req.param("birthday_day");
	var month = req.param("birthday_month");
	var year = req.param("birthday_year");
	var birthday = day+" "+month+" "+year;
	var sex = req.param("sex");*/
	
	var selectUser = "select emailid from user_table where emailid = '"+ email +"'";
	mysql.fetchData(function(err,results){
		if(err){
			console.log(err);
			res.render('error',{message:'',errormessage:"An error has occured."});
			return;
		}else{
			if(results.length > 0){
				res.render('login',{errormessage:"Email id already exists!!"});
			}else{
				var insertUser= "insert into user_table (EMAILID,PASSWORD,FIRSTNAME,LASTNAME) values ('"+email +
				"','"+password +"','"+firstname +"','"+lastname+"');"
				console.log("Query is:"+insertUser);
				mysql.fetchData(function(err,results){
					if(err){
						throw err;
					}
				},insertUser);
				res.render('addrSignup',{message:"Successfully signed up! You can now login with your email and password.",errormessage:'',emailid:email});
			}
		}
	},selectUser);
};


exports.addrSignup = function(req,res){
	
	var email = req.param("email");
	var password = req.param("password");
	var firstname = req.param("firstname");
	var lastname = req.param("lastname");
	var fullname = firstname+" "+lastname;
	var day = req.param("birthday_day");
	var month = req.param("birthday_month");
	var year = req.param("birthday_year");
	var birthday = day+" "+month+" "+year;
	var sex = req.param("sex");
	var lat = req.param("lat");
	var lng = req.param("lng");
	var zipcode = req.param("zipcode");
	var insertUser= "insert into user_table (EMAILID,PASSWORD,FIRSTNAME,LASTNAME,BIRTHDAY,SEX,LAT,LNG,ZIPCODE) values ('"+email +
	"','"+password +"','"+firstname +"','"+lastname+"','"+ birthday+"','"+sex+"','"+lat+"','"+lng+"','"+zipcode+"');"
	console.log("Query is:"+insertUser);
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
	},insertUser);
	res.render('interests',{message:"Successfully signed up! You can now login with your email and password.",errormessage:'',emailid:email});
	
/*	var selectUser = "select emailid from user_table where emailid = '"+ email +"'";
	mysql.fetchData(function(err,results){
		if(err){
			console.log(err);
			res.render('error',{message:'',errormessage:"An error has occured."});
			return;
		}else{
			if(results.length > 0){
				
				var updateUser ="update user_table set BIRTHDAY = '"+ birthday + "',SEX = '"+ sex +"',LAT ='" + lat +"', LNG = '"+lng+"', zipcode = '"+zipcode+"' where emailid = '"+ email +"'";
					
				var insertUser= "insert into user_table (BIRTHDAY,SEX,LAT,LNG) values ('"+birthday+"','"+sex+"','"+lat+"','"+lng+"')" +
						"where emailid = '"+ email +"'";
				console.log("Query is:"+updateUser);
				mysql.fetchData(function(err,results){
					if(err){
						throw err;
					}
				},updateUser);
				res.render('interests',{message:"Successfully signed up! You can now login with your email and password.",errormessage:''});
			}
		}
	},selectUser);*/
	
	
};

exports.addrInterests = function(req,res){
	
	var img1 = req.param("img1");
    mysql.fetchData(function(err,results){
					if(err){
						throw err;
					}
				},updateUser);
	res.render('main',{message:"Successfully signed up! You can now login with your email and password.",errormessage:''});
};

function signin(req,res) {
	
  if(req.session.name)
	  {
	  isviewProfile = false;
	  ejs.renderFile('./views/main.ejs',{ name:req.session.name, id: req.session.id,title:"Home" },function(err, result) {
		   // render on success
		   if (!err) {
		            res.end(result);
		   }
		   // render or error
		   else {
		            res.end('An error occurred');
		            console.log(err);
		   }
	   });
	  }
  else {
	ejs.renderFile('./views/signin.ejs',{errorlabel:""},function(err, result) {
	   // render on success
	   if (!err) {
	            res.end(result);
	   }
	   // render or error
	   else {
	            res.end('An error occurred');
	            console.log(err);
	   }
   });
 }
}

function profile(req,res) {
   if(req.session.name)
	{
	   isviewProfile = false;
	   console.log("id:"+req.session.id);
	ejs.renderFile('./views/profile.ejs',{ data:req.session.name, name: req.session.name, id: req.session.id },function(err, result) {
	   // render on success
	   if (!err) {
	            res.end(result);
	   }
	   // render or error
	   else {
	            res.end('An error occurred');
	            console.log(err);
	   }
   });
	}
   else {
	   res.redirect('/');
   }
}

function getUserProfile(req,res) {

	
	var profileid = req.param("profileid");
	isviewProfile = true;
	selectedProfile = profileid;
	
	var getuserProfile = "select firstname from user_table where user_id='"+profileid+"'";	
	console.log("Query is:"+getuserProfile);
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log("results user:"+results);
				res.render('profile',{ data: req.session.name , name: results[0].firstname , id:profileid} );
			}
			
				
		}	
	},getuserProfile);

	}
	



function afterSignIn(req,res)
{
	req.session.id = 0;
	req.session.name = "";
	// check user already exists
	var getUser="select * from user_table where emailid='"+req.param("inputUsername")+"' and password='" + req.param("inputPassword") +"'";
	console.log("Query is:"+getUser);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log("valid Login");
				req.session.id = results[0].user_id;
				req.session.name = results[0].firstname;
				//ejs.renderFile('./views/successLogin.ejs', { data: results} , function(err, result) {
				ejs.renderFile('./views/main.ejs', { name:req.session.name, id:req.session.id,title:"Home" } , function(err, result) {

			        if (!err) {
			            res.end(result);
			        }
			        // render or error
			        else {
			            res.end('An error occurred');
			            console.log(err);
			        }
			    });
			}
			else {    
				
				console.log("Invalid Login");
				ejs.renderFile('./views/signin.ejs',{errorlabel:"Invalid emailId or password!"},function(err, result) {
				
			        // render on success
			        if (!err) {
			            res.end(result);
			        }
			        // render or error
			        else {
			            res.end('An error occurred');
			            console.log(err);
			        }
				});
			}
		}  
	},getUser);
}

function signUp(req,res)
{
	var signup="insert into user_table(firstname,lastname,emailid,password) values('"+req.param("inputfname")+"','"+req.param("inputlname")+"','"+req.param("inputemailid")+"','"+req.param("inputpassword")+"')";
	console.log("Query is:"+signup);
	
	mysql.insertData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			console.log("result from db:"+results);
			if(results !== null){
			console.log("user added");
			ejs.renderFile('./views/signin.ejs',{errorlabel:"You have signed up. Login with your credentials!"},function(err, result) {
				
		        // render on success
		        if (!err) {
		            res.end(result);
		        }
		        // render or error
		        else {
		            res.end('An error occurred');
		            console.log(err);
		        }
			});
			}
			else
			{
				console.log("error");
				res.end("Error:no results from db");
			}
		}
	},signup);	
}

function datenow()
{
	var t = new Date();
	var YYYY = t.getFullYear();
	var MM = ((t.getMonth() + 1 < 10) ? '0' : '') + (t.getMonth() + 1);
	var DD = ((t.getDate() < 10) ? '0' : '') + t.getDate();
	var HH = ((t.getHours() < 10) ? '0' : '') + t.getHours();
	var mm = ((t.getMinutes() < 10) ? '0' : '') + t.getMinutes();
	var ss = ((t.getSeconds() < 10) ? '0' : '') + t.getSeconds();


	var time_of_call = YYYY+'-'+MM+'-'+DD+' '+HH+':'+mm+':'+ss;	
    return time_of_call;
}


function submitPost(req,res)
{

	var now = datenow();
	console.log("date now is :"+now);
	
	var insertpost="insert into posts(postdesc,postedby,postedon) values('"+req.body.message+"','"+req.session.id+"','"+now+"')";
	console.log("Query is:"+insertpost);
	
	mysql.insertData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			console.log("result from db:"+results);
			if(results !== null){
			console.log("post submitted");
			res.send(JSON.stringify({success:true}));	
			}
			else
			{
				console.log("error");
				res.send(JSON.stringify({success:false}));
			}
		}
	},insertpost);	
}


function getPosts(req,res)
{
	var userid;
	if(isviewProfile)
		{
		userid = selectedProfile;
		}
	else{
		userid = req.session.id;
	    }
var getuserPosts = "select * from posts where postedby='"+userid+"' order by postedon desc";	

console.log("Query is:"+getuserPosts);
mysql.fetchData(function(err,results){
	if(err){
		throw err;
	}
	else 
	{
		if(results.length > 0){
			console.log("results posts:"+results);
             res.send(JSON.stringify({posts:results,success:true}));
		}
		else
		{
			 res.send(JSON.stringify({success:false}));
		}
			
	}	
},getuserPosts);

}

function getAllPosts(req,res)
{
var getallPosts = "select user_id,firstname,lastname,postdesc,postedon from posts join user_table on posts.postedby =user_table.user_id where postedby='"+req.session.id+"' or postedby in ( select friend_id from friend_list where user_id='"+req.session.id+"' and status=1 union select user_id from friend_list where friend_id ='"+req.session.id+"' and status = 1) order by postedon desc";
console.log("Query is:"+getallPosts);
mysql.fetchData(function(err,results){
	if(err){
		throw err;
	}
	else 
	{
		if(results.length > 0){
			console.log("results posts:"+results);
             res.send(JSON.stringify({posts:results,success:true}));
		}
		else
		{
			 res.send(JSON.stringify({success:false}));
		}
			
	}	
},getallPosts);

}

function createGroup(req,res)
{

	
	var creategroup="insert into groups(groupname,groupdesc,createdby) values('"+req.body.name +"','"+req.body.desc+"',1)";
	console.log("Query is:"+creategroup);
	
	mysql.insertData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			console.log("result from db:"+results);
			if(results !== null){
			console.log("group added");
			res.send(JSON.stringify({success:true}));	
			}
			else
			{
				console.log("error");
				res.send(JSON.stringify({success:false}));
			}
		}
	},creategroup);	
}

function getUserGroups(req,res)
{
	if(req.session.name)
	{
	var getusergroups = "select g.group_id,g.groupname from groups g join group_members gm on g.group_id = gm.group_id and gm.user_id ='"+req.session.id+"' union select group_id,groupname from groups where createdby ='"+req.session.id+"'";
	console.log("Query is:"+getusergroups);
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log("results groups:"+results);
	             res.send(JSON.stringify({groups:results,success:true}));
			}
			else
			{
				 res.send(JSON.stringify({success:false}));
			}
				
		}	
	},getusergroups);	
	}
	else{
		res.send(JSON.stringify({success:false}));
		}
		
}

function searchUsers(req,res)
{
	var getAllUsers;
	console.log("text to search"+req.body.text);
	var txt = req.body.text + '%';
	if(req.body.text === "" || req.body.text === null || req.body.text === undefined)
		{
		 getAllUsers = "select * from user_table";
		}
	else
		{
		getAllUsers = "select * from user_table where firstname like '"+txt+"'";
		}
     console.log("Query is:"+getAllUsers);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				
				var jsonString = JSON.stringify(results);
				
				console.log("results posts:"+jsonString);
	             res.send(JSON.stringify({userlist:results,success:true}));
			}
			else
			{
				 res.send(JSON.stringify({success:false}));
			}
			
			
		}  
	},getAllUsers);
}


function redirectToGrp(req,res)
{
	
	 if(req.session.name)
		{
		 var groupid = req.param.grpid;
		 
			//var grpdesc = req.param.grpid;
			//var grpname = req.body.gname;
			console.log("inside redirect grp fn-"+groupid+"$");
			groupid = 1;
			var getGroupData = "select groupname,groupdesc from groups where group_id ='"+groupid+"'";
		
			mysql.fetchData(function(err,results){
				if(err){
					throw err;
				}
				else 
				{
					if(results.length > 0){
						
						var groupname = results[0].groupname;
						var groupdesc = results[0].groupdesc;
						
						console.log("results posts:"+groupname+"$"+groupdesc);
			             res.render("group",{gid: groupid, gname: groupname, gdesc: groupdesc, uid: req.session.id, name: req.session.name});
					}
								
				}  
			},getGroupData);
			
		}
	   else {
		   res.redirect('/');
	   }
}

exports.redirectToHomepage = function(req,res)
{
	//Checks before redirecting whether the session is valid
	if(req.session.name)
	{
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("homepage",{username:req.session.username});
	}
	else
	{
		res.redirect('/');
	}
};


//Logout the user - invalidate the session
exports.logout = function(req,res)
{
	req.session.destroy();
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	res.redirect('/');
};

//For SignUp redirection
exports.showSignup = function(req,res)
{
	res.render('addrSignup');
};

exports.addrInterests = function(req,res){

	var images = [];
	var i;
	images.push(req.param("img1"));
	images.push(req.param("img2"));
	images.push(req.param("img3"));
	images.push(req.param("img4"));
	images.push(req.param("img5"));
	images.push(req.param("img6"));
	images.push(req.param("img7"));
	images.push(req.param("img8"));
	images.push(req.param("img9"));
	images.push(req.param("img10"));
	images.push(req.param("img11"));
	images.push(req.param("img12"));
	images.push(req.param("img13"));
	images.push(req.param("img14"));
	images.push(req.param("img15"));
	console.log('length: '+images.length);
	for(i = 0; i < images.length; i++){
		if(images[i] != undefined || images[i] != null){
			var insertInterest= "insert into user_interests values ('"+ 1 +"','"+images[i]+"')";
			console.log("Query is:"+insertInterest);
			mysql.fetchData(function(err,results){
				if(err){
					throw err;
				}
			},insertInterest);
		}
	}
	res.render('main',{message:"Successfully signed up! You can now login with your email and password.",errormessage:''});
};

exports.signin=signin;
exports.afterSignIn=afterSignIn;
exports.signUp = signUp;
exports.searchUsers=searchUsers;
exports.profile=profile;
exports.submitPost = submitPost;
exports.getPosts = getPosts;
exports.getAllPosts = getAllPosts;
exports.getUserGroups = getUserGroups;
exports.createGroup = createGroup;
exports.redirectToGrp = redirectToGrp;
exports.getUserProfile = getUserProfile;