---
title : 'Hugo博客添加GitHub仓库信息短代码'
date : 2024-08-20T09:44:14+08:00
description: "给 Hugo 博客添加 GitHub 仓库信息短代码。"
featured_image: ""
tags: ["Hugo","短代码"]
categories: 建站
slug: hugo-github-card
---



<!--more-->

## 前言
`Hexo` `Butterfly` 主题的[标签插件](https://github.com/Akilarlxh/hexo-butterfly-tag-plugins-plus)可以实现 `GitHub` 仓库信息和个人信息展示，使用的项目是 [github-readme-stats](https://github.com/anuraghazra/github-readme-stats)，其实就是展示一张仓库信息或者个人信息的图片，类似于 `sheild.io` 的徽标。
`Hugo` 可以通过短代码方便的实现，这里就以 `Diary` 主题为例添加一个短代码，其他主题也通用。
本次用到的仓库(预览效果)如下：
{{< ghcard username="anuraghazra" repo="github-readme-stats" >}}

## 配置
新建 `~/layouts/shortcodes/ghcard.html` 文件，在其中添加模板代码：
```html
{{ $baseURL := .Site.Params.githubStatsBaseURL | default "https://github-readme-stats.vercel.app" }}
{{ $theme := .Get "theme" | default "default_repocard" }}
<div class="ghcard">
  <a href="https://github.com/{{ .Get "username"}}/{{ .Get "repo" }}" style="transition: none;background-image: none;border-bottom: none; display: block;">
    <img align="center" src="{{ $baseURL }}/api/pin/?username={{ .Get "username" }}&amp;repo={{ .Get "repo" }}&amp;theme={{ .Get "theme" }}" alt="{{ .Get "repo" }}" style="width: 100%;" />
  </a> 
</div>
<style>
  .ghcard {
    width: 100%;
    margin-bottom: 20px;
    display: inline-block;
    vertical-align: top;
  }
  @media (min-width: 769px) {
    .ghcard {
      width: calc(50% - 10px);
    }
    .ghcard:nth-child(odd) {
      margin-right: 100px;
    }
  }
</style>
```
## 使用
由于默认的地址访问量大后可能会失效，因此推荐自己部署项目到 `Vercel` ，可以参考这个链接：
[自己部署](https://github.com/anuraghazra/github-readme-stats/blob/master/docs/readme_cn.md#%E8%87%AA%E5%B7%B1%E9%83%A8%E7%BD%B2)

部署后在站点配置文件中添加一行配置，替换成自己的地址即可。
```toml
[params]
githubStatsBaseURL = "https://yourdomain.com"
```

使用的短代码如下：
```bash
{\{< ghcard username="anuraghazra" repo="github-readme-stats" >}}
{\{< ghcard username="anuraghazra" repo="github-readme-stats" theme="noctis_minimus" >}}
```
主题参数默认是 `default_repocard`，可以自己指定，最后的效果如下：
{{< ghcard username="anuraghazra" repo="github-readme-stats" >}}
{{< ghcard username="anuraghazra" repo="github-readme-stats" theme="noctis_minimus" >}}

{{< notice notice-info >}}
模板中只包含了仓库信息的短代码，还可以实现 GitHub 个人信息、 Gist 卡片、 Top Languages 卡片等 ，可以依照对应的添加短代码，使用的参数都类似，分开也方便使用。
{{< /notice >}}
## 参考
- [hexo-butterfly-tag-plugins-plus](https://github.com/Akilarlxh/hexo-butterfly-tag-plugins-plus)
- [github-readme-stats](https://github.com/anuraghazra/github-readme-stats)