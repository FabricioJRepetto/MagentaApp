import app from "./src/index.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`\x1b[32m✔ \x1b[0m · Server listening on port ${PORT}`);
});
