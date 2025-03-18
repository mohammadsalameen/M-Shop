import cors from 'cors'
import connectDB from './DB/connection.js';
import authRouter from './src/modules/auth/auth.router.js'
import categoryRouter from './src/modules/category/category.router.js'
import productRouter from './src/modules/product/product.router.js'
const initApp = async(app, express) =>{
    app.use(express.json());
    app.use(cors());
    connectDB();
    
    app.use('/auth', authRouter);
    app.use('/categories', categoryRouter);
    app.use('/products', productRouter);

    app.get('/', (req, res) =>{
        return res.status(200).json("Welcome ....");
    });
    app.get('*', (req, res) =>{
        return res.status(404).json("page not found");
    });
}
export default initApp;