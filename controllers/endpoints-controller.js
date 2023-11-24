const { getAllEndpoints } = require("../models/endpoints-model")

exports.getEndpoints = (req, res, next) => {
    console.log('hello from endpoints controller')
    const endpoints = getAllEndpoints()
    res.status(200).send({ endpoints })
}