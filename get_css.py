import urllib.request
import re
import traceback

try:
    url = "https://ipfstest-tau.vercel.app"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
    
    with open(r'd:\ipfs final\live_index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Saved live_index.html")
            
except Exception as e:
    traceback.print_exc()
