document.addEventListener('DOMContentLoaded', function() {
  const codeBlocks = document.querySelectorAll('.highlight');

  codeBlocks.forEach(function(highlight) {
    // 创建横条
    const toolbar = document.createElement('div');
    toolbar.className = 'code-toolbar';
    highlight.insertBefore(toolbar, highlight.firstChild);

    // 添加 Mac 风格圆点
    const macDots = document.createElement('div');
    macDots.className = 'mac-dots';
    toolbar.appendChild(macDots);

    // 检测语言
    let language = '';
    const possibleElements = [
      highlight,
      highlight.querySelector('code'),
      highlight.querySelector('pre > code'),
      highlight.querySelector('pre'),
      highlight.querySelector('td:nth-child(2) code')
    ];

    for (const element of possibleElements) {
      if (element && element.className) {
        const elementLanguageClass = element.className.split(' ').find(cls => cls.startsWith('language-'));
        if (elementLanguageClass) {
          language = elementLanguageClass.replace('language-', '');
          break;
        }
      }
    }

    // 添加语言显示
    if (language) {
      const languageDisplay = document.createElement('span');
      languageDisplay.className = 'language-display';
      languageDisplay.textContent = language;
      toolbar.appendChild(languageDisplay);
    }

    // 添加复制按钮
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.innerHTML = '📋';
    copyButton.title = '复制代码';
    toolbar.appendChild(copyButton);

    copyButton.addEventListener('click', function() {
      let codeText;
      const table = highlight.querySelector('table');
      if (table) {
        // 有行号的情况
        codeText = Array.from(table.querySelectorAll('td:last-child'))
          .map(td => td.textContent.replace(/\n$/, ''))  // 移除每行末尾的换行符
          .join('\n');
      } else {
        // 没有行号的情况
        const pre = highlight.querySelector('pre');
        codeText = pre.textContent;
      }

      // 移除开头和结尾的空白字符，并确保只有一个换行符
      codeText = codeText.trim().replace(/\n+/g, '\n');

      navigator.clipboard.writeText(codeText).then(function() {
        copyButton.innerHTML = '✅';
        setTimeout(function() {
          copyButton.innerHTML = '📋';
        }, 2000);
      }, function() {
        copyButton.innerHTML = '❌';
      });
    });

    // 添加折叠功能
    if (highlight.offsetHeight > 300) {
      highlight.classList.add('collapsible');
      const expandButton = document.createElement('button');
      expandButton.className = 'expand-button';
      expandButton.innerHTML = '▼';
      highlight.appendChild(expandButton);

      expandButton.addEventListener('click', function() {
        highlight.classList.toggle('expanded');
        expandButton.innerHTML = highlight.classList.contains('expanded') ? '▲' : '▼';
      });
    }

    // 调整横条宽度
    function adjustToolbarWidth() {
      toolbar.style.width = `${highlight.offsetWidth}px`;
    }

    // 初始调整和窗口大小变化时调整
    adjustToolbarWidth();
    window.addEventListener('resize', adjustToolbarWidth);
  });
});
