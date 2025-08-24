const express =  require('express');
const app = express();
const hostname = '0.0.0.0';
const port = 1111;

//third-party libraries
const cors = require('cors');
const bodyParser = require('body-parser');
const { urlencoded } = require('body-parser');
const csvtojson = require('csvtojson');


const filename = 'trainingProviderSample.csv';
const filePath = filename;
 
//custom scripts
const validator = require('./middleware/validator/validator');


//Allow cors; Not passing an argument allows cors on all origins
app.use(cors());

//Use body-parser to parse incoming json request as well as urlencoded, which is the default type when submitting html forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Using urlencoded without an argument is deprecated and will provide error
//The value of extended determines which library we use for parsing the body


//Routes
const router = require('./routes/admin/admin');
app.use(router);

const routerUser = require('./routes/user/user');
app.use(routerUser);

const routerDivChief = require('./routes/divChief/divChief');
app.use(routerDivChief);

const routerSupervisor = require('./routes/supervisor/supervisor');
app.use(routerSupervisor);

const all = require('./routes/other/all');
app.use(all);

app.use((req,res) => {
    res.status(404).send('Page Not Found!');
})
//Error handler function for validation
app.use(validator.errorHandler);

//Start the server and listen to the provided hostname and port
app.listen(port, hostname, () => {
    //Log something to the console to verify the server is running
    console.log(`Server is running on ${hostname}:${port}`);
});