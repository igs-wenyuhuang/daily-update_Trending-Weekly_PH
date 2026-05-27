import React, { useState } from 'react';
import { Search, Heart, TrendingUp, Calendar, ExternalLink, Filter } from 'lucide-react';

const TrendingPHApp = () => {
  // ===== 狀態管理 (State) =====
  // 這些就像應用的「記憶」，改變時網頁會自動更新
  const [searchQuery, setSearchQuery] = useState('');
  const [trending, setTrending] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // ===== 模擬數據 (Mock Data) =====
  // 在真實應用中，這些來自 API
  // 現在用假數據讓你看到效果
  const mockTrendingData = {
    entertainment: [
      {
        id: 1,
        title: 'It\'s Showtime - GMA Network',
        category: 'Entertainment',
        trend: '+45%',
        views: '2.3M',
        source: 'Facebook',
        date: '今天',
        description: '菲律賓最受歡迎的綜藝節目話題爆紅',
        image: '🎬'
      },
      {
        id: 2,
        title: 'Alden Richards 新劇宣傳',
        category: 'Entertainment',
        trend: '+38%',
        views: '1.8M',
        source: 'Twitter',
        date: '今天',
        description: '阿登最新影視作品引發關注',
        image: '🌟'
      },
      {
        id: 3,
        title: 'Kapamilya vs Kapuso 跨台合作',
        category: 'Entertainment',
        trend: '+52%',
        views: '3.1M',
        source: 'Facebook',
        date: '昨天',
        description: '菲律賓兩大電視台首次合作轟動',
        image: '📺'
      }
    ],
    gaming: [
      {
        id: 4,
        title: 'Mobile Legends Season 30',
        category: 'Gaming',
        trend: '+67%',
        views: '4.2M',
        source: 'YouTube',
        date: '今天',
        description: '東南亞最熱門手遊新賽季開啟',
        image: '🎮'
      },
      {
        id: 5,
        title: 'Dota 2 Southeast Asian Championship',
        category: 'Gaming',
        trend: '+55%',
        views: '2.9M',
        source: 'Twitch',
        date: '今天',
        description: '菲律賓電競隊伍進入決賽',
        image: '⚔️'
      },
      {
        id: 6,
        title: 'Genshin Impact 5.0 版本',
        category: 'Gaming',
        trend: '+41%',
        views: '1.6M',
        source: 'Facebook',
        date: '2天前',
        description: '新角色和地圖發佈引發熱議',
        image: '✨'
      }
    ]
  };

  // ===== 搜尋功能 =====
  // 當使用者點擊搜尋按鈕時執行
  const handleSearch = () => {
    setIsLoading(true);
    setErrorMessage('');
    
    // 模擬 API 呼叫延遲（真實應用會在這裡調用真正的API）
    setTimeout(() => {
      let results = [];
      
      // 如果有搜尋詞，過濾結果
      if (searchQuery.trim()) {
        const allData = [...mockTrendingData.entertainment, ...mockTrendingData.gaming];
        results = allData.filter(item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        if (results.length === 0) {
          setErrorMessage(`找不到「${searchQuery}」的相關話題，試試其他搜尋詞`);
        }
      } else {
        // 沒有搜尋詞時，顯示全部
        results = [...mockTrendingData.entertainment, ...mockTrendingData.gaming];
      }
      
      setTrending(results);
      setIsLoading(false);
    }, 600);
  };

  // ===== 篩選功能 =====
  const filteredResults = activeFilter === 'all' 
    ? trending 
    : trending.filter(item => item.category === activeFilter);

  // ===== 收藏功能 =====
  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const isFavorited = (id) => favorites.includes(id);

  // ===== 清除搜尋 =====
  const handleClear = () => {
    setSearchQuery('');
    setTrending([]);
    setErrorMessage('');
    setActiveFilter('all');
  };

  // ===== UI 返回 =====
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--color-background-tertiary)',
      padding: '2rem 1rem'
    }}>
      {/* 頁面容器 */}
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* ===== 標題區域 ===== */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.5rem' }}>
            <TrendingUp size={28} style={{ color: 'var(--color-text-info)' }} />
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '500' }}>
              菲律賓 話題搜尋
            </h1>
          </div>
          <p style={{ 
            margin: '0.5rem 0 0 0', 
            color: 'var(--color-text-secondary)',
            fontSize: '14px'
          }}>
            🎬 娛樂 & 🎮 遊戲話題即時蒐集
          </p>
        </div>

        {/* ===== 搜尋區域 ===== */}
        <div style={{
          background: 'var(--color-background-primary)',
          padding: '1.5rem',
          borderRadius: 'var(--border-radius-lg)',
          border: '0.5px solid var(--color-border-tertiary)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                type="text"
                placeholder="搜尋話題、演員、遊戲..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  border: '0.5px solid var(--color-border-tertiary)',
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: '14px',
                  fontFamily: 'inherit'
                }}
              />
              <Search 
                size={18} 
                style={{
                  position: 'absolute',
                  left: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-secondary)',
                  pointerEvents: 'none'
                }}
              />
            </div>
            <button
              onClick={handleSearch}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'var(--color-background-info)',
                color: 'var(--color-text-info)',
                border: '0.5px solid var(--color-border-info)',
                borderRadius: 'var(--border-radius-md)',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = 'var(--color-background-info)'}
              onMouseOut={(e) => e.target.style.background = 'var(--color-background-info)'}
            >
              搜尋
            </button>
            {trending.length > 0 && (
              <button
                onClick={handleClear}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'transparent',
                  color: 'var(--color-text-secondary)',
                  border: '0.5px solid var(--color-border-tertiary)',
                  borderRadius: 'var(--border-radius-md)',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                清除
              </button>
            )}
          </div>

          {/* 提示文字 */}
          <p style={{ 
            margin: 0, 
            fontSize: '13px', 
            color: 'var(--color-text-secondary)' 
          }}>
            💡 試試搜尋：&quot;Mobile Legends&quot; 或 &quot;Alden Richards&quot; 或 &quot;Entertainment&quot;
          </p>
        </div>

        {/* ===== 篩選區域 ===== */}
        {trending.length > 0 && (
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '1.5rem',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setActiveFilter('all')}
              style={{
                padding: '0.5rem 1rem',
                background: activeFilter === 'all' ? 'var(--color-background-info)' : 'var(--color-background-secondary)',
                color: activeFilter === 'all' ? 'var(--color-text-info)' : 'var(--color-text-primary)',
                border: '0.5px solid var(--color-border-tertiary)',
                borderRadius: 'var(--border-radius-md)',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: activeFilter === 'all' ? '500' : '400'
              }}
            >
              全部 ({trending.length})
            </button>
            <button
              onClick={() => setActiveFilter('Entertainment')}
              style={{
                padding: '0.5rem 1rem',
                background: activeFilter === 'Entertainment' ? 'var(--color-background-info)' : 'var(--color-background-secondary)',
                color: activeFilter === 'Entertainment' ? 'var(--color-text-info)' : 'var(--color-text-primary)',
                border: '0.5px solid var(--color-border-tertiary)',
                borderRadius: 'var(--border-radius-md)',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: activeFilter === 'Entertainment' ? '500' : '400'
              }}
            >
              🎬 娛樂 ({trending.filter(t => t.category === 'Entertainment').length})
            </button>
            <button
              onClick={() => setActiveFilter('Gaming')}
              style={{
                padding: '0.5rem 1rem',
                background: activeFilter === 'Gaming' ? 'var(--color-background-info)' : 'var(--color-background-secondary)',
                color: activeFilter === 'Gaming' ? 'var(--color-text-info)' : 'var(--color-text-primary)',
                border: '0.5px solid var(--color-border-tertiary)',
                borderRadius: 'var(--border-radius-md)',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: activeFilter === 'Gaming' ? '500' : '400'
              }}
            >
              🎮 遊戲 ({trending.filter(t => t.category === 'Gaming').length})
            </button>
          </div>
        )}

        {/* ===== 載入狀態 ===== */}
        {isLoading && (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: 'var(--color-text-secondary)'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '0.5rem' }}>⏳</div>
            <p>搜尋中...</p>
          </div>
        )}

        {/* ===== 錯誤訊息 ===== */}
        {errorMessage && (
          <div style={{
            background: 'var(--color-background-warning)',
            color: 'var(--color-text-warning)',
            padding: '1rem',
            borderRadius: 'var(--border-radius-md)',
            border: '0.5px solid var(--color-border-warning)',
            marginBottom: '1.5rem'
          }}>
            {errorMessage}
          </div>
        )}

        {/* ===== 結果區域 ===== */}
        {trending.length === 0 && !isLoading && !errorMessage && (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            color: 'var(--color-text-secondary)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🔍</div>
            <p style={{ fontSize: '16px', marginBottom: '0.5rem' }}>
              開始搜尋菲律賓的熱門話題吧！
            </p>
            <p style={{ fontSize: '14px' }}>
              搜尋娛樂、遊戲、電競等你喜歡的內容
            </p>
          </div>
        )}

        {/* ===== 話題卡片列表 ===== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1rem'
        }}>
          {filteredResults.map(item => (
            <div
              key={item.id}
              style={{
                background: 'var(--color-background-primary)',
                border: '0.5px solid var(--color-border-tertiary)',
                borderRadius: 'var(--border-radius-lg)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s',
                cursor: 'pointer',
                position: 'relative'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border-secondary)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border-tertiary)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* 卡片頂部 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '32px', marginBottom: '0.5rem' }}>{item.image}</div>
                  <h3 style={{ 
                    margin: 0, 
                    fontSize: '15px', 
                    fontWeight: '500',
                    lineHeight: '1.4'
                  }}>
                    {item.title}
                  </h3>
                </div>
                <button
                  onClick={() => toggleFavorite(item.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    fontSize: '18px',
                    transition: 'all 0.2s'
                  }}
                  title={isFavorited(item.id) ? '已收藏' : '加入收藏'}
                >
                  <Heart
                    size={20}
                    fill={isFavorited(item.id) ? 'currentColor' : 'none'}
                    color={isFavorited(item.id) ? 'var(--color-text-danger)' : 'var(--color-text-tertiary)'}
                  />
                </button>
              </div>

              {/* 描述 */}
              <p style={{
                margin: '0.75rem 0',
                fontSize: '13px',
                color: 'var(--color-text-secondary)',
                lineHeight: '1.5'
              }}>
                {item.description}
              </p>

              {/* 統計資訊 */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                margin: '1rem 0',
                padding: '0.75rem',
                background: 'var(--color-background-secondary)',
                borderRadius: 'var(--border-radius-md)'
              }}>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                    熱度
                  </p>
                  <p style={{ margin: 0, fontSize: '15px', fontWeight: '500', color: 'var(--color-text-success)' }}>
                    {item.trend}
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                    討論量
                  </p>
                  <p style={{ margin: 0, fontSize: '15px', fontWeight: '500' }}>
                    {item.views}
                  </p>
                </div>
              </div>

              {/* 卡片底部資訊 */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '0.75rem',
                borderTop: '0.5px solid var(--color-border-tertiary)',
                fontSize: '12px',
                color: 'var(--color-text-secondary)'
              }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{
                    background: 'var(--color-background-info)',
                    color: 'var(--color-text-info)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px'
                  }}>
                    {item.source}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} />
                    {item.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ===== 空狀態（當篩選後沒有結果） ===== */}
        {trending.length > 0 && filteredResults.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: 'var(--color-text-secondary)'
          }}>
            <p>找不到該分類的話題，試試其他篩選</p>
          </div>
        )}

        {/* ===== 收藏顯示區域（簡單版本） ===== */}
        {favorites.length > 0 && (
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: 'var(--color-background-secondary)',
            borderRadius: 'var(--border-radius-md)',
            fontSize: '13px',
            color: 'var(--color-text-secondary)'
          }}>
            ❤️ 已收藏 {favorites.length} 個話題
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingPHApp;
