# Your Diary

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

![GitHub package.json version](https://img.shields.io/github/package-json/v/zardoy/vk-your-diary?label=App%20Version) [![Build Status](https://travis-ci.com/zardoy/vk-your-diary.svg?branch=master)](https://travis-ci.com/zardoy/vk-your-diary)

## Расширения

Не знаю, можно ли в VSCode создать файл с рекомендуемыми расширениями, но вот что я советую поставить что бы балдеть:

- [TypeScript Import Sorter](https://marketplace.visualstudio.com/items?itemName=mike-co.import-sorter) ставим, заходим в настройки включаем удаление неиспользованных импортов, включаем сохранение на каждом сейве, а также `maximumNumberOfImportExpressionsPerLine.type` ставим на `newLineEachExpressionAfterCountLimit`. Всё! Балдеем от структурированных импортов и отсутствия проблем на CI из-за предупреждений об неиспользованных импортах!
- [Apollo GraphQL](https://marketplace.visualstudio.com/items?itemName=apollographql.vscode-apollo) - Автодополнение и подсветка синтаксиса GraphQL везде после `graphql`. (хотя типы запросов и мутаций генерируются независимо соответствующим NPM скриптом).

## Пути

Весь *основной* исходный код приложения лежит в `src/`, буду далее говорить относительно него.

- В `pages/` и `popups/` находится страницы и [попапы](https://github.com/web-standards-ru/dictionary/blob/master/dictionary.md#popup) соответственно, однако только те, которые **участвуют в маршутизации** приложения.

## Как завести локально

1. Клонируем репо
2. Внутри проекта устанавливаем зависимости (`yarn` или `npm install`)
3. Запускаем приложение через NPM скрипт *start* `yarn start` или `npm start`. Однако учтите, что для полноценного тестирования у вас еще должен быть запущен [локальный сервер](https://github.com/zardoy/api-vk-your-diary).

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
