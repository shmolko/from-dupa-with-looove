#!/usr/bin/env python3
"""Build push_files payload - run and paste output into MCP call."""
import base64
import json
import os

os.chdir("/Users/lukas.smol/Documents/Cursor/from-dupa-with-looove")

def read_text(path):
    with open(path) as f:
        return f.read()

def read_base64(path):
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode()

files = []
# All text files
for p in [".gitignore", "README.md", "index.html", "docs/curation-summary.md", 
          "docs/lesson-schema.json", "docs/sources.md", "docs/topics.md",
          "src/app.js", "src/content/index.js", "src/content/reflexive-verbs.js",
          "src/content/similar-words.js", "src/lesson-engine.js", "src/styles.css",
          "data-sources/vallex/README.md", "tools/vallex_reflexive_mine.py",
          ".cursor/rules/git-via-github-mcp.mdc"]:
    files.append({"path": p, "content": read_text(p)})

# Images as base64
for f in sorted(os.listdir("assets")):
    if f.endswith(".png"):
        files.append({"path": f"assets/{f}", "content": read_base64(f"assets/{f})})

payload = {
    "owner": "shmolko",
    "repo": "from-dupa-with-looove",
    "branch": "main",
    "message": "Sync local project state to GitHub",
    "files": files
}
print(json.dumps(payload)[:500])
print("\n---\nTotal files:", len(files), "Payload size:", len(json.dumps(payload))/1e6, "MB")
