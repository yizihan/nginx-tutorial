# Nginx 速通实验室 · 前端开发版

写给前端开发的 Nginx 实战教程。不讲运维八股，只讲每天会用的四件事：**静态托管、SPA 路由、反向代理、缓存与 HTTPS**。

纯前端零依赖，双击 `index.html` 即用。在线版：https://yizihan.github.io/nginx-tutorial/

## 核心知识点速览

### ① 配置三层结构

`http`（全局）→ `server`（虚拟主机，按域名/端口）→ `location`（按 URL 路径分发）。

**location 匹配决策链（重点）：**

1. 精确匹配 `= /exact` —— 命中即结束
2. 普通前缀 —— 记录**最长**的那个
3. 最长前缀带 `^~` —— 直接用它，跳过正则
4. 正则 `~` / `~*` —— 按**书写顺序**，第一个命中即生效
5. 正则都没中 —— 回退到第 2 步的最长前缀

> 易错点：前缀是「最长优先」，正则是「顺序优先」——写在前面的正则可以截胡更长的前缀。

### ② 静态资源托管

- **root vs alias**：`root` 拼完整 URI（`root /data` + `/static/a.js` → `/data/static/a.js`）；`alias` 去掉 location 前缀再拼。用 alias 时 location 和路径**末尾斜杠要一致**。
- **gzip**：`gzip on` + `gzip_min_length 1k` + `gzip_comp_level 6`，文本资源体积立减约 70%。
- `sendfile on` 零拷贝发送，静态托管必开（官方镜像默认已开）。

### ③ SPA 路由与 try_files

history 模式刷新 404 的标准解法：

```nginx
location /api/ {
    proxy_pass http://backend:3000/;      # API 走代理，绝不回退
}
location / {
    try_files $uri $uri/ /index.html;     # 页面请求才回退
}
```

要点：`/api/` 必须单独隔离，否则接口 404 会回退成 HTML，前端 `res.json()` 直接报错。子路径部署（如 `/admin/`）时，前端 `base`/`publicPath` 和路由 `basename` 要同步改。

### ④ 反向代理与跨域

**斜杠之谜（踩坑率第一名）**：`proxy_pass` 末尾带不带 `/`，结果天差地别。

| 配置 | 请求 `/api/users` 转发为 |
|---|---|
| `proxy_pass http://backend:3000;`（不带 /） | `/api/users`（原样拼接） |
| `proxy_pass http://backend:3000/;`（带 /） | `/users`（前缀被替换） |

**请求头透传四件套**（后端不失忆）：

```nginx
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
```

跨域终极方案：**同源代理**。浏览器视角下前后端完全同源，不触发 CORS；只有开放 API 这类多域名场景才需要 CORS 响应头。

WebSocket 代理记得加：`proxy_http_version 1.1` + `Upgrade`/`Connection` 头。

### ⑤ 缓存策略与 HTTPS

**黄金缓存策略**：带指纹的资源永久缓存，HTML 永远不许缓存。

```nginx
location = /index.html {
    add_header Cache-Control "no-cache, no-store, must-revalidate";  # 发版开关
}
location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";                    # 指纹资源
}
```

> HTML 引用的是 `app.a1b2c3.js`，缓存 HTML 会让用户一直加载旧 JS —— 新功能上线看不到甚至白屏。

**HTTPS**：80 端口 `return 301 https://$host$request_uri;` 强制跳转；443 配 `ssl_certificate` + TLSv1.2/1.3 + HSTS。本地练习用 [mkcert](https://github.com/FiloSottile/mkcert) 生成受信证书。上 HTTPS 后注意**混合内容**：接口统一走相对路径 `/api`。

### ⑥ 避坑 TOP 6

1. `proxy_pass` 末尾斜杠决定路径是否被替换
2. `try_files` 把 API 也回退成 HTML → `/api/` 单独写代理块
3. HTML 被缓存导致发版不生效 → HTML 必须 `no-cache`
4. `root`/`alias` 路径拼接错 → 看 error.log 的 "open() failed" 路径
5. 正则 location 顺序截胡前缀匹配
6. HTTPS 混合内容被浏览器拦截 → 相对路径 + `X-Forwarded-Proto`

## 项目结构

```
nginx-tutorial/
├── index.html            # 入口（hash 路由 + localStorage 进度跟踪）
├── css/style.css
├── js/
│   ├── pages.js          # 7 天路线 + 5 章教程 + 配置生成器 + 自测题库
│   └── app.js            # 路由、进度、3 个交互模拟器、生成器逻辑
└── docker-lab/           # Docker 练习环境（端口 8081）
    ├── docker-compose.yml
    ├── conf.d/default.conf
    └── site/
```

## 交互实验台（教程内置）

- **location 匹配模拟器**（第 01 章）：输入 URL，可视化匹配决策链
- **try_files 回退模拟器**（第 03 章）：追踪 SPA 回退的完整判断流程
- **proxy_pass 路径改写演示**（第 04 章）：切换斜杠实时看转发结果
- **配置生成器**：勾选 SPA/gzip/缓存/代理/HTTPS/安全头，产出生产可用 nginx.conf

## 本地练习

```bash
cd docker-lab
docker compose up -d

# 改完配置的标准三连
docker exec nginx-lab nginx -t        # ① 校验语法
docker exec nginx-lab nginx -s reload # ② 热重载（不断线）
docker logs nginx-lab --tail 50 -f    # ③ 看日志排错
```

验证：`curl -I http://localhost:8081/`（HTML 不缓存）、`curl -I http://localhost:8081/assets/style.css`（一年强缓存）、`curl -I http://localhost:8081/any/route`（SPA 回退 200）。

## 学习路线（7 天）

| Day | 主题 | 产出 |
|---|---|---|
| 1 | 安装与目录结构 | 容器跑起来，会 `nginx -t` 和 reload |
| 2 | 核心配置语法 | 说清 location 匹配优先级 |
| 3 | 静态托管 + gzip | dist 目录跑起来，gzip 生效 |
| 4 | SPA 路由回退 | 任意路径刷新不 404 |
| 5 | 反向代理与跨域 | 讲清斜杠之谜，后端拿到真实 IP |
| 6 | 缓存与 HTTPS | 指纹资源长缓存、HTML 禁缓存、301 跳转 |
| 7 | 综合实战 | 从 0 部署一个完整前端项目 |
