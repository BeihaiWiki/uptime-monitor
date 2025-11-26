window.Config = {

  // 显示标题
  SiteName: 'Uptime Monitor',

  // UptimeRobot Api Keys
  // 支持 Monitor-Specific 和 Read-Only
  ApiKeys: [
    'ur3194908-0112d4b7402d6f5169bf2748'
  ],

  // 日志天数
  CountDays: 60,

  // 是否显示检测站点的链接
  ShowLink: true,

  // 高级配置选项（可选）
  // AdvancedConfig: {
  //   includeResponseTimes: false, // 是否包含响应时间数据（会影响性能）
  //   enableTimezone: true, // 是否启用时区显示（已默认启用）
  //   maxMonitors: 50, // 最大监控器数量（已默认设置）
  // },

  // 导航栏菜单
  Navi: [
    {
      text: 'Homepage',
      url: 'https://status.beihai.wiki/'
    },
    {
      text: 'GitHub',
      url: 'https://github.com/BeiHaiWiki'
    },
    {
      text: 'Blog',
      url: 'https://beihai.wiki/'
    },
  ],
};
