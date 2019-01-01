var express = require('express');
var request = require('request');

var router = express.Router();

router.get('/:species', function(req, res) {
    request(
        {
            url: `http://localhost:9999/bigdata/sparql`,
            qs: {
                format: 'json',
                query: `PREFIX ns1: <http://example.org/animals/>

                        SELECT
                          ?name ?overview
                        WHERE {
                          ?item ns1:species  "${req.params.species}" ;
                                ns1:name     ?name                   ;
                                ns1:overview ?overview               ;
                        }`
            }
        },
        (errorRagunan, responseRagunan, bodyRagunan) => {
            if (!errorRagunan) {
                var parsedBodyRagunan = JSON.parse(bodyRagunan);

                var nameRagunan = parsedBodyRagunan.results.bindings[0].name.value;
                var overviewRagunan = parsedBodyRagunan.results.bindings[0].overview.value;

                request(
                    {
                        url: 'https://query.wikidata.org/sparql',
                        qs: {
                            format: 'json',
                            query: `SELECT
                                      ?item ?itemLabel ?image ?gestationPeriod ?conservationStatusLabel
                                    WHERE {
                                      ?item wdt:P225  "${req.params.species}" ;
                                            wdt:P18   ?image                  .
                                        OPTIONAL {?item wdt:P3063 ?gestationPeriod;
                                                        wdt:P141  ?conservationStatus}.
                                            SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
                                     }`
                        }
                    }, (errorWikidata, responseWikidata, bodyWikidata) => {
                        if (!errorWikidata) {
                            var parsedBodyWikidata = JSON.parse(bodyWikidata);
                            var bindingsWikidata = parsedBodyWikidata.results.bindings;

                            if (bindingsWikidata.length > 0) {
                                var nameWikidata = bindingsWikidata[0].itemLabel.value;
                                var imageWikidata = bindingsWikidata[0].image.value;
                                var gestationPeriodWikidata = bindingsWikidata[0].gestationPeriod == null ? '-' : bindingsWikidata[0].gestationPeriod.value;
                                var conservationStatusWikidata = bindingsWikidata[0].conservationStatusLabel == null ? '-' : bindingsWikidata[0].conservationStatusLabel.value;

                                res.json(
                                    {
                                        speciesRagunan: req.params.species,
                                        nameRagunan: nameRagunan,
                                        overviewRagunan: overviewRagunan,
                                        nameWikidata: nameWikidata,
                                        imageWikidata: imageWikidata,
                                        gestationPeriodWikidata: gestationPeriodWikidata,
                                        conservationStatusWikidata: conservationStatusWikidata
                                    }
                                );
                            } else {
                                res.json(
                                    {
                                        species: req.params.species,
                                        nameRagunan: nameRagunan,
                                        overviewRagunan: overviewRagunan,
                                        nameWikidata: '-',
                                        imageWikidata: '',
                                        gestationPeriodWikidata: '-',
                                        conservationStatusWikidata: '-'
                                    }
                                );
                            }
                        } else {
                            res.json({ error: error });
                        }
                    });
            } else {
                res.json({ error: error });
            }
        }
    );
});

module.exports = router;
