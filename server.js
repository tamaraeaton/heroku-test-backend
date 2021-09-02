const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const movieRoutes = express.Router();
const PORT = 8080;

let User = require('./UserModel');
// console.log(User)
let Movie = require('./MovieModel');

app.use(cors());
app.use(express.json());
mongoose.connect('mongodb+srv://tamara123:tamara123@cluster0.bsriq.mongodb.net/movieTracker?retryWrites=true&w=majority', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false, 
    useCreateIndex: true 
},
    () => console.log('connected')
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('it is connected')
});

// Finds all users
app.get('/', function (req, res) {
    User.find(function (err, user) {
        if (err) {
            console.log(err)
        } else {
            res.json(user)
        }
    })
});
// app.get('/', (req, res)=>{
//     return res.json({
//         message: 'working'
//     })
// })
movieRoutes.route('/:id').get(function (req, res) {
    let userId = req.params.id;
    User.findById(userId, function (err, user) {
        res.json(user)
        console.log(user)
    })
});

// password authentication
movieRoutes.route('/username/:username/password/:password').get(function (req, res) {
    let userName = req.params.username;
    let passWord = req.params.password;
    User.findOne({ username: userName, password: passWord }, function (err, user) {
        res.json(user)
        })
});

// add new user
movieRoutes.route('/add').post(function (req, res) {
    let user = new User(req.body);
    User.create(user)
        .then(user => {
            console.log('user worked')
            res.status(200).json({ 'user': 'user added successfully' })
        })
        .catch(err => {
            console.log('err worked')
            res.status(400).send('Adding new user failed');
        })
        console.log(user)
});


// update user info
movieRoutes.route('/update/:id').post(function (req, res) {
    let userId = req.params.id;
    User.findById(userId, function (err, user) {
        if (!user)
            res.status(404).send('user is not found');
        else

            user.password = req.body.password;
        user.name = req.body.name;

        user.save().then(user => {
            res.json('User updated')
        })
            .catch(err => {
                res.status(400).send("Update not possible")
            })
    });
});

// New route to find all movies
// movieRoutes.route('/movies').get(function (req, res) {
//     Movie.find(function (err, movie) {
//         if (err) {
//             console.log(err)
//         } else {
//             res.json(movie)
//             console.log("movie " , movie)
//         }
//     })
// });

// Create new Route to find all movies by username
movieRoutes.route('/movies/:username').get(function (req, res) {
   
    const findUserName = req.params.username

    Movie.find({ username: findUserName },
         function (err, user) {
        if(err) {
            console.log(err)
        } else {
        res.json(user);
        // console.log(user)
        }
    });
});

// New Route to find movie by id
movieRoutes.route('/singleMovie/:id').get(function (req, res) {
    Movie.findById(req.params.id, function (err, movie) {
        if (err) {
            console.log(err)
        } else {
            res.json(movie)
        
        }
    })
});

// Add movie
movieRoutes.route('/addMovie').post(function (req, res) {
    let movie = new Movie(req.body);
    movie.save()
        .then(movie => {
            res.status(200).json({ 'movie': 'movie added succesfully' });
        })
        .catch(err => {
            res.status(400).send('adding new movie failed');
        });
});



// Delete movie
movieRoutes.route('/movies/delete/:id').delete(function (req, res) {
    let deleteMovie = req.params.id;
    Movie.findByIdAndRemove(deleteMovie)
        .exec()
        .then(item => {
            if (!item) {
                return res.status(404).end()
            } else {
                return res.status(204).end()
            }
        })
        .catch(err => next(err))
})

// Delete many movies
movieRoutes.route('/delete/:id').delete(function (req, res) {
    let userDelete = req.params.id;
    User.findByIdAndRemove(userDelete, function (err, user) {
        Movie.deleteMany({ username: user.username }, function (err) {
            if (err) {
                console.log(err)
            }
        })

        if (err) {
            return next(err);
        }
        res.redirect('/')
        console.log("Delete Successful")
    });
})


app.use('/movieTracker', movieRoutes);

app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});