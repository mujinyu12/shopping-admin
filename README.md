# 慕今予商城 · 管理端

商城运营后台，Vue 3 + Vite + TypeScript + Element Plus。包含首页看板、商品与分类管理、品牌、规格、秒杀活动、订单、退款审核、用户、管理员与角色权限等模块。

> 后端：[mujinyu-shopping](https://github.com/mujinyu12/mujinyu-shopping) · 用户端：[shopping-user](https://github.com/mujinyu12/shopping-user)

## 技术栈

| 分类 | 选型 |
| --- | --- |
| 框架 | Vue 3.5（`<script setup>`）、TypeScript |
| 构建 | Vite 8 |
| UI | Element Plus 2.14 |
| 状态管理 | Pinia 4 |
| 路由 | Vue Router 4（**hash 模式**，地址形如 `/#/goods/seckill`） |
| 请求 | Axios（统一拦截器 + 401 跳登录） |
| 其他 | NProgress（顶部进度条）、sass、vue-tsc |

## 快速开始

```bash
npm install
npm run dev        # 默认 http://localhost:5173
```

```bash
npm run build      # vite build
npm run preview    # 预览构建产物
```

> 后端需先启动 `shopping_manager_api`（`http://localhost:8001`），否则登录会失败。

默认管理账号见数据库 `bz_admin` 表（账号自建，密码为 `md5(明文 + "MUJINYU")`）。登录态用的是 **Session Cookie**，不是 localStorage token。

## 代理配置

`.env.development`：

| 环境变量 | 默认值 | 说明 |
| --- | --- | --- |
| `VITE_API_BASE` | `/api` | 请求前缀 |
| `VITE_PROXY_TARGET` | `http://localhost:8001` | 后端管理接口地址 |
| `VITE_APP_TITLE` | `慕今予商城 · 运营后台` | 页面标题 |

所有接口都打到 `shopping_manager_api`（8001），再由它通过 Dubbo 调用各业务服务。

## 目录结构

```
shopping-admin/
├── src/
│   ├── api/            # 接口封装，按业务域拆分（goods.ts、order.ts、seckill.ts…）
│   ├── layout/         # 框架布局（侧边栏、顶栏、标签页）
│   ├── router/         # 路由表与守卫
│   ├── stores/         # Pinia（用户、权限、标签页）
│   ├── utils/          # 请求封装、文本处理（htmlToText）、格式化
│   └── views/
│       ├── dashboard/  # 首页看板
│       ├── goods/      # 商品、分类、品牌、规格、秒杀活动
│       ├── order/      # 订单、退款审核
│       ├── user/       # 会员用户
│       ├── system/     # 管理员、角色权限
│       └── redirect/   # 刷新中转页
├── public/
└── vite.config.ts
```

## 功能模块

| 菜单 | 说明 |
| --- | --- |
| 首页看板 | 今日成交、订单量、商品数等统计 |
| 商品管理 | 商品增删改查、上下架、图片上传（MinIO） |
| 分类 / 品牌 / 规格 | 分类树、品牌管理、规格模板 |
| 秒杀活动 | 新建/编辑活动、选商品自动带价、活动时间、活动介绍 |
| 订单管理 | 订单查询、发货、关闭 |
| 退款审核 | 退款单列表、通过驳回 |
| 会员用户 | 用户列表与状态 |
| 系统管理 | 管理员账号、角色与权限分配 |

## 几个实现细节

- **路由刷新**：顶栏刷新按钮走 `/#/redirect?target=<当前地址>` 中转页再跳回，避免直接 `location.reload()` 丢查询参数；该路由 `meta.hidden` 不出现在侧边栏
- **富文本字段**：秒杀活动介绍等历史数据里可能存的是 HTML，读取时用 `utils/text.ts` 的 `htmlToText()` 转纯文本显示（图片保留为 `[图片] 地址`），保存时写纯文本
- **时间字段**：日期选择器统一 `value-format="YYYY-MM-DD HH:mm:ss"`，与后端 `@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")` 对齐；**带 `T` 的 ISO 格式会被后端拒绝**并报「请求体缺失或格式错误」
- **接口路径**：所有请求以 `/api` 开头，由 Vite 代理转发到 8001

## 常见问题

| 现象 | 处理 |
| --- | --- |
| 登录一直转圈或 502 | 后端 `shopping_manager_api`（8001）没启动 |
| 新建/编辑保存报「参数异常: 请求体缺失或格式错误」 | 多半是日期字段格式不对（缺空格或带了 `T`），检查 `value-format` |
| 页面白屏、控制台 404 | 路由是 hash 模式，直接访问 `/goods/list` 这类路径无效，要用 `/#/goods/list` |
| 图片上传失败 | 后端 `shopping_file_service`（20883）与 MinIO 未启动 |

## 声明

个人学习 / 毕业设计项目，仅供学习参考。