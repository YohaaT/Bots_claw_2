#!/usr/bin/env python3
import os, json, urllib.request, urllib.error, pathlib, subprocess, datetime, sys

KEY = os.environ.get('NOTION_API_KEY')
if not KEY:
    print('Missing NOTION_API_KEY', file=sys.stderr)
    sys.exit(1)

VERSION = '2025-09-03'
DB_ID = '13a96e12-f1fc-4a94-82f0-48d6db4f2457'
ROOT = pathlib.Path('/home/ubuntu/.openclaw/workspace/collab')
WS = '/home/ubuntu/.openclaw/workspace'


def req(method, path, payload=None):
    url = 'https://api.notion.com/v1' + path
    data = None if payload is None else json.dumps(payload).encode()
    r = urllib.request.Request(url, data=data, method=method)
    r.add_header('Authorization', f'Bearer {KEY}')
    r.add_header('Notion-Version', VERSION)
    r.add_header('Content-Type', 'application/json')
    with urllib.request.urlopen(r, timeout=60) as resp:
        return json.load(resp)


req('PATCH', f'/data_sources/{DB_ID}', {'properties': {'Area': {'select': {'options': [
    {'name': 'Inbox/Briefs', 'color': 'blue'},
    {'name': 'Working/bo', 'color': 'green'},
    {'name': 'Working/tank', 'color': 'red'},
    {'name': 'Working/shared', 'color': 'purple'}]}}}})

query = req('POST', f'/data_sources/{DB_ID}/query', {'page_size': 100})
existing = {}
for row in query.get('results', []):
    title = ''.join(t.get('plain_text', '') for t in row.get('properties', {}).get('Name', {}).get('title', []))
    if title:
        existing[title] = row['id']

git_commit = subprocess.check_output(['git', '-C', WS, 'rev-parse', '--short', 'HEAD'], text=True).strip()
now = datetime.datetime.utcnow().replace(microsecond=0).isoformat() + 'Z'


def build(area_rel, f):
    name = f.name
    low = name.lower()
    topic = name.split('_')[0] if '_' in name else f.stem
    target = 'tank' if '_to_tank_' in low else 'bo' if '_to_bo_' in low else 'shared'
    status = 'pending' if '_pending' in low else 'review' if '_review' in low else 'done' if '_done' in low else 'blocked' if '_blocked' in low else 'working'
    notion_status = {'pending': 'Sin empezar', 'review': 'En curso', 'working': 'En curso', 'done': 'Listo', 'blocked': 'En curso'}.get(status, 'En curso')
    trace = ''
    version = 1
    if f.suffix.lower() in ('.md', '.txt'):
        txt = f.read_text(encoding='utf-8', errors='ignore').splitlines()[:20]
        for line in txt:
            if line.lower().startswith('trace_id:'):
                trace = line.split(':', 1)[1].strip()
            if line.lower().startswith('version:'):
                try:
                    version = int(line.split(':', 1)[1].strip())
                except Exception:
                    pass
    title = f'[{area_rel}] {topic} | {target} | {status} | {name}'
    props = {
        'Name': {'title': [{'text': {'content': title[:180]}}]},
        'Area': {'select': {'name': area_rel}},
        'Topic': {'rich_text': [{'text': {'content': topic}}]},
        'Target': {'rich_text': [{'text': {'content': target}}]},
        'Estado': {'status': {'name': notion_status}},
        'SourcePath': {'rich_text': [{'text': {'content': str(f.relative_to(ROOT.parent))[:1800]}}]},
        'GitCommit': {'rich_text': [{'text': {'content': git_commit}}]},
        'Version': {'number': version},
        'TraceID': {'rich_text': [{'text': {'content': trace[:1800]}}]},
        'Last Inspection Date': {'date': {'start': now}},
    }
    return title, props

items = []
for area_rel in ['Inbox/Briefs', 'Working/bo', 'Working/tank', 'Working/shared']:
    for f in sorted((ROOT / area_rel).glob('*')):
        if f.is_file():
            items.append((area_rel, f))

for area_rel, f in items:
    title, props = build(area_rel, f)
    if title in existing:
        req('PATCH', f'/pages/{existing[title]}', {'properties': props})
    else:
        req('POST', '/pages', {'parent': {'data_source_id': DB_ID}, 'properties': props})

print(json.dumps({'ok': True, 'rows_synced': len(items), 'git_commit': git_commit, 'url': 'https://www.notion.so/7103447a993749a48b18e5c53612431e'}))
