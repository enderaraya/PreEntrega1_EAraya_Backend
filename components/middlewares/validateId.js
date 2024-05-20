export const idValidation = (req, res, next) => {
    if (req.body.productId && req.body.productId !== req.params.productId) {
        res.status(404).json({ msg: 'Product cannot change ID' });
    } else {
        next();
    }
}
