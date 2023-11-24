const { getAllEndpoints } = require("../models/endpoints-model")

exports.getEndpoints = (req, res, next) => {
    const endpoints = getAllEndpoints()
    res.status(200).send({ endpoints })
}