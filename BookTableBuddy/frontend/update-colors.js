const fs = require('fs');
const path = require('path');

function replaceColors(content) {
  const replacements = [
    // Background colors
    [/bg-blue-50/g, 'bg-primary/5'],
    [/bg-blue-100/g, 'bg-primary/10'],
    [/bg-blue-500/g, 'bg-primary'],
    [/bg-blue-600/g, 'bg-primary'],
    [/bg-blue-700/g, 'bg-primary/80'],
    [/bg-indigo-50/g, 'bg-primary/5'],
    [/bg-indigo-100/g, 'bg-primary/10'],
    [/bg-indigo-500/g, 'bg-primary'],
    [/bg-indigo-600/g, 'bg-primary'],
    [/bg-indigo-700/g, 'bg-primary/80'],
    
    // Text colors
    [/text-blue-600/g, 'text-primary'],
    [/text-blue-700/g, 'text-primary/70'],
    [/text-blue-800/g, 'text-primary/80'],
    [/text-blue-900/g, 'text-primary/90'],
    [/text-indigo-600/g, 'text-primary'],
    [/text-indigo-700/g, 'text-primary/70'],
    [/text-indigo-800/g, 'text-primary/80'],
    [/text-indigo-900/g, 'text-primary/90'],
    
    // Border colors
    [/border-blue-200/g, 'border-primary/20'],
    [/border-blue-500/g, 'border-primary'],
    [/border-indigo-500/g, 'border-primary'],
    
    // Ring colors
    [/ring-indigo-500/g, 'ring-primary'],
    [/focus:ring-indigo-500/g, 'focus:ring-primary'],
    [/focus:border-indigo-500/g, 'focus:border-primary'],
    
    // Hover states
    [/hover:bg-blue-600/g, 'hover:bg-primary/90'],
    [/hover:bg-blue-700/g, 'hover:bg-primary/80'],
    [/hover:text-blue-900/g, 'hover:text-primary/90'],
    [/hover:bg-blue-100/g, 'hover:bg-primary/10'],
    [/hover:text-indigo-900/g, 'hover:text-primary/90'],
  ];

  let newContent = content;
  for (const [pattern, replacement] of replacements) {
    newContent = newContent.replace(pattern, replacement);
  }
  return newContent;
}

function updateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = replaceColors(content);
  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent);
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      updateFile(filePath);
    }
  });
}

// Update all JS files in the src directory
walkDir(path.join(__dirname, 'src'));
