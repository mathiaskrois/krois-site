"""Preview the assembled site, including case-sensitive legacy URL routing."""
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from urllib.parse import urlsplit
import argparse
root=Path(__file__).resolve().parent.parent
public=root/'dist'
legacy=root/'sources/WordWin/hosting/WordWin'
class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs):
        super().__init__(*args,directory=str(public),**kwargs)
    def translate_path(self,path):
        normal=Path(super().translate_path(path))
        url=urlsplit(path).path
        if url=='/WordWin' or url.startswith('/WordWin/'):
            relative=normal.relative_to(public)
            return str(legacy.joinpath(*relative.parts[1:]))
        return str(normal)
parser=argparse.ArgumentParser()
parser.add_argument('--port',type=int,default=8080)
args=parser.parse_args()
print(f'Preview: http://127.0.0.1:{args.port}',flush=True)
ThreadingHTTPServer(('127.0.0.1',args.port),Handler).serve_forever()
