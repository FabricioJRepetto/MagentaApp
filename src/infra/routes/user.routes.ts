import { Router } from "express"
const router: Router = Router()
import container from "../ioc";
import UserCtrl from "../controllers/user.ctrl"

const userCtrl: UserCtrl = container.get("user.ctrl");
router.get('', userCtrl.getUserData)
router.post('/signin', userCtrl.signin)
router.post('/login', userCtrl.login)
router.get('/autologin', userCtrl.autoLogin)


export { router }