const router = require('express').Router();

const { isAuth, isGuest } = require('../middlewares/authMiddleware');
const earthTreasureService = require('../services/earthTreasureService');
const { getErrorMessage } = require('../utils/errorUtils');


router.get('/create', isAuth, (req, res) => {
    res.render('earth-treasure/create');
});


router.post('/create', isAuth, async (req, res) => {
    const treasureData = req.body;
    
    try {
        await earthTreasureService.create(req.user._id, treasureData);
    } catch (error) {
        return res.status(400).render('earth-treasure/create', { ...treasureData, error: getErrorMessage(error), treasureData: treasureData });

    }

    res.redirect('/earth-treasure/dashboard');
});


router.get('/dashboard', async (req, res) => {
    const treasure = await earthTreasureService.getAll();

    res.render('earth-treasure/dashboard', { treasure });
    // res.render('earth-treasure/dashboard', { treasure: []}); //for testin if no courses
});


router.get('/:treasureId/details', async (req, res) => {
    const treasure = await earthTreasureService.getOne(req.params.treasureId);

    const isOwner = treasure.owner == req.user?._id;

    const isLiked = treasure.likedList?.some(user => user._id == req.user?._id);

    res.render('earth-treasure/details', { ...treasure, isOwner, isLiked });
});

router.get('/:treasureId/like', isAuth, async (req, res) => {
    try {
        await earthTreasureService.like(req.user._id, req.params.treasureId);
    } catch (error) {
        return res.status(400).render('404', { error: getErrorMessage(error) });
    }

    res.redirect(`/earth-treasure/${req.params.treasureId}/details`);
});

router.get('/:treasureId/edit', isAuth, isTreasureOwner, async (req, res) => {
    const treasure = await earthTreasureService.getOne(req.params.treasureId);

    res.render('earth-treasure/edit', { ...treasure });
});


router.post('/:treasureId/edit', isAuth, isTreasureOwner, async (req, res) => {
    const treasureData = req.body;

    try {
        await earthTreasureService.edit(req.params.treasureId, treasureData);
        res.redirect(`/earth-treasure/${req.params.treasureId}/details`);

    } catch (error) {
        return res.render('earth-treasure/edit', { ...treasureData, error: getErrorMessage(error) });
    };

});

router.get('/:treasureId/delete', isAuth, isTreasureOwner, async (req, res) => {

    await earthTreasureService.delete(req.params.treasureId);
    res.redirect('/earth-treasure/dashboard')
});


async function isTreasureOwner(req, res, next) {
    const treasure = await earthTreasureService.getOne(req.params.treasureId);

    if (treasure.owner != req.user?._id) {
        return res.redirect(`/earth-treasure/${req.params.treasureId}/details`);
    }

    next();
}

router.get('/search', async (req, res) => {
    const { name } = req.query;
    const treasure = await earthTreasureService.search(name);
 
    res.render('earth-treasure/search', { treasure, name });
 });

module.exports = router;