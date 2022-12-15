const express = require('express');
const fs = require('fs');

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

//Secret Key
const secret = '492d5346-c337-4a15-9445-6e742a0071f7';

//Load Pricing Data
const rawData = fs.readFileSync('pricing.json'); 
let pricingInfo = JSON.parse(rawData); 

app.post('/pricing', function(req, res) {
    console.log('paylod: ' + req.body);
    const requestData = JSON.stringify(req.body);
    console.log('requestData: ' + req.body.productIds);
    console.log('isArray: ' + Array.isArray(req.body.productIds));

    let token = req.headers['authorization']; 
    // Remove Bearer from string
    token = token.replace(/^Bearer\s+/, "");  

    if (!token || token !== secret) {
        return res.json({
            success: false,
            message: 'Token not provided or invalid'
        });
    };

    let productIds = req.body.productIds;
    let prices = [];
    productIds.forEach(productId => {
        let foundMatch = false; 
        pricingInfo.forEach(pricingEntry => {
            console.log('productId: ' + productId);
            console.log('pricingEntry: ' + JSON.stringify(pricingEntry)); 
            if (productId === pricingEntry.productId) {
                prices.push({ "productId" : productId , "price" : pricingEntry.price });    
                foundMatch = true;
            }    
        })
        //If no match found, set default price of 100 
        /*
        if (!foundMatch) {
            prices.push({ "productId" : productId, "price" : 100 });  
        }
        */
    });
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ "prices": prices }));
    //res.end(200, 'Success'); 
    
});

app.listen(process.env.PORT || 3000);
 

