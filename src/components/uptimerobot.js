import { formatDuration, formatNumber } from '../common/helper';
import Link from './link';

function UptimeRobot({ site, index, justRefreshed, isRefreshing }) {

  const status = {
    ok: '正常',
    down: '无法访问',
    paused: '已暂停',
    unknow: '未知'
  };

  const statusText = {
    ok: '在线',
    down: '离线',
    paused: '已暂停',
    unknow: '未知'
  };

  const { CountDays, ShowLink } = window.Config;

  // 直接使用传入的站点数据，不再需要异步获取
  if (site) return (
    <div className={`site ${justRefreshed ? 'just-refreshed' : ''} ${isRefreshing ? 'refreshing' : ''}`}>
      <div className='site-header'>
        {/* 刷新时的SVG动画覆盖层 */}
        {isRefreshing && (
          <div className='refresh-overlay'>
            <svg width="48" height="48" viewBox="0 0 50 50" fill="none" stroke="#D6D8D8" strokeWidth="2">
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
        )}

        <div className='site-info'>
          <div className='site-name'>
            <span className='site-number'>{index}</span>
            <span dangerouslySetInnerHTML={{ __html: site.name }} />
            <span className='site-url'>{site.url}</span>
          </div>
        </div>
        <div className='site-status'>
          {site.status === 'ok' && (
            <div className='status-badge online'>
              <span className='status-indicator success'></span>
              <span className='status-text text-success'>{statusText.ok}</span>
            </div>
          )}
          {site.status === 'down' && (
            <div className='status-badge offline'>
              <span className='status-indicator error'></span>
              <span className='status-text text-error'>{statusText.down}</span>
            </div>
          )}
          {site.status === 'paused' && (
            <div className='status-badge unknown'>
              <span className='status-indicator unknown'></span>
              <span className='status-text text-unknown'>{statusText.paused}</span>
            </div>
          )}
          {site.status === 'unknow' && (
            <div className='status-badge unknown'>
              <span className='status-indicator unknown'></span>
              <span className='status-text text-unknown'>{statusText.unknow}</span>
            </div>
          )}
        </div>
      </div>

      <div className='site-timeline'>
        <div className='timeline-header'>
          <span className='timeline-title'>最近 {CountDays} 天状态</span>
          <span className='timeline-period'>
            {site.daily?.[site.daily.length - 1]?.date?.format('MM/DD')} - {site.daily?.[0]?.date?.format('MM/DD')}
          </span>
        </div>
        <div className='timeline'>
          {site.daily?.slice().reverse().map((data, index) => {
            let status = '';
            let text = data.date?.format('YYYY-MM-DD ') || '';

            if (site.status === 'paused') {
              // 如果整个站点是暂停状态，时间线显示为无数据状态
              status = 'none';
              text += '监控已暂停';
            }
            else if (data.uptime >= 100) {
              status = 'ok';
              text += `可用率 ${formatNumber(data.uptime)}%`;
            }
            else if (data.uptime <= 0 && data.down.times === 0) {
              status = 'none';
              text += '无数据';
            }
            else {
              status = 'down';
              const durationText = formatDuration(data.down.duration);
              const uptimeText = formatNumber(data.uptime);
              text += `故障 ${data.down.times} 次，累计 ${durationText}，可用率 ${uptimeText}%`;
            }
            return (<i key={index} className={status} data-tip={text} title={text} />)
          }) || []}
        </div>
      </div>

      <div className='site-metrics'>
        <div className='metric'>
          <div className='metric-value uptime'>{site.average}%</div>
          <div className='metric-label'>可用率</div>
        </div>
        <div className='metric'>
          <div className='metric-value'>
            {site.total?.times > 0 ? site.total.times : '0'}
          </div>
          <div className='metric-label'>故障次数</div>
        </div>
        <div className='metric'>
          <div className='metric-value downtime'>
            {site.total?.times > 0 ? formatDuration(site.total.duration) : '0m'}
          </div>
          <div className='metric-label'>故障时长</div>
        </div>
      </div>

      {ShowLink && (
        <div className='site-footer'>
          <Link className='site-link' to={site.url} text={`🔗 访问 ${site.url}`} />
        </div>
      )}
    </div>
  );

  // 如果没有站点数据，返回空
  return null;
}

export default UptimeRobot;
