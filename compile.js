// const fs = require('fs');
const fs = require('fs-extra');
const path = require('path');
const sortBy = require('lodash').sortBy;

const allPost = fs
  .readdirSync(path.resolve('src/posts/'))
  .filter(d => /^\d{4}-/gi.test(d));

const postData = allPost.map(p => {
  const article = fs.readFileSync(
    path.resolve(`src/posts/${p}/article.md`),
    'utf-8'
  );
  const titleHandler = /標題(:|：).+\n/gi.exec(article);
  const tagHandler = /標籤(:|：).+\n/gi.exec(article);
  const contentHandler = article.split(/={3}\n/gi);

  const title = titleHandler.length
    ? titleHandler[0].replace(/(標題(:|：)\s*|\n)/gi, '')
    : '';
  const tag = tagHandler.length
    ? tagHandler[0].replace(/(標籤(:|：)\s*|\n)/gi, '').split(/,\s?/gi)
    : '';
  const time = p.split('_')[0].replace('T', ' ');
  let content = contentHandler.length
    ? contentHandler[contentHandler.length - 1].replace('\n', '')
    : '';

  // 拷貝文章中的圖片到 public 目錄下
  const imgPatt = /\!\[[^\]]*?\]\(([^\)]*?)\)/gi;
  const imgMatches = content.match(imgPatt);
  if (imgMatches) {
    imgMatches.forEach(imgMark => {
      if (!imgMark.includes('http')) {
        const imgPath = imgMark.replace(imgPatt, '$1');
        content = content.replace(
          imgPath,
          path.join(`/contents/${p}/`, imgPath)
        );

        fs.ensureDirSync(path.resolve(`public/contents/${p}/`));
        fs.copySync(
          path.resolve(`src/posts/${p}/`, imgPath),
          path.resolve(`public/contents/${p}/`, imgPath)
        );
      }
    });
  }

  // 拷貝文章缩圖到 public 目錄下
  fs.ensureDirSync(path.resolve(`public/contents/${p}/`));
  fs.copySync(
    path.resolve(`src/posts/${p}/`, 'thumb.jpg'),
    path.resolve(`public/contents/${p}/`, 'thumb.jpg')
  );

  return {
    title,
    tag,
    time,
    url: `/post/${p}`,
    thumb: `/contents/${p}/thumb.jpg`,
    content,
  };
});

fs.writeFileSync(
  path.join(path.resolve('public/'), 'data.json'),
  JSON.stringify(postData),
  'utf-8'
);

const getTagInfo = () => {
  const tagList = [];
  postData.forEach(p => {
    p.tag.forEach(t => {
      if (!tagList.find(o => o.tag === t)) {
        tagList.push({
          tag: t,
          count: 1,
        });
      } else {
        const tagIdx = tagList.findIndex(o => o.tag === t);
        tagList[tagIdx].count += 1;
      }
    });
  });

  return sortBy(tagList, o => -o.count);
};
const postInfo = {
  postCount: postData.length,
  tagInfo: getTagInfo(),
};

fs.writeFileSync(
  path.join(path.resolve('public/'), 'stat.json'),
  JSON.stringify(postInfo),
  'utf-8'
);

console.log('文章打包完畢...');
