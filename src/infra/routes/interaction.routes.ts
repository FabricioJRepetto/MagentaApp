import { Router } from "express"
const router: Router = Router()
import container from "../ioc";
import TestCtrl from "../controllers/test.ctrl"

const testCtrl: TestCtrl = container.get("test.ctrl");
router.post('/', testCtrl.send)

export { router }