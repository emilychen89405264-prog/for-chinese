
import { Grade, Category, Question, Boss } from './types';

export const LEARNING_CONTENT: Record<Grade, Record<Category, Question[]>> = {
  [Grade.G1]: {
    [Category.PHONETICS]: [
      { id: 'g1-p1', type: 'audio', text: '請聽音辨字：', audioText: 'ㄅ', options: ['ㄅ', 'ㄆ', 'ㄇ', 'ㄈ'], correctAnswer: 0, explanation: '這是注音符號的第一個字母「ㄅ」。' },
      { id: 'g1-p2', type: 'audio', text: '請聽音辨字：', audioText: '媽', options: ['麻', '馬', '罵', '媽'], correctAnswer: 3, explanation: '「媽」是第一聲。' },
      { id: 'g1-p3', type: 'audio', text: '請聽音辨字：', audioText: 'ㄨ', options: ['ㄧ', 'ㄨ', 'ㄩ', 'ㄚ'], correctAnswer: 1, explanation: '這是注音符號「ㄨ」。' },
      { id: 'g1-p4', type: 'audio', text: '請聽音辨字：', audioText: '魚', options: ['於', '魚', '雨', '玉'], correctAnswer: 1, explanation: '「魚」是第二聲。' },
      { id: 'g1-p5', type: 'audio', text: '請聽音辨字：', audioText: 'ㄌ', options: ['ㄋ', 'ㄌ', 'ㄉ', 'ㄊ'], correctAnswer: 1, explanation: '這是注音符號「ㄌ」。' },
      { id: 'g1-p6', type: 'audio', text: '請聽音辨字：', audioText: '爸爸', options: ['八八', '爸爸', '巴巴', '拔拔'], correctAnswer: 1, explanation: '「爸爸」的注音是 ㄅㄚˋ ˙ㄅㄚ。' },
      { id: 'g1-p7', type: 'audio', text: '請聽音辨字：', audioText: '水', options: ['睡', '誰', '水', '說'], correctAnswer: 2, explanation: '「水」是第三聲。' },
      { id: 'g1-p8', type: 'audio', text: '請聽音辨字：', audioText: 'ㄔ', options: ['ㄕ', 'ㄔ', 'ㄗ', 'ㄘ'], correctAnswer: 1, explanation: '這是注音符號「ㄔ」。' },
      { id: 'g1-p9', type: 'audio', text: '請聽音辨字：', audioText: '火', options: ['活', '或', '火', '和'], correctAnswer: 2, explanation: '「火」是第三聲。' },
      { id: 'g1-p10', type: 'audio', text: '請聽音辨字：', audioText: 'ㄋ', options: ['ㄌ', 'ㄋ', 'ㄇ', 'ㄈ'], correctAnswer: 1, explanation: '這是注音符號「ㄋ」。' },
      { id: 'g1-p11', type: 'audio', text: '請聽音辨字：', audioText: '老師', options: ['老鼠', '老師', '老實', '老是'], correctAnswer: 1, explanation: '這是「老師」。' },
      { id: 'g1-p12', type: 'audio', text: '請聽音辨字：', audioText: '同學', options: ['同學', '同伴', '同事', '同情'], correctAnswer: 0, explanation: '這是「同學」。' },
      { id: 'g1-p13', type: 'audio', text: '請聽音辨字：', audioText: '學校', options: ['學習', '學校', '學問', '學費'], correctAnswer: 1, explanation: '這是「學校」。' },
      { id: 'g1-p14', type: 'audio', text: '請聽音辨字：', audioText: '操場', options: ['市場', '廣場', '操場', '農場'], correctAnswer: 2, explanation: '這是「操場」。' },
      { id: 'g1-p15', type: 'audio', text: '請聽音辨字：', audioText: '教室', options: ['臥室', '辦公室', '教室', '更衣室'], correctAnswer: 2, explanation: '這是「教室」。' },
      { id: 'g1-p16', type: 'audio', text: '請聽音辨字：', audioText: '書包', options: ['書包', '錢包', '背包', '皮包'], correctAnswer: 0, explanation: '這是「書包」。' },
      { id: 'g1-p17', type: 'audio', text: '請聽音辨字：', audioText: '鉛筆', options: ['鋼筆', '毛筆', '鉛筆', '彩筆'], correctAnswer: 2, explanation: '這是「鉛筆」。' },
      { id: 'g1-p18', type: 'audio', text: '請聽音辨字：', audioText: '橡皮擦', options: ['衛生紙', '橡皮擦', '筆記本', '尺'], correctAnswer: 1, explanation: '這是「橡皮擦」。' },
      { id: 'g1-p19', type: 'audio', text: '請聽音辨字：', audioText: '課本', options: ['課本', '筆記', '作業', '考卷'], correctAnswer: 0, explanation: '這是「課本」。' },
      { id: 'g1-p20', type: 'audio', text: '請聽音辨字：', audioText: '作業', options: ['作品', '作用', '作業', '作者'], correctAnswer: 2, explanation: '這是「作業」。' },
    ],
    [Category.CHARACTERS]: [
      { 
        id: 'g1-c1', 
        type: 'stroke',
        text: '請觀察「中」的寫法：', 
        character: '中',
        bopomofo: 'ㄓㄨㄥ',
        definition: '中心、中間。',
        exampleSentence: '我們在操場中間玩耍。',
        options: ['看完了'],
        correctAnswer: 0,
        explanation: '「中」字先寫口，再寫一豎穿過。'
      },
      { 
        id: 'g1-c2', 
        type: 'stroke',
        text: '請觀察「大」的寫法：', 
        character: '大',
        bopomofo: 'ㄉㄚˋ',
        definition: '與「小」相對。',
        exampleSentence: '這是一顆大蘋果。',
        options: ['看完了'],
        correctAnswer: 0,
        explanation: '「大」字先寫一橫，再寫一撇一捺。'
      },
      { 
        id: 'g1-c3', 
        type: 'stroke',
        text: '請觀察「小」的寫法：', 
        character: '小',
        bopomofo: 'ㄒㄧㄠˇ',
        definition: '與「大」相對。',
        exampleSentence: '這隻小貓很可愛。',
        options: ['看完了'],
        correctAnswer: 0,
        explanation: '「小」字先寫中間的一勾，再寫兩旁的點。'
      },
      { 
        id: 'g1-c4', 
        type: 'stroke',
        text: '請觀察「人」的寫法：', 
        character: '人',
        bopomofo: 'ㄖㄣˊ',
        definition: '人類。',
        exampleSentence: '公園裡有很多人。',
        options: ['看完了'],
        correctAnswer: 0,
        explanation: '「人」字先寫一撇，再寫一捺。'
      },
      { 
        id: 'g1-c5', 
        type: 'stroke',
        text: '請觀察「山」的寫法：', 
        character: '山',
        bopomofo: 'ㄕㄢ',
        definition: '地面形成的高聳部分。',
        exampleSentence: '遠處有一座高山。',
        options: ['看完了'],
        correctAnswer: 0,
        explanation: '「山」字先寫中間的長豎，再寫兩旁的折與短豎。'
      },
      { 
        id: 'g1-c6', 
        type: 'stroke',
        text: '請觀察「木」的寫法：', 
        character: '木',
        bopomofo: 'ㄇㄨˋ',
        definition: '樹木。',
        exampleSentence: '森林裡有很多木頭。',
        options: ['看完了'],
        correctAnswer: 0,
        explanation: '「木」字先寫一橫一豎，再寫一撇一捺。'
      },
      { 
        id: 'g2-c7', 
        type: 'stroke',
        text: '請觀察「水」的寫法：', 
        character: '水',
        bopomofo: 'ㄕㄨㄟˇ',
        definition: '液體、河流。',
        exampleSentence: '我們要多喝水。',
        options: ['看完了'],
        correctAnswer: 0,
        explanation: '「水」字先寫中間的一勾，再寫左右兩邊。'
      },
      { 
        id: 'g1-c8', 
        type: 'stroke',
        text: '請觀察「火」的寫法：', 
        character: '火',
        bopomofo: 'ㄏㄨㄛˇ',
        definition: '燃燒產生的光和熱。',
        exampleSentence: '火可以取暖。',
        options: ['看完了'],
        correctAnswer: 0,
        explanation: '「火」字先寫兩旁的點，再寫中間的一撇一捺。'
      },
      { 
        id: 'g1-c9', 
        type: 'stroke',
        text: '請觀察「土」的寫法：', 
        character: '土',
        bopomofo: 'ㄊㄨˇ',
        definition: '土壤、泥土。',
        exampleSentence: '泥土裡有蚯蚓。',
        options: ['看完了'],
        correctAnswer: 0,
        explanation: '「土」字先寫一短橫一豎，最後寫一長橫。'
      },
      { 
        id: 'g1-c10', 
        type: 'stroke',
        text: '請觀察「口」的寫法：', 
        character: '口',
        bopomofo: 'ㄎㄡˇ',
        definition: '嘴巴。',
        exampleSentence: '我們用口說話。',
        options: ['看完了'],
        correctAnswer: 0,
        explanation: '「口」字先寫一豎，再寫一橫折，最後寫一橫封口。'
      },
      { 
        id: 'g1-c11', 
        type: 'stroke',
        text: '請觀察「人」的寫法：', 
        character: '人',
        bopomofo: 'ㄖㄣˊ',
        definition: '人類。',
        exampleSentence: '公園裡有很多人。',
        options: ['看完了'],
        correctAnswer: 0,
        explanation: '「人」字先寫一撇，再寫一捺。'
      },
      { 
        id: 'g1-c12', 
        type: 'stroke',
        text: '請觀察「大」的寫法：', 
        character: '大',
        bopomofo: 'ㄉㄚˋ',
        definition: '與「小」相對。',
        exampleSentence: '這顆西瓜很大。',
        options: ['看完了'],
        correctAnswer: 0,
        explanation: '「大」字先寫一橫，再寫一個「人」。'
      }
    ],
    [Category.VOCABULARY]: [
      { 
        id: 'g1-v1', 
        type: 'matching',
        text: '請將相反詞配對：', 
        matchingPairs: [
          { left: '大', right: '小' },
          { left: '多', right: '少' },
          { left: '長', right: '短' }
        ],
        options: [],
        correctAnswer: 'matching',
        explanation: '大對小，多對少，長對短。',
        bopomofo: 'ㄉㄚˋ / ㄒㄧㄠˇ',
        exampleSentence: '這顆蘋果很大，那顆很小。'
      },
      { 
        id: 'g1-v2', 
        type: 'matching',
        text: '請將相關詞配對：', 
        matchingPairs: [
          { left: '老師', right: '學生' },
          { left: '爸爸', right: '媽媽' },
          { left: '哥哥', right: '弟弟' }
        ],
        options: [],
        correctAnswer: 'matching',
        explanation: '這些是常見的人物稱呼配對。',
        bopomofo: 'ㄌㄠˇ ㄕ / ㄒㄩㄝˊ ㄕㄥ',
        exampleSentence: '老師在教室教導學生。'
      },
      { 
        id: 'g1-v3', 
        type: 'matching',
        text: '請將自然現象配對：', 
        matchingPairs: [
          { left: '太陽', right: '白天' },
          { left: '月亮', right: '晚上' },
          { left: '星星', right: '夜空' }
        ],
        options: [],
        correctAnswer: 'matching',
        explanation: '太陽在白天出現，月亮和星星在晚上出現。',
        bopomofo: 'ㄊㄞˋ ㄧㄤˊ / ㄅㄞˊ ㄊㄧㄢ',
        exampleSentence: '太陽出來了，白天到了。'
      }
    ],
    [Category.READING]: [
      { 
        id: 'g1-r1', 
        type: 'cloze',
        text: '我今天___去上學。', 
        options: ['很高興', '很難過', '很生氣', '很害怕'], 
        correctAnswer: 0, 
        explanation: '上學是一件快樂的事情。' 
      },
      { 
        id: 'g1-r2', 
        type: 'cloze',
        text: '太陽從___邊升起。', 
        options: ['東', '西', '南', '北'], 
        correctAnswer: 0, 
        explanation: '日出東方是自然現象。' 
      },
      { 
        id: 'g1-r3', 
        text: '小貓喜歡吃___。', 
        type: 'cloze',
        options: ['魚', '草', '骨頭', '蟲子'], 
        correctAnswer: 0, 
        explanation: '貓是肉食性動物，喜歡吃魚。' 
      },
      { 
        id: 'g1-r4', 
        text: '下雨了，我們要打___。', 
        type: 'cloze',
        options: ['傘', '球', '鼓', '電話'], 
        correctAnswer: 0, 
        explanation: '下雨時要用傘遮雨。' 
      },
      { 
        id: 'g1-r5', 
        text: '天空是___色的。', 
        type: 'cloze',
        options: ['藍', '綠', '紅', '黑'], 
        correctAnswer: 0, 
        explanation: '晴朗的天空通常是藍色的。' 
      }
    ],
    [Category.WRITING]: [
      { id: 'g1-w1', type: 'cloze', text: '我___喜歡吃蘋果。', options: ['很', '不', '都', '也'], correctAnswer: 0, explanation: '「很」用來表示程度。' }
    ]
  },
  [Grade.G2]: {
    [Category.PHONETICS]: [
      { id: 'g2-p1', type: 'audio', text: '請聽音辨字：', audioText: '你好', options: ['你好', '您好', '你們', '他們'], correctAnswer: 0, explanation: '這是「你好」。' },
      { id: 'g2-p2', type: 'audio', text: '請聽音辨字：', audioText: '老師', options: ['老鼠', '老師', '老實', '老是'], correctAnswer: 1, explanation: '這是「老師」。' },
      { id: 'g2-p3', type: 'audio', text: '請聽音辨字：', audioText: '學生', options: ['學問', '學費', '學生', '學期'], correctAnswer: 2, explanation: '這是「學生」。' },
      { id: 'g2-p4', type: 'audio', text: '請聽音辨字：', audioText: '早安', options: ['晚安', '午安', '早安', '平安'], correctAnswer: 2, explanation: '這是「早安」。' },
      { id: 'g2-p5', type: 'audio', text: '請聽音辨字：', audioText: '再見', options: ['再會', '再見', '再說', '再想'], correctAnswer: 1, explanation: '這是「再見」。' },
    ],
    [Category.CHARACTERS]: [
      { 
        id: 'g2-c1', 
        type: 'stroke',
        text: '請觀察「天」的寫法：', 
        character: '天',
        bopomofo: 'ㄊㄧㄢ',
        definition: '天空、日子。',
        exampleSentence: '今天的天氣很好。',
        options: ['看完了'],
        correctAnswer: 0,
        explanation: '「天」字先寫兩橫，再寫一撇一捺。'
      },
      { 
        id: 'g2-c2', 
        type: 'stroke',
        text: '請觀察「地」的寫法：', 
        character: '地',
        bopomofo: 'ㄉㄧˋ',
        definition: '地面、土地。',
        exampleSentence: '地上有很多落葉。',
        options: ['看完了'],
        correctAnswer: 0,
        explanation: '「地」字左邊是土部，右邊是也。'
      },
      { 
        id: 'g2-c3', 
        type: 'stroke',
        text: '請觀察「日」的寫法：', 
        character: '日',
        bopomofo: 'ㄖˋ',
        definition: '太陽、日子。',
        exampleSentence: '日出的景色很美。',
        options: ['看完了'],
        correctAnswer: 0,
        explanation: '「日」字是一個長方形，中間有一橫。'
      },
      { 
        id: 'g2-c4', 
        type: 'stroke',
        text: '請觀察「月」的寫法：', 
        character: '月',
        bopomofo: 'ㄩㄝˋ',
        definition: '月亮、月份。',
        exampleSentence: '今晚的月亮很圓。',
        options: ['看完了'],
        correctAnswer: 0,
        explanation: '「月」字像一彎明月，中間有兩橫。'
      },
      { 
        id: 'g2-c5', 
        type: 'stroke',
        text: '請觀察「水」的寫法：', 
        character: '水',
        bopomofo: 'ㄕㄨㄟˇ',
        definition: '液體、河流。',
        exampleSentence: '我們要多喝水。',
        options: ['看完了'],
        correctAnswer: 0,
        explanation: '「水」字先寫中間的一勾，再寫左右兩邊。'
      }
    ],
    [Category.VOCABULARY]: [
      { 
        id: 'g2-v1', 
        type: 'matching',
        text: '請將動物與其叫聲配對：', 
        matchingPairs: [
          { left: '小狗', right: '汪汪' },
          { left: '小貓', right: '喵喵' },
          { left: '小雞', right: '嘰嘰' }
        ],
        options: [],
        correctAnswer: 'matching',
        explanation: '狗汪汪，貓喵喵，雞嘰嘰。',
        bopomofo: 'ㄍㄡˇ / ㄨㄤ ㄨㄤ',
        exampleSentence: '小狗在門口汪汪叫。'
      },
      { 
        id: 'g2-v2', 
        type: 'matching',
        text: '請將顏色與事物配對：', 
        matchingPairs: [
          { left: '紅色', right: '蘋果' },
          { left: '黃色', right: '香蕉' },
          { left: '綠色', right: '西瓜' }
        ],
        options: [],
        correctAnswer: 'matching',
        explanation: '常見的水果顏色配對。',
        bopomofo: 'ㄏㄨㄥˊ ㄙㄜˋ / ㄆㄧㄥˊ ㄍㄨㄛˇ',
        exampleSentence: '紅色的蘋果很好吃。'
      },
      { 
        id: 'g2-v3', 
        type: 'matching',
        text: '請將身體部位與功能配對：', 
        matchingPairs: [
          { left: '眼睛', right: '看' },
          { left: '耳朵', right: '聽' },
          { left: '嘴巴', right: '說' }
        ],
        options: [],
        correctAnswer: 'matching',
        explanation: '眼睛看，耳朵聽，嘴巴說。',
        bopomofo: 'ㄧㄢˇ ㄐㄧㄥ / ㄎㄢˋ',
        exampleSentence: '我們用眼睛看世界。'
      }
    ],
    [Category.READING]: [
      { 
        id: 'g2-r1', 
        type: 'cloze',
        text: '春天到了，花兒都___了。', 
        options: ['開', '謝', '落', '枯'], 
        correctAnswer: 0, 
        explanation: '春天是花開的季節。' 
      },
      { 
        id: 'g2-r2', 
        type: 'cloze',
        text: '小鳥在樹上___地唱歌。', 
        options: ['快樂', '傷心', '生氣', '害怕'], 
        correctAnswer: 0, 
        explanation: '小鳥唱歌通常被形容為快樂。' 
      },
      { 
        id: 'g2-r3', 
        type: 'cloze',
        text: '下課了，小朋友在操場上___。', 
        options: ['玩耍', '睡覺', '洗澡', '吃飯'], 
        correctAnswer: 0, 
        explanation: '下課時間小朋友喜歡在操場玩。' 
      },
      { 
        id: 'g2-r4', 
        type: 'cloze',
        text: '爸爸每天開車去___。', 
        options: ['上班', '上學', '上課', '上網'], 
        correctAnswer: 0, 
        explanation: '爸爸的工作是上班。' 
      },
      { 
        id: 'g2-r5', 
        type: 'cloze',
        text: '媽媽在廚房做___。', 
        options: ['飯', '衣服', '功課', '運動'], 
        correctAnswer: 0, 
        explanation: '廚房是做飯的地方。' 
      }
    ],
    [Category.WRITING]: [
      { id: 'g2-w1', type: 'cloze', text: '小明___跑步，___游泳。', options: ['喜歡/也喜歡', '不喜歡/卻喜歡', '雖然/但是', '因為/所以'], correctAnswer: 0, explanation: '表示並列喜歡的兩件事。' }
    ]
  },
  [Grade.G3]: {
    [Category.PHONETICS]: [
      { id: 'g3-p1', type: 'audio', text: '請聽音辨字：', audioText: '環境', options: ['乾淨', '環境', '眼鏡', '鏡子'], correctAnswer: 1, explanation: '這是「環境」。' }
    ],
    [Category.CHARACTERS]: [
      { id: 'g3-c1', type: 'stroke', text: '請觀察「學」的寫法：', character: '學', bopomofo: 'ㄒㄩㄝˊ', definition: '學習、學問。', exampleSentence: '我們在學校學習新知識。', options: ['看完了'], correctAnswer: 0, explanation: '「學」字上半部較為複雜，注意筆畫順序。' },
      { id: 'g3-c2', type: 'stroke', text: '請觀察「校」的寫法：', character: '校', bopomofo: 'ㄒㄧㄠˋ', definition: '學校。', exampleSentence: '我們的校園很大。', options: ['看完了'], correctAnswer: 0, explanation: '左邊是木部，右邊是交。' }
    ],
    [Category.VOCABULARY]: [
      { id: 'g3-v1', type: 'matching', text: '請將成語與其意義配對：', matchingPairs: [{ left: '守株待兔', right: '妄想不勞而獲' }, { left: '井底之蛙', right: '見識淺薄' }, { left: '畫蛇添足', right: '多此一舉' }], options: [], correctAnswer: 'matching', explanation: '常見的寓言成語。', bopomofo: '', exampleSentence: '我們做事要腳踏實地。' },
      { id: 'g3-v2', type: 'matching', text: '請將職業與工作內容配對：', matchingPairs: [{ left: '醫生', right: '治病' }, { left: '教師', right: '教書' }, { left: '警察', right: '抓小偷' }], options: [], correctAnswer: 'matching', explanation: '各行各業的工作內容。', bopomofo: '', exampleSentence: '醫生負責醫治病人。' }
    ],
    [Category.READING]: [
      { id: 'g3-r1', type: 'cloze', text: '圖書館裡有很多___，我們應該保持安靜。', options: ['玩具', '書籍', '零食', '衣服'], correctAnswer: 1, explanation: '圖書館是看書的地方。' },
      { id: 'g3-r2', type: 'cloze', text: '這本故事書的___很有趣，讓人想一直看下去。', options: ['內容', '封面', '書名', '價格'], correctAnswer: 0, explanation: '吸引人的是書的內容。' }
    ],
    [Category.WRITING]: [
      { id: 'g3-w1', type: 'cloze', text: '因為下雨了，___。', options: ['所以我沒帶傘', '所以我取消了郊遊', '所以我很高興出門', '所以我去游泳'], correctAnswer: 1, explanation: '下雨通常會導致戶外活動取消。' }
    ]
  },
  [Grade.G4]: { 
    [Category.PHONETICS]: [
      { id: 'g4-p1', type: 'audio', text: '請聽音辨字：', audioText: '觀察', options: ['觀察', '警察', '檢查', '考察'], correctAnswer: 0, explanation: '這是「觀察」。' },
      { id: 'g4-p2', type: 'audio', text: '請聽音辨字：', audioText: '勇敢', options: ['勇敢', '永遠', '擁抱', '游泳'], correctAnswer: 0, explanation: '這是「勇敢」。' }
    ], 
    [Category.CHARACTERS]: [
      { id: 'g4-c1', type: 'stroke', text: '請觀察「麗」的寫法：', character: '麗', bopomofo: 'ㄌㄧˋ', definition: '美好、好看。', exampleSentence: '這是一幅美麗的畫。', options: ['看完了'], correctAnswer: 0, explanation: '「麗」字的筆畫較多，要注意結構。' }
    ], 
    [Category.VOCABULARY]: [
      { id: 'g4-v1', type: 'matching', text: '請將近義詞配對：', matchingPairs: [{ left: '開心', right: '快樂' }, { left: '美麗', right: '漂亮' }, { left: '聰明', right: '機智' }], options: [], correctAnswer: 'matching', explanation: '這些詞語的意思相近。', bopomofo: '', exampleSentence: '他是一個聰明又機智的孩子。' }
    ], 
    [Category.READING]: [
      { id: 'g4-r1', type: 'cloze', text: '這篇文章的___是告訴我們要愛護環境。', options: ['主旨', '標題', '作者', '結尾'], correctAnswer: 0, explanation: '文章傳達的中心思想稱為主旨。' }
    ], 
    [Category.WRITING]: [
      { id: 'g4-w1', type: 'cloze', text: '他___功課好，___喜歡幫助別人。', options: ['不但/而且', '因為/所以', '雖然/但是', '如果/就'], correctAnswer: 0, explanation: '「不但...而且...」表示遞進關係。' }
    ] 
  },
  [Grade.G5]: { 
    [Category.PHONETICS]: [
      { id: 'g5-p1', type: 'audio', text: '請聽音辨字：', audioText: '猶豫', options: ['由於', '猶豫', '魷魚', '優裕'], correctAnswer: 1, explanation: '這是「猶豫」。' }
    ], 
    [Category.CHARACTERS]: [
      { id: 'g5-c1', type: 'stroke', text: '請觀察「龜」的寫法：', character: '龜', bopomofo: 'ㄍㄨㄟ', definition: '爬行動物。', exampleSentence: '烏龜爬得很慢。', options: ['看完了'], correctAnswer: 0, explanation: '「龜」字筆畫繁多，需仔細觀察。' }
    ], 
    [Category.VOCABULARY]: [
      { id: 'g5-v1', type: 'matching', text: '請將成語與人物配對：', matchingPairs: [{ left: '臥薪嘗膽', right: '句踐' }, { left: '破釜沉舟', right: '項羽' }, { left: '三顧茅廬', right: '劉備' }], options: [], correctAnswer: 'matching', explanation: '這些成語都有歷史典故。', bopomofo: '', exampleSentence: '他有著臥薪嘗膽的精神。' }
    ], 
    [Category.READING]: [
      { id: 'g5-r1', type: 'cloze', text: '作者透過這首詩，抒發了對故鄉的___之情。', options: ['思念', '憤怒', '恐懼', '悲傷'], correctAnswer: 0, explanation: '詩歌常表達對家鄉的思念。' }
    ], 
    [Category.WRITING]: [
      { id: 'g5-w1', type: 'cloze', text: '___遇到困難，我們___不能放棄。', options: ['即使/也', '不但/而且', '因為/所以', '如果/就'], correctAnswer: 0, explanation: '「即使...也...」表示假設的讓步。' }
    ] 
  },
  [Grade.G6]: { 
    [Category.PHONETICS]: [
      { id: 'g6-p1', type: 'audio', text: '請聽音辨字：', audioText: '躊躇', options: ['躊躇', '抽搐', '稠密', '醜陋'], correctAnswer: 0, explanation: '這是「躊躇」。' }
    ], 
    [Category.CHARACTERS]: [
      { id: 'g6-c1', type: 'stroke', text: '請觀察「鬱」的寫法：', character: '鬱', bopomofo: 'ㄩˋ', definition: '茂盛、停滯。', exampleSentence: '他最近心情很鬱悶。', options: ['看完了'], correctAnswer: 0, explanation: '「鬱」是筆畫最多的常用字之一。' }
    ], 
    [Category.VOCABULARY]: [
      { id: 'g6-v1', type: 'matching', text: '請將文學體裁與特點配對：', matchingPairs: [{ left: '詩歌', right: '講究韻律' }, { left: '小說', right: '有故事情節' }, { left: '散文', right: '形散神不散' }], options: [], correctAnswer: 'matching', explanation: '不同的文學體裁有其獨特特徵。', bopomofo: '', exampleSentence: '他喜歡閱讀各種體裁的作品。' }
    ], 
    [Category.READING]: [
      { id: 'g6-r1', type: 'cloze', text: '這篇議論文的___非常嚴密，讓人無法反駁。', options: ['邏輯', '情感', '修辭', '排版'], correctAnswer: 0, explanation: '議論文最重要的是邏輯嚴密。' }
    ], 
    [Category.WRITING]: [
      { id: 'g6-w1', type: 'cloze', text: '___在這裡抱怨，___趕快想辦法解決問題。', options: ['與其/不如', '寧可/也不', '既然/就', '不僅/還'], correctAnswer: 0, explanation: '「與其...不如...」表示在比較中選擇更好的一方。' }
    ] 
  }
};

export const BOSSES: Record<Grade, Boss[]> = {
  [Grade.G1]: [
    { 
      id: 'g1-b1', 
      name: '注音小怪獸', 
      description: '第一次段考挑戰：掌握基礎注音！', 
      questions: [
        { id: 'g1-b1-q1', type: 'audio', text: '聽音辨字：', audioText: '學中文', options: ['學中文', '寫中文', '說中文', '看中文'], correctAnswer: 0, explanation: '這是「學中文」。' },
        { id: 'g1-b1-q2', type: 'cloze', text: '老師在___教書。', options: ['教室', '操場', '廁所', '廚房'], correctAnswer: 0, explanation: '老師在教室教書。' },
        { id: 'g1-b1-q3', type: 'audio', text: '聽音辨字：', audioText: '朋友', options: ['朋友', '皮球', '跑步', '蘋果'], correctAnswer: 0, explanation: '這是「朋友」。' },
      ] 
    },
    { 
      id: 'g1-b2', 
      name: '文字守衛者', 
      description: '第二次段考挑戰：筆畫與部首！', 
      questions: [
        { id: 'g1-b2-q1', type: 'stroke', text: '觀察「人」的寫法：', character: '人', bopomofo: 'ㄖㄣˊ', definition: '人類。', exampleSentence: '公園裡有很多人。', options: ['看完了'], correctAnswer: 0, explanation: '「人」字先寫一撇，再寫一捺。' },
        { id: 'g1-b2-q2', type: 'cloze', text: '這是一___大蘋果。', options: ['顆', '隻', '個', '條'], correctAnswer: 0, explanation: '蘋果的量詞通常用「顆」。' },
      ] 
    },
    { 
      id: 'g1-b3', 
      name: '句子大魔王', 
      description: '第三次段考挑戰：完整的一句話！', 
      questions: [
        { id: 'g1-b3-q1', type: 'cloze', text: '我們是一對好___。', options: ['朋友', '敵人', '路人', '壞人'], correctAnswer: 0, explanation: '我們是好朋友。' },
        { id: 'g1-b3-q2', type: 'audio', text: '聽音辨字：', audioText: '謝謝', options: ['休息', '謝謝', '學習', '消息'], correctAnswer: 1, explanation: '這是「謝謝」。' },
      ] 
    }
  ],
  [Grade.G2]: [
    { 
      id: 'g2-b1', 
      name: '詞彙小精靈', 
      description: '第一次段考挑戰：掌握基礎詞彙！', 
      questions: [
        { id: 'g2-b1-q1', type: 'audio', text: '聽音辨字：', audioText: '高興', options: ['高興', '難過', '生氣', '害怕'], correctAnswer: 0, explanation: '這是「高興」。' },
        { id: 'g2-b1-q2', type: 'cloze', text: '小明今天___去公園。', options: ['走路', '開車', '坐飛機', '騎馬'], correctAnswer: 0, explanation: '小明走路去公園。' },
      ] 
    },
    { 
      id: 'g2-b2', 
      name: '閱讀守護者', 
      description: '第二次段考挑戰：理解簡單句子！', 
      questions: [
        { id: 'g2-b2-q1', type: 'cloze', text: '小狗在門口___叫。', options: ['汪汪', '喵喵', '嘰嘰', '咩咩'], correctAnswer: 0, explanation: '狗是汪汪叫。' },
        { id: 'g2-b2-q2', type: 'audio', text: '聽音辨字：', audioText: '漂亮', options: ['漂亮', '醜陋', '可愛', '可怕'], correctAnswer: 0, explanation: '這是「漂亮」。' },
      ] 
    },
    { 
      id: 'g2-b3', 
      name: '語法大魔王', 
      description: '第三次段考挑戰：掌握句子結構！', 
      questions: [
        { id: 'g2-b3-q1', type: 'cloze', text: '這是一___美麗的風景。', options: ['幅', '隻', '個', '條'], correctAnswer: 0, explanation: '風景的量詞通常用「幅」。' },
        { id: 'g2-b3-q2', type: 'audio', text: '聽音辨字：', audioText: '環境保護', options: ['環境保護', '資源回收', '節約能源', '愛護動物'], correctAnswer: 0, explanation: '這是「環境保護」。' },
      ] 
    }
  ],
  [Grade.G3]: [
    { 
      id: 'g3-b1', 
      name: '成語大師', 
      description: '第一關：成語挑戰！', 
      questions: [
        { id: 'g3-b1-q1', type: 'cloze', text: '他做事總是___，不切實際。', options: ['守株待兔', '腳踏實地', '刻苦耐勞', '精益求精'], correctAnswer: 0, explanation: '守株待兔比喻妄想不勞而獲。' },
        { id: 'g3-b1-q2', type: 'cloze', text: '我們應該___，不要做井底之蛙。', options: ['增廣見聞', '閉門造車', '坐井觀天', '目光如豆'], correctAnswer: 0, explanation: '增廣見聞可以擴展視野。' }
      ] 
    }
  ], 
  [Grade.G4]: [
    { 
      id: 'g4-b1', 
      name: '近義詞怪獸', 
      description: '第一關：詞語辨析！', 
      questions: [
        { id: 'g4-b1-q1', type: 'cloze', text: '這朵花開得真___。', options: ['美麗', '難看', '枯萎', '醜陋'], correctAnswer: 0, explanation: '美麗是稱讚花朵的好詞。' },
        { id: 'g4-b1-q2', type: 'cloze', text: '考試時要___，不要粗心大意。', options: ['仔細', '隨便', '馬虎', '分心'], correctAnswer: 0, explanation: '仔細是粗心的反義詞。' }
      ] 
    }
  ], 
  [Grade.G5]: [
    { 
      id: 'g5-b1', 
      name: '典故守護者', 
      description: '第一關：歷史典故！', 
      questions: [
        { id: 'g5-b1-q1', type: 'cloze', text: '「破釜沉舟」這個成語與哪位歷史人物有關？', options: ['項羽', '劉邦', '韓信', '張良'], correctAnswer: 0, explanation: '破釜沉舟是項羽在鉅鹿之戰中的典故。' },
        { id: 'g5-b1-q2', type: 'cloze', text: '「三顧茅廬」是誰請誰出山？', options: ['劉備請諸葛亮', '曹操請關羽', '孫權請周瑜', '項羽請范增'], correctAnswer: 0, explanation: '劉備三顧茅廬請諸葛亮。' }
      ] 
    }
  ], 
  [Grade.G6]: [
    { 
      id: 'g6-b1', 
      name: '文學魔王', 
      description: '最終挑戰：綜合文學素養！', 
      questions: [
        { id: 'g6-b1-q1', type: 'cloze', text: '「床前明月光」是哪位詩人的作品？', options: ['李白', '杜甫', '白居易', '蘇軾'], correctAnswer: 0, explanation: '這是李白的《靜夜思》。' },
        { id: 'g6-b1-q2', type: 'cloze', text: '《西遊記》的作者是誰？', options: ['吳承恩', '羅貫中', '施耐庵', '曹雪芹'], correctAnswer: 0, explanation: '《西遊記》作者為吳承恩。' }
      ] 
    }
  ]
};
