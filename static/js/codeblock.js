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