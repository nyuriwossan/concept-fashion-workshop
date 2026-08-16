"use client";

import { useMemo, useState } from "react";
import { buildPrompt } from "./prompt-engine";

type Choice = { id: string; label: string; en: string; shortEn?: string };
type Motif = Choice & {
  palette: string;
  materials: string;
  shape: string;
  detail: string;
  summary: string;
};

const MOTIF_CATEGORIES: Array<{
  id: string;
  label: string;
  icon: string;
  items: Motif[];
}> = [
  {
    id: "concept",
    label: "概念・感情",
    icon: "♡",
    items: [
      { id: "first_love", label: "初恋", en: "first-love", palette: "blush pink, pale blue, and pearl white", materials: "sheer organza, satin, and fine tulle", shape: "an opening flower and fluttering ribbon", detail: "pressed-flower embroidery and tiny pearl drops", summary: "淡い色と花びらのような重なりで、初恋の高鳴りを表します" },
      { id: "jealousy", label: "嫉妬", en: "jealousy", palette: "acid green, deep emerald, and ink black", materials: "glossy silk, smoked mesh, and dark metal", shape: "coiling vines and a sharply narrowed waist", detail: "watchful eye-like gems and thorn motifs", summary: "緑の光沢と絡む蔓で、美しく危うい嫉妬を衣装化します" },
      { id: "nostalgia", label: "郷愁", en: "nostalgia", palette: "faded amber, dusty rose, and old ivory", materials: "washed velvet, antique lace, and soft chiffon", shape: "timeworn layers and a lingering train", detail: "faded botanical prints and heirloom buttons", summary: "褪せた色と古いレースで、遠い記憶の温度をまとわせます" },
      { id: "solitude", label: "孤独", en: "solitude", palette: "midnight blue, fog gray, and a single silver accent", materials: "matte crepe, translucent veil, and brushed metal", shape: "a narrow isolated column with floating outer layers", detail: "widely spaced stars and broken-line embroidery", summary: "静かな青と余白のある構造で、凛とした孤独を表します" },
      { id: "hope", label: "希望", en: "hope", palette: "dawn gold, clear sky blue, and luminous white", materials: "luminous silk, crystal mesh, and airy tulle", shape: "upward rays and unfolding wing-like panels", detail: "sunrise beading and fine golden threads", summary: "夜明けの光と上向きの線で、希望が開く瞬間を描きます" },
    ],
  },
  {
    id: "fantasy",
    label: "ファンタジー・超常",
    icon: "✦",
    items: [
      { id: "moon_witch", label: "月の魔女", en: "moon-witch", palette: "moonlit silver, indigo, and deep violet", materials: "velvet, translucent chiffon, and silver filigree", shape: "crescent arcs and a floating nocturnal cape", detail: "lunar phases, star chains, and crystal droplets", summary: "月相と夜色を、浮遊感のある魔女衣装に仕立てます" },
      { id: "crystal_dragon", label: "結晶竜", en: "crystal-dragon", palette: "prismatic blue, amethyst, and polished silver", materials: "faceted crystal, iridescent scales, and structured organza", shape: "swept horns, angular wings, and a powerful tapered form", detail: "gemstone scales and refracted-light edges", summary: "結晶の鱗と鋭い稜線で、竜の強さを華やかに映します" },
      { id: "celestial", label: "天上の使い", en: "celestial-messenger", palette: "radiant white, warm gold, and pale cyan", materials: "luminous silk, feather-light layers, and gold thread", shape: "halo rings and long symmetrical panels", detail: "constellation embroidery and suspended light shards", summary: "光輪と左右対称のラインで、神聖な存在感を作ります" },
      { id: "abyss", label: "深淵", en: "the abyss", palette: "void black, petroleum blue, and ultraviolet", materials: "light-absorbing velvet, liquid gloss, and smoky mesh", shape: "a plunging spiral and bottomless layered folds", detail: "faint bioluminescent seams and fractured ornaments", summary: "光を吸う黒と渦の構造で、深淵の引力を衣装化します" },
      { id: "time_magic", label: "時の魔法", en: "time-magic", palette: "antique gold, clockwork bronze, and midnight teal", materials: "metallic lace, glass, and fine pleated silk", shape: "concentric rings and repeating clock-hand lines", detail: "hourglass gems and orbiting numeral ornaments", summary: "円環と時計の意匠で、時間が巡る魔法を表現します" },
    ],
  },
  {
    id: "myth",
    label: "物語・神話・伝承",
    icon: "☾",
    items: [
      { id: "valkyrie", label: "ワルキューレ", en: "Valkyrie", palette: "storm silver, ice blue, and deep navy", materials: "engraved metal, white feathers, and heavy silk", shape: "winged shoulders and a heroic armored silhouette", detail: "runes, spear-point geometry, and braided borders", summary: "翼とルーンを、凛々しい戦装束へ翻訳します" },
      { id: "phoenix", label: "不死鳥", en: "phoenix-legend", palette: "crimson, molten gold, and ember orange", materials: "layered feathers, flame-like organza, and gold foil", shape: "rising wings and a sweeping flame-shaped train", detail: "ember crystals and rebirth-ring motifs", summary: "炎と羽根の上昇線で、不死鳥の再生を表します" },
      { id: "bamboo_princess", label: "竹取物語", en: "moon-princess folklore", palette: "bamboo green, moon white, and soft gold", materials: "silk, fine gauze, and polished bamboo accents", shape: "courtly layers with a luminous moon-disc train", detail: "bamboo-leaf embroidery and floating moon petals", summary: "竹と月を、気品ある物語衣装へ仕立てます" },
      { id: "mermaid_tale", label: "人魚姫", en: "melancholic mermaid-tale", palette: "seafoam, pearl, and twilight blue", materials: "iridescent scales, wet-look silk, and translucent fins", shape: "wave curves and a foam-like cascading hem", detail: "pearls, sea-glass, and tear-shaped crystals", summary: "泡と真珠の質感で、人魚姫の切ない物語を描きます" },
      { id: "red_hood", label: "赤ずきん", en: "Red-Riding-Hood folklore", palette: "scarlet, forest green, and charcoal", materials: "wool, velvet, and thorn-pattern lace", shape: "a dramatic hooded cape over a forest-ready silhouette", detail: "wolf-claw clasps and berry-red embroidery", summary: "赤いフードと森の影を、物語性のある衣装にします" },
    ],
  },
  {
    id: "food",
    label: "食べ物・飲み物",
    icon: "♨",
    items: [
      { id: "macaron", label: "マカロン", en: "macaron", palette: "pastel pistachio, raspberry pink, and cream", materials: "matte satin, airy tulle, and sugar-like beadwork", shape: "rounded tiers and crisp piped edges", detail: "petite rosettes and confectionery pearls", summary: "丸い層とパステル色で、マカロンの軽やかさを表します" },
      { id: "black_tea", label: "紅茶", en: "black-tea", palette: "amber, burgundy, and porcelain ivory", materials: "tea-stained silk, velvet, and delicate lace", shape: "rising steam curves and a refined hourglass form", detail: "tea-leaf embroidery and porcelain-like brooches", summary: "琥珀色と立つ湯気の曲線で、香り高い衣装にします" },
      { id: "pomegranate", label: "ざくろ", en: "pomegranate", palette: "garnet red, ruby, and deep leaf green", materials: "rich velvet, glossy beads, and structured silk", shape: "a split fruit silhouette with clustered jewel forms", detail: "seed-like gems and crown-shaped edging", summary: "宝石のような実と深紅で、濃密な華やかさを作ります" },
      { id: "cream_soda", label: "クリームソーダ", en: "retro cream-soda", palette: "soda green, vanilla white, and cherry red", materials: "sparkling organza, glossy satin, and bubble-like sequins", shape: "a fizzy bell silhouette with floating circular layers", detail: "cherry ornaments and translucent bubbles", summary: "泡・チェリー・ソーダ色をレトロポップにまとめます" },
      { id: "dark_chocolate", label: "ビターチョコ", en: "dark-chocolate", palette: "cocoa brown, black cherry, and muted gold", materials: "dense velvet, glossy leather, and gold foil", shape: "clean broken-bar geometry and a sharp fitted form", detail: "cacao-pod embossing and geometric wrappers", summary: "深い茶色と端正な面で、ほろ苦い高級感を表します" },
    ],
  },
  {
    id: "nature",
    label: "自然・天体・気象",
    icon: "☼",
    items: [
      { id: "aurora", label: "オーロラ", en: "aurora", palette: "emerald, violet, cyan, and midnight navy", materials: "iridescent chiffon, luminous mesh, and liquid satin", shape: "flowing light curtains and long atmospheric arcs", detail: "color-shifting gradients and star dust", summary: "揺れる光の帯を、長いドレープと偏光色で表します" },
      { id: "storm", label: "雷嵐", en: "thunderstorm", palette: "storm gray, electric blue, and white", materials: "metallic silk, smoky tulle, and reflective thread", shape: "twisted clouds and branching lightning lines", detail: "electric embroidery and rain-drop crystals", summary: "雲の渦と稲妻の線で、激しい天候を衣装化します" },
      { id: "eclipse", label: "日食", en: "solar-eclipse", palette: "black, burning gold, and corona white", materials: "matte velvet, polished gold, and translucent voile", shape: "a dark central disc framed by radiant rings", detail: "corona fringe and orbit-like metal arcs", summary: "黒い円と金の光輪で、日食の劇的な瞬間を作ります" },
      { id: "deep_sea", label: "深海", en: "deep-sea", palette: "abyssal blue, teal, and bioluminescent cyan", materials: "wet-look satin, transparent mesh, and glossy beads", shape: "slow currents and trailing fin-like panels", detail: "bioluminescent dots and pressure-wave patterns", summary: "深い青と微光で、静かな深海の世界をまとわせます" },
      { id: "dawn", label: "夜明け", en: "dawn", palette: "peach, lavender, pale blue, and soft gold", materials: "soft silk, sheer organza, and luminous thread", shape: "a horizon line opening into upward rays", detail: "sunrise gradients and dew-like crystals", summary: "空のグラデーションと朝露で、夜明けを軽やかに描きます" },
    ],
  },
  {
    id: "living",
    label: "生き物・植物",
    icon: "❀",
    items: [
      { id: "jellyfish", label: "クラゲ", en: "jellyfish", palette: "translucent aqua, lilac, and pearl white", materials: "sheer organza, iridescent film, and fine tulle", shape: "a bell-shaped volume with long drifting tendrils", detail: "bioluminescent edges and pearl droplets", summary: "透ける傘と長い触手を、幻想的なドレープへ変えます" },
      { id: "butterfly", label: "蝶", en: "butterfly", palette: "ink black, cobalt, and ultraviolet", materials: "velvet, wing-thin organza, and reflective scales", shape: "symmetrical wings and a pinched central silhouette", detail: "eye-spots and powdery gradient embroidery", summary: "左右対称の羽と鱗粉の色で、蝶の変身を表します" },
      { id: "rose", label: "薔薇", en: "rose", palette: "deep red, leaf green, and antique gold", materials: "velvet, layered silk petals, and thorn-like metal", shape: "spiraling petals around a sculpted waist", detail: "thorn filigree and dew-drop crystals", summary: "花弁の重なりと棘を、華やかで強い衣装にします" },
      { id: "peacock", label: "孔雀", en: "peacock", palette: "peacock blue, emerald, and bronze", materials: "lustrous feathers, silk, and jewel-toned sequins", shape: "a proud fan and elongated tail lines", detail: "eye-pattern beading and feathered trim", summary: "扇状の羽と玉虫色で、堂々としたシルエットを作ります" },
      { id: "wisteria", label: "藤", en: "wisteria", palette: "wisteria purple, leaf green, and mist white", materials: "draped chiffon, silk cord, and glass petals", shape: "hanging flower clusters and vertical cascades", detail: "vine embroidery and dangling blossom ornaments", summary: "垂れる花房を、縦に流れる装飾と袖へ映します" },
    ],
  },
  {
    id: "material",
    label: "素材・現象",
    icon: "◇",
    items: [
      { id: "stained_glass", label: "ステンドグラス", en: "stained-glass", palette: "jewel red, cobalt, emerald, and black lead lines", materials: "translucent panels, black metal piping, and faceted crystal", shape: "cathedral-window geometry and segmented light panels", detail: "lead-line embroidery and colored light reflections", summary: "色ガラスと黒い骨組みを、光を通す衣装構造へ翻訳します" },
      { id: "porcelain", label: "磁器", en: "porcelain", palette: "porcelain white, cobalt blue, and fine gold", materials: "smooth satin, glazed ceramic accents, and crisp organza", shape: "clean curved volumes with delicate fragile edges", detail: "blue painted florals and repaired-gold seams", summary: "白磁の滑らかさと絵付けを、端正な衣装にします" },
      { id: "mercury", label: "水銀", en: "liquid-mercury", palette: "mirror silver, charcoal, and cold blue", materials: "liquid metallic fabric, chrome, and glossy mesh", shape: "droplets merging into an unstable flowing form", detail: "mirror beads and fluid reflective seams", summary: "流れる鏡面と雫で、形を変える金属を表します" },
      { id: "smoke", label: "煙", en: "smoke", palette: "ash gray, black, and faint violet", materials: "transparent gauze, soft tulle, and matte crepe", shape: "curling layers that dissolve at the edges", detail: "ombre haze and drifting ribbon wisps", summary: "ほどける輪郭と薄い層で、煙の動きを衣装化します" },
      { id: "ice_crystal", label: "氷晶", en: "ice-crystal", palette: "frost white, pale cyan, and silver", materials: "faceted crystal, glassy organza, and metallic thread", shape: "radial shards and precise hexagonal geometry", detail: "frosted edges and snowflake filigree", summary: "鋭い結晶と霜の縁を、透明感ある衣装へ仕立てます" },
    ],
  },
  {
    id: "art",
    label: "美術・建築・工芸",
    icon: "✤",
    items: [
      { id: "rococo", label: "ロココ", en: "Rococo", palette: "powder blue, blush pink, ivory, and gold", materials: "silk, lace, ribbon, and porcelain-like ornaments", shape: "ornate pannier volume and playful asymmetrical curves", detail: "shell scrolls, bows, roses, and gilded filigree", summary: "淡い色と曲線装飾で、ロココの優雅な過剰さを楽しみます" },
      { id: "art_nouveau", label: "アール・ヌーヴォー", en: "Art-Nouveau", palette: "sage green, muted gold, iris purple, and cream", materials: "flowing silk, enamel-like accents, and fine metalwork", shape: "whiplash curves and elongated botanical lines", detail: "iris, vine, and dragonfly motifs", summary: "植物の曲線を、流れるシルエットと金工風装飾にします" },
      { id: "art_deco", label: "アール・デコ", en: "Art-Deco", palette: "black, champagne gold, and emerald", materials: "satin, mirrored panels, and geometric beadwork", shape: "stepped symmetry and sleek fan geometry", detail: "sunbursts, chevrons, and streamlined metallic lines", summary: "幾何学と金黒の配色で、都会的な華やかさを作ります" },
      { id: "gothic_cathedral", label: "ゴシック聖堂", en: "Gothic-cathedral", palette: "stone gray, wine red, stained-glass blue, and black", materials: "velvet, tracery lace, and dark silver", shape: "pointed arches and soaring vertical lines", detail: "rose-window jewels and ribbed-vault embroidery", summary: "尖塔と薔薇窓を、縦に伸びる荘厳な衣装へ変えます" },
      { id: "lacquer", label: "漆工芸", en: "Japanese-lacquerware", palette: "lacquer black, vermilion, and powdered gold", materials: "high-gloss silk, lacquered plates, and gold leaf", shape: "clean layered planes with controlled asymmetry", detail: "maki-e landscapes and fine gold dust", summary: "漆黒・朱・蒔絵の艶を、研ぎ澄まされた衣装に映します" },
    ],
  },
  {
    id: "traditional",
    label: "民族・伝統衣装",
    icon: "◎",
    items: [
      { id: "hanfu", label: "漢服", en: "hanfu", palette: "jade, cinnabar, and warm ivory", materials: "silk, gauze, and woven brocade", shape: "cross-collar layers and long water sleeves", detail: "cloud scrolls and jade ornaments", summary: "漢服の襟と長い袖を核に、現代的な舞台映えを加えます" },
      { id: "kimono", label: "着物", en: "kimono", palette: "indigo, vermilion, and soft gold", materials: "silk crepe, brocade, and braided cord", shape: "overlapping straight panels with a sculptural obi", detail: "seasonal motifs and fine gold embroidery", summary: "着物の直線と帯を尊重しながら、非日常の輪郭へ広げます" },
      { id: "sari", label: "サリー", en: "sari", palette: "saffron, magenta, and antique gold", materials: "draped silk, sheer veil fabric, and metallic embroidery", shape: "continuous wrapped drapery and a sweeping pallu", detail: "paisley borders and jewel-like beadwork", summary: "連続する布の流れと縁飾りを、華やかな衣装へ活かします" },
      { id: "kaftan", label: "カフタン", en: "kaftan", palette: "lapis blue, turquoise, and warm gold", materials: "flowing silk, woven trim, and metallic thread", shape: "a generous column with broad sleeves and a defined center line", detail: "geometric borders and ornate front embroidery", summary: "ゆったりした面と前中心の装飾で、堂々と見せます" },
      { id: "flamenco", label: "フラメンコ衣装", en: "flamenco dress", palette: "scarlet, black, and cream", materials: "structured stretch fabric, lace, and layered ruffles", shape: "a fitted torso opening into rhythmic cascading flounces", detail: "polka dots, roses, and comb-like ornaments", summary: "身体の線と連なるフリルで、舞台のリズムを強調します" },
    ],
  },
  {
    id: "stage",
    label: "特殊・舞台衣装",
    icon: "★",
    items: [
      { id: "masquerade", label: "仮面舞踏会", en: "masquerade-ball", palette: "midnight blue, gold, and wine red", materials: "velvet, satin, feathers, and filigree metal", shape: "a dramatic formal silhouette with sweeping cape lines", detail: "ornate masks, plume accents, and secretive eye motifs", summary: "仮面と羽根を、謎めいた舞踏会衣装にまとめます" },
      { id: "ballet", label: "幻想バレエ", en: "fantasy-ballet", palette: "mist white, lavender, and silver", materials: "fine tulle, satin ribbon, and crystal mesh", shape: "a weightless tutu-inspired form with elongated lines", detail: "feather-light petals and frost-like sparkle", summary: "バレエの軽さを、幻想的な層と長い線で広げます" },
      { id: "circus", label: "サーカス", en: "grand-circus", palette: "crimson, cobalt, cream, and gold", materials: "velvet, striped satin, and polished brass", shape: "a ringmaster silhouette with playful exaggerated volume", detail: "stars, tassels, ticket motifs, and tiny bells", summary: "鮮やかな色と誇張した形で、楽しい舞台衣装にします" },
      { id: "idol", label: "コンセプトアイドル", en: "concept-idol", palette: "electric pink, cyan, white, and chrome", materials: "glossy satin, holographic film, and crystal fringe", shape: "a kinetic stage silhouette with asymmetric layers", detail: "light-stick geometry and sparkling emblem ornaments", summary: "光と動きに強い形で、テーマ性のあるアイドル衣装を作ります" },
      { id: "opera", label: "幻想オペラ", en: "fantasy-opera", palette: "royal purple, black, and antique gold", materials: "heavy silk, velvet, lace, and gilded trim", shape: "a commanding theatrical silhouette with a grand train", detail: "music-scroll embroidery and chandelier-like jewels", summary: "重厚な布と大きなトレーンで、歌劇の存在感を高めます" },
    ],
  },
];

const DIRECTIONS: Choice[] = [
  { id: "elegant", label: "上品", en: "refined" },
  { id: "cute", label: "可愛い", en: "charming" },
  { id: "graceful", label: "優美", en: "graceful" },
  { id: "alluring", label: "妖艶", en: "alluring" },
  { id: "gothic", label: "ゴシック", en: "gothic" },
  { id: "dark", label: "ダーク", en: "dark" },
  { id: "mystical", label: "神秘的", en: "mystical" },
  { id: "fantastical", label: "幻想的", en: "fantastical" },
  { id: "sacred", label: "神聖", en: "sacred" },
  { id: "decadent", label: "退廃的", en: "decadent" },
  { id: "royal", label: "王族風", en: "regal" },
  { id: "futuristic", label: "未来的", en: "futuristic" },
  { id: "avant", label: "アヴァンギャルド", en: "avant-garde" },
  { id: "stage", label: "舞台衣装風", en: "theatrical" },
  { id: "high_fashion", label: "ハイファッション", en: "high-fashion" },
  { id: "comic", label: "コミカル", en: "playful" },
];

const BASES: Choice[] = [
  { id: "couture", label: "オートクチュール", en: "haute-couture ensemble", shortEn: "haute couture" },
  { id: "dress", label: "ドレス", en: "statement dress" },
  { id: "gown", label: "ガウン", en: "ceremonial gown" },
  { id: "suit", label: "スーツ", en: "sculptural tailored suit" },
  { id: "coat", label: "ロングコート", en: "dramatic long coat" },
  { id: "robe", label: "ローブ", en: "layered fantasy robe" },
  { id: "cape", label: "ケープ衣装", en: "cape-centered costume" },
  { id: "wafuku", label: "和装アレンジ", en: "reimagined Japanese-style ensemble" },
  { id: "ritual", label: "儀礼衣装", en: "ritual ceremonial costume" },
  { id: "royal", label: "王族衣装", en: "regal court costume" },
  { id: "stage", label: "舞台衣装", en: "theatrical stage costume" },
  { id: "idol", label: "アイドル衣装", en: "concept idol costume" },
  { id: "battle", label: "バトルコスチューム", en: "fantasy battle costume" },
  { id: "armor", label: "アーマー", en: "ornamental fantasy armor" },
  { id: "bodysuit", label: "ボディスーツ", en: "high-fashion bodysuit" },
  { id: "swim", label: "水着風衣装", en: "couture swimwear-inspired costume" },
  { id: "lingerie", label: "ランジェリー風", en: "luxury lingerie-inspired costume" },
  { id: "layered", label: "多層レイヤード", en: "multi-layered statement ensemble" },
];

const PLACEMENTS: Choice[] = [
  { id: "palette", label: "配色", en: "the color palette" },
  { id: "silhouette", label: "シルエット", en: "the overall silhouette" },
  { id: "materials", label: "素材・質感", en: "the materials and surface textures" },
  { id: "pattern", label: "柄", en: "the textile patterns" },
  { id: "ornament", label: "装飾", en: "the ornaments and embellishments" },
  { id: "sleeves", label: "袖", en: "the sleeve construction" },
  { id: "neckline", label: "襟・胸元", en: "the collar and neckline" },
  { id: "hem", label: "裾", en: "the hem and train" },
  { id: "headpiece", label: "頭部装飾", en: "the headpiece" },
  { id: "accessories", label: "小物", en: "the accessories" },
  { id: "special", label: "特殊構造", en: "the transformable construction" },
  { id: "light", label: "光・粒子", en: "the light and particle effects" },
];

const STRENGTHS: Choice[] = [
  { id: "subtle", label: "ほのかに", en: "subtle" },
  { id: "balanced", label: "ほどよく", en: "balanced" },
  { id: "bold", label: "大胆に", en: "bold" },
  { id: "total", label: "全振り", en: "fully immersive" },
  { id: "maximum", label: "ネタMAX", en: "deliberately maximal" },
];

const STRUCTURES: Choice[] = [
  { id: "high_slit", label: "ハイスリット", en: "a high slit" },
  { id: "side_slit", label: "サイドスリット", en: "a side slit" },
  { id: "open_back", label: "オープンバック", en: "an open back" },
  { id: "shoulder_cutout", label: "肩カットアウト", en: "shoulder cutouts" },
  { id: "back_cutout", label: "背中カットアウト", en: "a back cutout" },
  { id: "asymmetrical", label: "左右非対称の裾", en: "an asymmetrical hem" },
  { id: "detached_sleeves", label: "独立袖", en: "detached sleeves" },
  { id: "high_collar", label: "ハイカラー", en: "a high collar" },
  { id: "plunging", label: "深いネックライン", en: "a plunging neckline" },
  { id: "midriff", label: "ミドリフ", en: "an exposed midriff" },
  { id: "drapery", label: "多層ドレープ", en: "layered drapery" },
  { id: "veil", label: "ヴェール", en: "a floating veil" },
  { id: "train", label: "ロングトレーン", en: "a long sweeping train" },
  { id: "feathers", label: "羽根トリム", en: "feathered trim" },
  { id: "metal", label: "金属装飾", en: "sculptural metallic ornament" },
];

const FOCUSES: Choice[] = [
  { id: "silhouette", label: "全身シルエット", en: "the full-body silhouette", shortEn: "silhouette focus" },
  { id: "face", label: "顔まわり", en: "the framing around the face", shortEn: "face-framing details" },
  { id: "headpiece", label: "頭部装飾", en: "the headpiece", shortEn: "headpiece focus" },
  { id: "shoulders", label: "肩", en: "the shoulder line", shortEn: "shoulder focus" },
  { id: "sleeves", label: "袖・腕", en: "the sleeves and arm line", shortEn: "sleeve focus" },
  { id: "neckline", label: "胸元・襟", en: "the neckline and collar", shortEn: "neckline focus" },
  { id: "waist", label: "腰", en: "the waist construction", shortEn: "waist focus" },
  { id: "legs", label: "脚", en: "the leg line", shortEn: "leg-line focus" },
  { id: "train", label: "裾・トレーン", en: "the hem and train", shortEn: "train focus" },
  { id: "back", label: "背中", en: "the back design", shortEn: "back-design focus" },
  { id: "accessory", label: "小物", en: "the signature accessory", shortEn: "accessory focus" },
  { id: "texture", label: "素材感", en: "the material contrast", shortEn: "material-detail focus" },
  { id: "mechanism", label: "モチーフの仕掛け", en: "the motif-driven construction", shortEn: "concept-detail focus" },
];

const PRESENTATIONS = [
  { id: "runway", label: "ランウェイ", note: "全身と歩き", en: "Use a full-body, eye-level runway composition, walking forward with a confident posture and a composed expression", shortEn: "full body, eye level, runway walk" },
  { id: "editorial", label: "ファッション誌風", note: "腰上・洗練", en: "Use a cowboy-shot fashion editorial composition, turned three-quarters toward the viewer with an elegant model pose", shortEn: "cowboy shot, fashion editorial pose" },
  { id: "poster", label: "ポスター風", note: "中央・強い形", en: "Frame the full figure centrally like a fashion poster, standing in a clear iconic pose with strong negative space", shortEn: "full body, centered poster composition" },
  { id: "fantasy", label: "幻想一枚絵", note: "流れ・余韻", en: "Create a full-body fantasy illustration with a gentle low angle, flowing fabric motion, and an entranced expression", shortEn: "full body, low angle, flowing fantasy pose" },
  { id: "stage", label: "舞台風", note: "動き・照明", en: "Show the full figure in a theatrical stage pose with one sweeping gesture and a dramatic upward gaze", shortEn: "full body, theatrical stage pose" },
  { id: "sitting", label: "座り姿", note: "裾を広げる", en: "Use a full-body seated pose that arranges the hem and train clearly around the figure, viewed at eye level", shortEn: "full-body seated pose, arranged train" },
  { id: "reclining", label: "寝姿・俯瞰", note: "上から・布の面", en: "View the reclining figure from above, using the spread fabric as a graphic composition while keeping the costume readable", shortEn: "reclining, viewed from above, spread fabric" },
  { id: "back", label: "背面美", note: "背中・振り返り", en: "Use a full-body back view with an over-the-shoulder glance, clearly displaying the back design and train", shortEn: "full body, back view, over shoulder" },
  { id: "upper", label: "上半身主役", note: "顔・襟・袖", en: "Use an upper-body, eye-level portrait with one hand near the collar, keeping the neckline and sleeves unobstructed", shortEn: "upper body, hand near collar" },
  { id: "detail", label: "装飾アップ", note: "寄り・精密", en: "Use a close-up editorial crop focused on the face-framing ornament, textile detail, and craftsmanship", shortEn: "close-up, ornament and textile detail" },
  { id: "dramatic", label: "ドラマチック", note: "斜め・躍動", en: "Use a full-body low-angle composition with a slight Dutch angle, a strong turning pose, and wind-swept fabric", shortEn: "full body, low angle, Dutch angle, turning pose" },
  { id: "cinematic", label: "シネマ風", note: "横向き・余白", en: "Use a cinematic cowboy shot in side view, with controlled movement, layered depth, and purposeful negative space", shortEn: "cowboy shot, side view, cinematic composition" },
];

const BACKGROUNDS = [
  { id: "none", label: "衣装だけ", note: "背景指定なし", en: "", shortEn: "" },
  { id: "light", label: "軽い演出", note: "光と粒子のみ", en: "Keep the setting minimal with theme-colored rim light and a few restrained atmospheric particles, leaving the costume as the clear focal point", shortEn: "minimal backdrop, themed rim light" },
  { id: "theme", label: "テーマ背景", note: "世界観を添える", en: "Place the figure in a simplified environment that echoes the motif through color, light, and a few symbolic forms without competing with the costume", shortEn: "theme-responsive environment" },
  { id: "illustration", label: "一枚絵", note: "物語の空間", en: "Build a fully realized narrative environment around the motif with cinematic lighting and layered depth while keeping the costume as the brightest visual anchor", shortEn: "narrative background, cinematic depth" },
];

const SUBJECTS: Choice[] = [
  { id: "girl", label: "1girl", en: "1girl" },
  { id: "boy", label: "1boy", en: "1boy" },
  { id: "woman", label: "成人女性", en: "an adult woman" },
  { id: "man", label: "成人男性", en: "an adult man" },
  { id: "androgynous", label: "中性的", en: "an androgynous adult model" },
];

const REGIONS: Choice[] = [
  { id: "east_asia", label: "東アジア", en: "East Asian dress traditions" },
  { id: "south_asia", label: "南アジア", en: "South Asian dress traditions" },
  { id: "west_asia", label: "西アジア・中東", en: "West Asian and Middle Eastern dress traditions" },
  { id: "southeast_asia", label: "東南アジア", en: "Southeast Asian dress traditions" },
  { id: "europe", label: "ヨーロッパ", en: "European folk-dress traditions" },
  { id: "africa", label: "アフリカ", en: "African dress traditions" },
  { id: "latin", label: "中南米", en: "Latin American dress traditions" },
];

const ATTIRES: Choice[] = [
  { id: "hanfu", label: "hanfu", en: "hanfu construction" },
  { id: "qipao", label: "qipao / cheongsam", en: "qipao-inspired construction" },
  { id: "hanbok", label: "hanbok", en: "hanbok construction" },
  { id: "kimono", label: "kimono", en: "kimono construction" },
  { id: "sari", label: "sari", en: "sari draping" },
  { id: "lehenga", label: "lehenga", en: "lehenga construction" },
  { id: "belly_dance", label: "belly dance costume", en: "belly-dance costume construction" },
  { id: "kaftan", label: "kaftan", en: "kaftan construction" },
  { id: "flamenco", label: "flamenco dress", en: "flamenco-dress construction" },
  { id: "folk", label: "folk costume", en: "regional folk-costume construction" },
  { id: "mariachi", label: "mariachi-inspired", en: "mariachi-inspired tailoring" },
  { id: "carnival", label: "carnival costume", en: "carnival-costume construction" },
];

const TRADITION_TREATMENTS: Choice[] = [
  { id: "traditional", label: "伝統寄り", en: "a tradition-forward treatment" },
  { id: "modern", label: "現代アレンジ", en: "a contemporary reinterpretation" },
  { id: "fantasy", label: "ファンタジー融合", en: "a fantasy fusion" },
  { id: "fashion", label: "ハイファッション化", en: "a high-fashion transformation" },
  { id: "alluring", label: "セクシーアレンジ", en: "an alluring stage-oriented reinterpretation" },
  { id: "free", label: "自由創作", en: "an original creative reinterpretation" },
];

const PAINTS: Choice[] = [
  { id: "cel", label: "アニメ塗り", en: "anime cel shading" },
  { id: "soft", label: "柔らかい塗り", en: "soft shading" },
  { id: "semi", label: "セミリアル", en: "semi-realistic painting" },
  { id: "painterly", label: "絵画調", en: "painterly rendering" },
  { id: "watercolor", label: "水彩風", en: "watercolor-like rendering" },
  { id: "glossy", label: "艶のある塗り", en: "glossy rendering" },
  { id: "decorative", label: "装飾イラスト", en: "decorative illustration" },
];

const FINISHES: Choice[] = [
  { id: "matte", label: "マット", en: "matte finish" },
  { id: "glossy", label: "グロッシー", en: "glossy finish" },
  { id: "luminous", label: "発光感", en: "luminous finish" },
  { id: "silky", label: "シルキー", en: "silky finish" },
  { id: "ethereal", label: "幻想光", en: "ethereal glow" },
];

const LINES: Choice[] = [
  { id: "clean", label: "クリーン", en: "clean lineart" },
  { id: "delicate", label: "繊細", en: "delicate lineart" },
  { id: "bold", label: "太め", en: "bold lineart" },
  { id: "edges", label: "絵画的な輪郭", en: "painterly edges" },
];

const OUTPUT_MODES = [
  { id: "outfit", label: "衣装だけ", note: "服の設計に集中" },
  { id: "pose", label: "衣装＋ポーズだけ", note: "背景・画風なし" },
  { id: "all", label: "全部", note: "演出まで完成" },
];

function findChoice(list: Choice[], id: string) {
  return list.find((item) => item.id === id) || list[0];
}

function ChipGroup({
  label,
  items,
  selected,
  onChange,
  multi = false,
  max,
}: {
  label: string;
  items: Choice[];
  selected: string | string[];
  onChange: (next: string | string[]) => void;
  multi?: boolean;
  max?: number;
}) {
  const selectedList = Array.isArray(selected) ? selected : [selected];
  return (
    <fieldset className="field-block">
      <legend>{label}</legend>
      {multi && max ? <p className="field-hint">最大{max}つまで</p> : null}
      <div className="chips">
        {items.map((item) => {
          const active = selectedList.includes(item.id);
          return (
            <button
              className="chip"
              type="button"
              aria-pressed={active}
              key={item.id}
              onClick={() => {
                if (!multi) return onChange(item.id);
                const current = selectedList;
                if (active) return onChange(current.filter((id) => id !== item.id));
                if (max && current.length >= max) return;
                onChange([...current, item.id]);
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function ScopePicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  return (
    <div className="scope-picker" role="group" aria-label="出力する範囲">
      {OUTPUT_MODES.map((mode) => (
        <button
          key={mode.id}
          type="button"
          aria-pressed={value === mode.id}
          onClick={() => onChange(mode.id)}
        >
          <strong>{mode.label}</strong>
          <small>{mode.note}</small>
        </button>
      ))}
    </div>
  );
}

export default function Home() {
  const [categoryId, setCategoryId] = useState("concept");
  const [motifId, setMotifId] = useState("first_love");
  const [customMotif, setCustomMotif] = useState("");
  const [directions, setDirections] = useState<string[]>(["graceful", "mystical"]);
  const [baseId, setBaseId] = useState("couture");
  const [regionId, setRegionId] = useState("east_asia");
  const [attireId, setAttireId] = useState("hanfu");
  const [traditionId, setTraditionId] = useState("fantasy");
  const [placements, setPlacements] = useState<string[]>(["palette", "materials", "ornament"]);
  const [strengthId, setStrengthId] = useState("bold");
  const [exposure, setExposure] = useState(2);
  const [structures, setStructures] = useState<string[]>(["drapery", "metal"]);
  const [focusId, setFocusId] = useState("silhouette");
  const [presentationId, setPresentationId] = useState("runway");
  const [backgroundId, setBackgroundId] = useState("light");
  const [subjectId, setSubjectId] = useState("woman");
  const [styleEnabled, setStyleEnabled] = useState(false);
  const [paintId, setPaintId] = useState("decorative");
  const [finishId, setFinishId] = useState("luminous");
  const [lineId, setLineId] = useState("delicate");
  const [outputMode, setOutputMode] = useState("all");
  const [copied, setCopied] = useState("");

  const category = MOTIF_CATEGORIES.find((item) => item.id === categoryId) || MOTIF_CATEGORIES[0];
  const motif = category.items.find((item) => item.id === motifId) || category.items[0];
  const customActive = customMotif.trim().length > 0;
  const motifLabel = customActive ? customMotif.trim() : motif.label;
  const motifEn = customActive ? `custom ${customMotif.trim()} concept` : motif.en;
  const preserveTradition = categoryId === "traditional" && traditionId === "traditional";

  const result = useMemo(() => {
    const base = findChoice(BASES, baseId);
    const focus = findChoice(FOCUSES, focusId);
    const presentation = PRESENTATIONS.find((item) => item.id === presentationId) || PRESENTATIONS[0];
    const background = BACKGROUNDS.find((item) => item.id === backgroundId) || BACKGROUNDS[0];
    const paint = findChoice(PAINTS, paintId);
    const finish = findChoice(FINISHES, finishId);
    const line = findChoice(LINES, lineId);
    const attire = findChoice(ATTIRES, attireId);
    const treatment = findChoice(TRADITION_TREATMENTS, traditionId);
    return buildPrompt({
      outputMode,
      motifEn,
      directions: directions.map((id) => findChoice(DIRECTIONS, id).en),
      baseEn: base.en,
      baseShortEn: base.shortEn || base.en,
      traditionalAttireEn: categoryId === "traditional" ? attire.en : "",
      traditionalRegionEn: categoryId === "traditional" ? findChoice(REGIONS, regionId).en : "",
      traditionalTreatmentEn: categoryId === "traditional" ? treatment.en : "",
      paletteEn: motif.palette,
      materialsEn: motif.materials,
      shapeEn: motif.shape,
      detailEn: motif.detail,
      placementsEn: placements.map((id) => findChoice(PLACEMENTS, id).en),
      strengthEn: findChoice(STRENGTHS, strengthId).en,
      exposure,
      preserveTradition,
      structuresEn: structures.map((id) => findChoice(STRUCTURES, id).en),
      focusEn: focus.en,
      focusShortEn: focus.shortEn || focus.en,
      subjectEn: findChoice(SUBJECTS, subjectId).en,
      poseEn: presentation.en,
      poseShortEn: presentation.shortEn,
      backgroundEn: background.en,
      backgroundShortEn: background.shortEn,
      styleEnabled,
      styleEn: `Render with ${paint.en}, ${finish.en}, and ${line.en}`,
      styleShortEn: `${paint.en}, ${finish.en}, ${line.en}`,
    });
  }, [
    attireId, backgroundId, baseId, categoryId, directions, exposure, finishId,
    focusId, lineId, motif, motifEn, outputMode, paintId, placements,
    presentationId, preserveTradition, strengthId, structures, styleEnabled,
    subjectId, traditionId,
  ]);

  const summary = `${motifLabel}を「${directions.map((id) => findChoice(DIRECTIONS, id).label).join("＋")}」の方向で、${findChoice(BASES, baseId).label}へ。${motif.summary}。見せ方は${PRESENTATIONS.find((item) => item.id === presentationId)?.label}、出力範囲は${OUTPUT_MODES.find((item) => item.id === outputMode)?.label}です。`;

  function chooseCategory(id: string) {
    const next = MOTIF_CATEGORIES.find((item) => item.id === id) || MOTIF_CATEGORIES[0];
    setCategoryId(id);
    setMotifId(next.items[0].id);
    setCustomMotif("");
    if (id === "traditional") setAttireId(next.items[0].id);
  }

  function chooseMotif(id: string) {
    setMotifId(id);
    setCustomMotif("");
    if (categoryId === "traditional" && ATTIRES.some((item) => item.id === id)) setAttireId(id);
  }

  async function copyText(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(key);
    window.setTimeout(() => setCopied(""), 1600);
  }

  function resetAll() {
    setCategoryId("concept"); setMotifId("first_love"); setCustomMotif("");
    setDirections(["graceful", "mystical"]); setBaseId("couture");
    setRegionId("east_asia"); setAttireId("hanfu"); setTraditionId("fantasy");
    setPlacements(["palette", "materials", "ornament"]); setStrengthId("bold");
    setExposure(2); setStructures(["drapery", "metal"]); setFocusId("silhouette");
    setPresentationId("runway"); setBackgroundId("light"); setSubjectId("woman");
    setStyleEnabled(false); setPaintId("decorative"); setFinishId("luminous");
    setLineId("delicate"); setOutputMode("all");
  }

  const breakdown = [
    ["モチーフ", result.blocks.motif, true],
    ["衣装", result.blocks.outfit, true],
    ["構造アレンジ", result.blocks.structure, true],
    ["露出度の反映", result.blocks.exposure, true],
    ["構図・見せ方", result.blocks.pose, outputMode !== "outfit"],
    ["背景・演出", result.blocks.background, outputMode === "all"],
    ["画風", result.blocks.style, outputMode === "all" && styleEnabled],
  ] as const;

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="コンセプトファッション工房 トップへ">
          <span className="brand-mark" aria-hidden="true">✦</span>
          <span><strong>コンセプトファッション工房</strong><small>CONCEPT FASHION WORKSHOP</small></span>
        </a>
        <button className="ghost-button" type="button" onClick={resetAll}>最初に戻す</button>
      </header>

      <div className="page-shell" id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span>IDEA</span><i aria-hidden="true">→</i><span>FASHION</span></p>
            <h1 id="hero-title">ひらめきを、<br /><em>着られるかたち</em>へ。</h1>
            <p className="hero-lead">感情、神話、民族衣装、美術様式。好きな概念を選んで、主役級の衣装プロンプトに仕立てよう。</p>
            <a className="primary-link" href="#design">衣装を仕立てる <span aria-hidden="true">↓</span></a>
          </div>
          <div className="concept-card" aria-label="現在のコンセプト">
            <div className="concept-orbit orbit-one" aria-hidden="true" />
            <div className="concept-orbit orbit-two" aria-hidden="true" />
            <p>NOW CRAFTING</p>
            <strong>{motifLabel}</strong>
            <span>{findChoice(BASES, baseId).label}</span>
            <div className="swatches" aria-hidden="true"><i /><i /><i /><i /></div>
            <small>{findChoice(STRENGTHS, strengthId).label}反映</small>
          </div>
        </section>

        <section className="scope-band" aria-labelledby="scope-title">
          <div><p className="step-kicker">OUTPUT RANGE</p><h2 id="scope-title">どこまで出力する？</h2></div>
          <ScopePicker value={outputMode} onChange={setOutputMode} />
        </section>

        <div className="workspace" id="design">
          <div className="designer-column">
            <details className="work-card" open>
              <summary><span className="step-number">01</span><span><b>モチーフを決める</b><small>何を衣装にする？</small></span><i aria-hidden="true">＋</i></summary>
              <div className="card-body">
                <fieldset className="field-block">
                  <legend>大きなテーマ</legend>
                  <div className="category-grid">
                    {MOTIF_CATEGORIES.map((item) => (
                      <button key={item.id} type="button" aria-pressed={categoryId === item.id} onClick={() => chooseCategory(item.id)}>
                        <span aria-hidden="true">{item.icon}</span>{item.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <fieldset className="field-block motif-field">
                  <legend>{category.label}の候補</legend>
                  <div className="motif-grid">
                    {category.items.map((item) => (
                      <button key={item.id} type="button" aria-pressed={!customActive && motif.id === item.id} onClick={() => chooseMotif(item.id)}>
                        <strong>{item.label}</strong><small>{item.en}</small>
                      </button>
                    ))}
                  </div>
                </fieldset>
                <label className="text-field">
                  <span>自由モチーフ <small>任意</small></span>
                  <input value={customMotif} onChange={(event) => setCustomMotif(event.target.value)} placeholder="例：忘れられた約束 / forgotten promise" />
                  <small>自由入力はそのまま英語プロンプトにも残します。英単語を添えると安定します。</small>
                </label>
                <div className="translation-note">
                  <span aria-hidden="true">✦</span>
                  <div><b>衣装への翻訳</b><p>{motif.summary}</p></div>
                </div>
              </div>
            </details>

            <details className="work-card" open>
              <summary><span className="step-number">02</span><span><b>衣装を仕立てる</b><small>形・質感・ディテール</small></span><i aria-hidden="true">＋</i></summary>
              <div className="card-body">
                <ChipGroup label="方向・テイスト" items={DIRECTIONS} selected={directions} onChange={(next) => setDirections(next as string[])} multi max={2} />
                <ChipGroup label="衣装ベース" items={BASES} selected={baseId} onChange={(next) => setBaseId(next as string)} />

                {categoryId === "traditional" ? (
                  <div className="conditional-panel">
                    <div className="conditional-title"><span>民族・伝統衣装の詳細</span><small>文化的な骨格を残してアレンジします</small></div>
                    <ChipGroup label="地域" items={REGIONS} selected={regionId} onChange={(next) => setRegionId(next as string)} />
                    <ChipGroup label="衣装" items={ATTIRES} selected={attireId} onChange={(next) => setAttireId(next as string)} />
                    <ChipGroup label="アレンジ" items={TRADITION_TREATMENTS} selected={traditionId} onChange={(next) => setTraditionId(next as string)} />
                  </div>
                ) : null}

                <ChipGroup label="モチーフの反映先" items={PLACEMENTS} selected={placements} onChange={(next) => setPlacements(next as string[])} multi max={4} />
                <ChipGroup label="反映強度" items={STRENGTHS} selected={strengthId} onChange={(next) => setStrengthId(next as string)} />

                <fieldset className="field-block exposure-field">
                  <legend>露出度</legend>
                  <div className="slider-header"><strong>{["控えめ", "やや控えめ", "標準", "ややセクシー", "セクシー", "大胆"][exposure]}</strong><span>{exposure} / 5</span></div>
                  <input aria-label="露出度" type="range" min="0" max="5" step="1" value={exposure} onChange={(event) => setExposure(Number(event.target.value))} />
                  <div className="slider-labels"><span>控えめ</span><span>標準</span><span>大胆</span></div>
                  {result.exposure.adapted ? <p className="culture-note">伝統寄りの設定を尊重し、露出は衣装の骨格を崩さない表現へ自動調整しています。</p> : null}
                </fieldset>

                <ChipGroup label="構造アレンジ" items={STRUCTURES} selected={structures} onChange={(next) => setStructures(next as string[])} multi max={4} />
                <ChipGroup label="一番見せたいポイント" items={FOCUSES} selected={focusId} onChange={(next) => setFocusId(next as string)} />
              </div>
            </details>

            <details className="work-card" open>
              <summary><span className="step-number">03</span><span><b>衣装を魅せる</b><small>人物・ポーズ・背景</small></span><i aria-hidden="true">＋</i></summary>
              <div className="card-body">
                <ChipGroup label="人物タイプ" items={SUBJECTS} selected={subjectId} onChange={(next) => setSubjectId(next as string)} />
                <fieldset className="field-block">
                  <legend>見せ方プリセット</legend>
                  <div className="preset-grid">
                    {PRESENTATIONS.map((item) => (
                      <button key={item.id} type="button" aria-pressed={presentationId === item.id} onClick={() => setPresentationId(item.id)}>
                        <strong>{item.label}</strong><small>{item.note}</small>
                      </button>
                    ))}
                  </div>
                </fieldset>
                <fieldset className="field-block">
                  <legend>背景・演出の強さ</legend>
                  <div className="background-grid">
                    {BACKGROUNDS.map((item, index) => (
                      <button key={item.id} type="button" aria-pressed={backgroundId === item.id} onClick={() => setBackgroundId(item.id)}>
                        <span className={`bg-icon bg-${index}`} aria-hidden="true"><i /><i /><i /></span>
                        <strong>{item.label}</strong><small>{item.note}</small>
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>
            </details>

            <details className="work-card">
              <summary><span className="step-number">04</span><span><b>画風・仕上げ</b><small>必要なときだけ</small></span><i aria-hidden="true">＋</i></summary>
              <div className="card-body">
                <div className="toggle-row">
                  <div><b>画風をプロンプトに含める</b><small>キャラ側の塗り設定がある場合はOFFがおすすめ</small></div>
                  <button className="switch" type="button" role="switch" aria-checked={styleEnabled} onClick={() => setStyleEnabled(!styleEnabled)}><span>{styleEnabled ? "ON" : "OFF"}</span><i /></button>
                </div>
                {styleEnabled ? (
                  <div className="style-options">
                    <ChipGroup label="塗り傾向" items={PAINTS} selected={paintId} onChange={(next) => setPaintId(next as string)} />
                    <ChipGroup label="質感傾向" items={FINISHES} selected={finishId} onChange={(next) => setFinishId(next as string)} />
                    <ChipGroup label="線の雰囲気" items={LINES} selected={lineId} onChange={(next) => setLineId(next as string)} />
                  </div>
                ) : <p className="off-note">現在はOFF。出力に画風・塗りの指定は入りません。</p>}
              </div>
            </details>
          </div>

          <aside className="output-column" id="output" aria-labelledby="output-title">
            <div className="output-heading">
              <div><p className="step-kicker">YOUR PROMPT</p><h2 id="output-title">仕立て上がり</h2></div>
              <span className="live-badge"><i /> LIVE</span>
            </div>
            <ScopePicker value={outputMode} onChange={setOutputMode} />

            <section className="prompt-card prompt-card-main">
              <div className="prompt-label"><span>完成プロンプト</span><small>ENGLISH · FULL</small></div>
              <p>{result.detailed}</p>
              <button className="copy-button" type="button" onClick={() => copyText(result.detailed, "full")}><span aria-hidden="true">▢</span>{copied === "full" ? "コピーしました！" : "完成プロンプトをコピー"}</button>
            </section>

            <section className="prompt-card">
              <div className="prompt-label"><span>短め版</span><small>ENGLISH · COMPACT</small></div>
              <p className="compact-prompt">{result.short}</p>
              <button className="copy-button copy-button-secondary" type="button" onClick={() => copyText(result.short, "short")}><span aria-hidden="true">▢</span>{copied === "short" ? "コピーしました！" : "短め版をコピー"}</button>
            </section>

            <section className="summary-card">
              <div className="prompt-label"><span>どんな衣装？</span><small>日本語まとめ</small></div>
              <p>{summary}</p>
            </section>

            <details className="breakdown-card">
              <summary><span>プロンプトの分解</span><i aria-hidden="true">＋</i></summary>
              <div>
                {breakdown.map(([label, value, included]) => (
                  <article key={label} className={!included ? "is-muted" : ""}>
                    <span>{included ? "✓" : "—"}</span>
                    <div><b>{label}</b><p>{included ? value : "この出力範囲では含めません"}</p></div>
                    {included && value ? <button type="button" aria-label={`${label}をコピー`} onClick={() => copyText(value, label)}>▢</button> : null}
                  </article>
                ))}
              </div>
            </details>
            <p className="output-note">選択を変えるたび、自動で仕立て直します。プロンプトはモデルに合わせて自由に調整してね。</p>
          </aside>
        </div>
      </div>

      <footer><span>✦</span><p><b>コンセプトファッション工房</b><small>日常を少し離れて、まだ見たことのない一着へ。</small></p><a href="#top">TOP ↑</a></footer>
      <div className={`toast ${copied ? "is-visible" : ""}`} role="status" aria-live="polite">コピーしました</div>
    </main>
  );
}
