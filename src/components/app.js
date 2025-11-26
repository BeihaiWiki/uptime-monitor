import { useMemo, useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import Link from './link';
import Header from './header';
import UptimeRobot from './uptimerobot';
import Package from '../../package.json';
import { GetMonitors } from '../common/uptimerobot';

function App() {
  const apikeys = useMemo(() => {
    const { ApiKeys } = window.Config;
    if (Array.isArray(ApiKeys)) return ApiKeys;
    if (typeof ApiKeys === 'string') return [ApiKeys];
    return [];
  }, []);

  // 状态管理
  const [monitorsData, setMonitorsData] = useState({});
  const [filter, setFilter] = useState('all'); // all, online, offline
  const [sortBy, setSortBy] = useState('default'); // default, response, uptime, downtime
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [justRefreshed, setJustRefreshed] = useState(false); // 新增：跟踪是否刚刚完成刷新

  // 获取所有监控数据
  const fetchAllMonitors = async () => {
    const { CountDays } = window.Config;
    const newMonitorsData = {};

    try {
      const promises = apikeys.map(async (key) => {
        const includeResponseTimes = window.Config.AdvancedConfig?.includeResponseTimes || false;
        const monitors = await GetMonitors(key, CountDays, includeResponseTimes);
        return monitors || [];
      });

      const results = await Promise.all(promises);
      apikeys.forEach((key, index) => {
        newMonitorsData[key] = results[index] || [];
      });

      setMonitorsData(newMonitorsData);
    } catch (error) {
      console.error('Failed to fetch monitors:', error);
    }
  };

  // 初始化获取数据
  useEffect(() => {
    fetchAllMonitors();
  }, [refreshKey, apikeys]);

  // 当数据加载完成后重新构建tooltip
  useEffect(() => {
    if (Object.keys(monitorsData).length > 0) {
      setTimeout(() => {
        ReactTooltip.rebuild();
      }, 500);
    }
  }, [monitorsData]);

  // 刷新功能
  const handleRefresh = async () => {
    if (isRefreshing) return; // 防止重复刷新

    setIsRefreshing(true);
    setRefreshKey(prev => prev + 1);

    // 等待数据获取完成
    await fetchAllMonitors();

    // 最小显示1秒的加载效果，让用户看到刷新动画
    setTimeout(() => {
      setIsRefreshing(false);
      setJustRefreshed(true); // 设置刚刚完成刷新状态

      // 刷新完成后重新构建tooltip
      setTimeout(() => {
        ReactTooltip.rebuild();
      }, 100);

      // 2秒后清除刷新完成状态，让卡片动画结束
      setTimeout(() => {
        setJustRefreshed(false);
      }, 2000);
    }, 1000);
  };

  // 计算统计信息
  const stats = useMemo(() => {
    let totalSites = 0;
    let onlineSites = 0;
    let offlineSites = 0;

    Object.values(monitorsData).forEach(monitors => {
      monitors.forEach(site => {
        totalSites++;
        if (site.status === 'ok') {
          onlineSites++;
        } else if (site.status === 'down') {
          offlineSites++;
        }
      });
    });

    return { total: totalSites, online: onlineSites, offline: offlineSites };
  }, [monitorsData]);

  // 获取过滤后的监控数据
  const getFilteredMonitors = () => {
    const filteredData = {};

    Object.entries(monitorsData).forEach(([key, monitors]) => {
      let filteredMonitors = monitors;

      // 应用筛选
      if (filter === 'online') {
        filteredMonitors = monitors.filter(site => site.status === 'ok');
      } else if (filter === 'offline') {
        filteredMonitors = monitors.filter(site => site.status === 'down');
      }

      // 应用排序
      if (sortBy === 'uptime') {
        filteredMonitors = [...filteredMonitors].sort((a, b) => {
          const uptimeA = parseFloat(a.average) || 0;
          const uptimeB = parseFloat(b.average) || 0;
          return uptimeB - uptimeA;
        });
      } else if (sortBy === 'response') {
        filteredMonitors = [...filteredMonitors].sort((a, b) => {
          // 这里假设有响应时间数据，如果没有则按其他指标排序
          return a.name.localeCompare(b.name);
        });
      } else if (sortBy === 'downtime') {
        filteredMonitors = [...filteredMonitors].sort((a, b) => {
          // 按故障次数降序排列（故障次数多的排在前面）
          const downtimeA = (a.total?.times || 0);
          const downtimeB = (b.total?.times || 0);

          // 首先按故障次数降序，如果故障次数相同则按名称排序
          if (downtimeA !== downtimeB) {
            return downtimeB - downtimeA; // 降序排列
          } else {
            return a.name.localeCompare(b.name);
          }
        });
      }

      if (filteredMonitors.length > 0) {
        filteredData[key] = filteredMonitors;
      }
    });

    return filteredData;
  };

  const filteredMonitorsData = getFilteredMonitors();

  // 获取全局站点索引（用于显示序号）
  const getGlobalSiteIndex = (siteId, filteredData) => {
    let index = 1;
    for (const monitors of Object.values(filteredData)) {
      for (const site of monitors) {
        if (site.id === siteId) {
          return index;
        }
        index++;
      }
    }
    return 1;
  };

  return (
    <div className='app-layout'>
      {/* 侧边栏 */}
      <aside className='sidebar'>
        <div className='sidebar-header'>
          <h1 className='logo'>{window.Config.SiteName}</h1>
          <p className='subtitle'>实时监控网站状态和可用性</p>
        </div>
        <nav className='sidebar-nav'>
          <div className='nav-section'>
            <div className='nav-title'>监控</div>
            <button
              className={`nav-item ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              <span className='nav-icon'>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8M8 16h6" />
                </svg>
              </span>
              <span>所有站点</span>
              <span className='nav-count'>{stats.total}</span>
            </button>
            <button
              className={`nav-item ${filter === 'online' ? 'active' : ''}`}
              onClick={() => setFilter('online')}
            >
              <span className='nav-icon'>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <span>在线站点</span>
              <span className='nav-count'>{stats.online}</span>
            </button>
            <button
              className={`nav-item ${filter === 'offline' ? 'active' : ''}`}
              onClick={() => setFilter('offline')}
            >
              <span className='nav-icon'>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <span>离线站点</span>
              <span className='nav-count'>{stats.offline}</span>
            </button>
          </div>
          <div className='nav-section'>
            <div className='nav-title'>排序</div>
            <button
              className={`nav-item ${sortBy === 'default' ? 'active' : ''}`}
              onClick={() => setSortBy('default')}
            >
              <span className='nav-icon'>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </span>
              <span>默认顺序</span>
            </button>
            <button
              className={`nav-item ${sortBy === 'uptime' ? 'active' : ''}`}
              onClick={() => setSortBy('uptime')}
            >
              <span className='nav-icon'>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18v2H3V4zm0 7h12v2H3v-2zm0 7h6v2H3v-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 16l-3-3 3-3" />
                </svg>
              </span>
              <span>可用率排序</span>
            </button>
            <button
              className={`nav-item ${sortBy === 'response' ? 'active' : ''}`}
              onClick={() => setSortBy('response')}
            >
              <span className='nav-icon'>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h12M4 18h8" />
                  <circle cx="18" cy="6" r="2" />
                </svg>
              </span>
              <span>名称排序</span>
            </button>
            <button
              className={`nav-item ${sortBy === 'downtime' ? 'active' : ''}`}
              onClick={() => setSortBy('downtime')}
            >
              <span className='nav-icon'>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18v2H3V4zm0 7h12v2H3v-2zm0 7h6v2H3v-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 8l3 3-3 3" />
                </svg>
              </span>
              <span>故障率排序</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* 主内容区域 */}
      <main className='main-content'>
        <Header
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          currentFilter={filter}
          onFilterChange={setFilter}
        />
        <div className='content-area'>
          <div id='uptime'>
            {isRefreshing && Object.keys(monitorsData).length === 0 ? (
              <div className='loading-state'>
                <div className='loading-spinner'>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4m0 12v4m8.485-2.485l-2.828-2.828M6.343 6.343l-2.828-2.828m12.728 0l-2.828 2.828M6.343 17.657l-2.828 2.828" />
                    <circle cx="12" cy="12" r="9" strokeDasharray="1 2" opacity="0.3" />
                    <animateTransform
                      attributeName="transform"
                      attributeType="XML"
                      type="rotate"
                      from="0 12 12"
                      to="360 12 12"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </svg>
                </div>
                <div className='loading-text'>正在获取站点数据...</div>
              </div>
            ) : Object.keys(filteredMonitorsData).length > 0 ? (
              <div className='sites-grid'>
                {Object.entries(filteredMonitorsData).map(([key, monitors]) =>
                  monitors.map((site, index) => (
                    <UptimeRobot
                      key={`${key}-${site.id}`}
                      site={site}
                      index={getGlobalSiteIndex(site.id, filteredMonitorsData)}
                      justRefreshed={justRefreshed}
                      isRefreshing={isRefreshing}
                    />
                  ))
                )}
              </div>
            ) : (
              <div className='empty-state'>
                <div className='empty-icon'>
                  <svg width="64" height="64" viewBox="0 0 50 50" fill="none" stroke="#D6D8D8" strokeWidth="2">
                    <path
                      fill='#D6D8D8'
                      d='M19.52 42.712c9.897 2.916 20.285-2.743 23.201-12.64l-3.902-1.15c-2.281 7.742-10.407 12.17-18.15 9.888l-1.15 3.902z'
                    >
                      <animateTransform
                        attributeType='xml'
                        attributeName='transform'
                        type='rotate'
                        from='0 25 25'
                        to='360 25 25'
                        dur='0.6s'
                        repeatCount='indefinite'
                      />
                    </path>
                  </svg>
                </div>
                <div className='empty-title'>
                  {isRefreshing ? '正在获取监控数据...' : (
                    filter === 'online' ? '没有在线站点' :
                      filter === 'offline' ? '没有离线站点' : '暂无监控数据'
                  )}
                </div>
                <div className='empty-description'>
                  {isRefreshing ? '数据加载中，请稍候...' : (
                    filter !== 'all' ? '尝试切换到其他筛选条件查看站点' : '请检查API配置是否正确'
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <ReactTooltip place='top' type='dark' effect='solid' />
        <div id='footer'>
          <div className='footer-content'>
            <div className='footer-info'>
              <p>@2025 基于 <Link to='https://uptimerobot.com/' text='UptimeRobot V2' /> 接口制作，检测频率 5 分钟</p>
            </div>
            <div className='footer-meta'>
              <p>Version <span className='version'>{Package.version}</span></p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
