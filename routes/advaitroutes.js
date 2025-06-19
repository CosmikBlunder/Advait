const express = require('express');
const advaitController = require('../controllers/advaitController')

const router = express.Router();

//handler
const isAuth = (req, res, next) => {
    if(req.session.isAuth) {
        next();
    } else {
        res.redirect('/login');
    }
}

const alrAuth = (req, res, next) => {
    if(!req.session.isAuth){
        next();
    } 
    else
        res.redirect('/home')
}

router.get('/login',alrAuth, advaitController.advait_login);

router.get('/signup',alrAuth, advaitController.advait_signup);

router.get('/KYC', advaitController.advait_KYC);

router.get('/home', isAuth ,advaitController.advait_home);

router.get('/services', isAuth, advaitController.advait_services);

router.get('/landing',alrAuth, advaitController.advait_landing);

router.get('/CPM', isAuth, advaitController.advait_CPM);

router.get('/CPM/cpmimp', isAuth, advaitController.advait_cpmimp);

router.get('/CPM/cpmpns', isAuth, advaitController.advait_cpmpns);

router.get('/NEKI', isAuth, advaitController.advait_NEKI);

router.get('/404', advaitController.advait_404);

router.post('/CPM/cpmimp', advaitController.advait_cpmimp_post);

router.post('/CPM/cpmpns', advaitController.advait_cpmpns_post);

router.post('/NEKI', advaitController.advait_NEKI_post);

router.post('/signup' , advaitController.advait_signup_post);

router.post('/KYC', advaitController.advait_KYC_post);

router.post('/login', advaitController.advait_login_post);

router.post('/logout', advaitController.advait_logout);


router.get('/:id', (req, res) => {
        res.redirect('/404');
});

module.exports = router