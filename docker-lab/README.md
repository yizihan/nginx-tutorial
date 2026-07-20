# Docker 练习环境

配套「Nginx 速通实验室」的本地实测环境。教程里讲的每一条规则，都能在这里用真实 Nginx 验证。

## 目录

```
docker-lab/
├── docker-compose.yml      # 一键启动
├── conf.d/default.conf     # 练习配置（挂载进容器，改完热重载即生效）
└── site/                   # 测试站点（index.html + assets/）
```

## 常用命令

在 `docker-lab` 目录下执行：

```bash
# 启动 / 停止
docker compose up -d
docker compose down

# 修改配置后：校验 + 热重载（不中断服务）
docker exec nginx-lab nginx -t
docker exec nginx-lab nginx -s reload

# 看日志
docker logs nginx-lab --tail 50 -f

# 进容器排查
docker exec -it nginx-lab sh
```

## 验证清单

```bash
# 首页 200，HTML 不缓存
curl -I http://localhost:8081/

# 静态资源：一年强缓存 + immutable
curl -I http://localhost:8081/assets/style.css

# gzip 压缩（看 Content-Encoding: gzip）
curl -I -H "Accept-Encoding: gzip" http://localhost:8081/assets/style.css

# SPA 回退：不存在的路径也返回 index.html（200，URL 不变）
curl -I http://localhost:8081/any/spa/route

# 反代测试：本机起个 3000 端口的后端，然后
curl http://localhost:8081/api/hello
```

## 建议练习

1. 把 `conf.d/default.conf` 里 `location /assets/` 的 `expires 1y` 改成 `expires 1h`，`nginx -s reload` 后用 `curl -I` 观察 `Cache-Control` 变化
2. 把 `proxy_pass http://host.docker.internal:3000/;` 末尾的 `/` 去掉，起个本地后端观察转发路径的差异（对应教程第 04 章「斜杠之谜」）
3. 用教程里的「配置生成器」产出一份配置，替换 `default.conf` 后重载实测

注意：本机 8080 已被 nginx0720 容器占用，故本环境用 **8081**。
