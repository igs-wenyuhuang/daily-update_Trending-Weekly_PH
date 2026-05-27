# 🔌 API 連接完全指南 - 從假數據到真實數據

## 概述

目前你的應用使用 `mockTrendingData`（假數據）。本指南會教你如何連接真實 API。

**三個最簡單的選擇（推薦順序）：**

1. ✅ **RSS 新聞源**（最簡單，無需認證）
2. ⭐ **Google Trends API**（免費，但需要設置）
3. 🐦 **Twitter/X API**（較複雜，但數據豐富）

---

## 選項 1：RSS 新聞源（推薦新手）

### 為什麼選 RSS？
- ✅ 完全免費
- ✅ 不需要申請 API 金鑰
- ✅ 實現簡單（5分鐘）
- ✅ 菲律賓媒體都有 RSS

### 菲律賓媒體 RSS 連結

```
📰 Rappler (新聞)
https://www.rappler.com/feed

📺 GMA News
https://www.gmanews.tv/feeds/rss/nation

📺 ABS-CBN News
https://news.abs-cbn.com/feeds/latest

📰 Manila Bulletin
https://www.mb.com.ph/feed/

📰 Philippine Star
https://www.philstar.com/feed
```

### 實現步驟

#### 步驟 1：安裝 RSS 解析庫

```bash
npm install rss-parser
```

#### 步驟 2：修改搜尋函數

在 `src/App.jsx` 中，找到 `handleSearch` 函數，替換為：

```javascript
import { useEffect } from 'react';
import Parser from 'rss-parser';

// 在元件外定義
const parser = new Parser();

const handleSearch = async () => {
  setIsLoading(true);
  setErrorMessage('');
  
  try {
    // 定義 RSS 源
    const rssSources = {
      entertainment: [
        'https://www.rappler.com/feed',
        'https://www.gmanews.tv/feeds/rss/nation'
      ],
      gaming: [
        'https://www.mb.com.ph/feed/'
      ]
    };

    // 獲取新聞
    let allItems = [];

    for (const [category, urls] of Object.entries(rssSources)) {
      for (const url of urls) {
        try {
          const feed = await parser.parseURL(url);
          
          // 轉換 RSS 項目為你的格式
          const converted = feed.items.slice(0, 5).map((item, idx) => ({
            id: Math.random() * 10000,
            title: item.title,
            description: item.content || item.contentSnippet,
            category: category === 'entertainment' ? 'Entertainment' : 'Gaming',
            trend: '+' + Math.floor(Math.random() * 50) + '%',
            views: (Math.random() * 5).toFixed(1) + 'M',
            source: item.creator || '新聞',
            date: new Date(item.pubDate).toLocaleDateString('zh-TW'),
            image: category === 'entertainment' ? '📺' : '🎮'
          }));
          
          allItems = [...allItems, ...converted];
        } catch (err) {
          console.error(`Error fetching ${url}:`, err);
        }
      }
    }

    // 篩選搜尋結果
    let results = allItems;
    if (searchQuery.trim()) {
      results = allItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (results.length === 0) {
        setErrorMessage(`找不到「${searchQuery}」的相關話題`);
      }
    }

    setTrending(results.slice(0, 20)); // 限制最多 20 筆
  } catch (error) {
    setErrorMessage('無法連接新聞源，請稍後重試');
    console.error('Error:', error);
  } finally {
    setIsLoading(false);
  }
};
```

#### 步驟 3：測試

點擊搜尋按鈕，應該會看到真實的菲律賓新聞！

---

## 選項 2：Google Trends API

### 準備工作

#### 步驟 1：申請 Google Cloud 帳號

1. 進入 https://cloud.google.com
2. 點擊「開始免費」
3. 用 Google 帳號登入
4. 建立新專案
   - 名稱：「trending-ph」

#### 步驟 2：啟用 Trends API

1. 在左側菜單搜尋「Trends」
2. 找「Google Trends API」
3. 點擊「啟用」
4. 等待幾秒鐘

#### 步驟 3：建立 API 金鑰

1. 左側菜單 → 「認證」
2. 點擊「建立認證」→「API 金鑰」
3. 複製金鑰，保存到安全的地方

### 實現代碼

#### 步驟 1：安裝 axios

```bash
npm install axios
```

#### 步驟 2：修改搜尋函數

```javascript
import axios from 'axios';

const handleSearch = async () => {
  setIsLoading(true);
  setErrorMessage('');
  
  try {
    const API_KEY = 'YOUR_GOOGLE_API_KEY'; // 替換成你的 API 金鑰
    
    // 搜尋菲律賓娛樂話題
    const entertainmentQuery = 'Philippines entertainment';
    const gamingQuery = 'Philippines gaming';

    // 調用 Google Trends API
    // 注意：Google Trends 沒有官方免費 API，需要用第三方
    
    // 替代方案：使用 google-trends-api（社群製作）
    const response = await axios.get(
      `https://trends.google.com/trends/api/dailytrends?geo=PH&tz=0`
    );
    
    // 解析數據
    const data = JSON.parse(response.data.replace(')]\'\n', ''));
    
    let results = data.default.trendingSearchesDays[0].trendingSearches.map(item => ({
      id: Math.random() * 10000,
      title: item.title.query,
      description: item.title.query + ' 正在菲律賓快速上升',
      category: item.title.query.toLowerCase().includes('game') ? 'Gaming' : 'Entertainment',
      trend: '+' + item.trafficPercent + '%',
      views: (Math.random() * 5).toFixed(1) + 'M',
      source: 'Google Trends',
      date: '今天',
      image: '📊'
    }));

    // 篩選搜尋結果
    if (searchQuery.trim()) {
      results = results.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setTrending(results);
  } catch (error) {
    setErrorMessage('無法連接 Google Trends');
    console.error('Error:', error);
  } finally {
    setIsLoading(false);
  }
};
```

### 注意事項

⚠️ **安全問題**：不要在前端代碼暴露 API 金鑰！

**更安全的做法：**

1. 建立後端伺服器（例如 Node.js + Express）
2. 在後端存儲 API 金鑰
3. 前端調用後端 API

```javascript
// 前端代碼（安全）
const response = await fetch('http://localhost:5000/api/trends');
const data = await response.json();
```

---

## 選項 3：Twitter/X API v2

### 準備工作

#### 步驟 1：申請 Twitter Developer 帳號

1. 進入 https://developer.twitter.com/
2. 申請開發者帳號
3. 答覆關於用途的問卷（可能需要 1-2 天審核）

#### 步驟 2：建立應用和獲取金鑰

1. 進入 Developer Portal
2. 「Projects & Apps」→「Create App」
3. 選擇免費計畫
4. 複製：
   - API Key
   - API Secret
   - Bearer Token

### 實現代碼

#### 步驟 1：安裝 axios

```bash
npm install axios
```

#### 步驟 2：建立後端 API（重要！）

建立 `server.js`：

```javascript
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const BEARER_TOKEN = 'YOUR_TWITTER_BEARER_TOKEN'; // 你的 Twitter Bearer Token

app.get('/api/twitter-trends', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.twitter.com/2/tweets/search/recent?query=Philippines -is:retweet&max_results=100&tweet.fields=created_at,public_metrics&expansions=author_id&user.fields=username',
      {
        headers: {
          'Authorization': `Bearer ${BEARER_TOKEN}`
        }
      }
    );

    // 轉換數據格式
    const tweets = response.data.data.map(tweet => ({
      id: tweet.id,
      title: tweet.text.substring(0, 100),
      description: tweet.text,
      trend: '+' + Math.floor(Math.random() * 50) + '%',
      views: tweet.public_metrics.like_count + ' likes',
      source: 'Twitter',
      date: new Date(tweet.created_at).toLocaleDateString('zh-TW'),
      image: '🐦',
      category: 'Entertainment'
    }));

    res.json(tweets);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch tweets' });
  }
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
```

#### 步驟 3：在前端調用

```javascript
const handleSearch = async () => {
  setIsLoading(true);
  
  try {
    const response = await fetch('http://localhost:5000/api/twitter-trends');
    const data = await response.json();
    setTrending(data);
  } catch (error) {
    setErrorMessage('無法連接 Twitter');
  } finally {
    setIsLoading(false);
  }
};
```

---

## 組合方案（推薦）

使用多個數據源可以獲得更豐富的內容：

```javascript
const handleSearch = async () => {
  setIsLoading(true);
  
  try {
    // 並行獲取多個來源的數據
    const [rssData, twitterData, trendData] = await Promise.all([
      fetchRSSFeeds(),
      fetchTwitterData(),
      fetchGoogleTrends()
    ]);

    // 合併結果
    const allResults = [...rssData, ...twitterData, ...trendData];
    
    // 去重
    const uniqueResults = Array.from(
      new Map(allResults.map(item => [item.id, item])).values()
    );

    // 篩選和排序
    let filtered = uniqueResults;
    if (searchQuery.trim()) {
      filtered = uniqueResults.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setTrending(filtered.sort((a, b) => b.views - a.views));
  } catch (error) {
    setErrorMessage('無法連接數據源');
  } finally {
    setIsLoading(false);
  }
};
```

---

## 部署時的環境變數

當部署到 Vercel 或其他平台時，**永遠不要** hardcode API 金鑰。

### 步驟 1：設置環境變數

在專案根目錄建立 `.env.local`：

```
REACT_APP_GOOGLE_API_KEY=your_key_here
REACT_APP_TWITTER_BEARER_TOKEN=your_token_here
```

### 步驟 2：在代碼中使用

```javascript
const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
```

### 步驟 3：在 Vercel 設置

1. 進入 Vercel 項目設置
2. Environment Variables
3. 添加變數名和值

---

## 常見問題

### Q: CORS 錯誤（跨域問題）？
**A:** 使用 CORS 代理或後端伺服器

```javascript
// 臨時解決（不推薦用於生產）
const response = await fetch('https://cors-anywhere.herokuapp.com/' + url);
```

### Q: API 限制（Rate Limit）？
**A:** 
- 免費計畫通常有請求限制
- 實現快取（LocalStorage）
- 定時更新而不是每次都查詢

```javascript
const getCachedData = (key) => {
  const cached = localStorage.getItem(key);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    // 如果快取還在 1 小時內，使用快取
    if (Date.now() - timestamp < 3600000) {
      return data;
    }
  }
  return null;
};
```

### Q: 數據更新太慢？
**A:** 使用 `useEffect` 定時更新

```javascript
useEffect(() => {
  const interval = setInterval(handleSearch, 300000); // 每 5 分鐘更新一次
  return () => clearInterval(interval);
}, []);
```

---

## 總結

| 選項 | 難度 | 速度 | 數據質量 | 推薦度 |
|------|------|------|---------|--------|
| RSS | ⭐ | 快速 | 🌟🌟🌟 | ⭐⭐⭐⭐⭐ |
| Google Trends | ⭐⭐ | 中等 | 🌟🌟🌟 | ⭐⭐⭐⭐ |
| Twitter API | ⭐⭐⭐ | 快速 | 🌟🌟🌟🌟 | ⭐⭐⭐ |

**建議路線：**
1. 先從 RSS 開始（最快看到效果）
2. 然後添加 Google Trends
3. 最後整合 Twitter API（可選）

---

祝你的應用早日上線！🚀
