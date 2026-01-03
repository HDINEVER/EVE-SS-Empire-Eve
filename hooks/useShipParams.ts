// URL 参数解析 Hook
import { useState, useEffect } from 'react';
import { ShipParams } from '../types';
import { DEFAULT_SHIP_ID } from '../config/ships';
import { DEFAULT_FACTION_ID } from '../config/factions';

/**
 * 从 URL 参数中解析飞船ID和势力ID
 * 支持 URL 参数变化时自动更新
 * 示例: ?ship=imperial&faction=amarr
 */
export const useShipParams = (): ShipParams => {
  // 解析当前 URL 参数的辅助函数
  const getParams = (): ShipParams => {
    const params = new URLSearchParams(window.location.search);
    return {
      shipId: params.get('ship') || DEFAULT_SHIP_ID,
      factionId: params.get('faction') || DEFAULT_FACTION_ID
    };
  };

  const [shipParams, setShipParams] = useState<ShipParams>(getParams);

  useEffect(() => {
    // 处理 URL 变化事件
    const handleUrlChange = () => {
      setShipParams(getParams());
    };

    // 监听浏览器历史变化
    window.addEventListener('popstate', handleUrlChange);
    
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  return shipParams;
};
