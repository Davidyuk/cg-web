# Веб версия приложения Кампус Гид

## Требуемое ПО

  - [Node.js](http://nodejs.org), [Gulp](http://gulpjs.com) и [Bower](http://bower.io)
  - [Ruby](http://ruby-lang.org) и [Bundler](http://bundler.io)

## Установка

Нужно скопировать `server.js.template` в `server.js` с указанием актуальных параметров доступа 
 [серверу API](http://gitlab.vl.ru/dvfu/cg-api).

Выполнить:

```bash
npm install
bower install
bundle install

npm run build
```
