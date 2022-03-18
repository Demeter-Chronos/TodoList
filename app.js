const express = require('express')
const bodyParser = require('body-parser')
// Here I am trying to link this app to a database using MongoDB and Mongoose
// the code line below is used to require mongoose after it has been installed by npm
const mongoose = require('mongoose')

const app = express()
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.static('public'))

//Here this line of code checks the location of the database if the database has been created and if it has not been created the database is created automatically
//This connects to the specified database below
mongoose.connect('mongodb://localhost:27017/todolistDB')

//After connection with the database the next step is to create a database schema
//Here is the todolistDB schema
const itemsSchema = new mongoose.Schema({
    item: String,
})

//After creating a schema the next step is to create a model as shown below. NB: A model is a class
const Item = new mongoose.model('item', itemsSchema)

//Default collection to be added to the database so the list is not initialy empty
const item1 = new Item({
    item: 'Learn to code today'
})
const item2 = new Item({
    item: 'Go grab dinner in 30 mins'
})
const item3 = new Item({
    item: 'Resume coding immediately after eating'
})

//Here we create an array to add the default items of the database to
const defaultItems = [item1, item2, item3]

//We use mongoose function insertMany to insert the contents of the array into the database
// Item.insertMany(defaultItems, (err) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log('Default items sucessfully added to the database');
//     }
// });



app.get('/', (req, res) => {

    Item.find({}, (err, foundItems) => {

        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Default items sucessfully added to the database');
                }
            });
            res.redirect('/')
        } else {
            res.render('list', {
                listType: 'Today',
                dailyList: foundItems,
            })
        }
    })


})

app.post('/', (req, res) => {
    const newItem = req.body.newListItem

    const item = new Item({
        item: newItem
    })

    item.save()

    res.redirect('/')
})

app.post('/delete', (req,res) => {
    const checkedItemID = req.body.checkbox;
    Item.findByIdAndRemove(checkedItemID, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Sucessfully deleted item!');
        }
    })
    res.redirect('/')
})

// app.get('/work', (req, res) => {
//     res.render('list', {
//         listType: 'Work',
//         dailyList: workList,
//     })
// })

app.get('/:newList', (req, res) => {
    const newList = req.params.newList

    
    // res.render('list', {
    //     listType: req.params.newList,
    // })
})


app.get('/about', (req, res) => {
    res.render('about')
})



app.listen(3000, () => {
    console.log('App has started on port 3000...')
})