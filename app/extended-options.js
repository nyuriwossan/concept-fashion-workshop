export const FOOD_GROUPS = [
  { id: "sweets", label: "スイーツ", en: "sweet and dessert motifs" },
  { id: "fruits", label: "フルーツ", en: "fruit motifs" },
  { id: "drinks", label: "飲み物", en: "non-alcoholic drink motifs" },
  { id: "alcohol", label: "酒・カクテル", en: "wine and cocktail motifs" },
  { id: "savory", label: "甘くない食べ物", en: "savory food motifs" },
];

const FOOD_ITEMS = {
  sweets: [
    ["parfait", "パフェ", "parfait"], ["ice_cream", "アイスクリーム", "ice cream"],
    ["soft_serve", "ソフトクリーム", "soft-serve ice cream"], ["gelato", "ジェラート", "gelato"],
    ["shortcake", "ショートケーキ", "strawberry shortcake"], ["whole_cake", "ホールケーキ", "decorated whole cake"],
    ["mille_feuille", "ミルフィーユ", "mille-feuille pastry"], ["macaron", "マカロン", "macaron"],
    ["donut", "ドーナツ", "glazed donut"], ["crepe", "クレープ", "fruit crepe"],
    ["pudding", "プリン", "caramel custard pudding"], ["jelly", "ゼリー", "translucent jelly dessert"],
    ["pancake", "パンケーキ", "stacked pancakes"], ["waffle", "ワッフル", "golden waffle"],
    ["chocolate", "チョコレート", "chocolate"], ["candy", "キャンディ", "colorful candy"],
    ["cotton_candy", "綿あめ", "cotton candy"], ["cookie", "クッキー", "decorated cookies"],
  ],
  fruits: [
    ["strawberry", "いちご", "strawberry"], ["cherry", "さくらんぼ", "cherry"],
    ["orange", "オレンジ", "orange citrus"], ["lemon", "レモン", "lemon"],
    ["lime", "ライム", "lime"], ["grapefruit", "グレープフルーツ", "grapefruit"],
    ["grape", "ぶどう", "grapes"], ["peach", "もも", "peach"],
    ["apple", "りんご", "apple"], ["pear", "梨", "pear"],
    ["blueberry", "ブルーベリー", "blueberry"], ["raspberry", "ラズベリー", "raspberry"],
    ["blackberry", "ブラックベリー", "blackberry"], ["kiwi", "キウイ", "kiwi fruit"],
    ["pineapple", "パイナップル", "pineapple"], ["mango", "マンゴー", "mango"],
    ["banana", "バナナ", "banana"], ["watermelon", "スイカ", "watermelon"],
    ["melon", "メロン", "melon"], ["pomegranate", "ざくろ", "pomegranate"],
    ["fig", "いちじく", "fig"], ["coconut", "ココナッツ", "coconut"],
  ],
  drinks: [
    ["cream_soda", "クリームソーダ", "retro cream soda"], ["soda", "ソーダ", "sparkling soda"],
    ["lemonade", "レモネード", "fresh lemonade"], ["fruit_juice", "フルーツジュース", "colorful fruit juice"],
    ["milk", "ミルク", "fresh milk"], ["milk_tea", "ミルクティー", "milk tea"],
    ["black_tea", "紅茶", "black tea"], ["herbal_tea", "ハーブティー", "herbal tea"],
    ["coffee", "コーヒー", "roasted coffee"], ["cafe_latte", "カフェラテ", "cafe latte"],
    ["cocoa", "ココア", "hot cocoa"],
  ],
  alcohol: [
    ["wine", "ワイン", "wine"], ["red_wine", "赤ワイン", "red wine"],
    ["white_wine", "白ワイン", "white wine"], ["rose_wine", "ロゼワイン", "rose wine"],
    ["champagne", "シャンパン", "champagne"], ["cocktail", "カクテル", "colorful cocktail"],
    ["mojito", "モヒート", "mojito"], ["blue_curacao", "ブルーキュラソー系カクテル", "blue curacao cocktail"],
    ["sake", "日本酒", "Japanese sake"], ["umeshu", "梅酒", "Japanese plum wine"],
  ],
  savory: [
    ["sushi", "寿司", "sushi"], ["fruit_sandwich", "フルーツサンド", "Japanese fruit sandwich"],
    ["afternoon_tea", "アフタヌーンティーセット", "afternoon tea set"], ["bread", "パン", "artisan bread"],
    ["croissant", "クロワッサン", "croissant"], ["hamburger", "ハンバーガー", "hamburger"],
    ["pasta", "パスタ", "pasta dish"], ["ramen", "ラーメン", "ramen"],
    ["curry", "カレー", "Japanese curry"], ["omurice", "オムライス", "omurice"],
    ["pizza", "ピザ", "pizza"],
  ],
};

const GROUP_PROFILES = {
  sweets: {
    palette: "dessert-inspired pastel and cream colors",
    materials: "satin, airy tulle, glossy beads, and sugar-like sparkle",
    shape: "layered confectionery volumes and piped decorative edges",
    detail: "small dessert motifs translated into embroidery, jewelry, and trim",
    summary: "お菓子の層・色・質感を、甘く華やかな衣装構造へ翻訳します",
  },
  fruits: {
    palette: "fresh fruit colors balanced with leaf green and translucent highlights",
    materials: "lustrous silk, translucent organza, glass beads, and dewy crystal accents",
    shape: "clean botanical curves and rounded fruit-inspired forms",
    detail: "fruit slices, seeds, leaves, and blossoms used as textile and jewelry motifs",
    summary: "果実の色・輪切り・葉・みずみずしさを衣装の柄や装飾へ活かします",
  },
  drinks: {
    palette: "drink-inspired translucent gradients with clear glass highlights",
    materials: "liquid-gloss satin, transparent organza, bubble-like sequins, and glass beads",
    shape: "rising fizz, steam, pouring curves, and glass-like layered panels",
    detail: "bubbles, droplets, ice, and glass-rim geometry translated into ornament",
    summary: "飲み物の透明感・泡・湯気・グラスの光を衣装へ映します",
  },
  alcohol: {
    palette: "deep jewel-toned liquid colors with crystal-clear highlights",
    materials: "velvet, liquid satin, crystal mesh, glass beads, and metallic accents",
    shape: "elegant cocktail-hour tailoring with fluid pouring lines",
    detail: "glass stems, bubbles, reflections, and refined barware-inspired jewelry",
    summary: "酒の深い色・液体感・グラスの艶を、大人っぽい衣装へ翻訳します",
  },
  savory: {
    palette: "appetizing ingredient colors arranged with clean graphic contrast",
    materials: "textured silk, crisp cotton, lacquer-like accents, and polished accessories",
    shape: "playful structured layers inspired by plating and stacked ingredients",
    detail: "ingredients and serving motifs translated into patterns, embroidery, and handheld props",
    summary: "料理の配色・盛り付け・素材の重なりを、遊び心ある衣装へ変えます",
  },
};

const SPECIAL_PROFILES = {
  parfait: { palette: "strawberry red, cream white, mint, and glass-clear highlights", shape: "visible dessert-like tiers, fluted glass lines, and a whipped-cream crown", summary: "パフェの層構造・クリーム・果物色を、縦に映える衣装へ翻訳します" },
  cream_soda: { palette: "mint green, vanilla white, cherry red, and glass-clear highlights", materials: "transparent organza, liquid-gloss satin, bubble sequins, and crystal beads", detail: "fizzing bubbles, a glass-rim line, and cherry-red accents used only as jewelry or handheld props", summary: "クリームソーダの透明感・ミント色・泡をレトロポップにまとめます" },
  lemon: { palette: "lemon yellow, clean white, leaf green, and transparent highlights", detail: "citrus-slice geometry, tiny blossoms, and fresh leaf embroidery", summary: "レモンの黄・白・透明感・輪切りを、爽やかな夏衣装へ活かします" },
  wine: { palette: "deep wine red, black cherry, crystal clear, and muted gold", materials: "liquid satin, velvet, transparent glass-like panels, and polished gold", summary: "ワインの深赤・液体感・グラスの艶を、成熟した衣装へ映します" },
  red_wine: { palette: "cabernet red, burgundy, black cherry, and crystal highlights", materials: "velvet, liquid satin, and wine-glass crystal accents" },
  sushi: { palette: "rice white, seaweed black, salmon coral, and lacquer red", detail: "clean ingredient-colored blocks, subtle wave motifs, and serving-tray accessories", summary: "寿司の和風配色と盛り付け感を、柄・小物・端正な面構成へ翻訳します" },
};

export const FOOD_MOTIFS = Object.entries(FOOD_ITEMS).flatMap(([groupId, items]) =>
  items.map(([id, label, en]) => ({
    id,
    label,
    en,
    groupId,
    ...GROUP_PROFILES[groupId],
    ...(SPECIAL_PROFILES[id] || {}),
  })),
);

export const FOOD_APPLICATIONS = [
  { id: "palette", label: "配色に反映", en: "the color palette" },
  { id: "pattern", label: "柄に反映", en: "textile patterns" },
  { id: "embroidery", label: "刺繍に反映", en: "embroidery" },
  { id: "accessory", label: "アクセサリーに反映", en: "jewelry and accessories" },
  { id: "material", label: "素材感に反映", en: "material and surface texture" },
  { id: "prop", label: "小物に反映", en: "a handheld or table prop" },
  { id: "background", label: "背景演出に反映", en: "background staging" },
  { id: "literal", label: "実物を添える", en: "a literal food or drink item placed safely on a tray, plate, glass, or table" },
];

export const QIPAO_NECKLINES = [
  { id: "classic", label: "立ち襟", en: "a clean high stand collar with a diagonal closure" },
  { id: "halter", label: "ホルターネック", en: "a halter-neck qipao bodice with fully exposed shoulders" },
  { id: "open_back", label: "背中開き", en: "an open-back qipao bodice" },
  { id: "bare_shoulders", label: "肩出し", en: "a shoulder-baring qipao neckline" },
];

export const QIPAO_LENGTHS = [
  { id: "mini", label: "ミニ丈", en: "a clean mini hem" },
  { id: "above_knee", label: "膝上丈", en: "an above-knee hem" },
  { id: "knee", label: "膝丈", en: "a knee-length hem" },
  { id: "long", label: "ロング丈", en: "a long ankle-length hem" },
];

export const QIPAO_SLITS = [
  { id: "high", label: "ハイスリット", en: "a high side slit" },
  { id: "modest", label: "控えめスリット", en: "a modest side slit" },
  { id: "none", label: "スリットなし", en: "a slit-free closed hem" },
];

export const QIPAO_DRAPES = [
  { id: "clean", label: "余分な布なし", en: "a self-contained one-piece silhouette with a clean arm line and no separate draped panels" },
  { id: "short_panel", label: "短い飾り布", en: "one short controlled decorative panel attached to the dress" },
  { id: "cape", label: "ケープ併用", en: "a separate short couture cape that leaves the arms readable" },
];

export const IDOL_STYLES = [
  { id: "frill_mini", label: "フリルミニスカート", en: "an above-knee frilled mini skirt with sparkling layered ruffles" },
  { id: "above_knee", label: "膝上スカート", en: "a crisp above-knee stage skirt" },
  { id: "volume", label: "ボリュームスカート", en: "a buoyant high-volume performance skirt" },
  { id: "flare", label: "フレアスカート", en: "a lively flared skirt" },
  { id: "tiered", label: "ティアードスカート", en: "a glittering tiered skirt" },
  { id: "sequin", label: "スパンコール衣装", en: "a sequin-rich performance ensemble" },
  { id: "stage", label: "ステージ衣装", en: "a polished concert stage costume" },
  { id: "ribbons", label: "リボン多め", en: "a ribbon-rich idol costume" },
  { id: "stars", label: "星モチーフ", en: "a star-motif idol costume" },
  { id: "future", label: "近未来アイドル", en: "a futuristic illuminated idol ensemble" },
  { id: "classic_cute", label: "王道かわいい系", en: "a classic cute idol look" },
  { id: "cool", label: "クール系アイドル", en: "a sharp cool-toned idol look" },
  { id: "japanese", label: "和風アイドル", en: "a Japanese-inspired idol ensemble" },
  { id: "mens", label: "メンズアイドル衣装", en: "a tailored mens-idol stage ensemble wearable by any person" },
  { id: "unisex", label: "ユニセックスアイドル", en: "a gender-neutral unisex idol costume" },
];

export const ART_NOUVEAU_SHAPES = [
  { id: "long", label: "ロングドレス", en: "a flowing long dress with organic curves and no mandatory slit" },
  { id: "midi", label: "ミディ丈", en: "a softly draped midi-length silhouette" },
  { id: "mini", label: "ミニ丈", en: "a decorative mini silhouette with curved botanical panels" },
  { id: "tunic", label: "チュニック風", en: "an elegant Art Nouveau tunic silhouette" },
  { id: "cape", label: "ケープ付き", en: "a curved botanical cape over an independent dress silhouette" },
  { id: "separates", label: "上下セパレート", en: "a coordinated two-piece silhouette with flowing ornamental lines" },
  { id: "no_slit", label: "スリットなし", en: "a slit-free hem with continuous whiplash curves" },
  { id: "modest_slit", label: "控えめスリット", en: "one restrained slit integrated into a non-column silhouette" },
];

export const POSE_MOODS = [
  ["cute", "可愛い", "Use a cute, charming pose"], ["cool", "クール", "Use a cool and controlled pose"],
  ["sexy", "セクシー", "Use an alluring but fashion-focused pose"], ["refined", "上品", "Use a refined and dignified pose"],
  ["mystical", "神秘的", "Use a mysterious, otherworldly pose"], ["graceful", "優雅", "Use a graceful flowing pose"],
  ["energetic", "元気", "Use an energetic upbeat pose"], ["languid", "気だるい", "Use a languid relaxed pose"],
  ["commanding", "高圧的", "Use a commanding, dominant pose"], ["guardian", "守護者風", "Use a protective guardian-like pose"],
  ["idol", "アイドル風", "Use a polished idol-performance pose"], ["model", "モデル風", "Use a high-fashion model pose"],
  ["inviting", "誘うような", "Use an inviting gaze and gesture"], ["innocent", "無邪気", "Use an innocent playful pose"],
  ["fragile", "儚い", "Use a delicate, fleeting pose"],
].map(([id, label, en]) => ({ id, label, en }));

export const SEATS = [
  ["chair", "椅子", "a stable elegant chair"], ["armchair", "アームチェア", "an upholstered armchair"],
  ["throne", "玉座", "an ornate throne"], ["stool", "スツール", "a compact stool"],
  ["bench", "ベンチ", "a long bench"], ["sofa", "ソファ", "a plush sofa"],
  ["chaise", "寝椅子", "an elegant chaise longue"], ["counter_chair", "カウンターチェア", "a counter-height chair"],
  ["church_chair", "教会の椅子", "a carved church chair"], ["school_chair", "学校の椅子", "a simple school chair"],
  ["garden_chair", "ガーデンチェア", "a decorative garden chair"], ["bar_stool", "バースツール", "a tall bar stool"],
  ["floor", "床座り", "the floor with the garment arranged naturally"], ["bed", "ベッド", "the edge of a neatly made bed"],
  ["cushion", "クッション", "a large floor cushion"], ["windowsill", "窓辺", "a broad windowsill"],
  ["table_edge", "テーブル端", "the stable edge of a table"], ["stairs", "階段", "a broad stair step"],
  ["rock", "岩", "a stable natural rock"], ["flower_field", "花畑", "a flower-covered ground"],
  ["waterside", "水辺", "a dry stable ledge beside the water"],
].map(([id, label, en]) => ({ id, label, en }));

export const PRESENTATIONS = [
  { id: "standing", label: "立ち姿", note: "基本・全身", en: "Use a clear full-body standing pose that keeps the complete costume readable", shortEn: "full-body standing pose" },
  { id: "turning", label: "振り向き", note: "背面・視線", en: "Use a full-body over-the-shoulder turning pose that shows the back design and leg line", shortEn: "turning pose, over shoulder" },
  { id: "front_full", label: "正面全身", note: "設計を確認", en: "Use a straight-on full-body composition with an unobstructed costume silhouette", shortEn: "front full body" },
  { id: "looking_up", label: "見上げ構図", note: "視線を上へ", en: "Frame the full figure while they look upward, preserving the garment silhouette", shortEn: "full body, upward gaze" },
  { id: "high_angle", label: "見下ろし・俯瞰", note: "上から", en: "Use a high-angle overhead composition that clearly arranges the costume around the figure", shortEn: "high angle, overhead" },
  { id: "low_angle", label: "ローアングル", note: "堂々と", en: "Use a tasteful low-angle full-body fashion composition without distorting the outfit", shortEn: "low-angle full body" },
  { id: "seated", label: "座り構図", note: "座面を選択", seated: true, en: "Use a stable full-body seated fashion pose, visibly supported by the selected seat, with the garment arranged clearly", shortEn: "supported seated fashion pose" },
  { id: "chair_sit", label: "椅子座り", note: "衣装映え", seated: true, en: "Use an elegant chair-seated full-body pose with the hem and legs arranged for costume readability", shortEn: "chair seated, full body" },
  { id: "sofa_sit", label: "ソファ座り", note: "くつろぎ", seated: true, en: "Use a composed sofa-seated pose with layered fabric spread visibly around the figure", shortEn: "sofa seated pose" },
  { id: "floor_sit", label: "床座り", note: "裾を広げる", seated: true, en: "Use a floor-seated pose with the skirt or train spread in a clear radial arrangement", shortEn: "floor seated, spread hem" },
  { id: "bed", label: "ベッド上", note: "柔らかい構図", en: "Compose the figure on a neatly made bed while keeping the outfit fully visible and unobstructed", shortEn: "on bed, costume visible" },
  { id: "sleeping", label: "寝姿・俯瞰", note: "上から・布の面", en: "View the reclining figure from directly above, arranging the costume as a clear graphic shape", shortEn: "reclining, overhead view" },
  { id: "dakimakura", label: "添い寝シーツ風", note: "縦長・真上", en: "Use a tasteful vertical dakimakura-sheet-inspired overhead composition, reclining straight with the full costume visible from head to toe", shortEn: "vertical overhead reclining composition" },
  { id: "reclining", label: "横たわり", note: "横向き", en: "Use an elegant side-reclining full-body pose with the garment spread naturally", shortEn: "side reclining, full body" },
  { id: "prone", label: "うつ伏せ", note: "背面を見せる", en: "Use a tasteful prone pose viewed from a high angle, emphasizing the back design while keeping the costume readable", shortEn: "prone, high angle, back design" },
  { id: "supine", label: "仰向け", note: "正面・俯瞰", en: "Use a supine overhead pose with fabric arranged symmetrically around the body", shortEn: "supine, overhead" },
  { id: "one_knee", label: "片膝立ち", note: "動き・強さ", en: "Use a full-body one-knee pose with balanced posture and an unobstructed silhouette", shortEn: "one-knee full-body pose" },
  { id: "crossed_legs", label: "脚組み", note: "座り・端正", seated: true, en: "Use a supported seated pose with elegantly crossed legs and the outfit clearly arranged", shortEn: "seated, crossed legs" },
  { id: "turning_legs", label: "振り返り美脚", note: "脚線・背面", en: "Use a tasteful turning full-body pose that emphasizes the leg line and back design", shortEn: "turning pose, leg line" },
  { id: "spread_dress", label: "ドレスを広げる", note: "裾・面積", en: "Use both hands to spread the dress or skirt so its construction is fully visible", shortEn: "spreading dress" },
  { id: "pinch_outfit", label: "衣装をつまむ", note: "布を見せる", en: "Lightly hold one edge of the garment to display its textile, layers, and hem", shortEn: "holding garment edge" },
  { id: "wind_swept", label: "マント・裾をなびかせる", note: "風・動き", en: "Use a full-body fashion pose with the cape or hem moving in a controlled wind", shortEn: "wind-swept cape or hem" },
  { id: "runway", label: "ランウェイ", note: "歩き・全身", en: "Use a full-body runway walk with a confident posture and a composed expression", shortEn: "runway walk, full body" },
  { id: "editorial", label: "ファッション誌風", note: "洗練", en: "Use a three-quarter fashion editorial composition with an elegant model pose", shortEn: "fashion editorial pose" },
  { id: "stage", label: "ステージ構図", note: "照明・動き", en: "Show the full figure in a theatrical stage pose with one sweeping gesture and clear costume lighting", shortEn: "full-body stage pose" },
];
