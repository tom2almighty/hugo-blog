---
title : '给HugoDiary主题添加搜索页面'
date : 2024-08-17T19:02:35+08:00
description: "通过自定义 JS 给 Hugo Diary 主题添加一个搜索页面"
featured_image: ""
tags: ["搜索","Hugo"]
categories: 建站
slug: hugo-diary-search

---

## 前言

`Hugo Diary` 主题没有自带的搜索页面，文章多了后找笔记不方便，因此想给主题添加一个搜索页面，最终耗时一天成功添加。

## 过程

最开始发现一篇文章 [5分钟给Hugo博客增加搜索功能](https://ttys3.dev/blog/hugo-fast-search) 引入 `fuse.js` 文件实现搜索，最终效果是页面出现一个搜索按钮，点击会出现一个搜索框，然后可以搜索内容，呈现符合的文章标题列表，貌似由于主题的模板写法，使用这种方法在桌面端和移动端的 `html` 文件中添加会覆盖上一个引入的模板，并且按钮的位置调整也比较麻烦，因此作罢。

随后在[另一篇文章](https://sobaigu.com/hugo-set-featuer-search.html)中看到可以通过创建搜索模板文件来生成搜索页面，这样也不需要进行大的样式调整，所以使用这种方法，成功后发现这种搜索方法对中文并不生效，不会搜索中文内容，尝试引入结巴分词的 `JS` 库，但是没找到现成的，还老报错，因此再次寻找其他方法。

想到之前使用的 `Stack` 主题有搜索页面，并且中文的搜索也不错，所以尝试将其中的 `TypeScript` 代码转换成 `js` 后引入，最终成功，接下来记录一下详细的步骤。

{{< notice notice-info >}}

文中所使用的站点结构以及部分 `SCSS` 样式变量仅适用于 Diary 主题，如果要引入其他主题记得更改

{{< /notice >}}

## 步骤

### 配置文件

首先在配置文件 `config.yaml` 中添加输出数据代码：

```yaml
[outputs]
  home = ["HTML", "RSS", "JSON"]
```

顺带添加一个菜单子页面：

```yaml
[[menu.main]]
url = "/search"
name = "🔍 搜索"
weight = 6
```

然后在 `~/content/` 文件夹新建 `search.md` 文件，`Front Matter` 填写如下：

```yaml
---
title: "搜索"
layout: "search"
---
```

### 创建数据索引文件

在 `~/layouts/_default/` 文件夹下新建 `index.json` 文件，写入内容，字典内的索引变量可以自定义。

```json
{{- $.Scratch.Add "index" slice -}}
{{- range .Site.RegularPages -}}
    {{- $.Scratch.Add "index" (dict "title" .Title "tags" .Params.tags "categories" .Params.categories "content" .Plain "permalink" .Permalink "date" .Date "section" .Section ) -}}
{{- end -}}
{{- $.Scratch.Get "index" | jsonify -}}
```

完成后可以通过 `http://localhost:1313/index.json` 查看是否成功生成数据，以及是否有想要的字段。

### 创建 JS 文件

在 `~/static/js` 文件夹下新建 `search.js` 文件，写入搜索代码：

```js
/**
 * Escape HTML tags as HTML entities
 * Edited from:
 * @link https://stackoverflow.com/a/5499821
 */
const tagsToReplace = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '…': '&hellip;'
};
function replaceTag(tag) {
  return tagsToReplace[tag] || tag;
}
function replaceHTMLEnt(str) {
  return str.replace(/[&<>"]/g, replaceTag);
}
function escapeRegExp(string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
}

function Search({ form, input, list, resultTitle, resultTitleTemplate }) {
  this.form = form;
  this.input = input;
  this.list = list;
  this.resultTitle = resultTitle;
  this.resultTitleTemplate = resultTitleTemplate;
  this.data = null; // 用于缓存获取的数据
  this.handleQueryString();
  this.bindQueryStringChange();
  this.bindSearchForm();
}

/**
* Processes search matches
* @param str original text
* @param matches array of matches
* @param ellipsis whether to add ellipsis to the end of each match
* @param charLimit max length of preview string
* @param offset how many characters before and after the match to include in preview
* @returns preview string
*/
Search.processMatches = function (str, matches, ellipsis = true, charLimit = 140, offset = 20) {
  matches.sort((a, b) => {
      return a.start - b.start;
  });
  let i = 0, lastIndex = 0, charCount = 0;
  const resultArray = [];
  while (i < matches.length) {
      const item = matches[i];
      if (ellipsis && item.start - offset > lastIndex) {
          resultArray.push(`${replaceHTMLEnt(str.substring(lastIndex, lastIndex + offset))} [...] `);
          resultArray.push(`${replaceHTMLEnt(str.substring(item.start - offset, item.start))}`);
          charCount += offset * 2;
      } else {
          resultArray.push(replaceHTMLEnt(str.substring(lastIndex, item.start)));
          charCount += item.start - lastIndex;
      }
      let j = i + 1, end = item.end;
      while (j < matches.length && matches[j].start <= end) {
          end = Math.max(matches[j].end, end);
          ++j;
      }
      resultArray.push(`<mark>${replaceHTMLEnt(str.substring(item.start, end))}</mark>`);
      charCount += end - item.start;
      i = j;
      lastIndex = end;
      if (ellipsis && charCount > charLimit) break;
  }
  if (lastIndex < str.length) {
      let end = str.length;
      if (ellipsis) end = Math.min(end, lastIndex + offset);
      resultArray.push(`${replaceHTMLEnt(str.substring(lastIndex, end))}`);
      if (ellipsis && end !== str.length) {
          resultArray.push(` [...]`);
      }
  }
  return resultArray.join('');
};

Search.prototype.searchKeywords = async function (keywords) {
  const rawData = await this.getData();
  const results = [];
  const regex = new RegExp(keywords.filter((v, index, arr) => {
      arr[index] = escapeRegExp(v);
      return v.trim() !== '';
  }).join('|'), 'gi');
  for (const item of rawData) {
      const titleMatches = [], contentMatches = [];
      let result = Object.assign({}, item, { preview: '', matchCount: 0 });
      const contentMatchAll = item.content.matchAll(regex);
      for (const match of Array.from(contentMatchAll)) {
          contentMatches.push({
              start: match.index,
              end: match.index + match[0].length
          });
      }
      const titleMatchAll = item.title.matchAll(regex);
      for (const match of Array.from(titleMatchAll)) {
          titleMatches.push({
              start: match.index,
              end: match.index + match[0].length
          });
      }
      if (titleMatches.length > 0) {
          result.title = Search.processMatches(result.title, titleMatches, false);
      }
      if (contentMatches.length > 0) {
          result.preview = Search.processMatches(result.content, contentMatches);
      } else {
          result.preview = replaceHTMLEnt(result.content.substring(0, 140));
      }
      result.matchCount = titleMatches.length + contentMatches.length;
      if (result.matchCount > 0) results.push(result);
  }
  return results.sort((a, b) => b.matchCount - a.matchCount);
};

Search.prototype.doSearch = async function (keywords) {
  const startTime = performance.now();
  const results = await this.searchKeywords(keywords);
  this.clear();
  for (const item of results) {
      this.list.appendChild(Search.render(item));
  }
  const endTime = performance.now();
  this.resultTitle.innerText = this.generateResultTitle(results.length, ((endTime - startTime) / 1000).toPrecision(1));
};

Search.prototype.generateResultTitle = function (resultLen, time) {
  return this.resultTitleTemplate.replace("#PAGES_COUNT", resultLen).replace("#TIME_SECONDS", time);
};

Search.prototype.getData = async function () {
  if (!this.data) {
      const jsonURL = this.form.dataset.json;
      this.data = await fetch(jsonURL).then(res => res.json());
      const parser = new DOMParser();
      for (const item of this.data) {
          item.content = parser.parseFromString(item.content, 'text/html').body.innerText;
      }
  }
  return this.data;
};

Search.prototype.bindSearchForm = function () {
  let lastSearch = '';
  const eventHandler = (e) => {
      e.preventDefault();
      const keywords = this.input.value.trim();
      Search.updateQueryString(keywords, true);
      if (keywords === '') {
          lastSearch = '';
          return this.clear();
      }
      if (lastSearch === keywords) return;
      lastSearch = keywords;
      this.doSearch(keywords.split(' '));
  };
  this.input.addEventListener('input', eventHandler);
  this.input.addEventListener('compositionend', eventHandler);
};

Search.prototype.clear = function () {
  this.list.innerHTML = '';
  this.resultTitle.innerText = '';
};

Search.prototype.bindQueryStringChange = function () {
  window.addEventListener('popstate', () => {
      this.handleQueryString();
  });
};

Search.prototype.handleQueryString = function () {
  const pageURL = new URL(window.location.toString());
  const keywords = pageURL.searchParams.get('keyword');
  this.input.value = keywords;
  if (keywords) {
      this.doSearch(keywords.split(' '));
  } else {
      this.clear();
  }
};

Search.updateQueryString = function (keywords, replaceState = false) {
  const pageURL = new URL(window.location.toString());
  if (keywords === '') {
      pageURL.searchParams.delete('keyword');
  } else {
      pageURL.searchParams.set('keyword', keywords);
  }
  if (replaceState) {
      window.history.replaceState('', '', pageURL.toString());
  } else {
      window.history.pushState('', '', pageURL.toString());
  }
};

Search.render = function (item) {
  const article = document.createElement("article");

  const link = document.createElement("a");
  link.href = item.permalink;

  const detailsDiv = document.createElement("div");
  detailsDiv.className = "article-details";

  const title = document.createElement("h2");
  title.className = "article-title";
  title.innerHTML = item.title;
  detailsDiv.appendChild(title);

  const preview = document.createElement("section");
  preview.className = "article-preview";
  preview.innerHTML = item.preview;
  detailsDiv.appendChild(preview);

  link.appendChild(detailsDiv);

  article.appendChild(link);

  return article;
};


window.addEventListener('load', () => {
  setTimeout(() => {
      const searchForm = document.querySelector('.search-form');
      const searchInput = searchForm.querySelector('input');
      const searchResultList = document.querySelector('.search-result--list');
      const searchResultTitle = document.querySelector('.search-result--title');
      
      new Search({
          form: searchForm,
          input: searchInput,
          list: searchResultList,
          resultTitle: searchResultTitle,
          resultTitleTemplate: window.searchResultTitleTemplate
      });
  }, 0);
});
```

{{< notice notice-tip >}}

此搜索代码使用 `ChatGPT` 将 [Hugo Stack](https://github.com/CaiJimmy/hugo-theme-stack/blob/master/assets/ts/search.tsx) 主题的 `search.tsx` 文件转换成 `js` 文件，并将其中的 `React` 及模块化相关代码使用原生实现，去除了封面图片相关代码。

{{< /notice >}}

### 创建模板文件

新建 `~/layouts/_default/search.html` 模板文件，填入内容：

```html
{{ define "main" }}

<div class="post-list-container post-list-container-shadow">
  <a class="a-block">
    <div class="post-item-wrapper post-item-wrapper-no-hover">
      <div class="post-item post-item-no-gaps">
        <div class="post-item-info-wrapper">
          <div class="post-item-title post-item-title-small">
            {{.Title}}
          </div>
        </div>
      </div>
    </div>
  </a>
<!-- 搜索表单组件 -->
<form class="search-form" data-json="/index.json">
    <input type="text" placeholder="Search..." aria-label="Search" />
</form>
<div class="search-result--title">Results</div>
<ul class="search-result--list">
    <article>
        <a href="your-link">
            <div class="article-details">
                <h2 class="article-title"><a href="your-link">Article Title</a></h2>
                <section class="article-preview">This is a preview of the content with <mark>highlighted</mark> text.</section>
            </div>
        </a>
    </article>
</ul>


<script src="{{ "js/search.js" | relURL }}"></script>
<script>
    window.searchResultTitleTemplate = 'Found #PAGES_COUNT results in #TIME_SECONDS seconds';
</script>

{{ end }}
```

> **注意**：总体的布局是 `Diary` 主题，如果是其他主题请使用相应的模板。

### 样式修改

在 `~/assets/scss/custom.scss` 中写入搜索框及搜索内容的样式：

```scss
// 搜索页面样式
input{
  width: 100%;
  height: 40px;
  border-radius: 6px;
  border: 2px solid lighten($color-accent, 10%);
  background: #f5f5f5;
  body.night & {
    background: #333;
    border-color: 2px solid darken($color-accent, 10%);
    color: #e6e6e6;
  }
}
.search-result--title {
  font-size: 1.25rem;
  margin: 16px;
  color: #555;
  body.night & {
    color: #e6e6e6;
  }
}
// 样式用于搜索结果的整体容器
.search-result--list {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

// 样式用于每个搜索结果的文章
.search-result--list article {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 16px;
  border-bottom: 1px solid #ddd;
  transition: background-color 0.3s ease;
  mark{
    background-color: lighten($color-accent, 20%);
    color: #fff;
  }
  &:hover {
    background-color: #f9f9f9;
  }
}

// 样式用于文章的标题
.article-title {
  font-size: 1.5rem;
  margin: 0;
  color: #333;
  font-weight: bold;
  transition: color 0.3s ease;

  a {
    text-decoration: none;
    color: inherit;

    &:hover {
      color: #007bff;
    }
  }
}

// 样式用于文章预览部分
.article-preview {
  font-size: 1rem;
  color: #666;
  margin-top: 8px;
  line-height: 1.5;
  body.night & {
    color: #e6e6e6;
  }

  mark {
    background-color: lighten($color-accent, 20%);
    color: #333;
    font-weight: bold;
  }
}


// 样式用于文章的详细信息部分
.article-details {
  flex: 1;
}

// 样式用于搜索结果标题
.search-result--title {
  font-size: 1.25rem;
  margin-bottom: 16px;
  color: #555;
}
```

同样，代码中 `$color-accent` 以及 `body.night` 相关代码是 `Diary` 主题独有，其他主题需修改。

至此搜索页面的添加就结束了。

## 参考

- [Hugo Stack](https://github.com/CaiJimmy/hugo-theme-stack)
- [5分钟给Hugo博客增加搜索功能](https://ttys3.dev/blog/hugo-fast-search)

- [给hugo添加搜索功能](https://sobaigu.com/hugo-set-featuer-search.html)
