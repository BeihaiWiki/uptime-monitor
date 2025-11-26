import axios from 'axios';
import dayjs from 'dayjs';
import { formatNumber } from './helper';

export async function GetMonitors(apikey, days, includeResponseTimes = false) {

  const dates = [];
  const today = dayjs(new Date().setHours(0, 0, 0, 0));
  for (let d = 0; d < days; d++) {
    dates.push(today.subtract(d, 'day'));
  }

  const ranges = dates.map((date) => `${date.unix()}_${date.add(1, 'day').unix()}`);
  const start = dates[dates.length - 1].unix();
  const end = dates[0].add(1, 'day').unix();
  ranges.push(`${start}_${end}`);

  const postdata = {
    api_key: apikey,
    format: 'json',
    logs: 1,
    log_types: '1-2', // 只获取down/up事件用于统计 (1=down, 2=up)
    logs_start_date: start,
    logs_end_date: end,
    custom_uptime_ranges: ranges.join('-'),
    response_times: includeResponseTimes ? 1 : 0, // 根据参数决定是否获取响应时间数据
    alert_contacts: 0, // 不获取告警联系人，提高性能
    ssl: 0, // 不获取SSL证书信息，提高性能
    mwindows: 0, // 不获取维护窗口信息，提高性能
    timezone: 1, // 获取用户时区，用于时间显示优化
    limit: 50, // 最多获取50个监控器，符合API限制
  };

  const response = await axios.post('https://api.uptimerobot.com/v2/getMonitors', postdata, { timeout: 10000 });
  if (response.data.stat !== 'ok') throw response.data.error;

  // 调试日志：输出第一个监控器的状态码用于验证
  if (response.data.monitors && response.data.monitors.length > 0) {
    console.log('API响应 - 第一个监控器状态码:', response.data.monitors[0].status,
                '监控器名称:', response.data.monitors[0].friendly_name);
  }

  // 存储用户时区信息到全局配置（如果存在）
  if (response.data.timezone) {
    window.Config.userTimezone = response.data.timezone;
  }

  return response.data.monitors.map((monitor) => {

    const ranges = monitor.custom_uptime_ranges.split('-');
    const average = formatNumber(ranges.pop());
    const daily = [];
    const map = [];
    dates.forEach((date, index) => {
      map[date.format('YYYYMMDD')] = index;
      daily[index] = {
        date: date,
        uptime: formatNumber(ranges[index]),
        down: { times: 0, duration: 0 },
      }
    });

    const total = monitor.logs.reduce((total, log) => {
      if (log.type === 1) { // type 1 = down (离线)
        const date = dayjs.unix(log.datetime).format('YYYYMMDD');
        total.duration += log.duration;
        total.times += 1;
        daily[map[date]].down.duration += log.duration;
        daily[map[date]].down.times += 1;
      }
      return total;
    }, { times: 0, duration: 0 });

    // 监控器类型映射
    const monitorTypes = {
      1: 'HTTP(s)',
      2: 'Keyword',
      3: 'Ping',
      4: 'Port',
      5: 'Heartbeat'
    };

    const result = {
      id: monitor.id,
      name: monitor.friendly_name,
      url: monitor.url,
      type: monitorTypes[monitor.type] || 'Unknown',
      interval: monitor.interval,
      average: average,
      daily: daily,
      total: total,
      status: 'unknow',
      response_times: includeResponseTimes && monitor.response_times ? monitor.response_times.slice(-24) : [], // 获取最近24小时的响应时间数据
    };

    // 正确的状态码映射基于UptimeRobot API文档
    if (monitor.status === 2) result.status = 'ok';     // 2 = up (在线)
    if (monitor.status === 9) result.status = 'down';   // 9 = down (离线)
    if (monitor.status === 0) result.status = 'paused'; // 0 = paused (暂停)
    if (monitor.status === 8) result.status = 'down';   // 8 = seems down (看起来离线)
    if (monitor.status === 1) result.status = 'unknow'; // 1 = not checked yet (尚未检查)
    return result;
  });
}
