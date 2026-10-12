import {readFile} from 'node:fs/promises';
export const mounts={'unbound-web':'unbound','WordWin':'wordwin','dtu-courses':'dtu'};
export async function loadReleases(){
 const data=JSON.parse(await readFile(new URL('../releases.json',import.meta.url),'utf8'));
 if(JSON.stringify(Object.keys(data).sort())!==JSON.stringify(Object.keys(mounts).sort()))throw new Error('Record exactly unbound-web, WordWin and dtu-courses releases.');
 for(const [name,release] of Object.entries(data)){
  if(release.repository!==`mathiaskrois/${name}`||!/^[a-f0-9]{40}$/.test(release.commit||''))throw new Error(`Invalid repository or full commit SHA for ${name}.`);
 }
 return data;
}
