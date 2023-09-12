import { Router } from "express"
const router: Router = Router()
import container from "../ioc";
import InterCtrl from "../controllers/interaction.ctrl"

const interCtrl: InterCtrl = container.get("interaction.ctrl");
router.post('/', interCtrl.interactionHandler)

export { router }