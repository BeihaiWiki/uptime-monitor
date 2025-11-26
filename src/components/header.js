import { useEffect, useState, useRef } from 'react';

function Header({ onRefresh, isRefreshing, currentFilter, onFilterChange }) {

  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const filterDropdownRef = useRef(null);

  useEffect(() => {
    document.title = window.Config.SiteName;
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setShowFilterMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFilterSelect = (filter) => {
    if (onFilterChange) {
      onFilterChange(filter);
    }
    setShowFilterMenu(false);
  };

  const filterOptions = [
    { value: 'all', label: '所有站点', icon: 'all' },
    { value: 'online', label: '在线站点', icon: 'online' },
    { value: 'offline', label: '离线站点', icon: 'offline' }
  ];

  return (
    <div id='header'>
      <div className='header-content'>
        <div className='header-title'>
          <nav className='header-nav'>
            {window.Config.Navi && window.Config.Navi.map((item, index) => {
              // 将英文文本转换为中文
              const textMap = {
                'Homepage': '首页',
                'GitHub': 'GitHub',
                'Blog': '博客'
              };
              const displayText = textMap[item.text] || item.text;

              // 图标映射
              const iconMap = {
                'Homepage': (
                  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                ),
                'GitHub': (
                  <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                ),
                'Blog': (
                  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )
              };

              return (
                <a
                  key={index}
                  href={item.url}
                  className='nav-link'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {iconMap[item.text]}
                  <span className="nav-link-text">{displayText}</span>
                </a>
              );
            })}
          </nav>
        </div>
        <div className='header-actions'>
          {/* 筛选按钮 */}
          <div className='filter-dropdown' ref={filterDropdownRef}>
            <button
              className='filter-btn'
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            >
              <span className='filter-icon'>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </span>
              <span>筛选</span>
            </button>

            {showFilterMenu && (
              <div className='filter-menu'>
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`filter-option ${currentFilter === option.value ? 'active' : ''}`}
                    onClick={() => handleFilterSelect(option.value)}
                  >
                    <span className='filter-option-icon'>
                      {option.icon === 'all' && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6h10M9 12h6m-6 4h8M5 6v.01M5 12v.01M5 18v.01" />
                        </svg>
                      )}
                      {option.icon === 'online' && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {option.icon === 'offline' && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </span>
                    <span>{option.label}</span>
                    {currentFilter === option.value && (
                      <span className='filter-check'>✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 刷新按钮 */}
          <button
            className={`refresh-btn ${isRefreshing ? 'refreshing' : ''}`}
            onClick={onRefresh}
            disabled={isRefreshing}
            title={isRefreshing ? "正在刷新..." : "刷新数据"}
          >
            <span className='refresh-icon'>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {/* 优化的圆形箭头刷新图标 */}
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9 9.75 9.75 0 01-6.74-2.74L3 16" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v9h9" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 17v-9h-9" />
              </svg>
            </span>
            {isRefreshing && (
              <span className='refresh-ring'></span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;