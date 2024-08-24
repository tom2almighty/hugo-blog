---
categories: 建站
date: 2024-08-12 12:07:12+08:00
description: Hugo Diary 主题修改记录。
featured_image: ''
slug: hugo-diary-modify
tags:
- Hugo
title: Hugo Diary主题修改记录
---





<!--more-->

## 前言

 `Hugo Diary` 主题简约美观，但是一些细节不符合自己的要求，因此稍作调整并加以记录，修改的内容包括如下：
 - 正文行距调整
 - 表格显示优化
 - 目录优化
 - 滚动条美化
 - 代码块背景色修改
 - 代码块添加 Mac 红绿灯色块
 - 代码块添加复制按钮
 - 字体修改

## 准备工作

主题没有 `custom.scss` 文件，自定义方式可以将 `~/themes/diary/assets/scss/journal.scss` 文件复制到站点根目录下 `~/assets/scss` 中，在其中直接更改，也可以复制后，在末尾添加 `custom.scss` 引用，然后在自定义文件中修改，这里采用第二种方式，文中 `~` 均代表博客根目录。

1. 复制 `journal.scss` 文件到站点根目录下。
2. 创建两个文件 `custom.scss` 用来放置自定义样式。
3. 在复制的 `~/assets/scss/journal.scss` 末尾添加代码引用自定义样式：
```scss
@import "custom"
```

## 细节调整
整体细节调整如下：
- 正文的行间距稍微扩大
- 优化表格显示
- 不同目录层级使用不同的列表标记
在 `custom.scss` 添加下面的代码：

```scss
// 调整正文部分的行间距
p, li, body {
  line-height: 1.8;  // 根据需求调整此值
}
// 表格优化
table{
  display: table;
  width: 100%;
  empty-cells: show;
}
table th{
  border: 1px solid #eee;
  padding: 6px 12px;
  background-color: lighten($color-accent, 35%);
  body.night & {
    background-color: lighten($color-accent, 10%);
  }
  width: 400px;
}
table td{
  border: 1px solid #eee;
  padding: 6px 12px;
  width: 400px;
}
// 不同目录层级使用不同的列表标记
.toc ul ul {
  list-style-type: decimal;
}
.toc ul ul ul {
  list-style-type: disc;
}
.toc ul ul ul ul {
  list-style-type: circle;
}
```

## 滚动条美化

将滚动条滑块颜色改成主题强调色，并更改透明度，在 `custom.scss` 添加下面的代码：

```scss
// 全局自定义滚动条样式
* {
  &::-webkit-scrollbar {
    width: 8px; // 滚动条宽度
    height: 8px; // 滚动条高度
  }

  &::-webkit-scrollbar-track {
    background: transparent; // 滚动条轨道背景色
    border-radius: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba($color-accent, 0.1); // 滚动条滑块颜色
    border-radius: 5px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba($color-accent, 0.5); // 滚动条滑块悬停颜色
  }
}
```
{{< notice notice-tip >}}
上述代码 `background` 的值是主题内置变量强调色的值，如果要应用于其他主题，可以将对应的值修改一下。
{{< /notice >}}

## 标签微调
分类页和标签页标签微调，缩小圆角大小，更改背景色，并去除边线。
在 `custom.scss` 中添加下面的代码：

```scss
// 标签样式更改
.rounded-pill{
  background: lighten($color-accent, 35%);
  border-radius: 10px !important;
  border: none;
  color: #000;
  &:hover{
    background: lighten($color-accent, 20%);
  }
  body.night & {
    background: #555;
    color: black;
    &:hover{
      background: lighten($color-accent, 20%);
    }
  }
}
```

## 代码块优化

### 细节调整

```scss
pre {
  background: rgba(46,46,46, 1) !important;
  color: rgba(255,255,255, 1);
  background: rgba($color-accent, 0.07);
  padding: 12px 15px;
  border-radius: 0;
  font-family: $mono-font-list;
  border-top: 1px solid #474747;
  border-left: 1px solid #474747;
  width: 100%;
  overflow-x: auto;
  margin-bottom: 0;
  * {
    background: none;
    font-family: $mono-font-list !important;
  }
  code {
    padding: 0;
    * {
      color: inherit;
    }
  }
}
```
### 添加 Mac 风格标志
同样在 `custom.scss` 中添加代码：
```scss
// mac风格代码块
.highlight {
  background: #2E2E2E;
  border-radius: 5px;
  box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.2);
  padding-top: 30px;
  padding-inline-end: 0px;
  position: relative;
  display: block;
  margin-bottom: 15px;
  overflow-x: auto;
  &::before {
    background: #fc625d;
    border-radius: 50%;
    box-shadow: 20px 0 #fdbc40, 40px 0 #35cd4b;
    content: ' ';
    height: 12px;
    margin-top: -20px;
    position: absolute;
    width: 12px;
    left: 12px;
  }
}
```

### 添加复制按钮

1. 将 `~\themes\diary\layouts\partials\copyright.html` 复制到站点根目录同名文件夹下，并在最后一行加入：

```html
<script src="{{"/js/clipboard.js" | relURL}}"></script>
```

2. 在 `~\static\js\` 文件夹下新建 `clipboard.js` 文件，写入：

```js
(function() {
  'use strict';

  if(!document.queryCommandSupported('copy')) {
    return;
  }

  function flashCopyMessage(el, msg) {
    el.textContent = msg;
    setTimeout(function() {
      el.textContent = "Copy";
    }, 1000);
  }

  function selectText(node) {
    var selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
    return selection;
  }

  function addCopyButton(containerEl) {
    var copyBtn = document.createElement("button");
    copyBtn.className = "highlight-copy-btn";
    copyBtn.textContent = "Copy";

    var codeEl = containerEl.querySelector('code');
    if (!codeEl) return;

    copyBtn.addEventListener('click', function(e) {
      e.stopPropagation();  // 防止点击事件冒泡到父元素
      try {
        var selection = selectText(codeEl);
        document.execCommand('copy');
        selection.removeAllRanges();

        flashCopyMessage(copyBtn, 'Copied!')
      } catch(e) {
        console && console.log(e);
        flashCopyMessage(copyBtn, 'Failed :\'(')
      }
    });

    containerEl.appendChild(copyBtn);
  }

  // Add copy button to code blocks
  var highlightBlocks = document.getElementsByClassName('highlight');
  Array.prototype.forEach.call(highlightBlocks, addCopyButton);
})();
```

3. 在 `~/assets/scss/custom.scss` 中添加样式代码：

```scss
// 复制按钮
.highlight {
  position: relative;
}
.highlight-copy-btn {
  position: absolute;
  top: 0;
  right: 0;
  border: 0;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 0px;
  padding: 1px;
  height: 30px;
  font-size: 0.8em;
  line-height: 1.8;
  color: #fff;
  background-color: #444343;
  min-width: 70px;
  text-align: center;
  opacity: 0;  /* 默认不可见 */
  transition: opacity 0.3s;  /* 添加过渡效果 */
}
```
{{< notice notice-tip >}}
以下几点需要注意：
1. `copyright.html` 文件是 `diary` 主题的 `footer` 模板，如果是其他主题，请添加到 `footer.html` 中
2. 样式代码的第 `14` 行代码 `background-color: lighten($color-accent,15%);` 中，背景颜色是主题的变量强调色，如果是其他主题需要更改颜色。
    {{< /notice >}}

### 添加代码折叠功能
给代码块添加折叠功能，首先新建 `~/static/js/codeblock.js` 文件，写入代码：

```javascript
document.addEventListener('DOMContentLoaded', function() {
  const highlights = document.querySelectorAll('.highlight');
  
  highlights.forEach(highlight => {
    const pre = highlight.querySelector('pre');
    if (pre.offsetHeight > 300) { // 300px 是我们设置的最大高度
      const expandBtn = document.createElement('button');
      expandBtn.className = 'expand-btn';
      highlight.appendChild(expandBtn);
      
      expandBtn.addEventListener('click', function() {
        highlight.classList.toggle('expanded');
      });
    }
  });
});
```

{{< notice notice-info >}}
代码中第 `6` 行可以设置代码块的最大高度
{{< /notice >}}

完成后需要引入 `js` 文件，这里添加到 `extended_head.html` 中，添加一行：

```html
<script src="{{"/js/codeblock.js" | relURL}}"></script>
```

然后在 `custom.scss` 中添加样式代码：
```scss
// 代码块折叠
.highlight {
  max-height: 300px; // 设置最大高度，可以根据需要调整
  overflow-y: hidden; // 隐藏超出部分
  transition: max-height 0.3s ease-out; // 添加过渡效果

  &.expanded {
    max-height: none; // 展开时取消最大高度限制
  }

  // 添加展开/折叠按钮样式
  .expand-btn {
    position: absolute;
    bottom: 10px; // 稍微往上移动一点
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(70, 70, 70, 0.9);
    color: #fff;
    border: none;
    border-radius: 20px; // 圆角按钮
    padding: 6px 15px;
    cursor: pointer;
    font-size: 12px;
    font-weight: bold;
    opacity: 0;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;

    &::before {
      content: '▼'; // 下箭头
      margin-right: 5px;
      font-size: 10px;
    }

    &::after {
      content: '展开代码';
    }

    &:hover {
      background-color: rgba(80, 80, 80, 0.95);
      box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
    }
  }

  &.expanded .expand-btn {
    &::before {
      content: '▲'; // 上箭头
    }

    &::after {
      content: '收起代码';
    }
  }

  &:hover .expand-btn {
    opacity: 1;
  }
}

// 当代码块内容超过最大高度时显示渐变效果
.highlight:not(.expanded)::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px; // 增加渐变高度
  background: linear-gradient(to bottom, rgba(46,46,46,0), rgba(46,46,46,1));
  pointer-events: none;
}

// 当代码块内容超过最大高度时显示渐变效果
.highlight:not(.expanded)::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: linear-gradient(to bottom, rgba(46,46,46,0), rgba(46,46,46,1));
  pointer-events: none;
}
```

## 更改字体

这里给出两个字体样式，一个是霞鹜文楷，一个是鸿蒙字体。
字体的地址如下：

- [霞鹜文楷 GitHub 仓库](https://github.com/lxgw/LxgwWenKai)
- [霞骛文楷浏览器使用的 WebFont](https://github.com/chawyehsu/lxgw-wenkai-webfont)
- [鸿蒙字体 WebFont](https://github.com/IKKI2000/harmonyos-fonts) 

首先引入字体 CSS 样式，需要在其他 CSS 样式前引用，所以直接将主题目录下的 `~/themes/diary/layouts/partials/head.html` 复制到主题根目录同名文件夹下，然后在 `<head>` 下引用，二选一直接放到开头：

```html
// 霞鹜文楷
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-webfont@1.1.0/style.css" />
// 鸿蒙字体
<link rel="stylesheet" href="https://s1.hdslb.com/bfs/static/jinkela/long/font/regular.css" />
```

在 `journal.scss` 中更改字体设置，选择对应的字体替换：

```scss
$default-font-list: HarmonyOS_Regular, -apple-system, BlinkMacSystemFont,"Segoe UI", Roboto, "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
$default-font-list: "LXGW WenKai Screen", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
```

## 调整首页文章列表布局
将首页文章列表布局调整为卡片样式，并且根据奇偶数交错显示文章封面图，移动设备仍然将封面图显示在文章信息上方，样式参考 `Hexo Butterfly` ，在 `custom.scsss` 中添加如下代码：
```scss
// 首页文章列表布局调整
.stream-container {
  .post-list-container {
    padding: 20px;

    > * {
      .post-item-wrapper {
        margin: 0 auto 20px;
        width: 95%;
        max-width: 800px;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        background-color: #fff;

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
        }

        .post-item {
          margin: 0;
          padding: 0;
          display: flex;
          align-items: stretch;
          border-bottom: none;

          .post-item-image-wrapper {
            flex: 0 0 35%;
            max-width: 280px;
            margin: 0;
            overflow: hidden;

            .post-item-image {
              width: 100%;
              height: 100%;
              object-fit: cover;
              transition: transform 0.3s ease;
            }
          }

          &:hover {
            .post-item-image {
              transform: scale(1.05);
            }
          }

          .post-item-info-wrapper {
            flex: 1;
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;

            .post-item-title {
              margin-bottom: 10px;
              font-size: 1.3em;
            }

            .post-item-summary {
              margin-bottom: 15px;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
          }
        }
      }

      // 奇数项文章，图片在左边（默认情况）
      &:nth-child(odd) {
        .post-item-wrapper .post-item {
          flex-direction: row;
        }
      }

      // 偶数项文章，图片在右边
      &:nth-child(even) {
        .post-item-wrapper .post-item {
          flex-direction: row-reverse;

          .post-item-image-wrapper {
            margin-left: 0;
            margin-right: 0;
          }
        }
      }
    }
  }
}

// 暗色模式调整
body.night {
  .stream-container {
    .post-list-container > * {
      .post-item-wrapper {
        background-color: #2d2d2d;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

        &:hover {
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
        }

        .post-item {
          border-bottom: none;
        }
      }
    }
  }
}

// 针对移动设备的调整
@media screen and (max-width: $single-column-max-width) {
  .stream-container {
    .post-list-container {
      padding: 10px;

      > * {
        .post-item-wrapper {
          width: 100%;
          margin-bottom: 15px;

          .post-item {
            flex-direction: column !important; // 强制垂直布局

            .post-item-image-wrapper {
              flex: none;
              max-width: none;
              width: 100%;
              height: 200px;
              order: -1; // 确保图片始终在上方
            }

            .post-item-info-wrapper {
              padding: 15px;

              .post-item-title {
                font-size: 1.2em;
              }
            }
          }
        }
      }
    }
  }
}
```


## 参考


- [黄忠德的博客](https://huangzhongde.cn/post/2020-02-21-hugo-code-copy-to-clipboard/)
