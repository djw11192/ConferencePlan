var
    express = require('express'),
    app = express()
    ejs = require('ejs'),
    ejsLayouts = require('express-ejs-layouts'),
    mongoose = require('mongoose'),
    flash = require('connect-flash'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    passport = require('passport'),
    methodOverride = require('method-override'),
    dotenv = require('dotenv').load({silent: true}),
    http = require('http').Server(app)


    ///mongoose
    var port = process.env.PORT || 3000
    var mongoConnectionString = process.env.MONGO_URL

    mongoose.connect(process.env.MONGO_URL, function(err){
      	if(err) return console.log('Cannot connect to Mongo')
      	console.log('Connected to MongoDB. Hell Yeah!')
    })


    app.use(logger('dev'))
    app.use(methodOverride('_method'))
    app.use(cookieParser())
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())
    app.use(session({
    	secret: 'petersplan',
    	cookie: {maxAge: 6000000},
    	resave: true,
    	saveUninitialized: false,
      store: new MongoStore({url: mongoConnectionString})
    }))
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(flash())//flash application

    //this will add a currentUser to be available in every view
    app.use(function(req,res,next){
      if(req.user) req.app.locals.currentUser = req.user
      req.app.locals.loggedIn = !!req.user
      next()
    })

    // ejs configuration
    app.set('view engine', 'ejs')
    app.use(ejsLayouts)
    app.use(express.static('public'))

    app.get('/', function(req,res){
      if (req.app.locals.loggedIn){res.redirect('/team')}
      else{res.render('home')}
    })


http.listen(port, function(){
	console.log("Server running on port: ", port)
})
