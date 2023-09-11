import { Router } from "express"
const router: Router = Router()

// import { test, send } from "../controllers/test"
// router.get('/', test)
// router.post('/', send)

import container from "../ioc";
import TestCtrl from "../controllers/test.ctrl"
const testCtrl: TestCtrl = container.get("test.ctrl");

router.get('/', testCtrl.test)
router.post('/', testCtrl.send)

export { router }