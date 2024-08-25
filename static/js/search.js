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
  
  const performSearch = () => {
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

  // 监听表单提交事件
  this.form.addEventListener('submit', (e) => {
    e.preventDefault(); // 阻止表单默认提交行为
    performSearch();
  });

  // 保留原有的输入事件监听
  const inputHandler = () => {
    performSearch();
  };
  this.input.addEventListener('input', inputHandler);
  this.input.addEventListener('compositionend', inputHandler);
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
