import express from 'express';
import { routes } from './routes';
import compress from 'compression';
import helmet from 'helmet';
import mongoose from 'mongoose';
//import {fillInDb} from './script/fill-in-db'

export const setUpServer = async () => {
    return await startExpress(await connectDB())
    
}

export const connectDB = async() => {
    try {
        var con = await mongoose.connect('mongodb://localhost:27017/test');
        console.log("MongoDB Connected...");
        return con
    } catch (error) {
        console.error('catch', error);
        process.exit(1);
    }
}

export const startExpress = async (mongoConnection) => {
    //fillInDb()
    let app: express.Express = express();
    const port = 8000;
    
    app.use(express.json());
    app.use(express.urlencoded({
      extended: true
    }));
    
    app.use(compress());
    app.use(helmet());
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS, PUT, HEAD");
        res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
        next();
    });
    app.use(routes);
    
    app.get('/', (req, res) => {
        res.end();
    });

    let server = app.listen(port, () => {
      return console.log(`server is listening on ${port}`);
    }).on('error', (err: any) => {
        if (err) {
            return console.error('Error : ', err);
        }
    });
    server.on('close', (err: any) => {
        mongoConnection.disconnect()
    });

    return server
}
