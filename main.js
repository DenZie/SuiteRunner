const express = require('express')
const pug = require('pug');
const rf = require('./readFiles');
const app = express()
app.use(express.static('public'));
const port = 3000
app.set('view engine', 'pug');
app.get('/', (req, res) => res.send('Hello World!'))
app.get('/pug', function (req, res) {
	 res.render('index', { 'data': rf.getfiles()});
});
app.get('/index', function (req, res) {
   res.sendFile( __dirname + "/public/" + "index.html" );
	  var data = rf.getfiles();
	  res.end(data );
})


app.get("/process_get", function(req,res) {
	
	  var data = rf.getfiles();
	  res.end(data );
	  
//	resp =  {
//			FName:req.query.first_name,
//			LName:req.query.last_name
//	};
//	console.log(resp);
//	res.end( JSON.stringify(resp));
});

app.listen(port, () => console.log(`Example aphttp://marketplace.eclipse.org/marketplace-client-intro?mpc_install=1642532p listening on port ${port}!`))