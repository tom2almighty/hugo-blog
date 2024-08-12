+++
title = 'Hugo Diary主题修改记录'
date = 2024-08-12T12:07:12+08:00
description: "Hugo Diary 主题修改记录。"
featured_image: ""
tags: [“Hugo”]
categories: [建站]
slug: hugo-diary-modify

+++

## 前言

记录 `Hugo Diary` 主题的修改。

将 `/~/themes/diary/assets/scss/`目录下的`journal.scss`文件复制到站点根目录下 `~/assets/scss` 中。

## Mac 风格代码块

```scss
.highlight {
  background: #2E2E2E;
  border-radius: 5px;
  box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.4);
  padding-top: 30px;
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
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

`background` 值可以修改为和 `highlight` 方案同样的背景色，或者也可以将 `pre{}` 代码块下这两行代码注释取消掉：

```scss
  background: rgba(46,46,46, 1) !important;
  color: rgba(255,255,255, 1);
```



