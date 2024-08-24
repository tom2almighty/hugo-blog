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

## 更改字体

霞鹜文楷字体显示效果不错，字体的地址如下：

- [GitHub 仓库](https://github.com/lxgw/LxgwWenKai)
- [浏览器使用的 WebFont](https://github.com/chawyehsu/lxgw-wenkai-webfont)

首先引入字体 CSS 样式，需要在其他 CSS 样式前引用，所以直接将主题目录下的 `~/themes/diary/layouts/partials/head.html` 复制到主题根目录同名文件夹下，然后在 `<head>` 下引用，直接放到开头：

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-webfont@1.1.0/style.css" />
```

在 `journal.scss` 中更改字体设置：

```scss
$default-font-list: -apple-system, BlinkMacSystemFont, "LXGW WenKai Screen","Segoe UI", Roboto, "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
$mono-font-list: "LXGW WenKai Screen", "Segoe UI", "Fira Mono", "Cousine", Monaco, Menlo, "Source Code Pro", monospace;
```




## 参考


- [黄忠德的博客](https://huangzhongde.cn/post/2020-02-21-hugo-code-copy-to-clipboard/)
