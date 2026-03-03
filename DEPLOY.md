# 自动化部署指南

## 概述

本项目使用 GitHub Actions 实现自动构建和部署。当代码推送到 `main` 分支时，会自动触发构建并部署到你的云服务器。

## 服务器配置

### 1. 创建 SSH 密钥对（如果没有）

在你的本地机器上执行：

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github-actions-key -N ""
```

这将生成：
- `~/.ssh/github-actions-key` - 私钥
- `~/.ssh/github-actions-key.pub` - 公钥

### 2. 将公钥添加到服务器

```bash
# 将公钥复制到服务器
ssh-copy-id -i ~/.ssh/github-actions-key.pub user@your-server-ip

# 或者手动添加
cat ~/.ssh/github-actions-key.pub | ssh user@your-server-ip "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

### 3. 验证 SSH 连接

```bash
ssh -i ~/.ssh/github-actions-key user@your-server-ip
```

### 4. 创建部署目录

登录服务器后：

```bash
# 创建部署目录（根据你的 Caddy 配置调整）
sudo mkdir -p /var/www/baby
sudo chown -R $USER:$USER /var/www/baby
```

### 5. Caddy 配置示例

在 Caddyfile 中添加：

```
your-domain.com {
    root * /var/www/baby
    file_server
    try_files {path} /index.html
}
```

重载 Caddy：

```bash
sudo systemctl reload caddy
```

## GitHub 仓库配置

在 GitHub 仓库中添加以下 Secrets（Settings → Secrets and variables → Actions）：

| Secret 名称 | 说明 | 示例 |
|------------|------|------|
| `SSH_PRIVATE_KEY` | SSH 私钥内容 | `cat ~/.ssh/github-actions-key` 的输出 |
| `REMOTE_HOST` | 服务器 IP 或域名 | `123.45.67.89` 或 `example.com` |
| `REMOTE_USER` | SSH 用户名 | `ubuntu` 或 `root` |
| `DEPLOY_PATH` | 服务器部署路径 | `/var/www/baby` |

### 添加 Secrets 步骤

1. 进入 GitHub 仓库页面
2. 点击 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret**
4. 依次添加上述 4 个 Secret

## 工作流程

```
push 到 main 分支
        ↓
GitHub Actions 触发
        ↓
检出代码
        ↓
安装 Node.js 依赖
        ↓
执行 npm run build
        ↓
通过 SSH 将 dist/ 同步到服务器
        ↓
部署完成
```

## 手动触发部署

你也可以在 GitHub Actions 页面手动触发部署：

1. 进入仓库的 **Actions** 标签页
2. 选择 **Build and Deploy** 工作流
3. 点击 **Run workflow**

## 常见问题

### 部署失败：Permission denied

检查服务器上的目录权限和 SSH 密钥配置。

### 部署成功但页面空白

检查 Caddy 配置中的 `root` 路径是否正确，以及 `try_files` 指令是否包含 SPA 路由支持。

### SSH 连接超时

确保服务器防火墙开放了 22 端口。