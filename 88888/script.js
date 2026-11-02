// 問卷內容與分數對照表，所有答案只保存在目前頁面的記憶體中。
const 問卷資料 = [
  {
    分類: '市場展望',
    題目: '你怎麼看接下來三個月的台股？',
    補充: '依照你現在的直覺選擇即可，沒有對錯。',
    選項: [
      {文字: '明顯看好，期待市場走高', 分數: 100},
      {文字: '略為看好，但仍會留意變化', 分數: 75},
      {文字: '看不太清楚，可能區間震盪', 分數: 50},
      {文字: '略為保守，預期市場承壓', 分數: 25},
      {文字: '相當謹慎，預期市場走弱', 分數: 0}
    ]
  },
  {
    分類: '投資行動',
    題目: '面對目前的市場，你比較可能怎麼做？',
    補充: '想想你接下來可能採取的投資步調。',
    選項: [
      {文字: '增加投入，把握看好的機會', 分數: 100},
      {文字: '維持投入，照原本計畫進行', 分數: 75},
      {文字: '先觀察，暫時不調整部位', 分數: 50},
      {文字: '減少投入，保留較多現金', 分數: 25},
      {文字: '暫停投資，等市場更明朗', 分數: 0}
    ]
  },
  {
    分類: '個人信心',
    題目: '你對自己目前的投資判斷有多大信心？',
    補充: '從 1 到 5 選一個最符合你現在感受的程度。',
    選項: [
      {文字: '非常有信心', 分數: 100},
      {文字: '有一些信心', 分數: 75},
      {文字: '普通，還在摸索', 分數: 50},
      {文字: '信心不太足', 分數: 25},
      {文字: '目前沒有把握', 分數: 0}
    ]
  },
  {
    分類: '投資規劃',
    題目: '你通常以多長的時間來安排投資？',
    補充: '這題用來補充你的答題摘要，不影響分數。',
    選項: [
      {文字: '短期，幾週到幾個月', 分數: null},
      {文字: '中期，約半年到兩年', 分數: null},
      {文字: '長期，兩年以上', 分數: null},
      {文字: '依不同標的調整', 分數: null}
    ]
  },
  {
    分類: '市場觀察',
    題目: '最近哪個因素最影響你的投資信心？',
    補充: '選擇目前最常放在心上的一項。',
    選項: [
      {文字: '企業獲利與產業景氣', 分數: null},
      {文字: '利率、通膨與匯率', 分數: null},
      {文字: '國際情勢與政策變化', 分數: null},
      {文字: '市場漲跌與資金流向', 分數: null},
      {文字: '自己的財務目標與風險承受度', 分數: null}
    ]
  }
];

const 各題答案 = Array(問卷資料.length).fill(null);
let 目前索引 = 0;

const 首頁 = document.querySelector('#首頁');
const 問卷 = document.querySelector('#問卷');
const 結果 = document.querySelector('#結果');
const 分類文字 = document.querySelector('#題目分類');
const 題目文字 = document.querySelector('#問卷標題');
const 補充文字 = document.querySelector('#題目補充');
const 選項容器 = document.querySelector('#選項列表');
const 下一題按鈕 = document.querySelector('#下一題');
const 上一題按鈕 = document.querySelector('#上一題');

// 切換目前顯示的畫面，並將焦點移到新畫面的主要內容。
function 顯示畫面(畫面) {
  [首頁, 問卷, 結果].forEach(區塊 => 區塊.classList.add('隱藏'));
  畫面.classList.remove('隱藏');
  window.scrollTo({top: 0, behavior: 'smooth'});
}

// 依照目前題目重畫選項，並回復先前已選的答案。
function 顯示題目() {
  const 資料 = 問卷資料[目前索引];
  const 題號 = 目前索引 + 1;
  分類文字.textContent = 資料.分類;
  題目文字.textContent = 資料.題目;
  補充文字.textContent = 資料.補充;
  document.querySelector('#目前題數').textContent = `第 ${題號} 題，共 ${問卷資料.length} 題`;
  const 進度 = Math.round(題號 / 問卷資料.length * 100);
  document.querySelector('#進度百分比').textContent = `${進度}%`;
  document.querySelector('#進度完成').style.width = `${進度}%`;
  上一題按鈕.disabled = 目前索引 === 0;
  下一題按鈕.innerHTML = 目前索引 === 問卷資料.length - 1 ? '看我的摘要 <span aria-hidden="true">→</span>' : '下一題 <span aria-hidden="true">→</span>';

  選項容器.replaceChildren();
  資料.選項.forEach((選項, 選項索引) => {
    const 標籤 = document.createElement('label');
    標籤.className = '選項列';
    const 輸入框 = document.createElement('input');
    輸入框.type = 'radio';
    輸入框.name = `第${題號}題答案`;
    輸入框.value = String(選項索引);
    輸入框.checked = 各題答案[目前索引] === 選項索引;
    const 卡片 = document.createElement('span');
    卡片.className = '選項卡';
    const 圓點 = document.createElement('span');
    圓點.className = '選項圓點';
    圓點.setAttribute('aria-hidden', 'true');
    const 文字 = document.createElement('span');
    文字.className = '選項文字';
    文字.textContent = 選項.文字;
    卡片.append(圓點, 文字);
    標籤.append(輸入框, 卡片);
    輸入框.addEventListener('change', () => {
      各題答案[目前索引] = 選項索引;
      下一題按鈕.disabled = false;
    });
    選項容器.append(標籤);
  });
  下一題按鈕.disabled = 各題答案[目前索引] === null;
}

// 只用前三題的回答計算個人分數，後兩題僅用來補充摘要。
function 顯示結果() {
  const 計分題目 = 問卷資料.slice(0, 3);
  const 總分 = 計分題目.reduce((加總, 資料, 索引) => 加總 + 資料.選項[各題答案[索引]].分數, 0);
  const 分數 = Math.round(總分 / 計分題目.length);
  document.querySelector('#信心分數').textContent = String(分數);
  document.querySelector('#分數環').style.setProperty('--分數角度', `${分數 * 3.6}deg`);
  document.querySelector('#分數環').setAttribute('aria-label', `個人信心分數 ${分數} 分`);

  const 標籤 = document.querySelector('#結果標籤');
  const 描述 = document.querySelector('#結果描述');
  if (分數 >= 70) {
    標籤.textContent = '偏向樂觀';
    描述.textContent = '你對市場或自己的投資安排較有信心，持續依照計畫檢視每一步。';
  } else if (分數 >= 40) {
    標籤.textContent = '審慎觀察';
    描述.textContent = '你保留一些彈性，邊觀察邊調整，找到適合自己的步調。';
  } else {
    標籤.textContent = '偏向保守';
    描述.textContent = '你目前較重視風險與安全感，可以先回顧自己的目標和承受範圍。';
  }

  const 摘要 = document.querySelector('#回答摘要');
  摘要.replaceChildren();
  問卷資料.forEach((資料, 索引) => {
    const 列 = document.createElement('div');
    列.className = '摘要列';
    const 標題 = document.createElement('dt');
    標題.textContent = 資料.分類;
    const 答案 = document.createElement('dd');
    答案.textContent = 資料.選項[各題答案[索引]].文字;
    列.append(標題, 答案);
    摘要.append(列);
  });
  顯示畫面(結果);
}

document.querySelector('#開始填答').addEventListener('click', () => {
  目前索引 = 0;
  顯示題目();
  顯示畫面(問卷);
});

document.querySelector('#回首頁').addEventListener('click', () => 顯示畫面(首頁));

上一題按鈕.addEventListener('click', () => {
  if (目前索引 > 0) {
    目前索引 -= 1;
    顯示題目();
  }
});

下一題按鈕.addEventListener('click', () => {
  if (各題答案[目前索引] === null) return;
  if (目前索引 < 問卷資料.length - 1) {
    目前索引 += 1;
    顯示題目();
  } else {
    顯示結果();
  }
});

document.querySelector('#重新填答').addEventListener('click', () => {
  各題答案.fill(null);
  目前索引 = 0;
  顯示題目();
  顯示畫面(問卷);
});
