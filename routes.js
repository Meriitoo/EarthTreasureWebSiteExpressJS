const router = require('express').Router();

const homeController = require('./controllers/homeController');
const authController = require('./controllers/authController');
const earthTreasureController = require('./controllers/earthTreasureController');

router.use(homeController);
router.use('/auth', authController);
router.use('/earth-treasure', earthTreasureController);

router.all('*', (req, res) => {
    res.render('home/404');
});

module.exports = router;