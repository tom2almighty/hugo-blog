---
title: 'Hugo Diary主题修改记录'
date: 2024-08-12T12:07:12+08:00
description: Hugo Diary 主题修改记录。
featured_image: ""
tags: ["Hugo"]
categories: 建站
slug: hugo-diary-modify

---

## 前言

 `Hugo Diary` 主题简约美观，但是一些细节不符合自己的要求，因此稍作调整并加以记录。

主题貌似没有 `custom.scss` 文件，新建文件在其中修改貌似会出现一些问题，所以直接将主题目录下的样式复制到根目录下，然后在其中做自己的修改，具体如下：

将 `~/themes/diary/assets/scss/`目录下的`journal.scss`文件复制到站点根目录下 `~/assets/scss` 中。

## 滚动条优化

添加下面的代码：

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

> 上述代码 `background` 的值是主题内置变量强调色的值，如果要应用于其他主题，可以将对应的值修改一下。

## 代码块优化

### 细节调整

找到 `pre{}` 部分将其中的代码替换如下：

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

添加下面的代码：

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

`background` 值可以修改为和 `highlight` 方案同样的背景色，或者 `pre{}` 代码块下这两行代码注释取消掉：

```scss
  background: rgba(46,46,46, 1) !important;
  color: rgba(255,255,255, 1);
```

## 添加豆瓣条目短代码

首先将下面的代码放入 `~/layouts/shortcodes/douban.html` 中，没有就新建文件：

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

接下来在 `~/assets/scss/journal.scss` 中添加下面的样式代码：

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
  overflow: hidden;
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

接下来就可以在文章中添加短代码，语法如下(将大括号中间的 `\` 去掉)：

```bash
{\{< douban "https://book.douban.com/subject/35496106/">}\}
{\{< douban "https://movie.douban.com/subject/35267208/">}\}
```

样式预览：

{{< douban "https://book.douban.com/subject/35496106/">}}
{{< douban "https://movie.douban.com/subject/35267208/">}}



## 参考

- [Hugo 豆瓣短代码](https://immmmm.com/hugo-shortcodes-douban/)

- [豆瓣书影音同步 GitHub Action](https://imnerd.org/doumark.html)
