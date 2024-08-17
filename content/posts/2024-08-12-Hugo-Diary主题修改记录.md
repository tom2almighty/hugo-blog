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
 - 滚动条美化
 - 代码块背景色修改
 - 代码块添加 Mac 红绿灯色块
 - 代码块添加复制按钮
 - 添加一些短代码，包括 `Notice`、豆瓣卡片、`GitHub` 卡片、时间轴、友链、块引用

## 准备工作

主题没有 `custom.scss` 文件，自定义方式可以将 `~/themes/diary/assets/scss/journal.scss` 文件复制到站点根目录下 `~/assets/scss` 中，在其中直接更改，也可以复制后，在末尾添加 `custom.scss` 引用，然后在自定义文件中修改，这里采用第二种方式，文中 `~` 均代表博客根目录。

1. 复制 `journal.scss` 文件到站点根目录下。
2. 创建两个文件 `custom.scss` 和 `shortcodes.scss` 用来放置自定义样式和短代码样式。
3. 在复制的 `~/assets/scss/journal.scss` 末尾添加两行代码引用自定义样式：
```scss
@import "custom"
@import "shortcodes"
```
4. 在 `~/data` 文件夹下创建 `SVG.toml` 文件，用来存放短代码引用的图标，如果添加的短代码不涉及图标引用，可以不创建。
5. 在 `~/layouts/shortcodes/` 目录下创建 `<shortcodes>.html` 文件，用来存放短代码内容，`<>` 内表示短代码名称，后文会更换。


## 样式更改
### 细节调整
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

### 滚动条美化

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
### 代码块优化

#### 细节调整

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
#### 添加 Mac 风格标志
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

#### 添加复制按钮

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

    var codeEl = containerEl.firstElementChild;
    copyBtn.addEventListener('click', function() {
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
.highlight {
  position: relative;
}
.highlight-copy-btn {
  position: absolute;
  top: 3px;
  right: 3px;
  border: 0;
  border-radius: 4px;
  padding: 1px;
  font-size: 0.8em;
  line-height: 1.8;
  color: #fff;
  background-color: lighten($color-accent,15%);
  min-width: 55px;
  text-align: center;
}

.highlight-copy-btn:hover {
  background-color: #666;
}
```
{{< notice notice-tip >}}
以下几点需要注意：
1. `copyright.html` 文件是 `diary` 主题的 `footer` 模板，如果是其他主题，请添加到 `footer.html` 中
2. 样式代码的第 `14` 行代码 `background-color: lighten($color-accent,15%);` 中，背景颜色是主题的变量强调色，如果是其他主题需要更改颜色。
{{< /notice >}}
## 添加短代码

### 豆瓣条目
#### 配置

1. 新建 `~/layouts/shortcodes/douban.html`，放入下面的代码：

```html
{{ $dbUrl := .Get 0 }}
{{ $dbApiUrl := "https://neodb.social/api/catalog/fetch?url=" }}
{{ $dbFetch := getJSON $dbApiUrl $dbUrl }}

{{ if $dbFetch }}
    {{ $itemRating := 0 }}{{ with $dbFetch.rating }}{{ $itemRating = . }}{{ end }}
    <div class="db-card">
        <div class="db-card-subject">
            <div class="db-card-post"><img loading="lazy" decoding="async" referrerpolicy="no-referrer" src="{{ $dbFetch.cover_image_url }}"></div>
            <div class="db-card-content">
                <div class="db-card-title"><a href="{{ $dbUrl }}" class="cute" target="_blank" rel="noreferrer">{{ $dbFetch.title }}</a></div>
                <div class="rating"><span class="allstardark"><span class="allstarlight" style="width:{{ mul 10 $itemRating }}%"></span></span><span class="rating_nums">{{ $itemRating }}</span></div>
                <div class="db-card-abstract">{{ $dbFetch.brief }}</div>
            </div>
            <div class="db-card-cate">{{ $dbFetch.category }}</div>
        </div>
    </div>
{{else}}
    <p style="text-align: center;"><small>远程获取内容失败，请检查 API 有效性。</small></p>
{{end}}
```

2. 接下来在 `~/assets/scss/shortcodes.scss` 中添加下面的样式代码：

```scss
/* db-card -------- start */
.db-card {
  margin: 2rem 3rem;
  background: #fafafa;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25), 0 0 1px rgba(0, 0, 0, 0.25);
}

.db-card-subject {
  display: flex;
  align-items: flex-start;
  line-height: 1.6;
  padding: 12px;
  position: relative;
}

.db-card-content {
  flex: 1 1 auto;
}

.db-card-post {
  width: 96px;
  margin-right: 15px;
  display: flex;
  flex: 0 0 auto;
}

.db-card-title {
  margin-bottom: 5px;
  font-size: 18px;
}

.db-card-title a {
  text-decoration: none !important;
}

.db-card-abstract,
.db-card-comment {
  font-size: 14px;
  overflow: auto;
  max-height: 3rem;
}

.db-card-cate {
  position: absolute;
  top: 0;
  right: 0;
  background: #f99b01;
  padding: 1px 8px;
  font-size: small;
  font-style: italic;
  border-radius: 0 8px 0 8px;
  text-transform: capitalize;
}

.db-card-post img {
  width: 96px !important;
  height: 96px !important;
  border-radius: 4px;
  -o-object-fit: cover;
  object-fit: cover;
}

.rating {
  margin: 0 0 5px;
  font-size: 13px;
  line-height: 1;
  display: flex;
  align-items: center;
}

.rating .allstardark {
  position: relative;
  color: #f99b01;
  height: 16px;
  width: 80px;
  background-size: auto 100%;
  margin-right: 8px;
  background-repeat: repeat;
  background-image: url(data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPjxwYXRoIGQ9Ik05MDguMSAzNTMuMWwtMjUzLjktMzYuOUw1NDAuNyA4Ni4xYy0zLjEtNi4zLTguMi0xMS40LTE0LjUtMTQuNS0xNS44LTcuOC0zNS0xLjMtNDIuOSAxNC41TDM2OS44IDMxNi4ybC0yNTMuOSAzNi45Yy03IDEtMTMuNCA0LjMtMTguMyA5LjMtMTIuMyAxMi43LTEyLjEgMzIuOS42IDQ1LjNsMTgzLjcgMTc5LjEtNDMuNCAyNTIuOWMtMS4yIDYuOS0uMSAxNC4xIDMuMiAyMC4zIDguMiAxNS42IDI3LjYgMjEuNyA0My4yIDEzLjRMNTEyIDc1NGwyMjcuMSAxMTkuNGM2LjIgMy4zIDEzLjQgNC40IDIwLjMgMy4yIDE3LjQtMyAyOS4xLTE5LjUgMjYuMS0zNi45bC00My40LTI1Mi45IDE4My43LTE3OS4xYzUtNC45IDguMy0xMS4zIDkuMy0xOC4zIDIuNy0xNy41LTkuNS0zMy43LTI3LTM2LjN6TTY2NC44IDU2MS42bDM2LjEgMjEwLjNMNTEyIDY3Mi43IDMyMy4xIDc3MmwzNi4xLTIxMC4zLTE1Mi44LTE0OUw0MTcuNiAzODIgNTEyIDE5MC43IDYwNi40IDM4MmwyMTEuMiAzMC43LTE1Mi44IDE0OC45eiIgZmlsbD0iI2Y5OWIwMSIvPjwvc3ZnPg==);
}

.rating .allstarlight {
  position: absolute;
  left: 0;
  color: #f99b01;
  height: 16px;
  overflow: hidden;
  background-size: auto 100%;
  background-repeat: repeat;
  background-image: url(data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPjxwYXRoIGQ9Ik05MDguMSAzNTMuMWwtMjUzLjktMzYuOUw1NDAuNyA4Ni4xYy0zLjEtNi4zLTguMi0xMS40LTE0LjUtMTQuNS0xNS44LTcuOC0zNS0xLjMtNDIuOSAxNC41TDM2OS44IDMxNi4ybC0yNTMuOSAzNi45Yy03IDEtMTMuNCA0LjMtMTguMyA5LjMtMTIuMyAxMi43LTEyLjEgMzIuOS42IDQ1LjNsMTgzLjcgMTc5LjEtNDMuNCAyNTIuOWMtMS4yIDYuOS0uMSAxNC4xIDMuMiAyMC4zIDguMiAxNS42IDI3LjYgMjEuNyA0My4yIDEzLjRMNTEyIDc1NGwyMjcuMSAxMTkuNGM2LjIgMy4zIDEzLjQgNC40IDIwLjMgMy4yIDE3LjQtMyAyOS4xLTE5LjUgMjYuMS0zNi45bC00My40LTI1Mi45IDE4My43LTE3OS4xYzUtNC45IDguMy0xMS4zIDkuMy0xOC4zIDIuNy0xNy41LTkuNS0zMy43LTI3LTM2LjN6IiBmaWxsPSIjZjk5YjAxIi8+PC9zdmc+);
}

body.night{ 
  .db-card {
    background: #212121;
  }
  .db-card-abstract,
  .db-card-comment {
    color: #e6e6e6;
  }
 .db-card-cate {
    color: #e6e6e6;
  }
  .rating_nums{
    color: #e6e6e6
  }
}
@media (max-width: 550px) {
  .db-card {
    margin: 0.8rem 1rem;
  }

  .db-card-comment {
    display: none;
  }
}
/* db-card -------- end */
```
#### 使用

在文章中添加短代码，语法如下(将大括号中间的 `\` 去掉)：

```bash
{\{< douban "https://book.douban.com/subject/35496106/">}\}
{\{< douban "https://movie.douban.com/subject/35267208/">}\}
```

**样式预览：**

{{< douban "https://book.douban.com/subject/35496106/">}}
{{< douban "https://movie.douban.com/subject/35267208/">}}

{{< notice notice-info >}}
样式代码中第 `94` 行 `body.night` 是 `diary` 主题黑暗模式的定义，如果是其他的主题，需要做对应的修改。
{{< /notice >}}

### Notice
#### 配置

1. 新建 `~/layouts/shortcodes/notice.html` 写入如下内容：
```html
{{- $noticeType := .Get 0 -}}

{{- $raw := (markdownify .Inner | chomp) -}}

{{- $block := findRE "(?is)^<(?:address|article|aside|blockquote|canvas|dd|div|dl|dt|fieldset|figcaption|figure|footer|form|h(?:1|2|3|4|5|6)|header|hgroup|hr|li|main|nav|noscript|ol|output|p|pre|section|table|tfoot|ul|video)\\b" $raw 1 -}}

{{ $icon := (replace (index $.Site.Data.SVG $noticeType) "icon" "icon notice-icon") }}
<div class="notice {{ $noticeType }}" {{ if len .Params | eq 2 }} id="{{ .Get 1 }}" {{ end }}>
    <div class="notice-title">{{ $icon | safeHTML }}</div>
    {{- if or $block (not $raw) }}{{ $raw }}{{ else }}<p>{{ $raw }}</p>{{ end -}}
</div>
```
2. 在 `~/data/SVG.toml` 中引入图标：
```toml
notice-warning = '<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 576 512" fill="hsl(0, 65%, 65%)"><path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zM124 296c-6.6.0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h264c6.6.0 12 5.4 12 12v56c0 6.6-5.4 12-12 12H124z"/></svg>'
notice-info = '<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 512 512" fill="hsl(30, 80%, 70%)"><path d="M256 8a248 248 0 100 496 248 248 0 000-496zm0 110a42 42 0 110 84 42 42 0 010-84zm56 254c0 7-5 12-12 12h-88c-7 0-12-5-12-12v-24c0-7 5-12 12-12h12v-64h-12c-7 0-12-5-12-12v-24c0-7 5-12 12-12h64c7 0 12 5 12 12v100h12c7 0 12 5 12 12v24z"/></svg>'
notice-note = '<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 512 512" fill="hsl(200, 65%, 65%)"><path d="M504 256a248 248 0 11-496 0 248 248 0 01496 0zm-248 50a46 46 0 100 92 46 46 0 000-92zm-44-165l8 136c0 6 5 11 12 11h48c7 0 12-5 12-11l8-136c0-7-5-13-12-13h-64c-7 0-12 6-12 13z"/></svg>'
notice-tip = '<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 512 512" fill="hsl(140, 65%, 65%)"><path d="M504 256a248 248 0 11-496 0 248 248 0 01496 0zM227 387l184-184c7-6 7-16 0-22l-22-23c-7-6-17-6-23 0L216 308l-70-70c-6-6-16-6-23 0l-22 23c-7 6-7 16 0 22l104 104c6 7 16 7 22 0z"/></svg>'
```
3. 在 `~/assets/scss/shortcodes.scss` 中添加样式代码：
```scss
// notice 短代码
.notice {
    position:relative;
    padding: 1em 1em 1em 2.5em;
    margin-bottom: 1em;
    border-radius: 4px;
    p:last-child {
        margin-bottom: 0;
    }
    .notice-title {
        position: absolute;
        left: 0.8em;
        .notice-icon {
            width: 1.2em;
            height: 1.2em;
        }
    }
    &.notice-warning {
        background: hsla(0, 65%, 65%, 0.15);
        border-left: 5px solid hsl(0, 65%, 65%);
        .notice-title {
            color: hsl(0, 65%, 65%);
        }
    }
    &.notice-info {
        background: hsla(30, 80%, 70%, 0.15);
        border-left: 5px solid hsl(30, 80%, 70%);
        .notice-title {
            color: hsl(30, 80%, 70%);
        }
    }
    &.notice-note {
        background: hsla(200, 65%, 65%, 0.15);
        border-left: 5px solid hsl(200, 65%, 65%);
        .notice-title {
            color: hsl(200, 65%, 65%);
        }
    }
    &.notice-tip {
        background: hsla(140, 65%, 65%, 0.15);
        border-left: 5px solid hsl(140, 65%, 65%);
        .notice-title {
            color: hsl(140, 65%, 65%);
        }
    }
}
body.night{
    .notice {
        &.notice-warning {
            background: hsla(0, 25%, 25%, 0.15);
            border-left: 5px solid hsl(0, 25%, 35%);
            .notice-title {
                color: hsl(0, 25%, 35%);
            }
        }
        &.notice-info {
            background: hsla(30, 25%, 35%, 0.15);
            border-left: 5px solid hsl(30, 25%, 35%);
            .notice-title {
                color: hsl(30, 25%, 35%);
            }
        }
        &.notice-note {
            background: hsla(200, 25%, 35%, 0.15);
            border-left: 5px solid hsl(200, 25%, 35%);
            .notice-title {
                color: hsl(200, 25%, 35%);
            }
        }
        &.notice-tip {
            background: hsla(140, 25%, 35%, 0.15);
            border-left: 5px solid hsl(140, 25%, 35%);
            .notice-title {
                color: hsl(140, 25%, 35%);
            }
        }
    }
}
```
#### 使用
使用语法如下：
```bash
{\{< notice notice-warning >}}
你好。
{\{< /notice >}}

{\{< notice notice-info >}}
你好。
{\{< /notice >}}

{\{< notice notice-note >}}
你好。
{\{< /notice >}}

{\{< notice notice-tip >}}
你好。
{\{< /notice >}}
```
**预览：**
{{< notice notice-warning >}}
你好。
{{< /notice >}}

{{< notice notice-info >}}
你好。
{{< /notice >}}

{{< notice notice-note >}}
你好。
{{< /notice >}}

{{< notice notice-tip >}}
你好。
{{< /notice >}}

### 友链

#### 配置
1. 新建 `~/layouts/shortcodes/friend.html` 文件，写入：
```html
{{- $name := .Get "name" | default (.Get 0) -}}
{{- $url := .Get "url" | default (.Get 1) -}}
{{- $avatar := .Get "avatar" | default (.Get 2) -}}
{{- $bio := .Get "bio" | default (.Get 3) -}}

<a href="{{- $url -}}" title="{{- $name -}}" class="friend-link" target="_blank" rel="friend">
    <div class="friend-link-div">
        <div class="friend-link-avatar">
            <img src={{ .Get "avatar" }} class="friend-avatar" loading="lazy" alt="Avatar">
        </div>
        <div class="friend-link-info">
            <i class="fa fa-link" aria-hidden="true"></i>
            <i class="friend-name">{{ $name }}</i>
            <p class="friend-bio">{{ $bio }}</p>
        </div>
    </div>
</a>
```
2. 在 `shortcodes.scss` 中添加样式：
```scss
// 友链
// 头像边框颜色
$avatar-border-color: lighten($color-accent, 25%);
$avatar-border-color-dark: #C0C0C0;

// style-card 背景色
$friend-link-background-color: lighten($color-accent, 43%);
$friend-link-background-color-dark: #69697141;

// 友链 name 原始色
$friend-link-color: #11a1a2;
$friend-link-color-dark: #ffffff;

// 友链 name 气泡响应对比色
$friend-link-hover-color: #ea4e2f;
$friend-link-hover-color-dark: rgb(241, 213, 159);

// bio 简介上下文
$context-color: #404040;
$context-color-dark: #c0c0c0;

// 友链头像及头像边框的样式
.friend-avatar {
    width: 56px;
    height: 56px;
    padding: 2px;
    margin-top: 14px;
    margin-left: 14px;
    border-radius: 40px !important; 
    border: 3.0px inset $avatar-border-color;

    body.night & {
        border: 3.6px inset $avatar-border-color-dark;
    }
}

.friend-link-div {
    // 实现卡片双栏排列效果
    height: auto;
    margin-top: auto;
    margin-inline-start: 4.5%;
    width: 43%;
    display: inline-block !important;

    // 控制上下连续排列的卡片之间的行距
    margin-bottom: 11px;

    // 卡片圆角
    border-radius: 7px 7px 7px 7px;

    // 卡片阴影
    -webkit-box-shadow: 0px 14px 32px 0px rgba(231, 224, 224, 0.15);
    -moz-box-shadow: 0px 14px 32px 0px rgba(0, 0, 0, 0.15);
    box-shadow: 0.7px 1px 6px 0px rgba(0, 0, 0, 0.16);

    // 卡片背景色
    background: $friend-link-background-color;

    body.night & {
        background: $friend-link-background-color-dark;
    }

    // 卡牌气泡响应动画
    -webkit-transition: transform 0.4s ease;
    -moz-transition: transform 0.4s ease;
    -o-transition: transform 0.4s ease;
    transition: transform 0.15s ease;

    &:hover {
        transform: scale(1.03);
    }
}


.friend-link-avatar {
    width: 92px;
    float: left;
    margin-right: 2px;

}

// name 特效样式， hover 气泡效果,友链 name 变色
.friend-link-info {
    margin-top: 13px;
    margin-right: 18px;
    color: $friend-link-color;

    body.night & {
        color: $friend-link-color-dark;
    }

    &:hover {
        color: $friend-link-hover-color;

        body.night & {
            color: $friend-link-hover-color-dark;
        }
    }
}

// name 文字样式
.friend-name {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-style: normal;
    font-family: 'Comic Sans MS', cursive;
    font-size: 16px;
    body.night & {
        color: $friend-link-color-dark;
    }
}

// bio 文字样式
.friend-bio {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    margin-top: auto;

    // font: 12px/1 Tahoma,Helvetica,Arial,"\5b8b\4f53",sans-serif;
    font-family: Helvetica, 'Hiragino Sans GB', 'Microsoft Yahei', '微软雅黑', Arial, sans-serif;
    font-size: 14px;

    color: $context-color;

    body.night & {
        color: $context-color-dark;
    }

}

// 响应式页面，允许根据不同的尺寸调整样式
@media screen and (max-width: 720px) {
    .friend-link-div {
        width: 92%;
        margin-right: auto;
    }

    .friend-bio {
        margin: auto;
        align-content: center;
        justify-content: left;
    }

    .friend-link-avatar {
        width: 84px;
        margin: auto;
    }

    .friend-link-info {
        height: 100%;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: left;
    }

    .friend-name {
        font-size: 14px;
        font-style: normal;
        font-family: 'Microsoft Yahei', '微软雅黑', Arial, sans-serif;
    }
}
```
{{< notice notice-info >}}
样式代码中 `body.night` `$color-accent` 是 `diary` 主题黑暗模式的定义，如果是其他的主题，需要做对应的修改。
{{< /notice >}}

#### 使用

```bash
{\{< friend name="名称" url="网址" avatar="头像" bio="简介" >}}
```
**预览：**
{{< friend name="Tom's Blog" url="https://blog.grew.cc" avatar="https://pic.imgdb.cn/item/65ef12699f345e8d0335d08b.png" bio="Tom 的个人博客" >}}
{{< friend name="Tom's Blog" url="https://blog.grew.cc" avatar="https://pic.imgdb.cn/item/65ef12699f345e8d0335d08b.png" bio="Tom 的个人博客" >}}

### 时间线
#### 配置
1. 新建 `~/layouts/shortcodes/timeline.html` 文件，写入：
```html
{{- $date := .Get "date" -}} {{- $title := .Get "title" -}} {{- $description := .Get "description" -}} {{- $tags := .Get "tags" -}}{{- $url := .Get "url" -}}

<div class="timeline__row">
    <div class="timeline__time">
        <div class="timeline__time">{{ $date }}</div>
        <div class="timeline__split-line"></div>
    </div>
    <div class="timeline__content">
        <div class="timeline__tags">
            {{- with split $tags ", " -}} {{- range . }}{{- if eq . "样式" }}
            <span class="timeline__tag timeline__tag-style">{{ . }}</span> {{- else if eq . "文章" }}
            <span class="timeline__tag timeline__tag-article">{{ . }}</span> {{- else if eq . "页面" }}
            <span class="timeline__tag timeline__tag-page">{{ . }}</span> {{- else }}
            <span class="timeline__tag">{{ . }}</span> {{- end }} {{- end }} {{- end }}
        </div>
        <a href="{{ $url }}">
            <div class="timeline__title">{{ $title }}</div>
        </a>
        <!-- title 可点击，默认就是跳转时间轴所在页 -->
        <div class="timeline__description">
            {{ $description }}
        </div>
    </div>
</div>
```
2. 在 `shortcodes.scss` 添加样式：
```scss
// timeline
.timeline {
    display: flex;
    flex-direction: column;
}

.timeline__row {
    display: flex;
    padding-left: 4%;
    height: 90px;
}

.timeline__time {
    flex: 0 0 110px;
    color: #030100;
    font-size: 17px;
    text-transform: uppercase;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem 0;
}

.timeline__time-text {
    margin: 0;
}

.timeline__split-line {
    position: absolute;
    top: 0.5rem;
    right: -20px;
    height: 100%;
    width: 2px;
    background-color: $color-accent;
    z-index: 0;
}

.timeline__split-line:before {
    content: "";
    position: absolute;
    top: 24%;
    right: -4px;
    transform: translateY(-50%);
    width: 10px;
    height: 10px;
    background-color: $color-accent;
    box-shadow: 0 0 0 4px var(--theme);
    border-radius: 50%;
    border: 0px solid #84c4e2;
    z-index: -1;
}

.timeline__content {
    flex: 1;
    margin-left: 4.5rem;
    padding: 0.5rem 0 1.2rem 0;
}

.timeline__title {
    margin: 0;
    margin-bottom: 2px;
    padding-top: 3px;
    margin-left: 0.5rem;
    color: var(--content);
    font-family: var(--font-family-teshu);
    font-size: 19px;
    font-weight: 600;
    width: fit-content;
    display: inline-block;
    vertical-align: middle;
    /* 垂直居中对齐 */
}

.timeline__tags {
    display: inline-block;
    padding: 0;
    margin-left: 0.3rem;
    align-items: center;
    gap: 0.3rem;
}

.timeline__tag {
    display: inline-block;
    color: var(--secondary);
    background-color: lighten($color-accent, 25%);
    border: 1.5px solid $color-accent;
    border-radius: 999px;
    padding: 0rem 0.5rem;
    font-size: 12px;
    white-space: nowrap;
    line-height: 1.4rem;
    opacity: 0.8;
    vertical-align: middle;
    /* 垂直居中对齐 */
}

.timeline__description {
    font-size: 15px;
    line-height: 1.6;
    color: #030100;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0.5rem 0 0.4rem 1.5rem;
    /* 添加 1.5rem 的左侧内边距 */
}
body.night{
    .timeline__time, .timeline__description{
        color: #E6E6E6;
    }
}
@media screen and (max-width: 768px) {
    .timeline__time {
        font-size: 14px;
        /* 在小屏幕上使用较小的字体大小 */
    }
    .timeline__title {
        font-size: 16px;
        /* 在小屏幕上使用较小的字体大小 */
    }
    .timeline__description {
        font-size: 14px;
        /* 在小屏幕上使用较小的字体大小 */
    }
}
```
{{< notice notice-info >}}
样式代码中 `body.night` `$color-accent` 是 `diary` 主题黑暗模式的定义，如果是其他的主题，需要做对应的修改。
{{< /notice >}}

#### 使用

```bash
{\{< timeline date="2023-10-01" title="国庆节" description="祖国生日快乐" tags="节日" url="" >}\}
```
**预览：**
{{< timeline date="2023-10-01" title="国庆节" description="祖国生日快乐" tags="节日" url="" >}}

### 块引用
#### 配置
新建 `~/layouts/shortcodes/quote.html` 文件，写入：
```html
<blockquote>
    <p>{{ .Inner | markdownify }}</p>
    {{- if or (.Get "author") (.Get "source") -}}
    <span class="cite"><span>― </span>
        {{- if .Get "author" -}}
        <span>
            {{- .Get "author" -}}{{- if .Get "source" -}}, {{ end -}}
        </span>
        {{- end -}}
        {{- with .Get "url" -}}<a href="{{ . }}">{{- end -}}
            <cite>{{ .Get "source" }}</cite>
        {{- if .Get "url" -}}</a>{{- end -}}
    </span>
    {{- end -}}
</blockquote>
    
<style>

    span.cite {
        display: block;
        margin-top: 1em;
        font-size: 0.8em;
        text-align: right;
    }
</style>
```
> 这里样式比较简单，直接写入了 `HTML` 文件中。

#### 使用
```bash
{\{< quote author="作者/说话的人" source="书名/来源" url="链接（可选）" >}}
内容
{\{< /quote >}}
```
**预览：**
{{< quote author="A famous person" source="The book they wrote" url="https://en.wikipedia.org/wiki/Book">}}
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
{{< /quote >}}


## 参考

- [Hugo 豆瓣短代码](https://immmmm.com/hugo-shortcodes-douban/)
- [豆瓣书影音同步 GitHub Action](https://imnerd.org/doumark.html)
- [黄忠德的博客](https://huangzhongde.cn/post/2020-02-21-hugo-code-copy-to-clipboard/)
- [一些 Hugo 短代码](https://www.xalaok.top/post/hugo-shortcodes/)