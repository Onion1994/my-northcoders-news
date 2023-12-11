const { selectAllUsers, selectUserByUsername } = require("../models/users-model")

exports.getUsers = (req, res, next) => {
    const { username } = req.params
    if (username) {
        selectUserByUsername(username)
        .then((user) => {
            res.status(200).send({ user })
        })
        .catch((err) => {
            next(err)
        })

    } else {
        selectAllUsers()
        .then((users) => {
            res.status(200).send({ users })
    })
}
}