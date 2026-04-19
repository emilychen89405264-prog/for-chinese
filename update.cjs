const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove HanziWriter import
code = code.replace(`import HanziWriter from 'hanzi-writer';\n`, '');

// 2. Change PRACTICE_TYPES
code = code.replace(
  `const PRACTICE_TYPES = ['發音識字', '筆順練習', '詞彙語法', '閱讀理解'];`,
  `const PRACTICE_TYPES = ['發音識字', '單字填空', '詞彙語法', '閱讀理解'];`
);

// 3. Add cloze to GRADE_DATA
const clozeData = {
  '一年級': `cloze: [
      { q: '我想___一個好夢。', options: [{c:'做',z:'ㄗㄨㄛˋ'}, {c:'作',z:'ㄗㄨㄛˋ'}, {c:'座',z:'ㄗㄨㄛˋ'}], a: 0 },
      { q: '王爺爺每天到___照顧花草。', options: [{c:'學校',z:'ㄒㄩㄝˊ ㄒㄧㄠˋ'}, {c:'鞋子',z:'ㄒㄧㄝˊ ㄗ˙'}, {c:'雪球',z:'ㄒㄩㄝˇ ㄑㄧㄡˊ'}], a: 0 },
      { q: '妹妹才兩歲，___會說簡單的詞語。', options: [{c:'只',z:'ㄓˇ'}, {c:'子',z:'ㄗˇ'}, {c:'紙',z:'ㄓˇ'}], a: 0 },
      { q: '下大雨了，大家躲到屋___去。', options: [{c:'簷',z:'ㄧㄢˊ'}, {c:'言',z:'ㄧㄢˊ'}, {c:'炎',z:'ㄧㄢˊ'}], a: 0 },
      { q: '這顆大蘋___看起來很好吃。', options: [{c:'果',z:'ㄍㄨㄛˇ'}, {c:'裹',z:'ㄍㄨㄛˇ'}, {c:'狗',z:'ㄍㄡˇ'}], a: 0 }
    ],`,
  '二年級': `cloze: [
      { q: '弟弟很快就猜到___案了。', options: [{c:'答',z:'ㄉㄚˊ'}, {c:'打',z:'ㄉㄚˇ'}, {c:'搭',z:'ㄉㄚ'}], a: 0 },
      { q: '小明不小心把書包___忘在操場上。', options: [{c:'遺',z:'ㄧˊ'}, {c:'疑',z:'ㄧˊ'}, {c:'移',z:'ㄧˊ'}], a: 0 },
      { q: '店員___切的向客人問好。', options: [{c:'親',z:'ㄑㄧㄣ'}, {c:'輕',z:'ㄑㄧㄥ'}, {c:'青',z:'ㄑㄧㄥ'}], a: 0 },
      { q: '___天到了，樹葉都變黃了。', options: [{c:'秋',z:'ㄑㄧㄡ'}, {c:'丘',z:'ㄑㄧㄡ'}, {c:'求',z:'ㄑㄧㄡˊ'}], a: 0 },
      { q: '媽媽買了好多水___給我吃。', options: [{c:'果',z:'ㄍㄨㄛˇ'}, {c:'狗',z:'ㄍㄡˇ'}, {c:'過',z:'ㄍㄨㄛˋ'}], a: 0 }
    ],`,
  '三年級': `cloze: [
      { q: '他是一個___敢的人。', options: [{c:'勇',z:'ㄩㄥˇ'}, {c:'永',z:'ㄩㄥˇ'}, {c:'泳',z:'ㄩㄥˇ'}], a: 0 },
      { q: '這裡的風景真___人。', options: [{c:'迷',z:'ㄇㄧˊ'}, {c:'謎',z:'ㄇㄧˊ'}, {c:'米',z:'ㄇㄧˇ'}], a: 0 },
      { q: '他是一位有名的___師。', options: [{c:'廚',z:'ㄔㄨˊ'}, {c:'除',z:'ㄔㄨˊ'}, {c:'儲',z:'ㄔㄨˊ'}], a: 0 },
      { q: '我們去海邊___水。', options: [{c:'潛',z:'ㄑㄧㄢˊ'}, {c:'錢',z:'ㄑㄧㄢˊ'}, {c:'前',z:'ㄑㄧㄢˊ'}], a: 0 },
      { q: '這是一隻___麗的蝴蝶。', options: [{c:'美',z:'ㄇㄟˇ'}, {c:'每',z:'ㄇㄟˇ'}, {c:'妹',z:'ㄇㄟˋ'}], a: 0 }
    ],`,
  '四年級': `cloze: [
      { q: '老師___導我們要做一個誠實的孩子。', options: [{c:'教',z:'ㄐㄧㄠˋ'}, {c:'交',z:'ㄐㄧㄠ'}, {c:'叫',z:'ㄐㄧㄠˋ'}], a: 0 },
      { q: '這次的考試，他表現得非常___出。', options: [{c:'傑',z:'ㄐㄧㄝˊ'}, {c:'節',z:'ㄐㄧㄝˊ'}, {c:'結',z:'ㄐㄧㄝˊ'}], a: 0 },
      { q: '我們要___惜水資源，不可以浪費。', options: [{c:'珍',z:'ㄓㄣ'}, {c:'真',z:'ㄓㄣ'}, {c:'針',z:'ㄓㄣ'}], a: 0 },
      { q: '布袋戲是臺灣的傳___戲劇。', options: [{c:'統',z:'ㄊㄨㄥˇ'}, {c:'桶',z:'ㄊㄨㄥˇ'}, {c:'痛',z:'ㄊㄨㄥˋ'}], a: 0 },
      { q: '這真是一個大___奇。', options: [{c:'驚',z:'ㄐㄧㄥ'}, {c:'經',z:'ㄐㄧㄥ'}, {c:'精',z:'ㄐㄧㄥ'}], a: 0 }
    ],`,
  '五年級': `cloze: [
      { q: '他的成績非常___異。', options: [{c:'優',z:'ㄧㄡ'}, {c:'悠',z:'ㄧㄡ'}, {c:'幽',z:'ㄧㄡ'}], a: 0 },
      { q: '這是一個___大的計畫，需要多人合作。', options: [{c:'龐',z:'ㄆㄤˊ'}, {c:'旁',z:'ㄆㄤˊ'}, {c:'螃',z:'ㄆㄤˊ'}], a: 0 },
      { q: '他那___尚的行為，贏得了大家的讚賞。', options: [{c:'高',z:'ㄍㄠ'}, {c:'糕',z:'ㄍㄠ'}, {c:'膏',z:'ㄍㄠ'}], a: 0 },
      { q: '我們應該要___絕浪費食物。', options: [{c:'拒',z:'ㄐㄩˋ'}, {c:'具',z:'ㄐㄩˋ'}, {c:'聚',z:'ㄐㄩˋ'}], a: 0 },
      { q: '這朵花的花___掉落了。', options: [{c:'瓣',z:'ㄅㄢˋ'}, {c:'半',z:'ㄅㄢˋ'}, {c:'伴',z:'ㄅㄢˋ'}], a: 0 }
    ],`,
  '六年級': `cloze: [
      { q: '他的生活___倒，經常熬夜。', options: [{c:'顛',z:'ㄉㄧㄢ'}, {c:'巔',z:'ㄉㄧㄢ'}, {c:'店',z:'ㄉㄧㄢˋ'}], a: 0 },
      { q: '這場比賽___人心弦，非常精彩。', options: [{c:'扣',z:'ㄎㄡˋ'}, {c:'蔻',z:'ㄎㄡˋ'}, {c:'口',z:'ㄎㄡˇ'}], a: 0 },
      { q: '面對困難，我們不能___縮。', options: [{c:'畏',z:'ㄨㄟˋ'}, {c:'餵',z:'ㄨㄟˋ'}, {c:'味',z:'ㄨㄟˋ'}], a: 0 },
      { q: '他是一位___越的領導者。', options: [{c:'卓',z:'ㄓㄨㄛˊ'}, {c:'茁',z:'ㄓㄨㄛˊ'}, {c:'濁',z:'ㄓㄨㄛˊ'}], a: 0 },
      { q: '我們要保持___虛的態度。', options: [{c:'謙',z:'ㄑㄧㄢ'}, {c:'千',z:'ㄑㄧㄢ'}, {c:'牽',z:'ㄑㄧㄢ'}], a: 0 }
    ],`
};

for (const grade in clozeData) {
  const regex = new RegExp(`('${grade}':\\s*\\{[\\s\\S]*?)(reading:\\s*\\[)`);
  code = code.replace(regex, "$1" + clozeData[grade] + "\n    $2");
}

// 4. Update questions useMemo
code = code.replace('const shuffledReading = shuffleArray(data.reading).slice(0, 5);', 
`const shuffledReading = shuffleArray(data.reading).slice(0, 5);
    const shuffledCloze = shuffleArray(data.cloze || []).slice(0, 5);`);

const strokeLogic = `    if (selectedCategory === '筆順練習') {
      return shuffledChars.map(item => {
          const { opts, aIdx } = makeOptions(item, true);
          return { type: 'stroke', c: item.c, z: item.z, options: opts, correctAnswer: aIdx };
      });
    }`;
const clozeLogic = `    if (selectedCategory === '單字填空') {
      return shuffledCloze.map(item => {
          const opts = shuffleArray(item.options);
          const correctOpt = item.options[item.a];
          const aIdx = opts.findIndex(o => o.c === correctOpt.c);
          return { ...item, type: 'cloze', options: opts, correctAnswer: aIdx };
      });
    }`;
code = code.replace(strokeLogic, clozeLogic);

const oldBossLogic = `    if (selectedCategory.includes('魔王')) {
        const q1 = makeOptions(shuffledChars[0]);
        const q2 = makeOptions(shuffledChars[1], true);
        const q5 = makeOptions(shuffledChars[2]);
        
        const r1Opts = shuffleArray(shuffledReading[0].options);
        const r1AIdx = r1Opts.findIndex(o => o.c === shuffledReading[0].options[shuffledReading[0].a].c);
        
        const r2Opts = shuffleArray(shuffledReading[1].options);
        const r2AIdx = r2Opts.findIndex(o => o.c === shuffledReading[1].options[shuffledReading[1].a].c);

        return [
            { ...shuffledChars[0], type: 'audio', options: q1.opts, correctAnswer: q1.aIdx },
            { ...shuffledChars[1], type: 'stroke', options: q2.opts, correctAnswer: q2.aIdx },
            { ...shuffledReading[0], type: 'reading', options: r1Opts, a: r1AIdx },
            { ...shuffledReading[1], type: 'reading', options: r2Opts, a: r2AIdx },
            { ...shuffledChars[2], type: 'audio', options: q5.opts, correctAnswer: q5.aIdx }
        ];
    }`;
const newBossLogic = `    if (selectedCategory.includes('魔王')) {
        const q1 = makeOptions(shuffledChars[0]);
        const c1Opts = shuffleArray(shuffledCloze[0].options);
        const c1AIdx = c1Opts.findIndex(o => o.c === shuffledCloze[0].options[shuffledCloze[0].a].c);
        
        const q5 = makeOptions(shuffledChars[1]);
        
        const r1Opts = shuffleArray(shuffledReading[0].options);
        const r1AIdx = r1Opts.findIndex(o => o.c === shuffledReading[0].options[shuffledReading[0].a].c);
        
        const r2Opts = shuffleArray(shuffledReading[1].options);
        const r2AIdx = r2Opts.findIndex(o => o.c === shuffledReading[1].options[shuffledReading[1].a].c);

        return [
            { ...shuffledChars[0], type: 'audio', options: q1.opts, correctAnswer: q1.aIdx },
            { ...shuffledCloze[0], type: 'cloze', options: c1Opts, correctAnswer: c1AIdx },
            { ...shuffledReading[0], type: 'reading', options: r1Opts, a: r1AIdx },
            { ...shuffledReading[1], type: 'reading', options: r2Opts, a: r2AIdx },
            { ...shuffledChars[1], type: 'audio', options: q5.opts, correctAnswer: q5.aIdx }
        ];
    }`;
code = code.replace(oldBossLogic, newBossLogic);

// 5. Remove useEffect for stroke
const strokeEffect = `  useEffect(() => {
    if (view === 'battle' && q?.type === 'stroke' && writerRef.current && !showSuccessMessage) {
      writerRef.current.innerHTML = '';
      HanziWriter.create(writerRef.current, q.c, { width: 220, height: 220, strokeColor: '#fbbf24', padding: 5 }).animateCharacter();
    }
  }, [view, q, showSuccessMessage]);`;
code = code.replace(strokeEffect, '');

// 7. Update UI for type === 'stroke' to type === 'cloze'
const strokeUI = `                          {/* 筆順題左右排版 */}
                          {q?.type === 'stroke' && (
                            <div className="grid grid-cols-2 gap-10 w-full items-center mt-6">
                              <div className="bg-white p-8 rounded-[40px] border-8 border-slate-700 shadow-2xl flex flex-col justify-center items-center h-[350px]">
                                <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-widest border-b-4 border-yellow-400 pb-2">請看筆順</h2>
                                <div ref={writerRef} />
                              </div>
                              <div className="flex flex-col gap-6">
                                <h2 className="text-3xl font-black text-yellow-400 text-center mb-2 bg-slate-900 py-3 rounded-full border-2 border-slate-600">正確注音是？</h2>
                                {q.options.map((opt, i) => (
                                  <button key={i} onClick={() => handleAnswer(i)}
                                          className="w-full py-6 px-8 rounded-3xl border-4 border-slate-600 bg-slate-800 hover:border-yellow-400 flex items-center shadow-xl group transition-all active:scale-95">
                                    <span className="w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center text-yellow-400 font-black text-2xl border-2 border-yellow-400/30 group-hover:border-yellow-400">{i+1}</span>
                                    <div className="flex-1 flex justify-center font-black text-4xl text-white tracking-widest">{opt.c}</div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}`;

const clozeUI = `                          {/* 單字填空題排版 */}
                          {q?.type === 'cloze' && (
                            <div className="flex flex-col items-center gap-8 w-full mt-6">
                              <div className="bg-slate-800 p-8 rounded-[40px] border-4 border-slate-600 shadow-2xl w-full max-w-4xl text-center">
                                <h2 className="text-3xl font-black text-yellow-400 mb-6 tracking-widest">請選出正確的字填入空格：</h2>
                                <div className="text-5xl font-black text-white leading-relaxed flex flex-wrap justify-center items-center gap-4">
                                  {q.q.split('___').map((part, idx, arr) => (
                                    <React.Fragment key={idx}>
                                      <span>{part}</span>
                                      {idx < arr.length - 1 && <span className="inline-block w-24 border-b-8 border-yellow-400 mx-4 mb-2"></span>}
                                    </React.Fragment>
                                  ))}
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-8 w-full max-w-4xl">
                                {q.options.map((opt, i) => (
                                  <button key={i} onClick={() => handleAnswer(i)}
                                          className="py-8 rounded-3xl border-4 border-slate-600 bg-slate-800 hover:border-yellow-400 flex flex-col items-center shadow-xl group transition-all active:scale-95">
                                    <div className="flex justify-center font-black">
                                      <VerticalRuby c={opt.c} z={opt.z} fontSize="text-6xl" />
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}`;
code = code.replace(strokeUI, clozeUI);

// 8. Change q?.type !== 'stroke' to q?.type !== 'cloze'
code = code.replace(`{q?.type !== 'stroke' && (`, `{q?.type !== 'cloze' && (`);

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx updated successfully');
