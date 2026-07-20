/* =========================================================
 * Nginx 速通实验室 - 页面内容（教学文案 + 各页 HTML 模板）
 * 每个页面是一个函数，返回 HTML 字符串
 * ========================================================= */

const NAV_ITEMS = [
  { id: "home",       icon: "⌂",  title: "首页 · 学习地图" },
  { id: "route",      icon: "7d", title: "7 天速通路线" },
  { id: "basics",     icon: "01", title: "基础：配置语法与结构" },
  { id: "static",     icon: "02", title: "静态资源托管" },
  { id: "spa",        icon: "03", title: "SPA 路由与 try_files" },
  { id: "proxy",      icon: "04", title: "反向代理与跨域" },
  { id: "cache",      icon: "05", title: "缓存策略与 HTTPS" },
  { id: "generator",  icon: "⚙",  title: "配置生成器" },
  { id: "pitfalls",   icon: "⚠",  title: "避坑清单 + 自测" },
];

/* 页面公共页脚：标记完成按钮 */
function pageFooter(pageId) {
  return `
  <div class="page-foot">
    <button class="btn mark-done-btn" id="mark-done" data-page="${pageId}">标记本章为已学</button>
    <span style="font-size:12px;color:var(--text-3)">进度仅保存在本机浏览器 localStorage</span>
  </div>`;
}

/* ---------------- 首页 ---------------- */
function pageHome() {
  return `
  <div class="page-hero">
    <span class="page-tag">nginx for frontend developers</span>
    <h1>Nginx 速通实验室</h1>
    <p class="lede">写给前端开发的 Nginx 实战教程。不讲运维八股，只讲你每天会用的四件事：<strong>静态托管、SPA 路由、反向代理、缓存与 HTTPS</strong>。每一章都配了可交互的模拟器，改改参数就能看到 Nginx 的真实决策过程。</p>
    <div class="btn-row">
      <a class="btn btn-primary" href="#/route">开始学习 →</a>
      <a class="btn" href="#/generator">直接抄配置</a>
    </div>
  </div>

  <h2>四大核心场景</h2>
  <p>前端工作中 90% 的 Nginx 需求都落在这四个场景里，把它们吃透就算"速通"了。</p>
  <div class="home-grid">
    <a class="home-card" href="#/static">
      <span class="hc-icon">02</span>
      <div class="hc-title">静态资源托管</div>
      <div class="hc-desc">root 和 alias 到底差在哪？gzip 怎么开？让打包产物跑起来的第一步。</div>
    </a>
    <a class="home-card" href="#/spa">
      <span class="hc-icon">03</span>
      <div class="hc-title">SPA 路由与 try_files</div>
      <div class="hc-desc">前端路由 history 模式刷新 404？一个 try_files 指令就能解决。</div>
      <div class="hc-lab">▶ 附交互实验台</div>
    </a>
    <a class="home-card" href="#/proxy">
      <span class="hc-icon">04</span>
      <div class="hc-title">反向代理与跨域</div>
      <div class="hc-desc">proxy_pass 末尾一个斜杠，结果天差地别。前端最容易踩的坑。</div>
      <div class="hc-lab">▶ 附交互实验台</div>
    </a>
    <a class="home-card" href="#/cache">
      <span class="hc-icon">05</span>
      <div class="hc-title">缓存策略与 HTTPS</div>
      <div class="hc-desc">JS/CSS 长缓存、HTML 不缓存、HTTP 跳转 HTTPS 的标准姿势。</div>
    </a>
    <a class="home-card" href="#/basics">
      <span class="hc-icon">01</span>
      <div class="hc-title">配置语法与结构</div>
      <div class="hc-desc">http → server → location 的嵌套关系，location 匹配的优先级规则。</div>
      <div class="hc-lab">▶ 附匹配模拟器</div>
    </a>
    <a class="home-card" href="#/generator">
      <span class="hc-icon">⚙</span>
      <div class="hc-title">配置生成器</div>
      <div class="hc-desc">填几个选项，生成一份生产可用的 nginx.conf，直接复制带走。</div>
    </a>
  </div>

  <div class="tip tip-info">
    <span class="tip-label">推荐学习方式</span>
    按「7 天速通路线」每天一章；每学完一章，用本章的模拟器亲手验证一遍，最后在「配置生成器」里拼出自己的完整配置。
  </div>`;
}

/* ---------------- 7 天路线 ---------------- */
function pageRoute() {
  const days = [
    { n: 1, t: "安装与目录结构", d: "Docker 起容器、配置文件位置、nginx -t 校验、-s reload 热重载", link: "#/basics" },
    { n: 2, t: "核心配置语法", d: "http / server / location 三层结构、location 匹配优先级（附模拟器）", link: "#/basics" },
    { n: 3, t: "静态托管 + gzip", d: "root vs alias、expires 缓存头、gzip 压缩，让 dist 目录跑起来", link: "#/static" },
    { n: 4, t: "SPA 路由回退", d: "try_files 原理、子路径部署、API 与页面路由隔离（附模拟器）", link: "#/spa" },
    { n: 5, t: "反向代理与跨域", d: "proxy_pass 斜杠之谜、请求头透传、同源代理解决跨域（附模拟器）", link: "#/proxy" },
    { n: 6, t: "缓存与 HTTPS", d: "静态资源强缓存、HTML 禁缓存、证书配置、HTTP 301 跳转", link: "#/cache" },
    { n: 7, t: "综合实战", d: "从 0 部署一个 React/Vue 项目：gzip + SPA + 代理 + 缓存 + HTTPS 全家桶", link: "#/generator" },
  ];
  return `
  <div class="page-hero">
    <span class="page-tag">learning path</span>
    <h1>7 天速通路线</h1>
    <p class="lede">每天 1~2 小时，边学边动手。<strong>每日硬性产出：一份能在自己项目上跑起来的 nginx.conf。</strong>学完全部 7 天，你将拥有一套可复用的部署模板。</p>
  </div>

  ${days.map(d => `
  <div class="route-day">
    <div class="rd-num">D${d.n}</div>
    <div class="rd-body">
      <div class="rd-title"><a href="${d.link}" style="color:inherit">Day ${d.n}：${d.t}</a></div>
      <div class="rd-desc">${d.d}</div>
    </div>
  </div>`).join("")}

  <h2>推荐实践环境</h2>
  <p>强烈建议用 Docker 做练习环境，改坏了删了重来，毫无心理负担：</p>
  <pre><code><span class="c-com"># 启动一个 Nginx 容器，挂载本地配置和静态文件（Windows PowerShell / macOS / Linux 通用思路）</span>
docker run -d --name ngx-lab -p 8080:80 \\
  -v \${PWD}/nginx.conf:/etc/nginx/conf.d/default.conf \\
  -v \${PWD}/dist:/usr/share/nginx/html \\
  nginx:alpine

<span class="c-com"># 改完配置后的标准三连</span>
docker exec ngx-lab nginx -t        <span class="c-com"># ① 校验语法</span>
docker exec ngx-lab nginx -s reload <span class="c-com"># ② 热重载（不断线）</span>
docker logs ngx-lab                 <span class="c-com"># ③ 看日志排错</span></code></pre>

  <div class="tip tip-good">
    <span class="tip-label">没有 Docker？</span>
    Windows 可直接下载 <a href="https://nginx.org/en/download.html" target="_blank" style="color:var(--blue)">nginx for Windows</a>，解压后运行 nginx.exe，配置文件在 conf/nginx.conf，学习语法完全够用。
  </div>

  <h2>学习工具三件套</h2>
  <ul>
    <li><code>nginx -t</code> — 每次改完配置先校验，别直接 restart</li>
    <li><code>curl -I http://localhost:8080/app.js</code> — 看响应头，验证缓存、gzip 是否生效</li>
    <li>浏览器 DevTools Network 面板 — 检查状态码、Content-Encoding、Cache-Control</li>
  </ul>
  ${pageFooter("route")}`;
}

/* ---------------- 基础语法 ---------------- */
function pageBasics() {
  return `
  <div class="page-hero">
    <span class="page-tag">chapter 01</span>
    <h1>基础：配置语法与结构</h1>
    <p class="lede">Nginx 配置看上去像 JSON 的远房亲戚：指令以分号结尾，块用大括号嵌套。前端只需要看懂三层结构和一个匹配规则。</p>
  </div>

  <h2>三层嵌套结构</h2>
  <pre><code><span class="c-dir">http</span> {                          <span class="c-com"># ① http 块：全局配置（gzip、日志、mime 类型……）</span>
    <span class="c-dir">server</span> {                    <span class="c-com"># ② server 块：一个"虚拟主机"（按域名/端口区分站点）</span>
        <span class="c-dir">listen</span> <span class="c-num">80</span>;
        <span class="c-dir">server_name</span> <span class="c-str">example.com</span>;

        <span class="c-dir">location</span> <span class="c-str">/</span> {             <span class="c-com"># ③ location 块：按 URL 路径分发处理</span>
            <span class="c-dir">root</span> <span class="c-str">/usr/share/nginx/html</span>;
        }
        <span class="c-dir">location</span> <span class="c-str">/api/</span> {
            <span class="c-dir">proxy_pass</span> <span class="c-str">http://backend:3000/</span>;
        }
    }
}</code></pre>
  <p>记忆法：<strong>http 管全局、server 管站点、location 管路径</strong>。请求进来后，先匹配 server（看域名和端口），再在 server 内部匹配 location（看路径）。</p>

  <h2>location 四种写法与优先级</h2>
  <table>
    <tr><th>写法</th><th>名称</th><th>匹配方式</th><th>例子</th></tr>
    <tr><td><code>location = /exact</code></td><td>精确匹配</td><td>URI 必须完全一样</td><td><code>= /favicon.ico</code></td></tr>
    <tr><td><code>location ^~ /prefix</code></td><td>优先前缀</td><td>前缀匹配成功后，<em>不再</em>检查正则</td><td><code>^~ /static/</code></td></tr>
    <tr><td><code>location ~ \\.png$</code></td><td>正则（区分大小写）</td><td>按配置顺序，第一个命中即生效</td><td><code>~ \\.(js|css)$</code></td></tr>
    <tr><td><code>location ~\* \\.png$</code></td><td>正则（忽略大小写）</td><td>同上</td><td><code>~\* \\.(jpg|png)$</code></td></tr>
    <tr><td><code>location /docs</code></td><td>普通前缀</td><td>记录最长匹配，但还要等正则"复核"</td><td><code>location /</code></td></tr>
  </table>

  <h3>决策流程（重点）</h3>
  <ol>
    <li>先看有没有 <strong>精确匹配 <code>=</code></strong>，有就直接用，结束。</li>
    <li>收集所有<strong>普通前缀</strong>匹配，记住<em>最长</em>的那个。</li>
    <li>如果最长前缀带 <code>^~</code>，直接用它，结束（跳过正则）。</li>
    <li>否则按<strong>配置文件中的书写顺序</strong>检查正则，第一个命中即生效，结束。</li>
    <li>正则都没中？回去用第 2 步记住的最长前缀。</li>
  </ol>

  <div class="tip tip-warn">
    <span class="tip-label">最容易误解的一点</span>
    普通前缀匹配"最长优先"，但正则匹配是"书写顺序优先"。一个写在前面的正则，可以"截胡"更长的前缀匹配（除非那个前缀带 ^~）。
  </div>

  <h2>实验台：location 匹配模拟器</h2>
  <div class="lab" id="lab-location">
    <div class="lab-head">
      <span class="lab-title">location 匹配模拟器 <span class="lab-badge">interactive</span></span>
    </div>
    <div class="lab-desc">输入一个 URL 路径，看 Nginx 按上面的决策流程选中哪个 location。命中的块会亮绿框。</div>
    <div class="url-input-row">
      <input type="text" id="loc-url" value="/static/app.js" spellcheck="false">
      <button class="btn btn-primary" id="loc-run">匹配</button>
    </div>
    <div style="font-size:12px;color:var(--text-3);margin-bottom:8px">试试：<code style="cursor:pointer" class="try-url">/</code> · <code style="cursor:pointer" class="try-url">/static/app.js</code> · <code style="cursor:pointer" class="try-url">/static/img/logo.PNG</code> · <code style="cursor:pointer" class="try-url">/api/users</code> · <code style="cursor:pointer" class="try-url">/exact</code></div>
    <div class="sim-locations" id="loc-list"></div>
    <div class="sim-result" id="loc-result"><span class="r-dim">输入路径后点击「匹配」</span></div>
  </div>

  <h2>高频指令速查</h2>
  <table>
    <tr><th>指令</th><th>作用</th><th>常见场景</th></tr>
    <tr><td><code>listen 80;</code></td><td>监听端口</td><td>每个 server 必写</td></tr>
    <tr><td><code>server_name a.com;</code></td><td>绑定的域名</td><td>多站点共存时区分</td></tr>
    <tr><td><code>root /path;</code></td><td>资源根目录</td><td>静态托管（见第 02 章）</td></tr>
    <tr><td><code>index index.html;</code></td><td>目录默认文件</td><td>访问 / 时返回什么</td></tr>
    <tr><td><code>try_files ...;</code></td><td>按顺序尝试文件</td><td>SPA 回退（见第 03 章）</td></tr>
    <tr><td><code>proxy_pass url;</code></td><td>转发到后端</td><td>反向代理（见第 04 章）</td></tr>
    <tr><td><code>return 301 url;</code></td><td>直接返回响应</td><td>跳转、强制 HTTPS</td></tr>
    <tr><td><code>add_header k v;</code></td><td>加响应头</td><td>缓存控制、安全头</td></tr>
  </table>
  ${pageFooter("basics")}`;
}

/* ---------------- 静态托管 ---------------- */
function pageStatic() {
  return `
  <div class="page-hero">
    <span class="page-tag">chapter 02</span>
    <h1>静态资源托管</h1>
    <p class="lede">前端打包出的 dist 目录，交给 Nginx 是最经典的生产姿势。这一章解决两个问题：<strong>文件放哪</strong>（root / alias）和<strong>怎么传得更快</strong>（gzip）。</p>
  </div>

  <h2>最小可用配置</h2>
  <pre><code><span class="c-dir">server</span> {
    <span class="c-dir">listen</span> <span class="c-num">80</span>;
    <span class="c-dir">server_name</span> <span class="c-str">localhost</span>;

    <span class="c-dir">root</span> <span class="c-str">/usr/share/nginx/html</span>;   <span class="c-com"># 你的 dist 目录挂载到这里</span>
    <span class="c-dir">index</span> <span class="c-str">index.html</span>;
}</code></pre>

  <h2>root vs alias（高频面试题）</h2>
  <p>两者都告诉 Nginx"去磁盘哪里找文件"，但拼接规则不同：</p>
  <table>
    <tr><th></th><th>root</th><th>alias</th></tr>
    <tr><td>拼接规则</td><td><code>root + 完整URI</code></td><td><code>alias + (URI 去掉 location 前缀)</code></td></tr>
    <tr><td>配置</td><td><code>location /static/ { root /data; }</code></td><td><code>location /static/ { alias /data/files/; }</code></td></tr>
    <tr><td>请求 <code>/static/a.js</code></td><td>找 <code>/data/static/a.js</code></td><td>找 <code>/data/files/a.js</code></td></tr>
  </table>
  <div class="tip tip-warn">
    <span class="tip-label">经验法则</span>
    目录结构和 URL 结构一致时用 <code>root</code>；想把某个 URL 前缀映射到不相干的磁盘目录时用 <code>alias</code>。用 alias 时<strong>末尾斜杠要么都带要么都不带</strong>（location /static/ 配 alias /data/files/），否则会拼错路径。
  </div>

  <h2>开启 gzip 压缩</h2>
  <p>JS/CSS/HTML 是文本，gzip 能压掉 70% 左右的体积，几乎零成本：</p>
  <pre><code><span class="c-dir">gzip</span> <span class="c-str">on</span>;
<span class="c-dir">gzip_min_length</span> <span class="c-num">1k</span>;            <span class="c-com"># 小于 1KB 不值得压</span>
<span class="c-dir">gzip_comp_level</span> <span class="c-num">6</span>;             <span class="c-com"># 压缩级别 1-9，6 是性价比甜点</span>
<span class="c-dir">gzip_types</span> <span class="c-str">text/plain text/css application/json
           application/javascript text/xml image/svg+xml</span>;
<span class="c-dir">gzip_vary</span> <span class="c-str">on</span>;                  <span class="c-com"># 加 Vary: Accept-Encoding，对缓存友好</span></code></pre>
  <div class="tip tip-info">
    <span class="tip-label">验证方式</span>
    <code>curl -I -H "Accept-Encoding: gzip" http://localhost:8080/app.js</code>，响应头出现 <code>Content-Encoding: gzip</code> 即生效。注意：构建产物里如果已有 <code>.gz</code> 预压缩文件，还可以用 <code>gzip_static on;</code> 直接发预压缩版，省 CPU。
  </div>

  <h2>一个细节：sendfile 与 tcp_nopush</h2>
  <pre><code><span class="c-dir">sendfile</span> <span class="c-str">on</span>;        <span class="c-com"># 零拷贝发送文件，静态托管必开（官方镜像默认已开）</span>
<span class="c-dir">tcp_nopush</span> <span class="c-str">on</span>;     <span class="c-com"># 配合 sendfile，凑满一个包再发</span></code></pre>

  <h2>本章验收清单</h2>
  <ul>
    <li>dist 目录挂载进容器，访问 <code>/</code> 能看到首页</li>
    <li>请求任意 JS 文件，响应头带 <code>Content-Encoding: gzip</code></li>
    <li>能口述 root 和 alias 的拼接差异</li>
  </ul>
  <div class="tip tip-good">
    <span class="tip-label">下一章预告</span>
    现在站点能打开了，但你用前端路由跳几个页面再按 F5 刷新——大概率 404。下一章用一行 <code>try_files</code> 解决它。
  </div>
  ${pageFooter("static")}`;
}

/* ---------------- SPA 路由 ---------------- */
function pageSpa() {
  return `
  <div class="page-hero">
    <span class="page-tag">chapter 03</span>
    <h1>SPA 路由与 try_files</h1>
    <p class="lede">React Router / Vue Router 的 history 模式下，<code>/user/123</code> 这种路径在磁盘上<strong>根本不存在</strong>。刷新就 404 不是 bug，是你还没告诉 Nginx："找不到的文件，统统交给 index.html"。</p>
  </div>

  <h2>一行核心配置</h2>
  <pre><code><span class="c-dir">location</span> <span class="c-str">/</span> {
    <span class="c-dir">root</span> <span class="c-str">/usr/share/nginx/html</span>;
    <span class="c-dir">try_files</span> <span class="c-var">$uri</span> <span class="c-var">$uri/</span> <span class="c-str">/index.html</span>;
}</code></pre>
  <p>执行逻辑：请求 <code>/user/123</code> → 找文件 <code>/usr/share/nginx/html/user/123</code>（不存在）→ 找目录 <code>user/123/</code>（不存在）→ <strong>内部重定向到 <code>/index.html</code></strong> → 前端 JS 接管路由，渲染对应页面。</p>

  <h2>为什么 /api 必须单独隔离</h2>
  <p>如果 <code>/api/users</code> 也落进 <code>location /</code>，后端接口 404 时会"回退"成返回 HTML，前端 <code>res.json()</code> 直接报语法错误，非常难排查。正确姿势：</p>
  <pre><code><span class="c-dir">location</span> <span class="c-str">/api/</span> {
    <span class="c-dir">proxy_pass</span> <span class="c-str">http://backend:3000/</span>;   <span class="c-com"># API 请求走代理，绝不回退</span>
}
<span class="c-dir">location</span> <span class="c-str">/</span> {
    <span class="c-dir">try_files</span> <span class="c-var">$uri</span> <span class="c-var">$uri/</span> <span class="c-str">/index.html</span>;   <span class="c-com"># 页面请求才回退</span>
}</code></pre>
  <p>location 的最长前缀匹配规则保证了 <code>/api/*</code> 永远进上面那个块（<code>/api/</code> 比 <code>/</code> 长），这就是第 01 章匹配规则的第一个实战应用。</p>

  <h2>子路径部署（/admin/ 下挂一个应用）</h2>
  <pre><code><span class="c-dir">location</span> <span class="c-str">/admin/</span> {
    <span class="c-dir">alias</span> <span class="c-str">/usr/share/nginx/admin/</span>;
    <span class="c-dir">try_files</span> <span class="c-var">$uri</span> <span class="c-var">$uri/</span> <span class="c-str">/admin/index.html</span>;
}</code></pre>
  <div class="tip tip-warn">
    <span class="tip-label">别忘了前端也要配合</span>
    子路径部署时，构建工具的 publicPath（Vite 的 <code>base</code>、webpack 的 <code>publicPath</code>）和路由器的 basename 都要设成 <code>/admin/</code>，否则资源路径全错。
  </div>

  <h2>实验台：try_files 回退模拟器</h2>
  <div class="lab" id="lab-tryfiles">
    <div class="lab-head">
      <span class="lab-title">try_files 决策模拟器 <span class="lab-badge">interactive</span></span>
    </div>
    <div class="lab-desc">模拟配置 <code>location / { try_files $uri $uri/ /index.html; }</code> + <code>location /api/ { proxy_pass ... }</code>。输入路径，看 Nginx 的完整决策链。</div>
    <div class="url-input-row">
      <input type="text" id="tf-url" value="/user/123" spellcheck="false">
      <button class="btn btn-primary" id="tf-run">追踪</button>
    </div>
    <div style="font-size:12px;color:var(--text-3);margin-bottom:8px">试试：<code style="cursor:pointer" class="tf-try">/assets/app.a1b2c3.js</code> · <code style="cursor:pointer" class="tf-try">/user/123</code> · <code style="cursor:pointer" class="tf-try">/</code> · <code style="cursor:pointer" class="tf-try">/api/users</code> · <code style="cursor:pointer" class="tf-try">/favicon.ico</code></div>
    <div class="step-flow" id="tf-flow"></div>
    <div class="sim-result" id="tf-result"><span class="r-dim">输入路径后点击「追踪」</span></div>
  </div>

  <h2>本章验收清单</h2>
  <ul>
    <li>history 路由下任意路径刷新不 404</li>
    <li>接口 404 返回的是 JSON/空响应，而不是 HTML</li>
    <li>能画出 try_files 的三个判断节点</li>
  </ul>
  ${pageFooter("spa")}`;
}

/* ---------------- 反向代理 ---------------- */
function pageProxy() {
  return `
  <div class="page-hero">
    <span class="page-tag">chapter 04</span>
    <h1>反向代理与跨域</h1>
    <p class="lede">开发时用 devServer proxy，生产时用 Nginx proxy_pass——本质一样：让前端和后端<strong>同源</strong>，跨域问题从源头消失。</p>
  </div>

  <h2>proxy_pass 的"斜杠之谜"</h2>
  <p>这是前端配 Nginx 踩坑率第一名。<code>proxy_pass</code> 的 URL <strong>末尾带不带 <code>/</code></strong>，转发路径完全不同：</p>
  <table>
    <tr><th>配置</th><th>请求 <code>/api/users?page=1</code> 实际转发为</th></tr>
    <tr><td><code>location /api/ { proxy_pass http://backend:3000; }</code> <em>不带 /</em></td><td><code>http://backend:3000/api/users?page=1</code>（原样拼接）</td></tr>
    <tr><td><code>location /api/ { proxy_pass http://backend:3000/; }</code> <em>带 /</em></td><td><code>http://backend:3000/users?page=1</code>（前缀被替换）</td></tr>
  </table>
  <p>规则：proxy_pass 后面<strong>只有 host:port（没有 URI 部分）</strong>时，保留完整请求路径；<strong>带了 URI（哪怕只是 <code>/</code>）</strong>时，用该 URI 替换掉 location 匹配的前缀。</p>

  <div class="lab" id="lab-proxy">
    <div class="lab-head">
      <span class="lab-title">proxy_pass 路径改写演示 <span class="lab-badge">interactive</span></span>
    </div>
    <div class="lab-desc">切换末尾斜杠、修改 location 前缀和请求路径，实时看转发结果。</div>
    <div class="field-grid">
      <label class="field"><span class="field-label">location 前缀</span><input type="text" id="px-loc" value="/api/" spellcheck="false"></label>
      <label class="field"><span class="field-label">请求路径</span><input type="text" id="px-uri" value="/api/users?page=1" spellcheck="false"></label>
    </div>
    <label class="field"><span class="field-label">proxy_pass 目标</span>
      <select id="px-target">
        <option value="http://backend:3000">http://backend:3000 （不带斜杠）</option>
        <option value="http://backend:3000/" selected>http://backend:3000/ （带斜杠）</option>
        <option value="http://backend:3000/v2/">http://backend:3000/v2/ （带子路径）</option>
      </select>
    </label>
    <div class="sim-result" id="px-result"></div>
  </div>

  <h2>请求头透传：别让后端"失忆"</h2>
  <p>默认情况下后端拿到的 Host 是 <code>backend:3000</code>、客户端 IP 全是 Nginx 的 IP。标准透传四件套：</p>
  <pre><code><span class="c-dir">location</span> <span class="c-str">/api/</span> {
    <span class="c-dir">proxy_pass</span> <span class="c-str">http://backend:3000/</span>;
    <span class="c-dir">proxy_set_header</span> <span class="c-str">Host</span> <span class="c-var">$host</span>;
    <span class="c-dir">proxy_set_header</span> <span class="c-str">X-Real-IP</span> <span class="c-var">$remote_addr</span>;
    <span class="c-dir">proxy_set_header</span> <span class="c-str">X-Forwarded-For</span> <span class="c-var">$proxy_add_x_forwarded_for</span>;
    <span class="c-dir">proxy_set_header</span> <span class="c-str">X-Forwarded-Proto</span> <span class="c-var">$scheme</span>;
}</code></pre>
  <ul>
    <li><code>Host</code>：后端做虚拟主机路由、生成绝对链接时要用</li>
    <li><code>X-Real-IP / X-Forwarded-For</code>：后端日志、限流、审计要拿真实客户端 IP</li>
    <li><code>X-Forwarded-Proto</code>：告诉后端原始请求是 http 还是 https（HTTPS 站点必需，否则后端可能生成 http 链接造成混合内容）</li>
  </ul>

  <h2>WebSocket 代理（vite dev / 实时应用常用）</h2>
  <pre><code><span class="c-dir">location</span> <span class="c-str">/ws/</span> {
    <span class="c-dir">proxy_pass</span> <span class="c-str">http://backend:3000/</span>;
    <span class="c-dir">proxy_http_version</span> <span class="c-num">1.1</span>;
    <span class="c-dir">proxy_set_header</span> <span class="c-str">Upgrade</span> <span class="c-var">$http_upgrade</span>;
    <span class="c-dir">proxy_set_header</span> <span class="c-str">Connection</span> <span class="c-str">"upgrade"</span>;
}</code></pre>

  <h2>同源代理 = 跨域问题的终点</h2>
  <p>前端请求 <code>/api/users</code>，浏览器看到的是<strong>同源</strong>请求（都是你的域名），根本不触发 CORS。Nginx 在服务器侧转发给后端，服务器之间没有跨域概念。这就是为什么生产环境首选代理而不是 CORS 响应头。</p>
  <div class="tip tip-info">
    <span class="tip-label">什么情况下才需要 CORS 头？</span>
    后端服务被<strong>多个不同域名</strong>的前端直接调用（比如开放 API），这时才在后端或 Nginx 里加 <code>Access-Control-Allow-Origin</code>。自家前后端同站部署，一律走代理。
  </div>

  <h2>本章验收清单</h2>
  <ul>
    <li>能解释 proxy_pass 带不带 <code>/</code> 的区别，并在模拟器里验证</li>
    <li>后端日志里能看到真实客户端 IP 而不是 127.0.0.1 或容器 IP</li>
    <li>本地用 Nginx 替代 devServer proxy 跑通开发环境</li>
  </ul>
  ${pageFooter("proxy")}`;
}

/* ---------------- 缓存与 HTTPS ---------------- */
function pageCache() {
  return `
  <div class="page-hero">
    <span class="page-tag">chapter 05</span>
    <h1>缓存策略与 HTTPS</h1>
    <p class="lede">现代构建工具会给 JS/CSS 文件名加内容指纹（<code>app.a1b2c3.js</code>），这给了我们一个巨大的优化空间：<strong>带指纹的资源永久缓存，HTML 永远不许缓存</strong>。</p>
  </div>

  <h2>黄金缓存策略</h2>
  <pre><code><span class="c-com"># ① index.html：永远不缓存，保证发版立刻生效</span>
<span class="c-dir">location</span> <span class="c-num">=</span> <span class="c-str">/index.html</span> {
    <span class="c-dir">add_header</span> <span class="c-str">Cache-Control</span> <span class="c-str">"no-cache, no-store, must-revalidate"</span>;
}

<span class="c-com"># ② 带指纹的静态资源：缓存一年（内容变了文件名就会变）</span>
<span class="c-dir">location</span> <span class="c-str">/assets/</span> {
    <span class="c-dir">expires</span> <span class="c-num">1y</span>;
    <span class="c-dir">add_header</span> <span class="c-str">Cache-Control</span> <span class="c-str">"public, immutable"</span>;
}

<span class="c-com"># ③ 其余页面路由：走 SPA 回退，也禁缓存</span>
<span class="c-dir">location</span> <span class="c-str">/</span> {
    <span class="c-dir">add_header</span> <span class="c-str">Cache-Control</span> <span class="c-str">"no-cache"</span>;
    <span class="c-dir">try_files</span> <span class="c-var">$uri</span> <span class="c-var">$uri/</span> <span class="c-str">/index.html</span>;
}</code></pre>
  <div class="tip tip-danger">
    <span class="tip-label">为什么不能给 HTML 加长缓存？</span>
    index.html 里引用的是 <code>app.a1b2c3.js</code>。发新版后指纹变成 <code>d4e5f6</code>，如果用户浏览器缓存着旧 HTML，就会一直请求旧 JS——新功能上线用户看不到，甚至白屏。<strong>HTML 是发版的"开关"，必须每次新鲜。</strong>
  </div>

  <h3>expires 指令速查</h3>
  <table>
    <tr><th>写法</th><th>效果</th></tr>
    <tr><td><code>expires 1y;</code></td><td>Cache-Control: max-age=31536000</td></tr>
    <tr><td><code>expires 7d;</code></td><td>缓存 7 天</td></tr>
    <tr><td><code>expires -1;</code></td><td>Cache-Control: no-cache</td></tr>
    <tr><td><code>expires off;</code></td><td>不加缓存头</td></tr>
  </table>

  <h2>HTTPS 配置</h2>
  <pre><code><span class="c-com"># HTTP → HTTPS 强制跳转</span>
<span class="c-dir">server</span> {
    <span class="c-dir">listen</span> <span class="c-num">80</span>;
    <span class="c-dir">server_name</span> <span class="c-str">example.com</span>;
    <span class="c-dir">return</span> <span class="c-num">301</span> <span class="c-str">https://</span><span class="c-var">$host</span><span class="c-var">$request_uri</span>;
}

<span class="c-dir">server</span> {
    <span class="c-dir">listen</span> <span class="c-num">443</span> <span class="c-str">ssl</span>;
    <span class="c-dir">server_name</span> <span class="c-str">example.com</span>;

    <span class="c-dir">ssl_certificate</span>     <span class="c-str">/etc/nginx/ssl/example.com.pem</span>;
    <span class="c-dir">ssl_certificate_key</span> <span class="c-str">/etc/nginx/ssl/example.com.key</span>;

    <span class="c-com"># 现代 TLS 基线（2026 年视角）</span>
    <span class="c-dir">ssl_protocols</span>       <span class="c-str">TLSv1.2 TLSv1.3</span>;
    <span class="c-dir">ssl_ciphers</span>         <span class="c-str">HIGH:!aNULL:!MD5</span>;
    <span class="c-dir">ssl_session_cache</span>   <span class="c-str">shared:SSL:10m</span>;
    <span class="c-dir">ssl_session_timeout</span> <span class="c-num">10m</span>;

    <span class="c-com"># HSTS：告诉浏览器"以后只用 HTTPS 找我"</span>
    <span class="c-dir">add_header</span> <span class="c-str">Strict-Transport-Security</span> <span class="c-str">"max-age=31536000; includeSubDomains"</span>;

    <span class="c-dir">location</span> <span class="c-str">/</span> { <span class="c-com"># …站点配置…</span> }
}</code></pre>

  <h3>本地练习 HTTPS</h3>
  <p>本地没有真实域名证书，用 <a href="https://github.com/FiloSottile/mkcert" target="_blank" style="color:var(--blue)">mkcert</a> 一键生成本机受信证书：</p>
  <pre><code>mkcert -install
mkcert localhost 127.0.0.1
<span class="c-com"># 生成 localhost+1.pem / localhost+1-key.pem，挂进 Nginx 即可</span></code></pre>

  <h2>顺手加上的安全响应头</h2>
  <pre><code><span class="c-dir">add_header</span> <span class="c-str">X-Content-Type-Options</span> <span class="c-str">"nosniff"</span>;
<span class="c-dir">add_header</span> <span class="c-str">X-Frame-Options</span> <span class="c-str">"SAMEORIGIN"</span>;
<span class="c-dir">add_header</span> <span class="c-str">Referrer-Policy</span> <span class="c-str">"strict-origin-when-cross-origin"</span>;</code></pre>

  <h2>混合内容警告</h2>
  <div class="tip tip-warn">
    <span class="tip-label">上 HTTPS 后最常见的坑</span>
    页面是 HTTPS，但代码里写死了 <code>http://api.xxx.com</code>，浏览器会直接拦截。对策：① 接口全部走相对路径 <code>/api</code>（配合代理）；② 或确保第三方资源都有 HTTPS 版本。配合第 04 章的 <code>X-Forwarded-Proto</code>，后端重定向也不会掉回 http。
  </div>

  <h2>本章验收清单</h2>
  <ul>
    <li><code>curl -I</code> 检查：JS/CSS 带 <code>max-age=31536000</code>，HTML 带 <code>no-cache</code></li>
    <li>访问 http:// 自动 301 跳到 https://</li>
    <li>DevTools Security 面板无混合内容警告</li>
  </ul>
  ${pageFooter("cache")}`;
}

/* ---------------- 配置生成器 ---------------- */
function pageGenerator() {
  return `
  <div class="page-hero">
    <span class="page-tag">tools</span>
    <h1>配置生成器</h1>
    <p class="lede">把前六章的知识拼装成一份生产可用配置。勾选选项，右侧实时生成，直接复制带走。</p>
  </div>

  <div class="lab">
    <div class="field-grid">
      <label class="field"><span class="field-label">域名 / server_name</span><input type="text" id="g-domain" value="example.com" spellcheck="false"></label>
      <label class="field"><span class="field-label">站点根目录 root</span><input type="text" id="g-root" value="/usr/share/nginx/html" spellcheck="false"></label>
      <label class="field"><span class="field-label">后端地址（用于 /api 代理）</span><input type="text" id="g-backend" value="http://backend:3000" spellcheck="false"></label>
      <label class="field"><span class="field-label">API 前缀</span><input type="text" id="g-apiprefix" value="/api/" spellcheck="false"></label>
    </div>
    <div class="field-grid" style="margin-top:4px">
      <label style="display:flex;gap:8px;align-items:center;cursor:pointer"><input type="checkbox" id="g-spa" checked style="width:auto"> SPA 路由回退（try_files）</label>
      <label style="display:flex;gap:8px;align-items:center;cursor:pointer"><input type="checkbox" id="g-gzip" checked style="width:auto"> 开启 gzip 压缩</label>
      <label style="display:flex;gap:8px;align-items:center;cursor:pointer"><input type="checkbox" id="g-cache" checked style="width:auto"> 黄金缓存策略（assets 长缓存）</label>
      <label style="display:flex;gap:8px;align-items:center;cursor:pointer"><input type="checkbox" id="g-proxy" checked style="width:auto"> /api 反向代理（含请求头透传）</label>
      <label style="display:flex;gap:8px;align-items:center;cursor:pointer"><input type="checkbox" id="g-https" style="width:auto"> 启用 HTTPS + HTTP 跳转</label>
      <label style="display:flex;gap:8px;align-items:center;cursor:pointer"><input type="checkbox" id="g-security" checked style="width:auto"> 安全响应头</label>
    </div>
  </div>

  <div class="gen-out">
    <div class="btn-row" style="justify-content:flex-end">
      <button class="btn btn-primary" id="g-copy">复制配置</button>
      <button class="btn" id="g-download">下载 nginx.conf</button>
    </div>
    <pre id="g-output"><code></code></pre>
  </div>

  <div class="tip tip-good">
    <span class="tip-label">生成后怎么用</span>
    保存为 <code>default.conf</code>，按「7 天路线」页的 Docker 命令挂载到 <code>/etc/nginx/conf.d/</code>，然后 <code>nginx -t</code> → <code>nginx -s reload</code>。启用 HTTPS 时记得把证书文件挂到 <code>/etc/nginx/ssl/</code> 并修改生成配置里的证书路径。
  </div>
  ${pageFooter("generator")}`;
}

/* ---------------- 避坑与自测 ---------------- */
function pagePitfalls() {
  return `
  <div class="page-hero">
    <span class="page-tag">review</span>
    <h1>避坑清单 + 结课自测</h1>
    <p class="lede">都是真实项目里踩出来的坑。自测全对，就可以去配置生成器产出你的毕业配置了。</p>
  </div>

  <h2>前端踩坑 TOP 6</h2>

  <div class="card">
    <div class="card-title">① proxy_pass 末尾的斜杠</div>
    <p style="color:var(--text-2);font-size:14px">带 <code>/</code> 会替换掉 location 前缀，不带则原样拼接。接口突然 404，先查这里。去<a href="#/proxy">第 04 章模拟器</a>亲手试一次就忘不了。</p>
  </div>
  <div class="card">
    <div class="card-title">② try_files 把 API 也回退成了 HTML</div>
    <p style="color:var(--text-2);font-size:14px">接口 404 返回 index.html，前端 <code>res.json()</code> 抛 "Unexpected token &lt;"。对策：<code>location /api/</code> 单独写代理块，绝不落到 <code>location /</code>。</p>
  </div>
  <div class="card">
    <div class="card-title">③ HTML 被缓存，发版用户看不到</div>
    <p style="color:var(--text-2);font-size:14px">HTML 是引用带指纹 JS 的"入口开关"，必须 <code>no-cache</code>；长缓存只给 <code>/assets/</code> 这类带指纹的资源。</p>
  </div>
  <div class="card">
    <div class="card-title">④ root / alias 路径拼接错误</div>
    <p style="color:var(--text-2);font-size:14px">alias 忘记和 location 保持同样的结尾斜杠，拼出的路径少一层或多一层。排错时直接看 error.log 里的 "open() failed" 路径。</p>
  </div>
  <div class="card">
    <div class="card-title">⑤ 正则 location 顺序截胡</div>
    <p style="color:var(--text-2);font-size:14px">正则是"书写顺序优先"，不是"最长优先"。把 <code>~ \\.js$</code> 写在前面，<code>/assets/</code> 前缀块可能根本不生效。</p>
  </div>
  <div class="card">
    <div class="card-title">⑥ HTTPS 混合内容</div>
    <p style="color:var(--text-2);font-size:14px">页面 HTTPS、接口 HTTP，浏览器直接拦截。统一走相对路径 + 代理，并透传 <code>X-Forwarded-Proto</code>。</p>
  </div>

  <h2>结课自测（5 题）</h2>
  <div id="quiz-root"></div>
  <div class="sim-result" id="quiz-score" style="display:none"></div>
  ${pageFooter("pitfalls")}`;
}

/* 自测题库 */
const QUIZ_DATA = [
  {
    q: "history 模式的 SPA 刷新任意路径返回 404，最经典的修复配置是？",
    opts: [
      'location / { try_files $uri $uri/ /index.html; }',
      'location / { proxy_pass http://localhost:3000; }',
      'location / { rewrite .* /index.html redirect; }',
      'error_page 404 =200 /index.html;  （不推荐，改变了状态码语义）',
    ],
    answer: 0,
    explain: "try_files 按顺序尝试：文件 → 目录 → 内部重定向到 /index.html，且保持 200 状态码与 URL 不变，前端路由正常接管。error_page 方案虽能用，但 try_files 是社区标准写法。",
  },
  {
    q: '配置 location /api/ { proxy_pass http://backend:3000/; }，请求 /api/users 实际转发到？',
    opts: [
      "http://backend:3000/api/users",
      "http://backend:3000/users",
      "http://backend:3000//users",
      "http://backend:3000/api/",
    ],
    answer: 1,
    explain: "proxy_pass 带 URI（这里是 /）时，会用该 URI 替换 location 前缀：/api/users 去掉 /api/ 剩 users，拼到 http://backend:3000/ 后面得到 /users。",
  },
  {
    q: "关于静态资源缓存，正确的做法是？",
    opts: [
      "所有文件都加 expires 1y，越快越好",
      "index.html 长缓存，JS 不缓存",
      "带内容指纹的 JS/CSS 长缓存，index.html 设 no-cache",
      "全部禁缓存，保证永远最新",
    ],
    answer: 2,
    explain: "指纹文件名保证了内容变则 URL 变，可以安全长缓存；HTML 是发版开关，缓存它会让用户停留在旧版本。",
  },
  {
    q: "location 匹配中，以下哪种写法优先级最高？",
    opts: [
      "location /api/ （普通前缀）",
      "location = /api/ （精确匹配）",
      "location ~ \\.json$ （正则）",
      "location ^~ /api/ （优先前缀）",
    ],
    answer: 1,
    explain: "= 精确匹配永远最先检查且命中即结束。注意 = /api/ 只匹配 URI 恰好为 /api/ 的请求，不匹配 /api/users。",
  },
  {
    q: "生产环境解决前后端跨域，最推荐的方式是？",
    opts: [
      "后端加 Access-Control-Allow-Origin: *",
      "Nginx 同源代理：前端请求 /api 由 Nginx 转发到后端",
      "前端用 JSONP",
      "浏览器装插件关闭跨域检查",
    ],
    answer: 1,
    explain: "同源代理让浏览器视角下前后端完全同源，不触发 CORS，也不暴露后端真实地址，是生产标准姿势。CORS 头适用于开放 API 等多域名场景。",
  },
];
