var ejs= require('ejs');
var mysql = require('mysql');
var connectionPool = [];
var isPoolFlag = false;
var firstVisit = 0;
var MaxSize = 100;
function getConnection(){
	var connection = mysql.createConnection({
	    host     : 'localhost',
	    user     : 'root',
	    password : '',
	    database : 'swarna',
	    port	 : 3307
	});
	return connection;
}

function createConnectionPool(){	
	for (var i = 0; i<MaxSize;i++)
		{
		var connection = getConnection();
		connectionPool.push(connection); 
        }
}

function isempty(pool)
{
if(pool.length >0 )
	{
	return false;
	}
else {
	return true;
}
}
function fetchConnection()
{
	if(isempty(connectionPool))
    {
		connectionPool.push(getConnection());	
    }

	var	con = connectionPool.pop();

	return con;
}
function releaseConnection(con)
{
	connectionPool.push(con);
}

function fetchData(callback,sqlQuery){
	var connection;
	console.log("\nSQL Query::"+sqlQuery);
	
	if(!isPoolFlag)
    {
	connection=getConnection();
    }
	else
	{
	 if(firstVisit === 0)
	 {
		 createConnectionPool();
		 firstVisit = 1;
	 }	 
	connection = fetchConnection();	
	}	
	
	connection.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			console.log("DB Results:"+rows);
			callback(err, rows);
		}
	});
	console.log("\nConnection closed..");
	if(isPoolFlag)
	{
	releaseConnection(connection);
	}
	else{
		connection.end();
	}
}	

function insertData(callback,sqlQuery){
	
	console.log("\nSQL Query::"+sqlQuery);
	var connection;
	if(!isPoolFlag)
    {
	connection=getConnection();
    }
	else
	{
	 if(firstVisit === 0)
	 {
		 createConnectionPool();
		 firstVisit = 1;
	 }	 
	connection = fetchConnection();	
	}	
	
	
	connection.query(sqlQuery, function(err,result) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			console.log("DB Results:"+result);
			callback(err, result);
		}
	});
	console.log("\nConnection closed..");
	connection.end();
}	

exports.insertData = insertData;
exports.fetchData=fetchData;