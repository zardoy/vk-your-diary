# Your Diary

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Расширения

Не знаю, можно ли в VSCode создать файл с рекомендуемыми расширениями, но вот что я советую поставить что бы балдеть:

- [TypeScript Import Sorter](https://marketplace.visualstudio.com/items?itemName=mike-co.import-sorter) ставим, заходим в настройки включаем удаление неиспользованных импортов, включаем сохранение на каждом сейве, а также `maximumNumberOfImportExpressionsPerLine.type` ставим на `newLineEachExpressionAfterCountLimit`. Всё! Балдеем от структурированных импортов и отсутствия проблем на CI из-за предупреждений об неиспользованных импортах!
- [Apollo GraphQL](https://marketplace.visualstudio.com/items?itemName=apollographql.vscode-apollo) - Автодополнение и подсветка синтаксиса GraphQL везде после `graphql`. (хотя типы запросов и мутаций генерируются независимо соответствующим NPM скриптом).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
