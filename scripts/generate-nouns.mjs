/**
 * Generates data/vocabulary/nouns.json — ~100 nouns × 8 levels with examples.
 * Preserves curated exampleEn/exampleJa from the existing nouns.json when present.
 * Example refresh scripts: noun-examples-l1-4-build.mjs, patch-noun-examples-l5-8.mjs
 * Run: node scripts/generate-nouns.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {Record<string, [string, string][]>} */
const BY_LEVEL = {
  "1": [
    ["apple", "りんご"], ["book", "本"], ["water", "水"], ["friend", "友達"],
    ["house", "家"], ["school", "学校"], ["teacher", "先生"], ["student", "生徒"],
    ["mother", "母"], ["father", "父"], ["brother", "兄弟"], ["sister", "姉妹"],
    ["dog", "犬"], ["cat", "猫"], ["bird", "鳥"], ["fish", "魚"],
    ["food", "食べ物"], ["bread", "パン"], ["rice", "ご飯・米"], ["milk", "牛乳"],
    ["egg", "卵"], ["meat", "肉"], ["fruit", "果物"], ["vegetable", "野菜"],
    ["day", "日・昼"], ["night", "夜"], ["morning", "朝"], ["evening", "夕方"],
    ["week", "週"], ["month", "月"], ["year", "年"], ["time", "時間"],
    ["man", "男性"], ["woman", "女性"], ["boy", "男の子"], ["girl", "女の子"],
    ["child", "子供"], ["baby", "赤ちゃん"], ["people", "人々"], ["person", "人"],
    ["hand", "手"], ["foot", "足"], ["eye", "目"], ["ear", "耳"],
    ["nose", "鼻"], ["mouth", "口"], ["head", "頭"], ["face", "顔"],
    ["room", "部屋"], ["door", "ドア"], ["window", "窓"], ["table", "テーブル"],
    ["chair", "椅子"], ["bed", "ベッド"], ["bag", "かばん"], ["pen", "ペン"],
    ["pencil", "鉛筆"], ["paper", "紙"], ["phone", "電話"], ["car", "車"],
    ["bus", "バス"], ["train", "電車"], ["bike", "自転車"], ["plane", "飛行機"],
    ["city", "都市"], ["town", "町"], ["street", "通り"], ["park", "公園"],
    ["shop", "店"], ["hospital", "病院"], ["station", "駅"], ["office", "事務所"],
    ["job", "仕事"], ["money", "お金"], ["name", "名前"], ["number", "数字・番号"],
    ["color", "色"], ["red", "赤"], ["blue", "青"], ["green", "緑"],
    ["white", "白"], ["black", "黒"], ["sun", "太陽"], ["moon", "月（衛星）"],
    ["rain", "雨"], ["snow", "雪"], ["wind", "風"], ["sky", "空"],
    ["tree", "木"], ["flower", "花"], ["grass", "草"], ["river", "川"],
    ["sea", "海"], ["mountain", "山"], ["animal", "動物"], ["music", "音楽"],
    ["song", "歌"], ["game", "ゲーム"], ["ball", "ボール"], ["movie", "映画"],
  ],
  "2": [
    ["family", "家族"], ["parent", "親"], ["uncle", "おじさん"], ["aunt", "おばさん"],
    ["cousin", "いとこ"], ["neighbor", "隣人"], ["guest", "客人"], ["host", "ホスト"],
    ["kitchen", "台所"], ["bathroom", "浴室"], ["garden", "庭"], ["floor", "床・階"],
    ["wall", "壁"], ["roof", "屋根"], ["key", "鍵"], ["clock", "時計"],
    ["watch", "腕時計"], ["camera", "カメラ"], ["computer", "コンピュータ"], ["internet", "インターネット"],
    ["email", "メール"], ["message", "メッセージ"], ["letter", "手紙"], ["card", "カード"],
    ["ticket", "切符"], ["passport", "パスポート"], ["map", "地図"], ["photo", "写真"],
    ["picture", "絵・写真"], ["news", "ニュース"], ["story", "物語"], ["language", "言語"],
    ["word", "単語"], ["sentence", "文"], ["question", "質問"], ["answer", "答え"],
    ["test", "テスト"], ["exam", "試験"], ["homework", "宿題"], ["class", "授業・クラス"],
    ["lesson", "レッスン"], ["subject", "科目"], ["math", "数学"], ["science", "科学"],
    ["history", "歴史"], ["art", "芸術"], ["sport", "スポーツ"], ["team", "チーム"],
    ["player", "選手"], ["match", "試合"], ["goal", "ゴール・目標"], ["score", "得点"],
    ["breakfast", "朝食"], ["lunch", "昼食"], ["dinner", "夕食"], ["meal", "食事"],
    ["coffee", "コーヒー"], ["tea", "お茶"], ["juice", "ジュース"], ["sugar", "砂糖"],
    ["salt", "塩"], ["butter", "バター"], ["cheese", "チーズ"], ["soup", "スープ"],
    ["salad", "サラダ"], ["cake", "ケーキ"], ["cookie", "クッキー"], ["ice", "氷"],
    ["clothes", "服"], ["shirt", "シャツ"], ["pants", "ズボン"], ["dress", "ドレス"],
    ["skirt", "スカート"], ["coat", "コート"], ["hat", "帽子"], ["shoes", "靴"],
    ["socks", "靴下"], ["glasses", "眼鏡"], ["weather", "天気"], ["season", "季節"],
    ["spring", "春"], ["summer", "夏"], ["autumn", "秋"], ["winter", "冬"],
    ["holiday", "休日"], ["vacation", "休暇"], ["party", "パーティー"], ["gift", "贈り物"],
    ["birthday", "誕生日"], ["wedding", "結婚式"], ["meeting", "会議"], ["plan", "計画"],
    ["idea", "考え"], ["problem", "問題"], ["reason", "理由"], ["result", "結果"],
    ["hobby", "趣味"], ["skill", "技能"], ["tool", "道具"], ["toy", "おもちゃ"],
  ],
  "3": [
    ["address", "住所"], ["age", "年齢"], ["air", "空気"], ["airport", "空港"],
    ["area", "地域・面積"], ["bank", "銀行"], ["beach", "海岸"], ["bridge", "橋"],
    ["building", "建物"], ["business", "商売・事業"], ["career", "経歴"], ["center", "中心"],
    ["chance", "機会・可能性"], ["change", "変化・お釣り"], ["choice", "選択"], ["club", "クラブ"],
    ["college", "大学（短大など）"], ["company", "会社"], ["concert", "コンサート"], ["condition", "状態・条件"],
    ["conversation", "会話"], ["country", "国・田舎"], ["couple", "夫婦・カップル"], ["course", "講座・コース"],
    ["crowd", "群衆"], ["culture", "文化"], ["customer", "客"], ["danger", "危険"],
    ["decision", "決定"], ["difference", "違い"], ["direction", "方向・指示"], ["distance", "距離"],
    ["dream", "夢"], ["earth", "地球"], ["education", "教育"], ["effort", "努力"],
    ["energy", "エネルギー"], ["event", "出来事・行事"], ["example", "例"],
    ["experience", "経験"], ["fact", "事実"], ["farm", "農場"], ["feeling", "気持ち"],
    ["field", "畑・分野"], ["fire", "火"], ["flight", "飛行・便"], ["forest", "森"],
    ["future", "未来"], ["government", "政府"], ["ground", "地面"], ["group", "グループ"],
    ["habit", "習慣"], ["health", "健康"], ["heart", "心臓・心"], ["hill", "丘"],
    ["hope", "希望"], ["hotel", "ホテル"], ["hour", "時間（60分）"], ["human", "人間"],
    ["industry", "産業"], ["information", "情報"], ["interest", "興味"], ["island", "島"],
    ["kind", "種類・親切"], ["knowledge", "知識"], ["lake", "湖"], ["law", "法律"],
    ["leader", "指導者"], ["library", "図書館"], ["life", "人生・生命"], ["light", "光・明かり"],
    ["line", "線・列"], ["list", "リスト"], ["machine", "機械"], ["market", "市場"],
    ["material", "材料"], ["member", "会員"], ["memory", "記憶"], ["method", "方法"],
    ["mind", "心・精神"], ["minute", "分"], ["moment", "瞬間"], ["museum", "博物館"],
    ["nature", "自然"], ["noise", "騒音"], ["note", "メモ・音符"],
    ["object", "物・対象"], ["ocean", "大洋"], ["opinion", "意見"], ["order", "注文・順序"],
    ["passenger", "乗客"], ["path", "道・小道"], ["patient", "患者"], ["peace", "平和"],
    ["plant", "植物"], ["police", "警察"], ["price", "価格"], ["program", "番組・計画"],
    ["pupil", "生徒"], ["purse", "財布"],
  ],
  "4": [
    ["ability", "能力"], ["account", "口座・説明"], ["action", "行動"], ["activity", "活動"],
    ["actor", "俳優"], ["advice", "助言"], ["agreement", "合意"], ["aim", "目的"],
    ["amount", "量"], ["analysis", "分析"], ["anger", "怒り"], ["appearance", "外見・出現"],
    ["application", "申込・応用"], ["appointment", "約束・予約"], ["approach", "接近・手法"], ["argument", "議論"],
    ["arrangement", "手配"], ["article", "記事・品物"], ["atmosphere", "雰囲気・大気"], ["attention", "注意"],
    ["attitude", "態度"], ["audience", "観客"], ["authority", "権威・当局"], ["average", "平均"],
    ["background", "背景"], ["balance", "バランス"], ["base", "基盤"], ["basic", "基本"],
    ["behavior", "行動・振る舞い"], ["belief", "信念"], ["benefit", "利益・恩恵"], ["bill", "請求書"],
    ["board", "板・委員会"], ["border", "国境"], ["bottom", "底"], ["brain", "脳"],
    ["branch", "枝・支店"], ["budget", "予算"], ["campaign", "キャンペーン"], ["candidate", "候補者"],
    ["capacity", "能力・容量"], ["capital", "首都・資本"], ["case", "場合・ケース"], ["category", "カテゴリー"],
    ["cause", "原因"], ["ceremony", "式"], ["challenge", "挑戦"], ["character", "性格・文字"],
    ["charge", "料金・担当"], ["chemical", "化学物質"], ["citizen", "市民"], ["claim", "主張"],
    ["climate", "気候"], ["code", "暗号・規範"], ["collection", "収集"], ["comment", "コメント"],
    ["communication", "コミュニケーション"], ["community", "共同体"], ["comparison", "比較"], ["competition", "競争"],
    ["complaint", "苦情"], ["complex", "複合体・複雑なもの"], ["concept", "概念"], ["concern", "懸念"],
    ["conclusion", "結論"], ["confidence", "自信"], ["conflict", "対立"], ["connection", "つながり"],
    ["consequence", "結果・影響"], ["construction", "建設"], ["consumer", "消費者"], ["contact", "連絡"],
    ["content", "内容"], ["context", "文脈"], ["contract", "契約"], ["contrast", "対照"],
    ["contribution", "貢献"], ["control", "管理・制御"], ["convenience", "便利"], ["convention", "慣習・大会"],
    ["corner", "角"], ["cost", "費用"], ["court", "裁判所・コート"], ["cover", "覆い・表紙"],
    ["creation", "創造"], ["credit", "信用・単位"], ["crime", "犯罪"], ["crisis", "危機"],
    ["criterion", "基準"], ["criticism", "批判"], ["crop", "作物"], ["custom", "習慣・税関"],
    ["cycle", "循環"], ["damage", "損害"], ["data", "データ"], ["debate", "討論"],
    ["debt", "借金"], ["decade", "10年"], ["delay", "遅れ"], ["demand", "需要"],
  ],
  "5": [
    ["definition", "定義"], ["degree", "程度・学位"],
    ["delivery", "配達"], ["department", "部門"], ["depression", "不況・うつ"],
    ["depth", "深さ"], ["description", "説明"], ["design", "デザイン"], ["desire", "欲望"],
    ["detail", "詳細"], ["development", "発展"], ["device", "装置"], ["diet", "食事・ダイエット"],
    ["difficulty", "困難"], ["dimension", "次元・寸法"], ["disaster", "災害"], ["discipline", "規律・学問"],
    ["discount", "割引"], ["discussion", "議論"], ["disease", "病気"], ["display", "展示・表示"],
    ["distribution", "分配"], ["district", "地区"], ["document", "書類"], ["domain", "領域"],
    ["drama", "ドラマ"], ["duty", "義務"], ["economy", "経済"], ["edge", "端"],
    ["editor", "編集者"], ["effect", "効果・影響"], ["efficiency", "効率"], ["election", "選挙"],
    ["element", "要素"], ["emotion", "感情"], ["emphasis", "強調"], ["employee", "従業員"],
    ["employer", "雇用主"], ["employment", "雇用"], ["enemy", "敵"], ["engine", "エンジン"],
    ["engineer", "エンジニア"], ["entertainment", "娯楽"], ["enthusiasm", "熱意"], ["entrance", "入口"],
    ["environment", "環境"], ["episode", "エピソード"], ["equipment", "設備"], ["error", "誤り"],
    ["escape", "脱出"], ["estimate", "見積もり"], ["evidence", "証拠"], ["exchange", "交換"],
    ["excitement", "興奮"], ["exhibition", "展示会"], ["existence", "存在"], ["expansion", "拡大"],
    ["expectation", "期待"], ["expense", "費用"], ["experiment", "実験"], ["expert", "専門家"],
    ["explanation", "説明"], ["exploration", "探検"], ["export", "輸出"], ["expression", "表現"],
    ["extent", "程度・範囲"], ["facility", "施設"], ["factor", "要因"], ["failure", "失敗"],
    ["fame", "名声"], ["fashion", "ファッション"], ["feature", "特徴"], ["fee", "料金"],
    ["feedback", "フィードバック"], ["figure", "数字・人物"], ["finance", "財政"], ["finding", "発見・所見"],
    ["focus", "焦点"], ["force", "力"], ["form", "形・用紙"], ["formation", "形成"],
    ["formula", "公式"], ["foundation", "基礎・財団"], ["framework", "枠組み"], ["freedom", "自由"],
    ["frequency", "頻度"], ["friendship", "友情"], ["function", "機能・関数"], ["fund", "資金"],
    ["gallery", "美術館"], ["garage", "車庫"], ["gasoline", "ガソリン"], ["gate", "門"],
    ["gene", "遺伝子"], ["genius", "天才"], ["geography", "地理"], ["gesture", "身ぶり"],
    ["globe", "地球儀"], ["glory", "栄光"], ["glucose", "ブドウ糖"],
  ],
  "6": [
    ["furniture", "家具"], ["gain", "利益・獲得"], ["gap", "隙間・格差"], ["generation", "世代"],
    ["glance", "一目"], ["globalization", "グローバリゼーション"], ["goods", "商品"],
    ["grade", "学年・等級"], ["grant", "助成金"], ["growth", "成長"],
    ["guarantee", "保証"], ["guidance", "指導"], ["guideline", "指針"], ["guilt", "罪悪感"],
    ["habitat", "生息地"], ["harm", "害"], ["headline", "見出し"], ["height", "高さ"],
    ["heritage", "遺産"], ["highway", "幹線道路"], ["hint", "ヒント"], ["household", "世帯"],
    ["housing", "住宅"], ["humor", "ユーモア"], ["identity", "同一性・身元"], ["illusion", "錯覚"],
    ["image", "イメージ"], ["imagination", "想像力"], ["impact", "影響"], ["implication", "含意"],
    ["import", "輸入"], ["impression", "印象"], ["improvement", "改善"], ["incentive", "動機づけ"],
    ["incident", "出来事・事件"], ["income", "収入"], ["independence", "独立"], ["index", "指数・索引"],
    ["indication", "兆候"], ["individual", "個人"], ["inflation", "インフレ"], ["influence", "影響"],
    ["initiative", "主導権・施策"], ["injury", "けが"], ["innovation", "革新"], ["inquiry", "問い合わせ"],
    ["insight", "洞察"], ["instance", "例"], ["institution", "機関"], ["instruction", "指示"],
    ["instrument", "器具・楽器"], ["insurance", "保険"], ["intention", "意図"], ["interaction", "相互作用"],
    ["interpretation", "解釈"], ["interview", "面接・インタビュー"], ["introduction", "導入・紹介"], ["invasion", "侵略"],
    ["invention", "発明"], ["investigation", "調査"], ["investment", "投資"], ["invitation", "招待"],
    ["issue", "問題・号"], ["item", "項目"], ["journey", "旅"], ["judgment", "判断"],
    ["justice", "正義"], ["label", "ラベル"], ["labor", "労働"], ["lack", "不足"],
    ["landscape", "風景"], ["layer", "層"], ["league", "連盟"], ["lecture", "講義"],
    ["length", "長さ"], ["level", "水準"], ["liability", "責任・負債"],
    ["license", "免許"], ["lifestyle", "生活様式"], ["limitation", "制限"], ["link", "つながり"],
    ["literature", "文学"], ["loan", "融資"], ["location", "場所"], ["logic", "論理"],
    ["loss", "損失"], ["loyalty", "忠誠"], ["luxury", "贅沢"], ["majority", "過半数"],
    ["makeup", "化粧"], ["manual", "手引き"], ["marble", "大理石"],
    ["marine", "海の生き物・海運"], ["mask", "マスク"], ["matrix", "行列・母体"], ["mayor", "市長"],
    ["melody", "メロディー"], ["memo", "メモ"], ["menu", "メニュー"], ["mercy", "慈悲"],
  ],
  "7": [
    ["management", "経営・管理"], ["manner", "作法・方法"], ["manufacture", "製造"], ["margin", "余白・差"],
    ["mark", "印・点"], ["mass", "塊・大衆"], ["master", "達人・主人"], ["matter", "事柄・物質"],
    ["measure", "対策・測定"], ["mechanism", "仕組み"], ["media", "メディア"], ["medium", "媒体"],
    ["membership", "会員資格"], ["mention", "言及"], ["merchant", "商人"], ["merit", "長所"],
    ["metal", "金属"], ["migration", "移住"], ["minority", "少数派"],
    ["miracle", "奇跡"], ["mission", "使命"], ["mistake", "間違い"], ["mixture", "混合物"],
    ["mode", "様式・モード"], ["model", "模型・手本"], ["modification", "修正"], ["molecule", "分子"],
    ["momentum", "勢い"], ["monitor", "監視・画面"], ["mood", "気分"], ["mortgage", "住宅ローン"],
    ["motion", "動き"], ["motivation", "動機"], ["movement", "運動・動き"], ["myth", "神話"],
    ["narrative", "物語"], ["nation", "国家"], ["necessity", "必要性"], ["negotiation", "交渉"],
    ["network", "ネットワーク"], ["nightmare", "悪夢"], ["notion", "考え"], ["novel", "小説"],
    ["obligation", "義務"], ["observation", "観察"], ["obstacle", "障害"], ["occasion", "機会・行事"],
    ["occupation", "職業・占領"], ["offense", "違反・攻撃"], ["offer", "申し出"], ["official", "役人"],
    ["operation", "手術・運用"], ["opponent", "相手"], ["opportunity", "機会"], ["option", "選択肢"],
    ["orbit", "軌道"], ["organism", "有機体"], ["organization", "組織"], ["origin", "起源"],
    ["outcome", "結果"], ["outline", "概要"], ["output", "産出"], ["ownership", "所有権"],
    ["pace", "ペース"], ["package", "小包"], ["pain", "痛み"], ["panel", "委員会・パネル"],
    ["parameter", "パラメータ"], ["participant", "参加者"], ["participation", "参加"], ["partner", "相棒"],
    ["passage", "通路・一節"], ["passion", "情熱"], ["patience", "忍耐"], ["pattern", "模様・型"],
    ["payment", "支払い"], ["penalty", "罰・ペナルティ"], ["pension", "年金"],
    ["percentage", "パーセント"], ["perception", "認識"], ["performance", "演技・成績"], ["period", "期間"],
    ["permission", "許可"], ["perspective", "視点"], ["phase", "段階"], ["phenomenon", "現象"],
    ["philosophy", "哲学"], ["phrase", "句"], ["pilot", "パイロット"], ["pipeline", "パイプライン"],
    ["planet", "惑星"], ["plastic", "プラスチック"], ["plot", "筋書き"], ["poem", "詩"],
    ["poet", "詩人"], ["poison", "毒"], ["pole", "棒・極"], ["poll", "世論調査"],
    ["portal", "入口"], ["poster", "ポスター"],
  ],
  "8": [
    ["platform", "台・方針"], ["policy", "政策"], ["politics", "政治"], ["pollution", "汚染"],
    ["population", "人口"], ["portion", "部分"], ["portrait", "肖像"], ["position", "位置・立場"],
    ["possibility", "可能性"], ["potential", "潜在能力"], ["poverty", "貧困"], ["power", "力・権力"],
    ["practice", "練習・慣行"], ["praise", "称賛"], ["prayer", "祈り"], ["precaution", "予防策"],
    ["precision", "精密さ"], ["prediction", "予測"], ["preference", "好み"], ["prejudice", "偏見"],
    ["presence", "存在"], ["presentation", "発表"], ["preservation", "保存"], ["president", "大統領・社長"],
    ["pressure", "圧力"], ["prestige", "名声"], ["prevention", "予防"], ["pride", "誇り"],
    ["principle", "原則"], ["priority", "優先事項"], ["privacy", "プライバシー"], ["privilege", "特権"],
    ["probability", "確率"], ["procedure", "手続き"], ["process", "過程"], ["product", "製品"],
    ["production", "生産"], ["profession", "専門職"], ["professor", "教授"], ["profile", "プロフィール"],
    ["profit", "利益"], ["progress", "進歩"], ["project", "計画・プロジェクト"], ["promise", "約束"],
    ["promotion", "昇進・宣伝"], ["proof", "証拠"], ["property", "財産・性質"], ["proportion", "割合"],
    ["proposal", "提案"], ["prospect", "見通し"], ["protection", "保護"], ["protest", "抗議"],
    ["provision", "供給・規定"], ["psychology", "心理学"], ["publication", "出版物"], ["publicity", "宣伝"],
    ["punishment", "罰"], ["purchase", "購入"], ["purpose", "目的"], ["pursuit", "追求"],
    ["quality", "質"], ["quantity", "量"], ["quarter", "四半期・地区"], ["race", "人種・競争"],
    ["range", "範囲"], ["rank", "順位"], ["rate", "率・料金"], ["ratio", "比率"],
    ["reaction", "反応"], ["reality", "現実"], ["recognition", "認識・評価"],
    ["recommendation", "推薦"], ["record", "記録"], ["recovery", "回復"], ["reduction", "削減"],
    ["reference", "参照・推薦状"], ["reflection", "反射・考察"], ["reform", "改革"], ["refuge", "避難所"],
    ["regard", "考慮・敬意"], ["region", "地域"], ["register", "登録簿"], ["regulation", "規制"],
    ["relation", "関係"], ["relationship", "人間関係"], ["relief", "安堵・救援"], ["religion", "宗教"],
    ["reputation", "評判"], ["request", "依頼"], ["requirement", "必要条件"], ["research", "研究"],
    ["reserve", "予備・保護区"], ["residence", "住居"], ["resident", "住民"], ["resource", "資源"],
    ["respect", "尊敬"], ["response", "反応"], ["responsibility", "責任"], ["restriction", "制限"],
    ["retail", "小売"],
  ],
};

function article(word) {
  return /^[aeiou]/i.test(word) ? "an" : "a";
}

function exampleFor(en, ja) {
  const a = article(en);
  return {
    exampleEn: `This is ${a} ${en}.`,
    exampleJa: `これは${ja}です。`,
  };
}

function loadExistingExamples() {
  try {
    const raw = JSON.parse(
      readFileSync(join(__dirname, "..", "data", "vocabulary", "nouns.json"), "utf8"),
    );
    /** @type {Map<string, { exampleEn: string, exampleJa: string }>} */
    const map = new Map();
    for (const w of raw.words ?? []) {
      if (w.en && w.exampleEn && !/^This is /i.test(w.exampleEn)) {
        map.set(w.en, { exampleEn: w.exampleEn, exampleJa: w.exampleJa });
      }
    }
    return map;
  } catch {
    return new Map();
  }
}

const existingExamples = loadExistingExamples();

const words = [];
for (const [level, pairs] of Object.entries(BY_LEVEL)) {
  pairs.forEach(([en, ja], i) => {
    const curated = existingExamples.get(en);
    const ex = curated ?? exampleFor(en, ja);
    words.push({
      id: `n${level}-${i + 1}`,
      en,
      ja,
      pos: "noun",
      level,
      exampleEn: ex.exampleEn,
      exampleJa: ex.exampleJa,
    });
  });
}

const outPath = join(__dirname, "..", "data", "vocabulary", "nouns.json");
writeFileSync(outPath, JSON.stringify({ words }, null, 2) + "\n", "utf8");

const counts = Object.fromEntries(
  Object.entries(BY_LEVEL).map(([k, v]) => [k, v.length]),
);
console.log("Wrote", words.length, "nouns to", outPath);
console.log("Per level:", counts);
console.log("Curated examples kept:", words.filter((w) => existingExamples.has(w.en)).length);

const ens = words.map((w) => w.en);
const dupes = ens.filter((e, i) => ens.indexOf(e) !== i);
if (dupes.length) {
  console.warn("Duplicate English words:", [...new Set(dupes)]);
}
