import { Router } from "express"
const router: Router = Router()
import container from "../ioc";
import CronCtrl from "../controllers/cron.ctrl"

const cronCtrl: CronCtrl = container.get("cron.ctrl");
router.get('/', cronCtrl.handler)

export { router }