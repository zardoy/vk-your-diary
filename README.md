<div align="center">
    <h1>Your Diary</h1>
    <img src="https://img.shields.io/github/package-json/v/zardoy/vk-your-diary?label=App%20Version" />
    <img src="https://img.shields.io/maintenance/yes/2020" />
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen" />
    <a href="https://travis-ci.com/zardoy/vk-your-diary">
        <img src="https://travis-ci.com/zardoy/vk-your-diary.svg?branch=master" />
    </a>
</div>

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Репо содержит фронтенд, а также бекенд в 📁 backend. Возможно, в будущем он будет перенесен.

## Расширения

Не знаю, можно ли в VSCode создать файл с рекомендуемыми расширениями, но вот что я советую поставить что бы балдеть:

- [TypeScript Import Sorter](https://marketplace.visualstudio.com/items?itemName=mike-co.import-sorter) ставим, заходим в настройки включаем удаление неиспользованных импортов, включаем сохранение на каждом сейве, а также `maximumNumberOfImportExpressionsPerLine.type` ставим на `newLineEachExpressionAfterCountLimit`. Всё! Балдеем от структурированных импортов и отсутствия проблем на CI из-за предупреждений об неиспользованных импортах!
- [Apollo GraphQL](https://marketplace.visualstudio.com/items?itemName=apollographql.vscode-apollo) - Автодополнение и подсветка синтаксиса GraphQL везде после `gql`. (хотя TypeScript типы запросов и мутаций генерируются независимым NPM скриптом).

<!-- ## Пути

Весь *основной* исходный код приложения лежит в `src/`, буду далее говорить относительно него.

- В `pages/` и `popups/` находится страницы и [попапы](https://github.com/web-standards-ru/dictionary/blob/master/dictionary.md#popup) соответственно, однако только те, которые **участвуют в маршутизации** приложения. -->

## Как завести локально

1. Ставим зависимости (пишем `yarn` или `npm install`)
2. [См. как завести бекенд](backend/README.MD#Как%20завести)
3. В VScode просто прожимаем `CMD`(`CTRL`) + `SHIFT` + `B` для запуска build-task'а (хотя, на самом деле он ничего не строит). Это запустит локально приложение и сервер из 📁 backend для полноценного тестирования в двух отдельные терминалах.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
