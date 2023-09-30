// import { readdirSync } from "fs";
import path from "node:path";
import { Response, Router } from "express"
const router: Router = Router()
import { router as testRouter } from "./test.routes"
import { router as interRouter } from "./interaction.routes"
import { router as cronRouter } from "./cron.routes";
import { router as userRouter } from "./user.routes";

router.get("/", (__, res: Response) => {
    res.send("Welcome to Magenta productivity app API");
});
router.get('/sensei', (__, res: Response) => {
    res.send('El facusama te bendice.')
})
router.get('/favicon.ico', (__, res: Response) => {
    const PATH = path.resolve(process.cwd() + '/src/assets/icons/icon.ico');
    res.status(200).sendFile(PATH)
})

router.use('/test', testRouter)
router.use('/slack/events', interRouter)
router.use('/api/cron', cronRouter)
router.use('/api/user', userRouter)

export default router

//_-----------------------------------------------------_//

// //? Toma todos los archivos de la carpeta routes, toma su nombre y lo utliza para crear un router
// const PATH_ROUTES = path.resolve(process.cwd() + "/src/infra/routes");

// function removeExtension(fileName: string): string {
//     const cleanFileName = <string>fileName.split(".").shift();
//     return cleanFileName;
// }

// /**
//  *
//  * @param file tracks.ts
//  */
// function loadRouter(file: string): void {
//     const name = removeExtension(file);
//     if (name !== "index") {
//         import(`./${file}`).then((routerModule) => {
//             console.log(`\x1b[32m > route ${name} loaded \x1b[0m`);
//             router.use(`/${name}`, routerModule.router);
//         });
//     }
// }

// readdirSync(PATH_ROUTES).filter((file) => loadRouter(file));
