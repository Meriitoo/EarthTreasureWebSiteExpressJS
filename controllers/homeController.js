const router = require('express').Router();

const { isAuth } = require('../middlewares/authMiddleware');
const earthTreasureService = require('../services/earthTreasureService');

router.get('/', async (req, res) => {
    const latestPosts = await earthTreasureService.getLatest().lean();

    console.log(req.user)
    res.render('home', { latestPosts });
});

// router.get('/authorize-test', isAuth, (req, res) => {
//     res.send('You are authorized');
// });

module.exports = router;