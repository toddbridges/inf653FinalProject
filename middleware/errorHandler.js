// removed import logevents

const errorHandler = (err, req, res, next) => {
    // removed logger
    console.error(err.stack)
    res.status(500).send(err.message);
}

module.exports = errorHandler;