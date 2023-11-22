exports.handlePsqlErrors = (err, req, res, next) => {
    if (err.code === '23502' || err.code === "22P02") {
        res.status(400).send({ msg: "Bad Request" })
    } else if (err.code === "23503") {
        res.status(404).send({ msg: "Not Found"})
    } else {
        next(err)
    }
}

exports.handleCustomErrors = (err, req, res, next) => {
    console.log(err.status)
    if (err.status) {
        console.log(err)
        res.status(err.status).send({ msg: err.msg })
    } else {
        next(err)
    }
}

exports.handleServerErrors = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Internal Server Error' });
  };