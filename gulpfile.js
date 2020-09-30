const gulp = require("gulp");
const open = require("open");

gulp.task("start:vk-app", async () => {
    await open(`https://m.vk.com/app${require("./package.json").vk_com_app_id}`)
});