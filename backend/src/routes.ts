import express from 'express'
const routes = express.Router();


// ControllerP
import InsidentController from './controllers/InsidentsController'
import CasesController from './controllers/CasesController'
// 
const insidentController = new InsidentController();
const casesController = new CasesController();
//Routes
routes.get('/insidents', insidentController.index)
routes.post('/insidents', insidentController.create)
routes.get('/insidents/:id',insidentController.show)

routes.get('/cases', casesController.index);





export default  routes;