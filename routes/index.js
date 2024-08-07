var express = require('express');
var router = express.Router();

const app = express();

const { swaggerUi, swaggerSpec } = require("../swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = router;
