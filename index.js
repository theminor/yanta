let defaultText = `
This is *markdown* and it **works** just fine.
# Heading 1
Here is heading 1.
## Heading 2
Here is Heading 2
### Heading 3
Here is Heading 3
#### Heading 4
Here is Heading 4
##### Heading 5
Here is Heading 5
###### Heading 6
Here is Heading 6
- bullet
- bullet
- [x] Checklist
- [ ] Checklist
> quoted text
> More quoted
~~strikethrough~~
* Bullet
* Bullet
\`\`\`javascript
let x = 1;
// code block
\`\`\`
Some \`inline code\` here.
A [link](http://example.com).
An image: ![Alt](img.jpg)
`

var editor = ace.edit('editor');
editor.setTheme('ace/theme/yanta');
editor.session.setMode('ace/mode/markdown');
editor.session.setTabSize(4);
editor.session.setUseWrapMode(true);
document.getElementById('editor').style.fontSize='16px';
	
if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js');
function saveBtn() { localStorage.setItem('editorText', editor.getValue()); }
function loadBtn() { editor.setValue(localStorage.getItem('editorText') || defaultText, -1); }
loadBtn();
