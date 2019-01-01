var express = require('express');
var request = require('request');

var router = express.Router();

router.get('/', function(req, res) {
    request(
        {
            url: `http://localhost:9999/bigdata/sparql`,
            qs: {
                format: 'json',
                query: `PREFIX ns1: <http://example.org/animals/>

                        SELECT
                          ?name ?species ?classLabel
                        WHERE {
                          ?item ns1:name    ?name    ;
                                ns1:species ?species ;
                                ns1:class   ?class.
                            ?class ns1:classLabel ?classLabel
                        }`
            }
        },
        (error, response, body) => {
            if (!error) {
                res.json(JSON.parse(body).results.bindings)
            } else {
                res.json({error : "error"})
            }
        }
    );
});

module.exports = router;
