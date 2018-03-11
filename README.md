## Welcome to WB web

webber's web project

Fork [矮大紧的日常](https://parksben.github.io)

主要用於介紹個人的作品頁。

## 開發環境

* node.js： v8.9.4 
* react: v16.0.0

## 使用说明

### 1. 啟動

* 指令 `npm start` 啟動開發模式

### 2. 個人頁設定

* `src/siteConfig/site.json` 個人資訊
* `public/manifest.json` 文件（pwa相關屬性）

### 3. 建立文章

* 指令 `npm run new-post` 建立新的文章目錄（在 `src/posts/` 下）
* 編輯你的文章，文章中引用的圖片需放到相同的目錄下
* 指令 `npm run compile` 可隨時打包文章，打包成功可正常瀏覽該文章

### 4. build

* 指令 `npm run build` 建立靜態資源

### 5. 發布 github page

* 指令 `npm run deploy` 會將 build 好的頁面發佈到 master 分支
* 詳情參考 [gh-pages](https://github.com/tschaub/gh-pages) Command Line

### 6. 刪除所有文章

* 指令 `npm run del-post` 刪除舊有文章目錄（在 `src/posts/` 下）



