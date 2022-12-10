const mongoose = require("mongoose");

const mongoDBUrl = "mongodb+srv://admin1:ADMINparehome@cluster0.63wh007.mongodb.net/PareHome";
mongoose.connect(mongoDBUrl, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log(`Connected to database`);
})
.catch((err) => {
    console.log(`Error connecting to database: ${err}`);
});

