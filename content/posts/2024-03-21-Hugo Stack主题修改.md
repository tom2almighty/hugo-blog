---
categories: 建站
date: 2024-03-21 17:13:54+08:00
description: Stack 主题修改记录。
featured_image: https://image.dooo.ng/i/2024/04/14/661b4ccc75308.webp
slug: stack
tags:
- Hugo
title: Hugo Stack主题修改
---

## 前言

上一篇文章介绍了如何部署 `Hugo` 博客，这里针对 `Stack` 主题的修改做一些记录。

## 准备

首先在博客根目录下的 `assets` 下创建一个名为 `scss` 的文件夹，然后在 `scss` 文件夹里创建一个名为 `custom.scss` 的文件，最终效果为`~blog/assets/scss/custom.scss`，创建好文件后，对于主题的大部分样式魔改都将写进这个 `custom.scss`，其中有很多冗余的代码。

## 整体细节调整

```scss
//  ~\blog\assets\scss\custom.scss
// 页面基本配色
:root {
  // 全局顶部边距
  --main-top-padding: 30px;
  // 全局卡片圆角
  --card-border-radius: 12px;
  // 标签云卡片圆角
  --tag-border-radius: 8px;
  // 卡片间距
  --section-separation: 40px;
  // 全局字体大小
  --article-font-size: 1.8rem;
  // 行内代码背景色
  --code-background-color: #f8f8f8;
  // 行内代码前景色
  --code-text-color: #e96900;

  // 暗色模式下样式
  &[data-scheme="dark"] {
      // 行内代码背景色
      --code-background-color: #ff6d1b17;
      // 行内代码前景色
      --code-text-color: #e96900;
      // 暗黑模式下背景色
      --body-background: #0D0D0D;
      // 暗黑模式下卡片背景色
      --card-background: #121212;
      // 代码块背景色
      .highlight,
      .chroma {
          background-color: #171717;
      }
  }
  // 亮色模式下样式
  &[data-scheme="light"] {
      .highlight,
      .chroma {
          background-color: #FFF9F3;
      }
  }
}

// 修复引用块内容窄页面显示问题
  a {
    word-break: break-all;
  }
  
  code {
    word-break: break-all;
  }
  
  // 文章内容图片圆角阴影
  .article-page .main-article .article-content {
    img {
      max-width: 96% !important;
      height: auto !important;
      border-radius: 8px;
    }
  }

// 文章内容引用块样式
  .article-content {
    blockquote {
      border-left: 6px solid #5E7092 !important;
    }
  }
// 设置选中字体的区域背景颜色
  ::selection {
    color: #fff;
    background: #34495e;
  }
  
  a {
    text-decoration: none;
    color: var(--accent-color);
  
    &:hover {
      color: var(--accent-color-darker);
    }
  
    &.link {
      color: #4288b9ad;
      font-weight: 600;
      padding: 0 2px;
      text-decoration: none;
      cursor: pointer;
  
      &:hover {
        text-decoration: underline;
      }
    }
  }

//全局页面小图片样式微调
  .article-list--compact article .article-image img {
    width: var(--image-size);
    height: var(--image-size);
    object-fit: cover;
    border-radius: 17%;
  }
```

## 代码块样式调整

```scss
// 代码块样式修改
  .highlight {
    max-width: 102% !important;
    background-color: var(--pre-background-color);
    padding: var(--card-padding);
    position: relative;
    border-radius: 13px;
    margin-left: -7px !important;
    margin-right: -12px;
    box-shadow: var(--shadow-l1) !important;
  
    &:hover {
      .copyCodeButton {
        opacity: 1;
      }
    }
  
    // keep Codeblocks LTR
    [dir="rtl"] & {
      direction: ltr;
    }
  
    pre {
      margin: initial;
      padding: 0;
      margin: 0;
      width: auto;
    }
  }
```

## 代码块引入 Mac 样式

首先在博客根目录下的 `static` 文件夹中创建一个名为 `code-header.svg` 的文件,在文件中写入以下内容:

```xml
<svg xmlns="http://www.w3.org/2000/svg" version="1.1"  x="0px" y="0px" width="450px" height="130px">
    <ellipse cx="65" cy="65" rx="50" ry="52" stroke="rgb(220,60,54)" stroke-width="2" fill="rgb(237,108,96)"/>
    <ellipse cx="225" cy="65" rx="50" ry="52"  stroke="rgb(218,151,33)" stroke-width="2" fill="rgb(247,193,81)"/>
    <ellipse cx="385" cy="65" rx="50" ry="52"  stroke="rgb(27,161,37)" stroke-width="2" fill="rgb(100,200,86)"/>
</svg>
```

接下来继续在 `custom.scss` 添加以下内容：

```scss
//----------------------------------------------------------
//为代码块顶部添加macos样式
.article-content {
  .highlight:before {
    content: "";
    display: block;
    background: url(/code-header.svg);
    height: 32px;
    width: 100%;
    background-size: 57px;
    background-repeat: no-repeat;
    margin-bottom: 5px;
    background-position: -1px 2px;
  }
}
//--------------------------------------------------
```

## 首页添加欢迎样式

在博客的根目录下新建一个文件夹名为 `layouts` (默认生成站点时也生成了，没有的话手动创建),之后将 `~\blog\themes\hugo-theme-stack\layouts\index.html` 下的文件复制到刚刚创建的 `layouts` 文件夹里,这意味着主题 根目录下的 `layouts`文件夹里的 `index.html`将覆盖原主题目录下对应的文件，然后在复制出来的`index.html`修改为以下内容：

```scss
<!-- ~\site\blog\layouts\index.html -->
{{ define "main" }}
    {{ $pages := where .Site.RegularPages "Type" "in" .Site.Params.mainSections }}
    {{ $notHidden := where .Site.RegularPages "Params.hidden" "!=" true }}
    {{ $filtered := ($pages | intersect $notHidden) }}
    {{ $pag := .Paginate ($filtered) }}
<!-- ---这是我们添加进去的--------- -->
<!-- 首页欢迎字幅板块 -->
<div class="welcome">
  <p style="font-size: 2rem; text-align: center; font-weight: bold">
    <span class="shake">👋</span>
    <span class="jump-text1" > Welcome</span>
    <span class="jump-text2"> To </span>
    <span class="jump-text3" style="color:#e99312">Tom</span>
    <span class="jump-text4" style="color:#e99312">'s</span>
    <span class="jump-text5" style="color:#e99312">Blog</span>
  </p>
</div>
<!-- ------首页欢迎字幅板块------ -->
<!-- 下面也是主题自带的,只展示一部分,其余省略 -->

    <section class="article-list">
        {{ range $index, $element := $pag.Pages }}
            {{ partial "article-list/default" . }}
        {{ end }}
    </section>

    {{- partial "pagination.html" . -}}
    {{- partial "footer/footer" . -}}
{{ end }}

{{ define "right-sidebar" }}
    {{ partial "sidebar/right.html" (dict "Context" . "Scope" "homepage") }}
{{ end }}

```

接下来在 `custom.scss` 中添加如下：
```scss
//首页欢迎板块样式
.welcome {
  color: var(--card-text-color-main);
  background: var(--card-background);
  box-shadow: var(--shadow-l2);
  border-radius: 30px;
  display: inline-block;
}

// 👋emoji实现摆动效果
.shake {
  display: inline-block;
  animation: shake 1s;
  animation-duration: 1s;
  animation-timing-function: ease;
  animation-delay: 0s;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-fill-mode: none;
  animation-play-state: running;
  animation-name: shake;
  animation-timeline: auto;
  animation-range-start: normal;
  animation-range-end: normal;
  animation-delay: 2s;
  @keyframes shake {
    0% {
      transform: rotate(0);
    }
    25% {
      transform: rotate(45deg) scale(1.2);
    }
    50% {
      transform: rotate(0) scale(1.2);
    }
    75% {
      transform: rotate(45deg) scale(1.2);
    }
    100% {
      transform: rotate(0);
    }
  }
}
// 实现字符跳动动画
.jump-text1 {
  display: inline-block;
  animation: jump 0.5s 1;
}

.jump-text2 {
  display: inline-block;
  animation: jump 0.5s 1;
  animation-delay: 0.1s;
}

.jump-text3 {
  display: inline-block;
  animation: jump 0.5s 1;
  animation-delay: 0.2s;
}

.jump-text4 {
  display: inline-block;
  animation: jump 0.5s 1;
  animation-delay: 0.3s;
}

.jump-text5 {
  display: inline-block;
  animation: jump 0.5s 1;
  animation-delay: 0.4s;
}


@keyframes jump {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0);
  }
}

```

## 归档页和链接页文章三栏

```scss
// 修改归档和链接列表样式
@media (min-width: 1024px) {
  .article-list--compact,
  .article-list--compact.links {
    display: grid;
    background: none;
    box-shadow: none;
    gap: 1rem;

    article {
      background: var(--card-background);
      border: none;
      box-shadow: var(--shadow-l2);
      margin-bottom: 8px;
      border-radius: var(--card-border-radius);

      &:nth-child(odd) {
        margin-right: 8px;
      }
    }
  }
  //归档页
  .article-list--compact {
    grid-template-columns: 1fr 1fr 1fr;
  }
  //链接页
  .article-list--compact.links {
    grid-template-columns: 1fr 1fr 1fr; //三个1fr即为三栏,两个1fr则为双栏,以此类推即可.
  }
}
```

## 左侧栏

### 头像旋转

```scss
/*头像旋转动画*/
.sidebar header .site-avatar .site-logo {
    transition: transform 1.65s ease-in-out; //旋转时间
    &:hover {
      transform: rotate(360deg); //旋转角度为360度
    }
  }
```

## 右侧栏

### 标签栏

```scss
/*右侧标签放大动画*/
.tagCloud .tagCloud-tags a {
  border-radius: 10px; //圆角
  font-size: 1.4rem; //字体大小
  font-family: var(--article-font-family); //字体
  transition: transform 0.3s ease, background 0.3s ease; //动画时间
  &:hover {
    background: #b7d2ea7b; //背景颜色
    transform: translateY(-5px); //上移
  }
}
```

### 归档栏

```scss
/* 归档年份放大动画 */
.widget.archives .archives-year {
  &:first-of-type {
    border-top-left-radius: var(--card-border-radius);
    border-top-right-radius: var(--card-border-radius);
  }

  &:last-of-type {
    border-bottom-left-radius: var(--card-border-radius);
    border-bottom-right-radius: var(--card-border-radius);
  }

  &:hover {
    background-color: #b7d2ea7b;
  }

  &:not(:first-of-type):not(:last-of-type) {
    border-radius: 0; /* 确保中间的元素没有圆角 */
  }
}
```

### 搜索栏

```scss
// 修改首页搜索框样式
.search-form.widget input {
  font-size: 1.5rem;
  padding: 44px 25px 19px;
}

//搜索菜单动画
.search-form.widget {
  transition: transform 0.6s ease;
  &:hover {
    transform: scale(1.1, 1.1);
  }
}
```



## 修改字体为鸿蒙字体

字体的修改主题作者提供了模板，链接 [点击这里](https://stack.jimmycai.com/config/header-footer#example-custom-font-family-for-article-content)。

首先将鸿蒙字体保存到 `Github` 或其他 `CDN` 存储中，字体链接可以在 [这里](https://github.com/Irithys/cdn/tree/master/src/fonts?ref=irithys.com) 找到。然后修改 `~\blog\layouts\partials\head\custom.html` 文件，添加以下内容：

```html
<style>
    :root {
    /* 在style中,apple系统优先调用系统字体，其余优先调用 HarmonyOS_Sans_SC_Medium */
    --sys-font-family: -apple-system, "HarmonyOS_Sans_SC_Medium", Georgia, 'Nimbus Roman No9 L', 'PingFang SC', 'Hiragino Sans GB', 'Noto Serif SC', 'Microsoft Yahei', 'WenQuanYi Micro Hei', 'ST Heiti', sans-serif;
    --code-font-family: "JetBrainsMono Regular", Menlo, Monaco, Consolas, "Courier New";
    --article-font-family: -apple-system, "HarmonyOS_Sans_SC_Medium", var(--base-font-family);
  }
</style>
<script>  // 正文自重300，标题字重700
		(function () {
		    const customFont = document.createElement('link');
		    customFont.href = "https://cdn.jsdmirror.com/gh/tom2almighty/files@master/fonts/font.css";  // css文件地址
		
		    customFont.type = "text/css";
		    customFont.rel = "stylesheet";
		
		    document.head.appendChild(customFont);
		}());
</script>

```

> 记得在 `font.css` 文件中修改字体文件地址。

## 参考

- [L1nSn0w's Blog](https://blog.linsnow.cn/p/modify-hugo/)
- [Lovir's Blog](https://lovir.cn/p/changes-in-my-blog/)
- [山茶花舍](https://irithys.com/hugo-mod-3/)