const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const moment = require('moment');
const postSample = require('./postSample.json');

const questions = [
  {
    type: 'input',
    name: 'post_name',
    message: '請輸入文章名稱（用於建立文章目錄，限制英文，單詞間用‘-’連接）：',
    validate: value => {
      if (/(\.|\*|\?|\\|\/)/gi.test(value)) {
        return '文章名稱不得包含特殊符号（.*?\\/），請重新輸入↑↑';
      }

      if (/(([A-z]+-)+)?[A-z]+/gi.test(value)) {
        return true;
      }

      return '文章别名不合法，請重新輸入↑↑';
    },
    filter: value => value.replace(/\s+/gi, '-'),
  },
  {
    type: 'input',
    name: 'create_at',
    message: '請輸入文章的發佈時間 (或者按 Enter 使用默認值）：',
    default: () => {
      return moment().format('YYYY-MM-DDThh:mm:ss');
    },
    validate: value => {
      if (/\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d/gi.test(value)) {
        return true;
      }

      return '時間格式不合法，請重新輸入↑↑';
    },
  },
];

inquirer
  .prompt(questions)
  .then(answers => {
    const { post_name, create_at } = answers;
    const postDirName = `src/posts/${create_at}_${post_name}/`;

    if (fs.existsSync(path.resolve(postDirName))) {
      console.log('文章已存在，請直接編輯！');
    } else {
      // 創建文章目錄
      fs.mkdirSync(path.resolve(postDirName));
      // 寫入md
      fs.writeFileSync(
        path.resolve(`${postDirName}article.md`),
        postSample.md,
        'utf-8'
      );
      // 寫入縮圖（thumb.jpg）
      const base64Data = postSample.thumb.replace(
        /data:image\/\w+;base64,/i,
        ''
      );
      const dataBuffer = new Buffer(base64Data, 'base64');
      fs.writeFileSync(path.resolve(`${postDirName}thumb.jpg`), dataBuffer);

      console.log(
        `\n文章目錄：\`${postDirName}\` 已創建，您可以愉快地編輯文章了！\n編輯完成後請使用 \`npm run compile\` 命令建構文章（自動建構功能正在努力開發中...）`
      );
    }
  })
  .catch(err => {
    console.log(err);
    console.log('文章目錄創建失敗了...');
  });
