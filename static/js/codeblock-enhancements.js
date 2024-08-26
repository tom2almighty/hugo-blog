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
    copyButton.innerHTML = '<i class="iconfont icon-copy"></i>';
    copyButton.title = '复制代码';
    toolbar.appendChild(copyButton);
    
    copyButton.addEventListener('click', function() {
      let codeText = '';
      const table = highlight.querySelector('table');
      
      if (table) {
        // 表格形式 (lineIntable=true)
        const codeLines = table.querySelectorAll('tr > td:last-child');
        codeText = Array.from(codeLines)
          .map(td => {
            const code = td.querySelector('code');
            return code ? code.textContent : td.textContent;
          })
          .join('\n');
      } else {
        // 非表格形式
        const pre = highlight.querySelector('pre');
        const codeElement = pre.querySelector('code');
        
        if (codeElement) {
          const lines = codeElement.children;
          for (let line of lines) {
            if (line.children.length >= 2) {
              // 获取最后一个子元素的文本内容（代码内容）
              codeText += line.children[line.children.length - 1].textContent + '\n';
            } else {
              // 如果没有行号，直接获取整行内容
              codeText += line.textContent + '\n';
            }
          }
        } else {
          codeText = pre.textContent;
        }
      }
      
      // 移除开头和结尾的空白字符，并确保只有一个换行符
      codeText = codeText.trim().replace(/\n+/g, '\n');
      
      navigator.clipboard.writeText(codeText).then(function() {
        copyButton.innerHTML = '<i class="iconfont icon-chenggong"></i>';
        setTimeout(function() {
          copyButton.innerHTML = '<i class="iconfont icon-copy"></i>';
        }, 2000);
      }, function() {
        copyButton.innerHTML = '<i class="iconfont icon-shibai"></i>';
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