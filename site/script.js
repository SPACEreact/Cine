document.getElementById('copy').addEventListener('click',async()=>{
 const prompt=document.getElementById('prompt').textContent;
 const status=document.getElementById('copy-status');
 try{await navigator.clipboard.writeText(prompt);status.textContent='Prompt copied.';}
 catch{const range=document.createRange();range.selectNodeContents(document.getElementById('prompt'));const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);status.textContent='Select and copy the highlighted prompt, or download the sample.';}
});
