const asyncHandler = (func) => {
    return async (req, res, next) => {
        try{
            return await func(req, res, next);
        }catch(error) {
            return res.status(500).json({
                message: 'Internal server error',
                error: error.stack
            });
        }
    }
}

export default asyncHandler;