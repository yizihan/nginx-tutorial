/* =========================================================
 * Nginx 速通实验室 - 应用逻辑
 * hash 路由 / 模拟器 / 配置生成器 / 测验 / 进度存储
 * ========================================================= */

const PAGES = {
  home: pageHome,
  route: pageRoute,
  basics: pageBasics,
  static: pageStatic,
  spa: pageSpa,
  proxy: pageProxy,
  cache: pageCache,
  generator: pageGenerator,
  pitfalls: pagePitfalls,
};

const LS_KEY = "nginx-lab-progress";

/* ---------------- 进度 ---------------- */
function getProgress() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch { return {}; }
}
function saveProgress(p) { localStorage.setItem(LS_KEY, JSON.stringify(p)); }

function updateProgressUI() {
  const p = getProgress();
  const learnable = NAV_ITEMS.filter(i => i.id !== "home" && i.id !== "generator");
  const done = learnable.filter(i => p[i.id]).length;
  const pct = Math.round((done / learnable.length) * 100);
  document.getElementById("progress-fill").style.width = pct + "%";
  document.getElementById("progress-text").textContent = pct + "%";
  document.querySelectorAll(".nav-item").forEach(el => {
    const id = el.dataset.page;
    let check = el.querySelector(".nav-check");
    if (p[id] && !check) {
      const s = document.createElement("span");
      s.className = "nav-check";
      s.textContent = "✓";
      el.appendChild(s);
    } else if (!p[id] && check) {
      check.remove();
    }
  });
}

/* ---------------- 导航与路由 ---------------- */
function renderNav() {
  document.getElementById("nav").innerHTML = NAV_ITEMS.map(i =>
    `<a class="nav-item" data-page="${i.id}" href="#/${i.id}"><span class="nav-icon">${i.icon}</span>${i.title}</a>`
  ).join("");
}

function currentPage() {
  const h = location.hash.replace(/^#\/?/, "");
  return PAGES[h] ? h : "home";
}

function render() {
  const id = currentPage();
  document.getElementById("content").innerHTML = PAGES[id]();
  document.querySelectorAll(".nav-item").forEach(el =>
    el.classList.toggle("active", el.dataset.page === id)
  );
  window.scrollTo({ top: 0 });
  attachCommon();
  if (id === "basics") initLocationLab();
  if (id === "spa") initTryFilesLab();
  if (id === "proxy") initProxyLab();
  if (id === "generator") initGenerator();
  if (id === "pitfalls") initQuiz();
  updateProgressUI();
  refreshDoneBtn(id);
}

/* ---------------- 公共：复制按钮 + 标记完成 ---------------- */
function attachCommon() {
  document.querySelectorAll("pre").forEach(pre => {
    if (pre.querySelector(".copy-btn")) return;
    const btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.textContent = "复制";
    btn.onclick = () => {
      // 优先取 <code> 文本（不含按钮）；无 code 时克隆 pre 移除按钮兜底
      let text;
      const code = pre.querySelector("code");
      if (code) {
        text = code.innerText;
      } else {
        const clone = pre.cloneNode(true);
        clone.querySelectorAll(".copy-btn").forEach(b => b.remove());
        text = clone.innerText;
      }
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = "已复制 ✓";
        setTimeout(() => (btn.textContent = "复制"), 1500);
      });
    };
    pre.appendChild(btn);
  });

  const doneBtn = document.getElementById("mark-done");
  if (doneBtn) {
    doneBtn.onclick = () => {
      const p = getProgress();
      const id = doneBtn.dataset.page;
      p[id] = !p[id];
      saveProgress(p);
      updateProgressUI();
      refreshDoneBtn(id);
    };
  }
}

function refreshDoneBtn(id) {
  const btn = document.getElementById("mark-done");
  if (!btn) return;
  const p = getProgress();
  const done = !!p[id];
  btn.classList.toggle("done", done);
  btn.textContent = done ? "✓ 本章已学（点击取消）" : "标记本章为已学";
}

/* ================= 实验台 1：location 匹配模拟器 ================= */
const LOCATIONS = [
  { raw: "location = /exact",        type: "exact",   value: "/exact",            tag: "精确" },
  { raw: "location ^~ /static/",     type: "prefix",  value: "/static/", prio: true, tag: "优先前缀 ^~" },
  { raw: "location ~ \\.(js|css)$",  type: "regex",   value: "\\.(js|css)$",  ci: false, tag: "正则（区分大小写）" },
  { raw: "location ~* \\.(png|jpg)$",type: "regex",   value: "\\.(png|jpg)$", ci: true,  tag: "正则（忽略大小写）" },
  { raw: "location /api/",           type: "prefix",  value: "/api/",             tag: "普通前缀" },
  { raw: "location /",               type: "prefix",  value: "/",                 tag: "普通前缀（兜底）" },
];

function matchLocation(uri) {
  const path = uri.split("?")[0];
  const trace = [];

  // 1. 精确匹配
  for (const loc of LOCATIONS.filter(l => l.type === "exact")) {
    if (path === loc.value) {
      trace.push(`① 精确匹配 <span class="r-ok">= ${loc.value}</span> 命中，立即生效`);
      return { hit: loc, trace };
    }
  }
  trace.push('① 无精确匹配（= 检查）');

  // 2. 普通前缀（含 ^~），记最长
  let longest = null;
  for (const loc of LOCATIONS.filter(l => l.type === "prefix")) {
    if (path.startsWith(loc.value)) {
      if (!longest || loc.value.length > longest.value.length) longest = loc;
    }
  }
  if (longest) {
    trace.push(`② 最长前缀匹配：<span class="r-warn">${longest.raw.replace("location ", "")}</span>`);
    if (longest.prio) {
      trace.push("③ 该前缀带 <span class=\"r-warn\">^~</span>，跳过正则，直接生效");
      return { hit: longest, trace, candidate: null };
    }
  } else {
    trace.push("② 无前缀匹配");
  }

  // 3. 正则按顺序
  for (const loc of LOCATIONS.filter(l => l.type === "regex")) {
    const re = new RegExp(loc.value, loc.ci ? "i" : "");
    if (re.test(path)) {
      trace.push(`③ 正则 <span class="r-ok">${loc.raw.replace("location ", "")}</span> 按顺序第一个命中，生效（覆盖前缀）`);
      return { hit: loc, trace, candidate: longest };
    }
  }
  trace.push("③ 正则均未命中");

  // 4. 回退到最长前缀
  if (longest) {
    trace.push(`④ 回退到最长前缀 <span class="r-ok">${longest.raw.replace("location ", "")}</span>`);
    return { hit: longest, trace };
  }
  return { hit: null, trace };
}

function initLocationLab() {
  const list = document.getElementById("loc-list");
  const result = document.getElementById("loc-result");
  const input = document.getElementById("loc-url");

  list.innerHTML = LOCATIONS.map((loc, i) =>
    `<div class="sim-loc" data-i="${i}"><span class="loc-tag">${loc.tag}</span><code>${loc.raw}</code><span class="loc-arrow"></span></div>`
  ).join("");

  function run() {
    let uri = input.value.trim();
    if (!uri.startsWith("/")) uri = "/" + uri;
    const { hit, trace } = matchLocation(uri);
    list.querySelectorAll(".sim-loc").forEach((el, i) => {
      el.classList.toggle("hit", hit && LOCATIONS[i] === hit);
      el.querySelector(".loc-arrow").textContent = hit && LOCATIONS[i] === hit ? "← 生效" : "";
    });
    result.innerHTML =
      `<span class="r-dim">请求：</span><span class="r-ok">${escapeHtml(uri)}</span>\n` +
      trace.map(t => `<span class="r-dim">→</span> ${t}`).join("\n") +
      `\n<span class="r-ok">最终生效：${hit ? escapeHtml(hit.raw) : "无匹配（404）"}</span>`;
  }

  document.getElementById("loc-run").onclick = run;
  input.addEventListener("keydown", e => { if (e.key === "Enter") run(); });
  document.querySelectorAll(".try-url").forEach(el => {
    el.onclick = () => { input.value = el.textContent; run(); };
  });
  run();
}

/* ================= 实验台 2：try_files 模拟器 ================= */
function initTryFilesLab() {
  const input = document.getElementById("tf-url");
  const flow = document.getElementById("tf-flow");
  const result = document.getElementById("tf-result");

  // 模拟的虚拟文件系统
  const FILES = new Set(["/index.html", "/favicon.ico", "/assets/app.a1b2c3.js", "/assets/style.x9y8z7.css"]);
  const DIRS = new Set(["/assets/"]);

  function run() {
    let uri = input.value.trim().split("?")[0];
    if (!uri.startsWith("/")) uri = "/" + uri;

    const nodes = [];
    const lines = [`<span class="r-dim">请求：</span><span class="r-ok">${escapeHtml(uri)}</span>`];

    // location 分流
    if (uri.startsWith("/api/")) {
      nodes.push({ t: "location /api/", on: true });
      nodes.push({ t: "proxy_pass 转发", on: true });
      lines.push('→ 最长前缀匹配命中 <span class="r-warn">location /api/</span>');
      lines.push('→ <span class="r-ok">转发到后端 http://backend:3000' + escapeHtml(uri.slice(4)) + '</span>（绝不回退到 HTML）');
      render(nodes, lines);
      return;
    }

    nodes.push({ t: "location /", on: true });
    lines.push('→ 命中 <span class="r-warn">location /</span>，进入 try_files 流程');

    // try_files 三步
    const fileHit = FILES.has(uri);
    nodes.push({ t: "$uri 文件存在?", on: fileHit });
    if (fileHit) {
      lines.push(`→ ① 文件 <span class="r-ok">${escapeHtml(uri)}</span> 存在，直接返回（200）`);
      render(nodes, lines);
      return;
    }
    lines.push(`→ ① 文件 ${escapeHtml(uri)} <span class="r-dim">不存在</span>`);

    const dirUri = uri.endsWith("/") ? uri : uri + "/";
    const dirHit = DIRS.has(dirUri);
    nodes.push({ t: "$uri/ 目录存在?", on: dirHit });
    if (dirHit) {
      lines.push(`→ ② 目录 <span class="r-ok">${escapeHtml(dirUri)}</span> 存在，按 index 指令处理`);
      render(nodes, lines);
      return;
    }
    lines.push(`→ ② 目录 ${escapeHtml(dirUri)} <span class="r-dim">不存在</span>`);

    nodes.push({ t: "回退 /index.html", on: true });
    if (uri === "/" || uri === "/index.html") {
      lines.push('→ ③ 直接返回 <span class="r-ok">/index.html</span>（200），前端路由渲染首页');
    } else {
      lines.push(`→ ③ 内部重定向到 <span class="r-ok">/index.html</span>（URL 不变，状态码 200）`);
      lines.push(`→ 前端 JS 启动，Router 读取 <span class="r-ok">${escapeHtml(uri)}</span>，渲染对应页面`);
    }
    render(nodes, lines);
  }

  function render(nodes, lines) {
    flow.innerHTML = nodes.map((n, i) =>
      `${i ? '<span class="step-sep">→</span>' : ""}<span class="step-node ${n.on ? "on" : "off"}">${n.t}</span>`
    ).join("");
    result.innerHTML = lines.join("\n");
  }

  document.getElementById("tf-run").onclick = run;
  input.addEventListener("keydown", e => { if (e.key === "Enter") run(); });
  document.querySelectorAll(".tf-try").forEach(el => {
    el.onclick = () => { input.value = el.textContent; run(); };
  });
  run();
}

/* ================= 实验台 3：proxy_pass 演示 ================= */
function initProxyLab() {
  const loc = document.getElementById("px-loc");
  const uri = document.getElementById("px-uri");
  const target = document.getElementById("px-target");
  const result = document.getElementById("px-result");

  function run() {
    const L = loc.value.trim() || "/";
    let U = uri.value.trim();
    if (!U.startsWith("/")) U = "/" + U;
    const T = target.value;

    const matched = U.startsWith(L);
    let finalUrl, explain;

    if (!matched) {
      finalUrl = null;
      explain = `<span class="r-err">请求 ${escapeHtml(U)} 不匹配 location ${escapeHtml(L)}，不会进入此块</span>`;
    } else {
      const u = new URL("http://x" + U);
      const pathOnly = u.pathname + u.search;
      // proxy_pass 是否带 URI 部分（除 host:port 外还有路径，哪怕只是 "/"）
      const uriPart = T.replace(/^https?:\/\/[^/]+/, ""); // "" | "/" | "/v2/"
      const origin = T.slice(0, T.length - uriPart.length); // http://backend:3000
      if (uriPart === "") {
        finalUrl = origin + pathOnly;
        explain = `proxy_pass 只有 host:port（无 URI 部分）→ <span class="r-warn">原样保留完整请求路径</span>`;
      } else {
        const rest = pathOnly.slice(L.length); // 去掉 location 前缀后剩余部分
        finalUrl = origin + uriPart.replace(/\/$/, "") + "/" + rest;
        explain = `proxy_pass 带 URI <span class="r-warn">${escapeHtml(uriPart)}</span> → 请求路径去掉前缀 <span class="r-warn">${escapeHtml(L)}</span> 剩 <span class="r-warn">${escapeHtml("/" + rest)}</span>，拼到 ${escapeHtml(uriPart)} 后面`;
      }
    }

    result.innerHTML = matched
      ? `<span class="r-dim">请求行：</span>${escapeHtml(U)}\n` +
        `<span class="r-dim">匹配：</span><span class="r-ok">location ${escapeHtml(L)}</span> ✓\n` +
        `<span class="r-dim">规则：</span>${explain}\n` +
        `<span class="r-dim">实际转发：</span><span class="r-ok">${escapeHtml(finalUrl)}</span>`
      : explain;
  }

  [loc, uri, target].forEach(el => el.addEventListener("input", run));
  run();
}

/* ================= 配置生成器 ================= */
function buildConfig() {
  const domain = document.getElementById("g-domain").value.trim() || "example.com";
  const root = document.getElementById("g-root").value.trim() || "/usr/share/nginx/html";
  const backend = document.getElementById("g-backend").value.trim() || "http://backend:3000";
  let apiPrefix = document.getElementById("g-apiprefix").value.trim() || "/api/";
  if (!apiPrefix.startsWith("/")) apiPrefix = "/" + apiPrefix;
  if (!apiPrefix.endsWith("/")) apiPrefix += "/";

  const use = id => document.getElementById(id).checked;
  const L = [];
  const push = (s = "") => L.push(s);

  push("# 由「Nginx 速通实验室」配置生成器产出");
  push("# 用法：挂载到 /etc/nginx/conf.d/default.conf 后 nginx -t && nginx -s reload");
  push();

  if (use("g-gzip")) {
    push("# ---- gzip 压缩（放 http 块或 server 块均可）----");
    push("gzip on;");
    push("gzip_min_length 1k;");
    push("gzip_comp_level 6;");
    push("gzip_types text/plain text/css application/json application/javascript text/xml image/svg+xml;");
    push("gzip_vary on;");
    push();
  }

  if (use("g-https")) {
    push("# ---- HTTP 强制跳转 HTTPS ----");
    push("server {");
    push("    listen 80;");
    push(`    server_name ${domain};`);
    push("    return 301 https://$host$request_uri;");
    push("}");
    push();
  }

  push(`# ---- 主站点（${use("g-https") ? "HTTPS" : "HTTP"}）----`);
  push("server {");
  push(use("g-https") ? "    listen 443 ssl;" : "    listen 80;");
  push(`    server_name ${domain};`);
  push(`    root ${root};`);
  push("    index index.html;");

  if (use("g-https")) {
    push();
    push("    # 证书路径按需修改（可用 mkcert 生成本地证书练习）");
    push("    ssl_certificate     /etc/nginx/ssl/" + domain + ".pem;");
    push("    ssl_certificate_key /etc/nginx/ssl/" + domain + ".key;");
    push("    ssl_protocols       TLSv1.2 TLSv1.3;");
    push("    ssl_ciphers         HIGH:!aNULL:!MD5;");
    push("    ssl_session_cache   shared:SSL:10m;");
    push("    ssl_session_timeout 10m;");
    push("    add_header Strict-Transport-Security \"max-age=31536000; includeSubDomains\";");
  }

  if (use("g-security")) {
    push();
    push("    # 安全响应头");
    push("    add_header X-Content-Type-Options \"nosniff\";");
    push("    add_header X-Frame-Options \"SAMEORIGIN\";");
    push("    add_header Referrer-Policy \"strict-origin-when-cross-origin\";");
  }

  if (use("g-proxy")) {
    push();
    push(`    # API 反向代理（注意：proxy_pass 末尾带 / 会去掉 ${apiPrefix} 前缀）`);
    push(`    location ${apiPrefix} {`);
    push(`        proxy_pass ${backend}/;`);
    push("        proxy_set_header Host $host;");
    push("        proxy_set_header X-Real-IP $remote_addr;");
    push("        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;");
    push("        proxy_set_header X-Forwarded-Proto $scheme;");
    push("    }");
  }

  if (use("g-cache")) {
    push();
    push("    # index.html 永不缓存（发版开关）");
    push("    location = /index.html {");
    push("        add_header Cache-Control \"no-cache, no-store, must-revalidate\";");
    push("    }");
    push();
    push("    # 带指纹的构建产物：长缓存一年");
    push("    location /assets/ {");
    push("        expires 1y;");
    push("        add_header Cache-Control \"public, immutable\";");
    push("    }");
  }

  push();
  push("    # 页面路由" + (use("g-spa") ? "（SPA history 回退）" : ""));
  push("    location / {");
  if (use("g-cache")) push("        add_header Cache-Control \"no-cache\";");
  if (use("g-spa")) {
    push("        try_files $uri $uri/ /index.html;");
  }
  push("    }");
  push("}");
  return L.join("\n");
}

function initGenerator() {
  const out = document.querySelector("#g-output code");
  const update = () => { out.textContent = buildConfig(); };
  document.querySelectorAll(".lab input, .lab select").forEach(el =>
    el.addEventListener("input", update)
  );
  document.getElementById("g-copy").onclick = e => {
    navigator.clipboard.writeText(buildConfig()).then(() => {
      e.target.textContent = "已复制 ✓";
      setTimeout(() => (e.target.textContent = "复制配置"), 1500);
    });
  };
  document.getElementById("g-download").onclick = () => {
    const blob = new Blob([buildConfig()], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "nginx.conf";
    a.click();
    URL.revokeObjectURL(a.href);
  };
  update();
}

/* ================= 结课自测 ================= */
function initQuiz() {
  const root = document.getElementById("quiz-root");
  let answered = 0, correct = 0;

  root.innerHTML = QUIZ_DATA.map((q, qi) => `
    <div class="card quiz-card" data-q="${qi}">
      <div class="quiz-q">${qi + 1}. ${q.q}</div>
      <div class="quiz-opts">
        ${q.opts.map((o, oi) => `<div class="quiz-opt" data-o="${oi}">${o}</div>`).join("")}
      </div>
      <div class="quiz-explain">${q.explain}</div>
    </div>`).join("");

  root.querySelectorAll(".quiz-opt").forEach(el => {
    el.onclick = () => {
      const card = el.closest(".quiz-card");
      if (card.dataset.done) return;
      card.dataset.done = "1";
      const qi = +card.dataset.q, oi = +el.dataset.o;
      const q = QUIZ_DATA[qi];
      answered++;
      if (oi === q.answer) { correct++; el.classList.add("right"); }
      else {
        el.classList.add("wrong");
        card.querySelector(`[data-o="${q.answer}"]`).classList.add("right");
      }
      card.querySelector(".quiz-explain").classList.add("show");
      if (answered === QUIZ_DATA.length) {
        const score = document.getElementById("quiz-score");
        score.style.display = "block";
        const pass = correct === QUIZ_DATA.length;
        score.innerHTML = pass
          ? `<span class="r-ok">★ ${correct}/${QUIZ_DATA.length} 满分！你已经具备独立配置前端 Nginx 的能力，去生成器产出你的配置吧。</span>`
          : `<span class="r-warn">得分 ${correct}/${QUIZ_DATA.length}。答错的章节建议回看后再试（刷新页面可重做）。</span>`;
        if (pass) {
          const p = getProgress();
          p["pitfalls"] = true;
          saveProgress(p);
          updateProgressUI();
          refreshDoneBtn("pitfalls");
        }
      }
    };
  });
}

/* ---------------- 工具 ---------------- */
function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ---------------- 启动 ---------------- */
renderNav();
window.addEventListener("hashchange", render);
render();
