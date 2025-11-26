# 贡献指南

感谢您对 Uptime Monitor 项目的关注！我们欢迎各种形式的贡献。

## 如何贡献

### 报告问题

如果您发现了 bug 或有功能建议，请：

1. 检查 [Issues](https://github.com/your-username/uptime-monitor/issues) 确认问题未被报告
2. 创建新的 Issue，详细描述问题或建议
3. 提供重现步骤、截图或相关信息

### 提交代码

1. **Fork** 本仓库
2. **克隆** 您的 fork 到本地：
   ```bash
   git clone https://github.com/your-username/uptime-monitor.git
   cd uptime-monitor
   ```

3. **创建** 新分支：
   ```bash
   git checkout -b feature/amazing-feature
   # 或者
   git checkout -b fix/fix-bug
   ```

4. **安装** 依赖：
   ```bash
   npm install
   ```

5. **开发** 您的更改：
   ```bash
   npm start  # 启动开发服务器
   ```

6. **测试** 您的更改确保正常工作

7. **提交** 您的更改：
   ```bash
   git add .
   git commit -m "Add some amazing feature"
   ```

8. **推送** 到您的 fork：
   ```bash
   git push origin feature/amazing-feature
   ```

9. **创建** Pull Request

## 代码规范

- 使用现代 JavaScript (ES6+) 语法
- 遵循 React 最佳实践
- 保持代码整洁和可读性
- 添加适当的注释
- 确保响应式设计

## 项目结构

- `src/components/` - React 组件
- `src/common/` - 工具函数和 API 调用
- `public/` - 静态资源和配置文件
- `public/config.js` - 主配置文件

## 开发环境

- Node.js 16+
- npm 或 yarn
- 现代浏览器

## 提交信息规范

使用清晰的提交信息格式：

```
type: description

[optional body]
```

类型：
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

示例：
```
feat: 添加暗色主题支持

- 添加暗色主题配置选项
- 实现主题切换功能
- 更新 CSS 变量
```

## 发布

发布由维护者负责。重大更改需要更新版本号和文档。

## 联系方式

如有问题，请通过以下方式联系：

- GitHub Issues
- 邮箱：beihaiwiki@163.com

## 行为准则

请保持友善和专业的交流。尊重所有贡献者。