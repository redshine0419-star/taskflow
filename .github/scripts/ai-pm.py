import os
import json
import re
import requests
import uuid
from datetime import datetime

GEMINI_API_KEY = os.environ['GEMINI_API_KEY']
GITHUB_TOKEN = os.environ['GITHUB_TOKEN']
ISSUE_TITLE = os.environ['ISSUE_TITLE']
ISSUE_BODY = os.environ.get('ISSUE_BODY', '')
ISSUE_NUMBER = os.environ['ISSUE_NUMBER']
REPO = os.environ['REPO']

if '[AI PM]' not in ISSUE_TITLE:
    print('Not an AI PM issue, skipping.')
    exit(0)

BLOG_KEYWORDS = ['블로그', 'blog', '콘텐츠', 'content', '발행', '포스트', 'post', '작성', '링크 최적화', 'seo']
text = (ISSUE_TITLE + ' ' + ISSUE_BODY).lower()
is_blog = any(kw in text for kw in BLOG_KEYWORDS)

GH_HEADERS = {
    'Authorization': f'Bearer {GITHUB_TOKEN}',
    'Accept': 'application/vnd.github+json'
}

def gh_comment(body):
    requests.post(
        f'https://api.github.com/repos/{REPO}/issues/{ISSUE_NUMBER}/comments',
        headers=GH_HEADERS,
        json={'body': body}
    )

def gh_close():
    requests.patch(
        f'https://api.github.com/repos/{REPO}/issues/{ISSUE_NUMBER}',
        headers=GH_HEADERS,
        json={'state': 'closed'}
    )

def gh_label(label):
    requests.post(
        f'https://api.github.com/repos/{REPO}/issues/{ISSUE_NUMBER}/labels',
        headers=GH_HEADERS,
        json={'labels': [label]}
    )

def call_gemini(prompt):
    res = requests.post(
        f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}',
        json={
            'contents': [{'parts': [{'text': prompt}]}],
            'generationConfig': {'responseMimeType': 'application/json'}
        },
        headers={'Content-Type': 'application/json'},
        timeout=60
    )
    return res.json()['candidates'][0]['content']['parts'][0]['text']

if is_blog:
    topic = re.sub(r'\[AI PM\]', '', ISSUE_TITLE).strip()
    count_match = re.search(r'(\d+)\s*개', ISSUE_TITLE + ISSUE_BODY)
    count = min(int(count_match.group(1)) if count_match else 1, 3)

    lang_hint = 'en' if any(w in text for w in ['english', 'google', 'productivity', 'tool', 'free', 'remote']) else 'ko'

    success_count = 0
    for i in range(count):
        prompt = f"""
Write a blog post for TaskGrid (free kanban project management tool) on this topic: {topic}
Respond with JSON only:
{{
  "title": "post title",
  "description": "2 sentence summary",
  "content": "full markdown content (600+ words)",
  "category": "one of: alternatives, google-workspace, ai-tools, productivity",
  "keywords": "comma separated keywords",
  "lang": "{lang_hint}"
}}
"""
        try:
            data = call_gemini(prompt)
            blog = json.loads(data)
            slug = re.sub(r'[^a-z0-9-]', '-', blog.get('title', 'post').lower())[:60]
            slug = slug.strip('-') + '-' + str(uuid.uuid4())[:8]

            save_res = requests.post(
                'https://www.taskgrid.my/api/blog-save',
                headers={'Content-Type': 'application/json'},
                json={
                    'slug': slug,
                    'title': blog.get('title', ''),
                    'date': datetime.now().strftime('%Y-%m-%d'),
                    'category': blog.get('category', 'productivity'),
                    'description': blog.get('description', ''),
                    'keywords': blog.get('keywords', ''),
                    'content': blog.get('content', ''),
                    'used_keyword': topic,
                    'lang': blog.get('lang', lang_hint),
                    'image_url': ''
                },
                timeout=30
            )
            if save_res.status_code in [200, 201]:
                success_count += 1
                print(f'Blog {i+1} saved: {slug}')
            else:
                print(f'Blog {i+1} failed: {save_res.status_code} {save_res.text[:200]}')
        except Exception as e:
            print(f'Blog {i+1} error: {e}')

    if success_count > 0:
        gh_comment(f'✅ **AI PM 블로그 자동 생성 완료**\n\n- 주제: {topic}\n- 발행: {success_count}/{count}개\n- 발행처: taskgrid.my/blog')
        gh_close()
    else:
        gh_comment(f'⚠️ 블로그 생성 실패. 수동 확인 필요.\n주제: {topic}')
else:
    print('Code issue — labeling needs-dev')
    gh_label('needs-dev')
    gh_comment('🔧 **코드 개발 이슈**\n\n대시보드에서 검토 후 처리됩니다.')
