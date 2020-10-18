const gulp = require("gulp");
const open = require("open");
const fs = require("fs");
const findRemoveSync = require("find-remove");

gulp.task("start:vk-app", async () => {
    await open(`https://m.vk.com/app${require("./package.json").vk_com_app_id}`)
});

gulp.task("codegen:clear", async () => {
    if (fs.existsSync("__generated__")) await fs.promises.rmdir("__generated__");
    findRemoveSync("src", { dir: "__generated__" });
})