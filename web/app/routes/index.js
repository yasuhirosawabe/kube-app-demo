const router = require('express-promise-router')();
const service = require('../components/service');

/* GET home page. */
router.get('/', async (req, res, next) => {
  if (req.query.del) {
    await service.delete(req.query.del);
    res.redirect('/');
    return;
  }
  const customers = await service.gets();
  res.render('index', { hostname: process.env.HOSTNAME, customers });
});

module.exports = router;
