import { readdirSync } from "fs";
import path from "node:path";
import { Response, Router } from "express"
const router: Router = Router()
// import { router as testRouter } from "./test.routes"

router.get("/", (__, res: Response) => {
    res.send("Welcome to Magenta productivity app API");
});
router.get('/sensei', (__, res: Response) => {
    res.send('El facusama te bendice.')
})

// router.use('/test', testRouter)

//? Toma todos los archivos de la carpeta routes, toma su nombre y lo utliza para crear un router
const PATH_ROUTES = path.resolve(process.cwd() + "/src/infra/routes");

function removeExtension(fileName: string): string {
    const cleanFileName = <string>fileName.split(".").shift();
    return cleanFileName;
}

/**
 *
 * @param file tracks.ts
 */
function loadRouter(file: string): void {
    const name = removeExtension(file);
    if (name !== "index") {
        import(`./${file}`).then((routerModule) => {
            console.log(`\x1b[32m > route ${name} loaded \x1b[0m`);
            router.use(`/${name}`, routerModule.router);
        });
    }
}

readdirSync(PATH_ROUTES).filter((file) => loadRouter(file));

export default router