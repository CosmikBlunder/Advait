const User = require('../models/User');
const session = require('express-session');
const bcrypt = require('bcryptjs');


const axios = require('axios');
const cheerio = require('cheerio');
const { name } = require('ejs');
previews=[];
async function scrapeGovernmentWebsite(keyword, count) {
    try {
        const searchQuery = `https://services.india.gov.in/service/search?kw=${encodeURIComponent(keyword)}`;
        const response = await axios.get(searchQuery);
        const $ = cheerio.load(response.data);
        

        $('.edu-lern-con').each((index, element) => {
            if(index >= count) return;
            const title = $(element).find('h3').text(); 
            const snippet = $(element).find('p').text(); 
            const url = $(element).find('.ext-link').attr('href');

            previews.push({ keyword, title, snippet, url });
        });
        //console.log(`Link previews for keyword '${keyword}':`, previews);
    } catch (error) {
    console.error('Error:', error);
    }
}



const advait_login = (req, res) => {
    res.render('login', {title: 'LOGIN', msg:''});
}

const advait_login_post = async (req, res) => {
    const {email, password} = req.body;

    let user = await User.findOne({email: email});

    if(!user) {
        // alert('User does not exist');
        return res.render('login', {title: 'LOGIN', msg: 'User does not exist'});
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if(!validPassword) {
        return res.render('login', {title: 'LOGIN', msg: 'Invalid password'});
    }

    req.session.user = {name: user.name, email: user.email, points: user.points, id: user._id.toJSON(), state: user.state, education: user.education, occupation: user.occupation}; 
    req.session.isAuth = true;
    res.redirect('/home');

}

const advait_signup = (req, res) => {
    res.render('signup', {title: 'SIGNUP', msg: ''})
}

const advait_signup_post = async (req, res) => {
    const {name, email, password} = req.body;

    let user = await User.findOne({email: email});

    if(user) {
        return res.render('/signup', {title: 'SIGNUP', msg: 'User already exists'});
    }

    req.session.signupInfo = {name, email, password};

    res.redirect('/KYC');
}

const advait_KYC = (req, res) => {
    res.render('KYC', {title: 'KYC'})
}

const advait_KYC_post = async (req, res) => {
    const {aadhar, pan, state, education, occupation} = req.body;
    const {name, email, password} = req.session.signupInfo;

    const hashedPassword = await bcrypt.hashSync(password, 10);

    const user = new User({name, email, password: hashedPassword, aadhar, pan, state, education, occupation});

    delete req.session.signupInfo;

    user.save()
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
        });

}

const advait_logout = (req, res) => {
    req.session.destroy(err => {
        if(err) throw err;
        res.redirect('/');
    });
}

const advait_home = async (req, res) => {
    keywords = [req.session.user.state, req.session.user.occupation, req.session.user.education];
    await keywords.forEach(keyword => {
        scrapeGovernmentWebsite(keyword, 2);
    });
    // console.log(keywords);
    await res.render('home', {title: 'Advait', name: req.session.user.name, previews});
    previews.length = 0;
}

const advait_services = async (req, res) => {
    keywords = [req.session.user.state, req.session.user.occupation, req.session.user.education];
    // console.log(keywords);
    
    await keywords.forEach(keyword => {
        scrapeGovernmentWebsite(keyword, 5);
    });
    
    await res.render('services', {title: 'Services', name: req.session.user.name, previews});
    previews.length = 0;
}

const advait_landing = (req, res) => {
    res.redirect('/');
}
const advait_CPM = (req, res) => {
    res.render('CPM', {title: 'CPM', name: req.session.user.name})
}

const advait_cpmimp = (req, res) => {
    res.render('cpmimp', {title: 'Suggest an improvement', name: req.session.user.name})
}

const advait_cpmimp_post = (req, res) => {
    const {policy, improvement} = req.body;
    console.log(policy, improvement);
    res.redirect('/CPM');
}

const advait_cpmpns_post = (req, res) => {
    const {improvement} = req.body;
    console.log(improvement);
    res.redirect('/CPM');
}

const advait_cpmpns = (req, res) => {
    res.render('cpmpns', {title: 'Propose new service', name: req.session.user.name})
}

const advait_NEKI = async (req, res) => {

    try {
        // Retrieve users from the database, sorted by points in descending order
        const leaderboardData = await User.find().sort({ points: -1 });
    
        res.render('NEKI', {title: 'NEKI', name: req.session.user.name ,points : req.session.user.points , msg: '', leaderboard: leaderboardData });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

const advait_NEKI_post = async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id);
        if (!user) {
          return res.status(404).send('User not found');
        }
    
        user.points += 100;
        req.session.user.points = user.points;
    
        await user.save();
    
        const leaderboardData = await User.find().sort({ points: -1 });
    
        res.render('NEKI', {title: 'NEKI', name: req.session.user.name ,points : req.session.user.points , msg: 'Thank you for your contribution', leaderboard: leaderboardData });

      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
    console.log(req.session.user);
    
}

const advait_404 = (req, res) => {
    res.render('404', {title: 'Oops'});
}


module.exports = {
    advait_login,
    advait_signup,
    advait_KYC,
    advait_home,
    advait_services,
    advait_landing,
    advait_signup_post,
    advait_KYC_post,
    advait_login_post,
    advait_404,
    advait_logout,
    advait_CPM,
    advait_cpmimp,
    advait_cpmpns,
    advait_NEKI,
    advait_cpmimp_post,
    advait_cpmpns_post,
    advait_NEKI_post
}


