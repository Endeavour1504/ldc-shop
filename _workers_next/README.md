# LDC Shop (Cloudflare Workers Edition)


基于 **Next.js 16**、**Cloudflare Workers** (OpenNext)、**D1 Database** 和 **Shadcn UI** 构建的无服务器虚拟商品商店。

## 🛠 技术架构 (Technical Architecture)

本版本采用 **Next.js on Workers** 的前沿技术路线，而非传统的单文件 Worker：

*   **核心框架**: **Next.js 16 (App Router)** - 保持与 Vercel 版本一致的现代化开发体验。
*   **适配器**: **OpenNext (Cloudflare Adapter)** - 目前最先进的 Next.js 到 Workers 的转换方案，支持大部分 Next.js 特性。
*   **数据库**: **Cloudflare D1 (SQLite)** - 边缘原生关系型数据库，替代 Vercel Postgres。
*   **ORM**: **Drizzle ORM** - 完美适配 D1，提供类型安全的 SQL 操作。
*   **部署**: **Wrangler** - 一键部署到全球边缘网络。

此架构旨在结合 Next.js 的开发效率与 Cloudflare 的边缘性能/低成本优势。

## ✨ 特性

- **OpenNext**: 在 Cloudflare Workers 运行时上完整运行 Next.js App Router。
- **Cloudflare D1**: 使用边缘 SQLite 数据库，低成本高性能。
- **Linux DO 集成**: 内置 OIDC 登录与 EasyPay 支付。
- **完整商城功能**:
    - 🔍 **搜索与筛选**: 客户端即时搜索。
    -  **Markdown 描述**: 商品支持富文本。
    - � **限购与库存**: 实时库存扣减，防止超卖。
    - � **自动发货**: 支付成功后自动展示卡密。
    - 🧾 **订单管理**: 完整的订单流程与管理员后台。
- **管理后台**:
    - 商品/分类管理、库存管理、销售统计、订单处理、顾客管理。

## 🚀 部署指南

### 网页部署 (Workers Builds)

无需命令行，完全在 Cloudflare Dashboard 操作。

#### 1. 创建 D1 数据库

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 左侧菜单 **Storage & Databases** → **D1**
3. 点击 **Create database**，输入名称（如 `ldc-shop`）

#### 2. 连接 Git 仓库部署

1. Cloudflare Dashboard → **Workers & Pages** → **Create application**
2. 选择 **Connect to Git**，连接你的 GitHub/GitLab 仓库
3. 配置构建设置：
   - **Path**: `_workers_next`
   - **Build command**: `npm install && npx opennextjs-cloudflare build`
   - **Deploy command**: `npx wrangler deploy`

4. 点击 **Deploy**（首次可能会失败，因为还没绑定数据库，继续下一步）

#### 3. 绑定 D1 数据库

部署后，进入项目 **Settings** → **Bindings**：

1. 点击 **Add binding**
2. 选择 **D1 Database**
3. **Variable name**: `DB`（必须是这个名字）
4. 选择你创建的数据库
5. 保存

#### 4. 配置环境变量

进入项目 **Settings** → **Variables and Secrets**：

| 变量名 | 类型 | 说明 |
|--------|------|------|
| `OAUTH_CLIENT_ID` | Text 或 Secret | Linux DO Connect Client ID |
| `OAUTH_CLIENT_SECRET` | Secret | Linux DO Connect Client Secret |
| `MERCHANT_ID` | Text 或 Secret | EPay 商户 ID |
| `MERCHANT_KEY` | Secret | EPay 商户 Key |
| `AUTH_SECRET` | Secret | 随机字符串 (可用 `openssl rand -base64 32` 生成) |
| `ADMIN_USERS` | Text | 管理员用户名，逗号分隔 |
| `NEXT_PUBLIC_APP_URL` | **Text** | 你的 Workers 域名 (如 `https://ldc-shop.xxx.workers.dev`) |

> ⚠️ **重要**: `NEXT_PUBLIC_APP_URL` **必须**设置为 Text 类型，不能用 Secret，否则支付签名会失败！

#### 5. 重新部署

回到 **Deployments** 页面，点击最新部署记录的 **Retry deployment**。

#### 6. 首次访问

访问你的 Workers 域名，首页会自动创建所有数据库表。

---

## � 本地开发

本地开发使用 SQLite 文件模拟 D1。

1. **配置本地环境**
   复制 `.env.example` (如果有) 或直接创建 `.env.local`：
   ```bash
   LOCAL_DB_PATH=local.sqlite
   ```

2. **生成本地数据库**
   ```bash
   npx drizzle-kit push
   ```
   这会创建一个 `local.sqlite` 文件。

3. **启动开发服务器**
   ```bash
   npm run dev
   ```
   访问 `http://localhost:3000`。

## ⚙️ 环境变量说明

| 变量名 | 说明 |
|Ref | Ref Description|
| `OAUTH_CLIENT_ID` | Linux DO Connect Client ID |
| `OAUTH_CLIENT_SECRET` | Linux DO Connect Client Secret |
| `MERCHANT_ID` | EPay 商户 ID |
| `MERCHANT_KEY` | EPay 商户 Key |
| `AUTH_SECRET` | NextAuth 加密密钥 |
| `ADMIN_USERS` | 管理员用户名列表 (逗号分隔) |
| `NEXT_PUBLIC_APP_URL` | 部署后的完整 URL (用于回调) |

## 📄 许可证
MIT
