import {mkdir,access} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {loadReleases} from './releases.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));await mkdir(root+'sources',{recursive:true});
const run=(cmd,args,cwd)=>execFileSync(cmd,args,{cwd,stdio:'inherit'});
for(const [name,release] of Object.entries(await loadReleases())){
 const source=root+'sources/'+name;
 let exists=true;try{await access(source+'/.git');}catch{exists=false;}
 if(!exists)run('git',['clone','--depth','1',`https://github.com/${release.repository}.git`,source],root);
 const changes=execFileSync('git',['status','--porcelain'],{cwd:source,encoding:'utf8'}).trim();
 if(changes)throw new Error(`${source} contains local changes. Keep development work in the sibling project repo and clear this cache deliberately.`);
 run('git',['fetch','--depth','1','origin',release.commit],source);run('git',['checkout','--detach',release.commit],source);
 run('npm',['ci'],source);run('npm',['run','build'],source);
}
console.log('All pinned public outputs are ready. Run npm run build to assemble them.');
