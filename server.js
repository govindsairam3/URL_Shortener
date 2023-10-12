const express = require('express')
const mongoose =  require('mongoose')
const ShortUrl = require('./models/shortUrl')
const shortId = require('shortid')

const app = express()

mongoose.connect('mongodb://localhost/urlShortner')


app.set('view engine','ejs')
app.use(express.urlencoded({ extended: false}))


app.get('/', async (req,res) => {
    const shortUrls = await ShortUrl.find();
    res.render('index', { shortUrls: shortUrls})
    //console.log("hello world");
})


app.post('/shortUrl', async (req,res) => {
    const check = await ShortUrl.exists({ full: req.body.fullUrl})
    //console.log(check)
    if(check == null)
        await ShortUrl.create({ full: req.body.fullUrl })
    else{
        await ShortUrl.findOneAndUpdate({ short: shortId.generate()})
    }
    res.redirect('/')
})

app.get('/:shortUrl', async (req,res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    console.log(shortUrl)
    if(shortUrl == null)
        return res.sendStatus(404)
    shortUrl.visits++
    shortUrl.save()
    res.redirect(shortUrl.full)

})

//Browser port
app.listen(process.env.PORT || 5000);