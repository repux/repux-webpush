import { Router, Request, Response } from 'express';
const config = require('./../../package.json');

const router: Router = Router();

router.get('/', (request: Request, response: Response) => {
    response.send(`version: ${config.version}`);
});

export const IndexController: Router = router;