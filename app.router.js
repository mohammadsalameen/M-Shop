import cors from 'cors'
const initApp = async(app, express) =>{
    app.use(express.json());
    app.use(cors());
    app.get('/', (req, res) =>{
        return res.status(200).json("Welcome ....");
    });
    app.get('*', (req, res) =>{
        return res.status(404).json("page not found");
    })
}
export default initApp;