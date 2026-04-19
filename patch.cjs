const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const lines = code.split(/\r?\n/);
let newLines = [];
let i = 0;

while (i < lines.length) {
    if (lines[i].includes("if (selectedCategory === '筆順練習') {")) {
        newLines.push("    if (selectedCategory === '單字填空') {");
        newLines.push("      return shuffledCloze.map(item => {");
        newLines.push("          const opts = shuffleArray(item.options);");
        newLines.push("          const correctOpt = item.options[item.a];");
        newLines.push("          const aIdx = opts.findIndex(o => o.c === correctOpt.c);");
        newLines.push("          return { ...item, type: 'cloze', options: opts, correctAnswer: aIdx };");
        newLines.push("      });");
        newLines.push("    }");
        i += 6; // skip the old lines
    } else if (lines[i].includes("if (selectedCategory.includes('魔王')) {")) {
        newLines.push(lines[i]);
        let j = i + 1;
        while(j < lines.length && !lines[j].includes("return [")) {
            if (lines[j].includes("const q2 = makeOptions(shuffledChars[1], true);")) {
                newLines.push("        const c1Opts = shuffleArray(shuffledCloze[0].options);");
                newLines.push("        const c1AIdx = c1Opts.findIndex(o => o.c === shuffledCloze[0].options[shuffledCloze[0].a].c);");
            } else {
                newLines.push(lines[j]);
            }
            j++;
        }
        if (j < lines.length) {
            newLines.push(lines[j]); // return [
            j++;
            while(j < lines.length && !lines[j].includes("];")) {
                if (lines[j].includes("type: 'stroke'")) {
                    newLines.push("            { ...shuffledCloze[0], type: 'cloze', options: c1Opts, correctAnswer: c1AIdx },");
                } else {
                    newLines.push(lines[j]);
                }
                j++;
            }
            newLines.push(lines[j]); // ];
            i = j;
        }
    } else if (lines[i].includes("{/* 筆順題左右排版 */}")) {
        newLines.push("                          {/* 單字填空題排版 */}");
        newLines.push("                          {q?.type === 'cloze' && (");
        newLines.push("                            <div className=\"flex flex-col items-center gap-8 w-full mt-6\">");
        newLines.push("                              <div className=\"bg-slate-800 p-8 rounded-[40px] border-4 border-slate-600 shadow-2xl w-full max-w-4xl text-center\">");
        newLines.push("                                <h2 className=\"text-3xl font-black text-yellow-400 mb-6 tracking-widest\">請選出正確的字填入空格：</h2>");
        newLines.push("                                <div className=\"text-5xl font-black text-white leading-relaxed flex flex-wrap justify-center items-center gap-4\">");
        newLines.push("                                  {q.q.split('___').map((part, idx, arr) => (");
        newLines.push("                                    <React.Fragment key={idx}>");
        newLines.push("                                      <span>{part}</span>");
        newLines.push("                                      {idx < arr.length - 1 && <span className=\"inline-block w-24 border-b-8 border-yellow-400 mx-4 mb-2\"></span>}");
        newLines.push("                                    </React.Fragment>");
        newLines.push("                                  ))}");
        newLines.push("                                </div>");
        newLines.push("                              </div>");
        newLines.push("                              <div className=\"grid grid-cols-3 gap-8 w-full max-w-4xl\">");
        newLines.push("                                {q.options.map((opt, i) => (");
        newLines.push("                                  <button key={i} onClick={() => handleAnswer(i)}");
        newLines.push("                                          className=\"py-8 rounded-3xl border-4 border-slate-600 bg-slate-800 hover:border-yellow-400 flex flex-col items-center shadow-xl group transition-all active:scale-95\">");
        newLines.push("                                    <div className=\"flex justify-center font-black\">");
        newLines.push("                                      <VerticalRuby c={opt.c} z={opt.z} fontSize=\"text-6xl\" />");
        newLines.push("                                    </div>");
        newLines.push("                                  </button>");
        newLines.push("                                ))}");
        newLines.push("                              </div>");
        newLines.push("                            </div>");
        newLines.push("                          )}");
        let j = i + 1;
        while(j < lines.length && !lines[j].includes("{/* 發音題與閱讀理解排版 */}")) {
            j++;
        }
        i = j - 1; // skip all old stroke ui
    } else if (lines[i].includes("q?.type !== 'stroke'")) {
        newLines.push(lines[i].replace("'stroke'", "'cloze'"));
    } else {
        newLines.push(lines[i]);
    }
    i++;
}

fs.writeFileSync('src/App.tsx', newLines.join('\n'));
console.log('App.tsx patched successfully');
