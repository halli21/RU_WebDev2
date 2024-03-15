const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const cors = require('cors');
const bubbleService = require('./services/bubbleService');
var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require('./swagger.json');

app.use(bodyParser.json());
app.use(cors());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));

const PORT = 3500;
/*
    All orders that reside within the system are in this collection.
    If the server is shutdown, this collection will be initalized to an empty collection
*/
let orders = {

};

const checkExistence = (elems, res) => {
    return elems.length > 0 ? res.json(elems[0]) : res.status(404).send('Not found');
};

router.get('/bubbles', (req, res) => {
    return res.json(bubbleService.getProducts());
});

router.get('/bubbles/:bubbleId', (req, res) => {
    const { bubbleId } = req.params;
    const product = bubbleService.getProducts(p => p.id == bubbleId);
    return checkExistence(product, res);
});

router.get('/bundles', (req, res) => {
    return res.json(bubbleService.getBundles());
});

router.get('/bundles/:bundleId', (req, res) => {
    const { bundleId } = req.params;
    const bundle = bubbleService.getBundles(b => b.id == bundleId);
    return checkExistence(bundle, res);
});

router.get('/orders/:telephone', (req, res) => {
    const { telephone } = req.params;
    return orders.hasOwnProperty(telephone) ? res.json(orders[telephone]) : res.status(404).send(`No orders are found for ${telephone}`);
});

router.post('/orders/:telephone', (req, res) => {
    const { telephone } = req.params;
    const order = req.body;
    orders.hasOwnProperty(telephone) ? orders[telephone].push(order) : orders[telephone] = [order];
    return res.send(`Order for ${telephone} was successfully issued!`);
});

app.use('/api', router);

app.listen(process.env.PORT || PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});
