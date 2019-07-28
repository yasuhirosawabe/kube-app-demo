const router = require('express-promise-router')();
const service = require('../components/service');

/* GET home page. */
router.get('/', async (_req, res, _next) => {
  res.render('register', { hostname: process.env.HOSTNAME });
});

router.post('/', async (req, res, _next) => {
  if (!req.body.name || !req.body.age) {
    res.render('register', { hostname: process.env.HOSTNAME, notRegisterd: true });
    return;
  }
  await service.add({ name: req.body.name, age: req.body.age });
  res.render('register', { hostname: process.env.HOSTNAME, registerd: { name: req.body.name, age: req.body.age } });
});

module.exports = router;
