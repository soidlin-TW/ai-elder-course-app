# AI 好朋友：50+ 也學得會的大字好讀入門課

教中年人認識 AI 的 iPhone 課程 App。Expo（React Native）＋ Expo Router，在 Windows 上就能開發，用 EAS 雲端編譯並上傳 App Store，不需要 Mac。

## 在 Windows 上預覽

1. 安裝 [Node.js LTS](https://nodejs.org/)。
2. 在這個資料夾執行：
   ```
   npm install
   npx expo start
   ```
3. iPhone 安裝 App Store 的「Expo Go」，用相機掃終端機上的 QR code。

Expo Go 裡沒有 App Store 付款功能，「解鎖」按鈕會直接解鎖（只在開發模式），方便看完整課程。

## 實機測試付款與上架

需要：Apple Developer Program（每年 US$99）、Expo 帳號（免費）。

```
npm install -g eas-cli
eas login
eas build --platform ios --profile production   # 雲端編譯，第一次會引導建立憑證
eas submit --platform ios                       # 上傳到 App Store Connect
```

上傳後在 App Store Connect：
- 建立 App 內購買項目「非消耗性」，產品 ID 要等於 `src/lib/config.ts` 的 `UNLOCK_PRODUCT_ID`。
- 用 TestFlight 在自己的 iPhone 測試購買（沙盒帳號不會真的扣款）。

## 上架前要改的地方

| 檔案 | 項目 |
| --- | --- |
| `app.json` | `name`、`ios.bundleIdentifier`、`android.package`（目前是 `com.soidlin.aieldercourse`） |
| `src/lib/config.ts` | App 名稱、講師名字、內購產品 ID、隱私權政策網址、客服信箱 |
| `assets/` | App 圖示（1024×1024）、啟動畫面 |
| `src/content/images.ts` | 加入用 Krita 生成的課程插圖 |

## 加入插圖

把圖片放到 `assets/lessons/`，檔名用課程 ID（例如 `u1l1.png`），再在 `src/content/images.ts` 加一行：

```ts
export const lessonImages = {
  u1l1: require('../../assets/lessons/u1l1.png'),
};
```

沒有圖的課會顯示機器人佔位圖。

## 課程內容

`src/content/unit1.json` 到 `unit6.json`。每課有三段課文、生活例子、一個互動、一題測驗。`"free": true` 的課不用付費就能看（目前是第 1 單元全部和第 2 單元前兩課）。

## 檔案結構

- `src/app/`：畫面（首頁、單元、課程、解鎖、設定、結業證書）
- `src/components/`：講師對話框、互動練習、測驗、分享小卡
- `src/lib/`：進度儲存、內購、朗讀、設定值、配色

## 隱私與安全

- App 不連任何伺服器，也沒有分析、廣告或追蹤套件。對外動作只有：Apple 內購（StoreKit）、寄信給客服、撥 165、打開隱私權政策網頁。
- 學習進度、設定和家庭暗號「問題」只存在手機本機（AsyncStorage）；畫面提醒使用者暗號答案不要寫下來。
- App Store Connect 的「App 隱私權」填「未收集資料」。`app.json` 已附隱私權清單（privacy manifest），宣告不追蹤、不蒐集資料。
- `npm audit` 的警告都在開發和打包工具（metro、expo CLI、node-forge 等），不會打包進 App；Expo 出修正版時一起升級即可。

## 家人共享

在 App Store Connect 的內購項目頁面打開「家人共享」（開了就不能關）。程式不用改：App 啟動時會讀取 Apple 的購買紀錄，家人共享的購買也包含在內，家人打開 App 就會自動解鎖，或按「恢復購買」。

## 音效與語音

- 音效：`assets/sounds/` 四個短音（答對、再試一次、完成、輕點），用程式合成，沒有版權問題；由 `src/lib/feedback.ts` 播放並搭配震動。設定頁可關閉，手機靜音時不出聲，也不會打斷正在播放的音樂。`expo-audio` 已設定為不要麥克風權限。
- 語音：用 iPhone 內建的中文（台灣）語音朗讀，不連網。會自動挑手機上最好的聲音；沒有下載增強版時，設定頁會教使用者下載「美佳（增強版）」。點小智的對話框會唸出那句話。
