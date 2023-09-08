import { Router } from "express"
const router = Router()
import { test, send } from "../controllers/test.js"

router.get('/', test)
router.post('/', send)

export { router }