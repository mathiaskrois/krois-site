import {cp,mkdir,rm,writeFile,stat} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {loadReleases,mounts} from './releases.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const releases=await loadReleases();
// Validate all release inputs before replacing any local build output.
for(const [name,release] of Object.entries(releases)){
 const source=root+'sources/'+name;
 const sha=execFileSync('git',['rev-parse','HEAD'],{cwd:source,encoding:'utf8'}).trim();
 if(sha!==release.commit)throw new Error(`${name}: checkout ${sha} does not match the recorded release ${release.commit}.`);
 await stat(source+'/dist/index.html');
}
await rm(root+'dist',{recursive:true,force:true});await mkdir(root+'dist',{recursive:true});
await cp(root+'index.html',root+'dist/index.html');await cp(root+'CNAME',root+'dist/CNAME');
for(const [name,release] of Object.entries(releases)){
 const mount=mounts[name];
 await cp(root+'sources/'+name+'/dist',root+'dist/'+mount,{recursive:true});
 await writeFile(root+'dist/'+mount+'/release.json',JSON.stringify(release)+'\n');
}
await cp(root+'sources/WordWin/hosting/WordWin',root+'dist/WordWin',{recursive:true});
console.log('Built krois.dk: /unbound/, /wordwin/, /dtu/ and legacy /WordWin/.');
