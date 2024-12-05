require('dotnev').config();
const express = require('express');
const path = require('path');
const app = express();
const apiRoutes = require('../routes/api');

const PORT = process.env.PORT || 300;

//middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serving the static file
app.use(express.static(path.join(__dirname, 'public')));


//api routing
app.use('/routes/api.js', apiRoutes);


//watches to see if server is running
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})