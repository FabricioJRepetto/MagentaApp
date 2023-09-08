import { Router } from "express"
const router = Router()

import { router as testRouter } from "./testRoutes.js"

router.get("/", (__, res) => {
    res.send("Welcome to Magenta productivity app API");
});
router.get('/sensei', (__, res) => {
    res.send('El facusama te bendice.')
})

router.use('/test', testRouter)

export default router