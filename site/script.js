(() => {
 const form=document.getElementById('prompt-form');
 const subject=document.getElementById('subject');
 const output=document.getElementById('prompt-output');
 const status=document.getElementById('prompt-status');
 const looks={
  cinematic:'Photographic cinematic rendering, restrained colour, realistic materials, subtle fine grain and soft atmospheric bloom.',
  monochrome:'Monochrome photographic rendering. Build the frame from charcoal, mid-grey and one pale light field; no colour accents.',
  painterly:'Soft painterly rendering, broad matte pigment masses, rounded shapes, gentle grain and diffuse pale-yellow light within a cool slate-blue field.'
 };
 function compose(){
  const value=subject.value.trim();
  if(!value){subject.setCustomValidity('Tell us a subject first.');subject.reportValidity();return false;}
  subject.setCustomValidity('');
  const look=new FormData(form).get('look');
  output.textContent=`Create a visually striking image of ${value}, built around one dominant visual event. Place the primary form asymmetrically and let every other form support it. Build 3–5 large tonal or colour masses. Use strong scale asymmetry and a broad quiet field of negative space. Keep one focal silhouette clear; conceal or soften secondary details in shadow and atmosphere. Let light unify the frame rather than spotlight every object. The composition should read at thumbnail size, then reveal quieter information on closer viewing. ${looks[look]} Landscape 16:9. Avoid equal importance, uniform sharpness and clutter.`;
  status.textContent='';return true;
 }
 form.addEventListener('submit',event=>{event.preventDefault();if(compose())status.textContent='Prompt ready to copy.';});
 form.addEventListener('change',event=>{if(event.target.name==='look')compose();});
 subject.addEventListener('input',()=>{subject.setCustomValidity('');compose();});
 compose();
 async function copyText(value,node,success,selectNode){
  try{await navigator.clipboard.writeText(value);node.textContent=success;}
  catch{if(selectNode){const range=document.createRange();range.selectNodeContents(selectNode);const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);}node.textContent='Select and copy the text above.';}
 }
 document.getElementById('copy').addEventListener('click',()=>copyText(output.textContent,status,'Prompt copied.',output));
 document.getElementById('copy-email').addEventListener('click',()=>copyText('himanshuworkofficial@gmail.com',document.getElementById('email-status'),'Email copied.',document.querySelector('.email')));
 const videos=[...document.querySelectorAll('video')];
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const visibility=new Map();const manuallyPaused=new Set();
 function setButton(video){const button=document.querySelector(`[data-video="${video.id}"]`);if(button)button.textContent=video.paused?'Play film':'Pause film';}
 videos.forEach(video=>{
  video.addEventListener('play',()=>setButton(video));video.addEventListener('pause',()=>setButton(video));
  video.addEventListener('error',()=>{const button=document.querySelector(`[data-video="${video.id}"]`);if(button){button.textContent='Video unavailable';button.disabled=true;}});
 });
 document.querySelectorAll('[data-video]').forEach(button=>button.addEventListener('click',async()=>{
  const video=document.getElementById(button.dataset.video);
  if(video.paused){manuallyPaused.delete(video);try{await video.play();}catch{button.textContent='Use the video play control';}}
  else{manuallyPaused.add(video);video.pause();}
 }));
 if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries){const video=entry.target;visibility.set(video,entry.isIntersecting&&entry.intersectionRatio>=.35);
    if(visibility.get(video)&&!reduced.matches&&!document.hidden&&!manuallyPaused.has(video))video.play().catch(()=>setButton(video));
    else if(!visibility.get(video))video.pause();
   }
  },{threshold:[0,.35,.7]});videos.forEach(video=>observer.observe(video));
 }
 document.addEventListener('visibilitychange',()=>videos.forEach(video=>{if(document.hidden)video.pause();else if(visibility.get(video)&&!reduced.matches&&!manuallyPaused.has(video))video.play().catch(()=>setButton(video));}));
 reduced.addEventListener('change',()=>{if(reduced.matches)videos.forEach(video=>video.pause());});
})();
