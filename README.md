<div align="center">

![Uptime Monitor Logo](https://img.shields.io/badge/Uptime-Monitor-blue?style=for-the-badge&logo=monitor-shield)

# Uptime Monitor

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![GitHub stars](https://img.shields.io/github/stars/BeihaiWiki/uptime-monitor?style=social)](https://github.com/yb/uptime-monitor/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/BeihaiWiki/uptime-monitor?style=social)](https://github.com/yb/uptime-monitor/network)

**🚀 基于 UptimeRobot API 的现代化在线状态监控面板**

一个开源、美观、易用的网站状态监控解决方案，实时展示您的网站可用性和性能数据。

[查看演示](https://monitor.beihai.wiki/) · [报告问题](https://github.com/BeihaiWiki/uptime-monitor/issues) · [功能请求](https://github.com/BeihaiWiki/uptime-monitor/issues/new?template=feature_request.md)

---

![Uptime Monitor Screenshot](https://user-images.githubusercontent.com/25887822/178935137-6d23521d-5894-4fb8-922d-3575be4f7abc.png)

</div>

## ✨ 功能特性

- 🌟 **现代化界面** - 基于 React 18 构建，响应式设计，完美适配桌面端和移动端
- 📊 **实时监控** - 通过 UptimeRobot API 实时显示网站状态和可用性
- 📈 **数据分析** - 展示历史数据、统计信息和 uptime 趋势图
- 🎨 **高度可定制** - 支持自定义配置、主题和品牌化
- 🌐 **多语言支持** - 中文界面，技术术语双语显示
- ⚡ **零配置部署** - 纯静态文件，可部署到任何静态托管服务
- 🔒 **安全可靠** - 支持只读 API 密钥，保护您的数据安全
- 📱 **移动端优化** - 专为移动设备优化的用户界面

## 🚀 快速开始

### 前置要求

- [UptimeRobot](https://uptimerobot.com/) 账户和 API 密钥
- 基础的网页托管服务（Nginx、Apache、静态存储等）

### 方式一：直接部署（推荐）

1. **下载最新版本**

   ```bash
   # 下载预构建文件
   curl -L -o uptime-monitor.zip https://github.com/yb/uptime-monitor/releases/latest/download/uptime-monitor.zip
   unzip uptime-monitor.zip
   ```

2. **配置项目**

   编辑 `public/config.js` 文件：

   ```javascript
   window.Config = {
     SiteName: '我的状态监控',  // 显示标题
     ApiKeys: ['your-api-key'],  // UptimeRobot API 密钥
     CountDays: 60,              // 显示天数
     ShowLink: true,             // 显示站点链接
     Navi: [                     // 导航菜单
       { text: '首页', url: 'https://example.com' },
       { text: 'GitHub', url: 'https://github.com/username' }
     ]
   };
   ```

3. **上传到服务器**

   将所有文件上传到您的网页托管空间即可。

### 方式二：本地开发

```bash
# 克隆仓库
git clone git@github.com:BeihaiWiki/uptime-monitor.git
cd uptime-monitor

# 安装依赖
npm install

# 启动开发服务器
npm start

# 构建生产版本
npm run build
```

## 📋 配置说明

| 参数 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
| `SiteName` | string | 网站标题 | `"Uptime Monitor"` |
| `ApiKeys` | string[] | UptimeRobot API 密钥数组 | `[]` |
| `CountDays` | number | 显示天数 | `60` |
| `ShowLink` | boolean | 是否显示站点链接 | `true` |
| `Navi` | object[] | 导航菜单配置 | `[]` |

### 高级配置

```javascript
window.Config = {
  // ...基础配置...

  // 高级选项
  AdvancedConfig: {
    includeResponseTimes: false,  // 包含响应时间数据
    enableTimezone: true,         // 启用时区显示
    maxMonitors: 50,             // 最大监控器数量
    refreshInterval: 60000       // 刷新间隔（毫秒）
  }
};
```

## 🛠️ 技术栈

- **前端框架**: ![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
- **构建工具**: ![Create React App](https://img.shields.io/badge/Create%20React%20App-5.0.1-09D3AC?logo=react)
- **HTTP 客户端**: ![Axios](https://img.shields.io/badge/Axios-0.27.2-5A29E4?logo=axios)
- **样式预处理**: ![Sass](https://img.shields.io/badge/Sass-1.53.0-CC6699?logo=sass)
- **日期处理**: ![Day.js](https://img.shields.io/badge/Day.js-1.11.3-003087)
- **工具提示**: ![React Tooltip](https://img.shields.io/badge/React%20Tooltip-4.2.21-FFCA28?logo=react)

## 📦 部署指南

### 静态托管服务

本项目可以部署到任何支持静态文件的托管服务：

| 服务 | 部署方式 | 说明 |
|------|----------|------|
| GitHub Pages | 自动部署 | 连接仓库自动构建 |
| Netlify | 拖拽部署 | 直接拖拽构建文件夹 |
| Vercel | Git 集成 | 连接 GitHub 仓库 |
| 阿里云 OSS | 上传文件 | 静态网站托管 |
| Nginx | 配置代理 | 反向代理到静态文件 |

## 🔧 配置详解

### 基础配置

编辑 `public/config.js` 文件进行基础配置：

```javascript
window.Config = {
  SiteName: '我的状态监控',  // 显示标题
  ApiKeys: ['your-api-key'],  // UptimeRobot API 密钥
  CountDays: 60,              // 显示天数
  ShowLink: true,             // 是否显示站点链接
  Navi: [                     // 导航菜单
    { text: '首页', url: 'https://example.com' },
    { text: 'GitHub', url: 'https://github.com/username' }
  ]
};
```

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/uptime-monitor;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### API 代理配置（可选）

如果遇到 CORS 问题，可以配置 API 代理：

```nginx
server {
    listen 80;
    server_name api-proxy.your-domain.com;

    location / {
        proxy_ssl_server_name on;
        proxy_pass https://api.uptimerobot.com/;
        proxy_hide_header Access-Control-Allow-Origin;
        add_header Access-Control-Allow-Origin * always;
    }
}
```

## 🤝 贡献指南

我们欢迎所有形式的贡献！请阅读我们的 [贡献指南](CONTRIBUTING.md) 了解详细信息。

### 如何贡献

1. **Fork** 本仓库
2. **创建** 功能分支 (`git checkout -b feature/amazing-feature`)
3. **提交** 更改 (`git commit -m 'Add some amazing feature'`)
4. **推送** 到分支 (`git push origin feature/amazing-feature`)
5. **创建** Pull Request

### 开发环境设置

```bash
# 安装依赖，推荐使用pnpm
npm install

# 启动开发服务器
npm start

# 运行代码检查
npm run lint

# 构建生产版本
npm run build
```

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE) 开源。

## 🙏 致谢

- [UptimeRobot](https://uptimerobot.com/) - 提供强大的监控 API
- [React](https://reactjs.org/) - 现代化的前端框架
- [uptime-status](https://github.com/yb/uptime-status/) - 一代开发者
- 所有贡献者和支持者

## 📊 项目统计

![GitHub repo size](https://img.shields.io/github/repo-size/BeihaiWiki/uptime-monitor)
![GitHub last commit](https://img.shields.io/github/last-commit/BeihaiWiki/uptime-monitor)
![GitHub issues](https://img.shields.io/github/issues/BeihaiWiki/uptime-monitor)
![GitHub pull requests](https://img.shields.io/github/issues-pr/BeihaiWiki/uptime-monitor)

## 🙏 致谢

- [UptimeRobot](https://uptimerobot.com/) - 提供强大的监控 API
- [React](https://reactjs.org/) - 现代化的前端框架
- [uptime-status](https://github.com/yb/uptime-status/) - 一代开发者
- 所有贡献者和支持者

## 📊 项目统计

![GitHub repo size](https://img.shields.io/github/repo-size/BeihaiWiki/uptime-monitor)
![GitHub last commit](https://img.shields.io/github/last-commit/BeihaiWiki/uptime-monitor)
![GitHub issues](https://img.shields.io/github/issues/BeihaiWiki/uptime-monitor)
![GitHub pull requests](https://img.shields.io/github/issues-pr/BeihaiWiki/uptime-monitor)
![GitHub license](https://img.shields.io/github/license/BeihaiWiki/uptime-monitor)

---

<div align="center">

  如果这个项目对您有帮助，请给我们一个 ⭐️

  Made with ❤️ by [BeiHaiWiki](https://beihai.wiki/)
</div>

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=BeihaiWiki/uptime-monitor&type=date&legend=top-left)](https://www.star-history.com/#BeihaiWiki/uptime-monitor&type=date&legend=top-left)