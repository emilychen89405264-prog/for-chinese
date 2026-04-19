/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Save, LogOut, ChevronLeft, Volume2, Star, Lock, Trophy, CheckCircle } from 'lucide-react';

// --- 直式注音渲染組件 ---
const VerticalRuby = ({ c, z, fontSize = "text-5xl" }) => {
  const rtSize = (fontSize === 'text-2xl' || fontSize === 'text-3xl') ? 'text-sm' : 'text-lg';
  return (
    <div style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }} className="flex items-center justify-center">
      <ruby className="ruby-vertical">
        <span className={`${fontSize} font-black text-white leading-none`}>{c}</span>
        <rt className={`${rtSize} font-bold text-orange-400 pr-1 tracking-widest`}>{z}</rt>
      </ruby>
    </div>
  );
};

// 小助手：快速生成注音陣列
const R = (str, zStr) => {
  const chars = str.split('');
  const zuyins = zStr ? zStr.split(' ') : [];
  return chars.map((c, i) => ({ c, z: zuyins[i] || '' }));
};

// 小助手：陣列隨機洗牌
const shuffleArray = (array) => {
  let newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

// --- 綜合大題庫數據 ---
const GRADE_DATA = {
  '一年級': {
    chars: [
      {c:'貓',z:'ㄇㄠ'}, {c:'羊',z:'ㄧㄤˊ'}, {c:'瓜',z:'ㄍㄨㄚ'}, {c:'田',z:'ㄊㄧㄢˊ'}, {c:'紙',z:'ㄓˇ'}, 
      {c:'半',z:'ㄅㄢˋ'}, {c:'苗',z:'ㄇㄧㄠˊ'}, {c:'蘿',z:'ㄌㄨㄛˊ'}, {c:'豬',z:'ㄓㄨ'}, {c:'狗',z:'ㄍㄡˇ'},
      {c:'跑',z:'ㄆㄠˇ'}, {c:'步',z:'ㄅㄨˋ'}, {c:'寶',z:'ㄅㄠˇ'}, {c:'刀',z:'ㄉㄠ'}, {c:'島',z:'ㄉㄠˇ'},
      {c:'太',z:'ㄊㄞˋ'}, {c:'陽',z:'ㄧㄤˊ'}, {c:'雲',z:'ㄩㄣˊ'}, {c:'雨',z:'ㄩˇ'}, {c:'山',z:'ㄕㄢ'}
    ],
    matching: [
      { l: '大', r: '小', lz: 'ㄉㄚˋ', rz: 'ㄒㄧㄠˇ' }, { l: '多', r: '少', lz: 'ㄉㄨㄛ', rz: 'ㄕㄠˇ' }, { l: '上', r: '下', lz: 'ㄕㄤˋ', rz: 'ㄒㄧㄚˋ' }, { l: '來', r: '去', lz: 'ㄌㄞˊ', rz: 'ㄑㄩˋ' }, { l: '黑', r: '白', lz: 'ㄏㄟ', rz: 'ㄅㄞˊ' },
      { l: '天', r: '地', lz: 'ㄊㄧㄢ', rz: 'ㄉㄧˋ' }, { l: '左', r: '右', lz: 'ㄗㄨㄛˇ', rz: 'ㄧㄡˋ' }, { l: '前', r: '後', lz: 'ㄑㄧㄢˊ', rz: 'ㄏㄡˋ' }, { l: '長', r: '短', lz: 'ㄔㄤˊ', rz: 'ㄉㄨㄢˇ' }, { l: '高', r: '矮', lz: 'ㄍㄠ', rz: 'ㄞˇ' },
      { l: '胖', r: '瘦', lz: 'ㄆㄤˋ', rz: 'ㄕㄡˋ' }, { l: '快', r: '慢', lz: 'ㄎㄨㄞˋ', rz: 'ㄇㄢˋ' }, { l: '輕', r: '重', lz: 'ㄑㄧㄥ', rz: 'ㄓㄨㄥˋ' }, { l: '冷', r: '熱', lz: 'ㄌㄥˇ', rz: 'ㄖㄜˋ' }, { l: '早', r: '晚', lz: 'ㄗㄠˇ', rz: 'ㄨㄢˇ' },
      { l: '日', r: '夜', lz: 'ㄖˋ', rz: 'ㄧㄝˋ' }, { l: '開', r: '關', lz: 'ㄎㄞ', rz: 'ㄍㄨㄢ' }, { l: '笑', r: '哭', lz: 'ㄒㄧㄠˋ', rz: 'ㄎㄨ' }
    ],
    cloze: [
      { q: '我想___一個好夢。', options: [{c:'做',z:'ㄗㄨㄛˋ'}, {c:'作',z:'ㄗㄨㄛˋ'}, {c:'座',z:'ㄗㄨㄛˋ'}], a: 0 },
      { q: '王爺爺每天到___照顧花草。', options: [{c:'學校',z:'ㄒㄩㄝˊ ㄒㄧㄠˋ'}, {c:'鞋子',z:'ㄒㄧㄝˊ ㄗ˙'}, {c:'雪球',z:'ㄒㄩㄝˇ ㄑㄧㄡˊ'}], a: 0 },
      { q: '妹妹才兩歲，___會說簡單的詞語。', options: [{c:'只',z:'ㄓˇ'}, {c:'子',z:'ㄗˇ'}, {c:'紙',z:'ㄓˇ'}], a: 0 },
      { q: '下大雨了，大家躲到屋___去。', options: [{c:'簷',z:'ㄧㄢˊ'}, {c:'言',z:'ㄧㄢˊ'}, {c:'炎',z:'ㄧㄢˊ'}], a: 0 },
      { q: '這顆大蘋___看起來很好吃。', options: [{c:'果',z:'ㄍㄨㄛˇ'}, {c:'裹',z:'ㄍㄨㄛˇ'}, {c:'狗',z:'ㄍㄡˇ'}], a: 0 }
    ],
        reading: [
      { t: R('要是明天放假，我們就去動物園。'), q: '「要是」可以換成什麼？', options: [{c:'如果',z:'ㄖㄨˊ ㄍㄨㄛˇ'},{c:'雖然',z:'ㄙㄨㄟ ㄖㄢˊ'},{c:'但是',z:'ㄉㄢˋ ㄕˋ'}], a: 0 },
      { t: R('弟弟一回家，就跑去玩玩具。'), q: '這句話表示弟弟回家後做什麼？', options: [{c:'馬上玩玩具',z:'ㄇㄚˇ ㄕㄤˋ ㄨㄢˊ ㄨㄢˊ ㄐㄩˋ'},{c:'先寫作業',z:'ㄒㄧㄢ ㄒㄧㄝˇ ㄗㄨㄛˋ ㄧㄝˋ'},{c:'去睡覺',z:'ㄑㄩˋ ㄕㄨㄟˋ ㄐㄧㄠˋ'}], a: 0 },
      { t: R('蘋果不但好看，而且很好吃。'), q: '蘋果有什麼優點？', options: [{c:'又好看又好吃',z:'ㄧㄡˋ ㄏㄠˇ ㄎㄢˋ ㄧㄡˋ ㄏㄠˇ ㄔ'},{c:'只有好看',z:'ㄓˇ ㄧㄡˇ ㄏㄠˇ ㄎㄢˋ'},{c:'只有好吃',z:'ㄓˇ ㄧㄡˇ ㄏㄠˇ ㄔ'}], a: 0 },
      { t: R('因為下大雨，所以比賽取消了。'), q: '為什麼比賽取消了？', options: [{c:'因為下雨',z:'ㄧㄣ ㄨㄟˋ ㄒㄧㄚˋ ㄩˇ'},{c:'因為沒人',z:'ㄧㄣ ㄨㄟˋ ㄇㄟˊ ㄖㄣˊ'},{c:'因為太熱',z:'ㄧㄣ ㄨㄟˋ ㄊㄞˋ ㄖㄜˋ'}], a: 0 },
      { t: R('與其在家看電視，不如出去走走。'), q: '「不如」表示什麼？', options: [{c:'比較好',z:'ㄅㄧˇ ㄐㄧㄠˋ ㄏㄠˇ'},{c:'比較差',z:'ㄅㄧˇ ㄐㄧㄠˋ ㄔㄚ'},{c:'一樣好',z:'ㄧˊ ㄧㄤˋ ㄏㄠˇ'}], a: 0 }
    ]
  },
  '二年級': {
    chars: [
      {c:'雲',z:'ㄩㄣˊ'}, {c:'傘',z:'ㄙㄢˇ'}, {c:'紹',z:'ㄕㄠˋ'}, {c:'介',z:'ㄐㄧㄝˋ'}, {c:'戴',z:'ㄉㄞˋ'}, 
      {c:'冒',z:'ㄇㄠˋ'}, {c:'勇',z:'ㄩㄥˇ'}, {c:'筆',z:'ㄅㄧˇ'}, {c:'呼',z:'ㄏㄨ'}, {c:'招',z:'ㄓㄠ'},
      {c:'樹',z:'ㄕㄨˋ'}, {c:'點',z:'ㄉㄧㄢˇ'}, {c:'線',z:'ㄒㄧㄢˋ'}, {c:'冰',z:'ㄅㄧㄥ'}, {c:'屋',z:'ㄨ'},
      {c:'果',z:'ㄍㄨㄛˇ'}, {c:'園',z:'ㄩㄢˊ'}, {c:'秋',z:'ㄑㄧㄡ'}, {c:'天',z:'ㄊㄧㄢ'}, {c:'葉',z:'ㄧㄝˋ'}
    ],
    matching: [
      { l: '打招呼', r: '問候', lz: 'ㄉㄚˇ ㄓㄠ ㄏㄨ', rz: 'ㄨㄣˋ ㄏㄡˋ' }, { l: '撐開', r: '合起', lz: 'ㄔㄥ ㄎㄞ', rz: 'ㄏㄜˊ ㄑㄧˇ' }, { l: '害怕', r: '勇敢', lz: 'ㄏㄞˋ ㄆㄚˋ', rz: 'ㄩㄥˇ ㄍㄢˇ' }, { l: '裡面', r: '外面', lz: 'ㄌㄧˇ ㄇㄧㄢˋ', rz: 'ㄨㄞˋ ㄇㄧㄢˋ' }, { l: '高興', r: '傷心', lz: 'ㄍㄠ ㄒㄧㄥˋ', rz: 'ㄕㄤ ㄒㄧㄣ' },
      { l: '冰涼', r: '溫暖', lz: 'ㄅㄧㄥ ㄌㄧㄤˊ', rz: 'ㄨㄣ ㄋㄨㄢˇ' }, { l: '安靜', r: '吵鬧', lz: 'ㄢ ㄐㄧㄥˋ', rz: 'ㄔㄠˇ ㄋㄠˋ' }, { l: '黑暗', r: '明亮', lz: 'ㄏㄟ ㄢˋ', rz: 'ㄇㄧㄥˊ ㄌㄧㄤˋ' }, { l: '喜歡', r: '討厭', lz: 'ㄒㄧˇ ㄏㄨㄢ', rz: 'ㄊㄠˇ ㄧㄢˋ' }, { l: '開始', r: '結束', lz: 'ㄎㄞ ㄕˇ', rz: 'ㄐㄧㄝˊ ㄕㄨˋ' },
      { l: '朋友', r: '敵人', lz: 'ㄆㄥˊ ㄧㄡˇ', rz: 'ㄉㄧˊ ㄖㄣˊ' }, { l: '美麗', r: '醜陋', lz: 'ㄇㄟˇ ㄌㄧˋ', rz: 'ㄔㄡˇ ㄌㄡˋ' }, { l: '早晨', r: '夜晚', lz: 'ㄗㄠˇ ㄔㄣˊ', rz: 'ㄧㄝˋ ㄨㄢˇ' }, { l: '天空', r: '地面', lz: 'ㄊㄧㄢ ㄎㄨㄥ', rz: 'ㄉㄧˋ ㄇㄧㄢˋ' }, { l: '進步', r: '退步', lz: 'ㄐㄧㄣˋ ㄅㄨˋ', rz: 'ㄊㄨㄟˋ ㄅㄨˋ' }
    ],
    cloze: [
      { q: '弟弟很快就猜到___案了。', options: [{c:'答',z:'ㄉㄚˊ'}, {c:'打',z:'ㄉㄚˇ'}, {c:'搭',z:'ㄉㄚ'}], a: 0 },
      { q: '小明不小心把書包___忘在操場上。', options: [{c:'遺',z:'ㄧˊ'}, {c:'疑',z:'ㄧˊ'}, {c:'移',z:'ㄧˊ'}], a: 0 },
      { q: '店員___切的向客人問好。', options: [{c:'親',z:'ㄑㄧㄣ'}, {c:'輕',z:'ㄑㄧㄥ'}, {c:'青',z:'ㄑㄧㄥ'}], a: 0 },
      { q: '___天到了，樹葉都變黃了。', options: [{c:'秋',z:'ㄑㄧㄡ'}, {c:'丘',z:'ㄑㄧㄡ'}, {c:'求',z:'ㄑㄧㄡˊ'}], a: 0 },
      { q: '媽媽買了好多水___給我吃。', options: [{c:'果',z:'ㄍㄨㄛˇ'}, {c:'狗',z:'ㄍㄡˇ'}, {c:'過',z:'ㄍㄨㄛˋ'}], a: 0 }
    ],
        reading: [
      { t: R('只要不下雨，就可以到操場打球。'), q: '「只要…就…」可以換成哪一組語詞？', options: [{c:'如果…就…',z:'ㄖㄨˊ ㄍㄨㄛˇ ㄐㄧㄡˋ'},{c:'雖然…就…',z:'ㄙㄨㄟ ㄖㄢˊ ㄐㄧㄡˋ'},{c:'但是…就…',z:'ㄉㄢˋ ㄕˋ ㄐㄧㄡˋ'}], a: 0 },
      { t: R('這本書雖然很厚，但他還是看完了。'), q: '「雖然…還是…」可以換成什麼？', options: [{c:'儘管…還…',z:'ㄐㄧㄣˇ ㄍㄨㄢˇ ㄏㄞˊ'},{c:'因為…所以…',z:'ㄧㄣ ㄨㄟˋ ㄙㄨㄛˇ ㄧˇ'},{c:'只要…就…',z:'ㄓˇ ㄧㄠˋ ㄐㄧㄡˋ'}], a: 0 },
      { t: R('與其一直抱怨，不如動手幫忙。'), q: '這句話希望對方怎麼做？', options: [{c:'幫忙',z:'ㄅㄤ ㄇㄤˊ'},{c:'抱怨',z:'ㄅㄠˋ ㄩㄢˋ'},{c:'休息',z:'ㄒㄧㄡ ㄒㄧ'}], a: 0 },
      { t: R('他高興得跳了起來。'), q: '「高興得」後面接的動作表示什麼？', options: [{c:'高興的程度',z:'ㄍㄠ ㄒㄧㄥˋ ㄉㄜ˙ ㄔㄥˊ ㄉㄨˋ'},{c:'高興的原因',z:'ㄍㄠ ㄒㄧㄥˋ ㄉㄜ˙ ㄩㄢˊ ㄧㄣ'},{c:'高興的時間',z:'ㄍㄠ ㄒㄧㄥˋ ㄉㄜ˙ ㄕˊ ㄐㄧㄢ'}], a: 0 },
      { t: R('連這麼簡單的題目，他都不會。'), q: '這句話強調什麼？', options: [{c:'題目很簡單',z:'ㄊㄧˊ ㄇㄨˋ ㄏㄣˇ ㄐㄧㄢˇ ㄉㄢ'},{c:'題目很難',z:'ㄊㄧˊ ㄇㄨˋ ㄏㄣˇ ㄋㄢˊ'},{c:'大家都不會',z:'ㄉㄚˋ ㄐㄧㄚ ㄉㄡ ㄅㄨˊ ㄏㄨㄟˋ'}], a: 0 }
    ]
  },
  '三年級': {
    chars: [
      {c:'鐵',z:'ㄊㄧㄝˇ'}, {c:'環',z:'ㄏㄨㄢˊ'}, {c:'搓',z:'ㄘㄨㄛ'}, {c:'洗',z:'ㄒㄧˇ'}, {c:'膠',z:'ㄐㄧㄠ'}, 
      {c:'闊',z:'ㄎㄨㄛˋ'}, {c:'彈',z:'ㄊㄢˊ'}, {c:'鹽',z:'ㄧㄢˊ'}, {c:'潛',z:'ㄑㄧㄢˊ'}, {c:'染',z:'ㄖㄢˇ'},
      {c:'蒸',z:'ㄓㄥ'}, {c:'寄',z:'ㄐㄧˋ'}, {c:'妙',z:'ㄇㄧㄠˋ'}, {c:'鏡',z:'ㄐㄧㄥˋ'}, {c:'術',z:'ㄕㄨˋ'}
    ],
    matching: [
      { l: '寬闊', r: '狹窄', lz: 'ㄎㄨㄢ ㄎㄨㄛˋ', rz: 'ㄒㄧㄚˊ ㄓㄞˇ' }, { l: '開心', r: '難過', lz: 'ㄎㄞ ㄒㄧㄣ', rz: 'ㄋㄢˊ ㄍㄨㄛˋ' }, { l: '炎熱', r: '寒冷', lz: 'ㄧㄢˊ ㄖㄜˋ', rz: 'ㄏㄢˊ ㄌㄥˇ' }, { l: '透明', r: '混濁', lz: 'ㄊㄡˋ ㄇㄧㄥˊ', rz: 'ㄏㄨㄣˋ ㄓㄨㄛˊ' }, { l: '巨大', r: '微小', lz: 'ㄐㄩˋ ㄉㄚˋ', rz: 'ㄨㄟˊ ㄒㄧㄠˇ' },
      { l: '聰明', r: '愚笨', lz: 'ㄘㄨㄥ ㄇㄧㄥˊ', rz: 'ㄩˊ ㄅㄣˋ' }, { l: '神氣', r: '膽怯', lz: 'ㄕㄣˊ ㄑㄧˋ', rz: 'ㄉㄢˇ ㄑㄩㄝˋ' }, { l: '熱鬧', r: '冷清', lz: 'ㄖㄜˋ ㄋㄠˋ', rz: 'ㄌㄥˇ ㄑㄧㄥ' }, { l: '安全', r: '危險', lz: 'ㄢ ㄑㄩㄢˊ', rz: 'ㄨㄟˊ ㄒㄧㄢˇ' }, { l: '保護', r: '破壞', lz: 'ㄅㄠˇ ㄏㄨˋ', rz: 'ㄆㄛˋ ㄏㄨㄞˋ' },
      { l: '柔軟', r: '堅硬', lz: 'ㄖㄡˊ ㄖㄨㄢˇ', rz: 'ㄐㄧㄢ ㄧㄥˋ' }, { l: '乾燥', r: '潮濕', lz: 'ㄍㄢ ㄗㄠˋ', rz: 'ㄔㄠˊ ㄕ' }, { l: '勝利', r: '落敗', lz: 'ㄕㄥˋ ㄌㄧˋ', rz: 'ㄌㄨㄛˋ ㄅㄞˋ' }, { l: '豐富', r: '貧乏', lz: 'ㄈㄥ ㄈㄨˋ', rz: 'ㄆㄧㄣˊ ㄈㄚˊ' }, { l: '虛幻', r: '真實', lz: 'ㄒㄩ ㄏㄨㄢˋ', rz: 'ㄓㄣ ㄕˊ' }
    ],
    cloze: [
      { q: '他是一個___敢的人。', options: [{c:'勇',z:'ㄩㄥˇ'}, {c:'永',z:'ㄩㄥˇ'}, {c:'泳',z:'ㄩㄥˇ'}], a: 0 },
      { q: '這裡的風景真___人。', options: [{c:'迷',z:'ㄇㄧˊ'}, {c:'謎',z:'ㄇㄧˊ'}, {c:'米',z:'ㄇㄧˇ'}], a: 0 },
      { q: '他是一位有名的___師。', options: [{c:'廚',z:'ㄔㄨˊ'}, {c:'除',z:'ㄔㄨˊ'}, {c:'儲',z:'ㄔㄨˊ'}], a: 0 },
      { q: '我們去海邊___水。', options: [{c:'潛',z:'ㄑㄧㄢˊ'}, {c:'錢',z:'ㄑㄧㄢˊ'}, {c:'前',z:'ㄑㄧㄢˊ'}], a: 0 },
      { q: '這是一隻___麗的蝴蝶。', options: [{c:'美',z:'ㄇㄟˇ'}, {c:'每',z:'ㄇㄟˇ'}, {c:'妹',z:'ㄇㄟˋ'}], a: 0 }
    ],
        reading: [
      { t: R('無論天氣多麼惡劣，郵差都會送信。'), q: '「無論…都…」可以換成什麼？', options: [{c:'不管…都…',z:''},{c:'即使…也…',z:''},{c:'如果…就…',z:''}], a: 0 },
      { t: R('與其在旁邊生氣，不如想辦法解決。'), q: '說這句話的人建議怎麼做？', options: [{c:'想辦法解決',z:''},{c:'繼續生氣',z:''},{c:'離開現場',z:''}], a: 0 },
      { t: R('這座山不但很高，而且非常陡峭。'), q: '「不但…而且…」表示什麼關係？', options: [{c:'遞進關係',z:''},{c:'轉折關係',z:''},{c:'條件關係',z:''}], a: 0 },
      { t: R('即使失敗了，我們也不能放棄。'), q: '「即使…也…」可以換成什麼？', options: [{c:'就算…也…',z:''},{c:'因為…所以…',z:''},{c:'只要…就…',z:''}], a: 0 },
      { t: R('他跑得飛快，像一陣旋風。'), q: '這句話使用了什麼修辭？', options: [{c:'譬喻',z:''},{c:'擬人',z:''},{c:'誇飾',z:''}], a: 0 }
    ]
  },
  '四年級': {
    chars: [
      {c:'欒',z:'ㄌㄨㄢˊ'}, {c:'雀',z:'ㄑㄩㄝˋ'}, {c:'粥',z:'ㄓㄡ'}, {c:'偶',z:'ㄡˇ'}, {c:'蹈',z:'ㄉㄠˋ'}, 
      {c:'蛻',z:'ㄊㄨㄟˋ'}, {c:'肢',z:'ㄓ'}, {c:'裂',z:'ㄌㄧㄝˋ'}, {c:'康',z:'ㄎㄤ'}, {c:'喵',z:'ㄇㄧㄠ'},
      {c:'湖',z:'ㄏㄨˊ'}, {c:'智',z:'ㄓˋ'}, {c:'慧',z:'ㄏㄨㄟˋ'}, {c:'幻',z:'ㄏㄨㄢˋ'}, {c:'疊',z:'ㄉㄧㄝˊ'}
    ],
    matching: [
      { l: '完美', r: '缺陷', lz: 'ㄨㄢˊ ㄇㄟˇ', rz: 'ㄑㄩㄝ ㄒㄧㄢˋ' }, { l: '輕薄', r: '厚重', lz: 'ㄑㄧㄥ ㄅㄛˊ', rz: 'ㄏㄡˋ ㄓㄨㄥˋ' }, { l: '新鮮', r: '腐敗', lz: 'ㄒㄧㄣ ㄒㄧㄢ', rz: 'ㄈㄨˇ ㄅㄞˋ' }, { l: '前進', r: '後退', lz: 'ㄑㄧㄢˊ ㄐㄧㄣˋ', rz: 'ㄏㄡˋ ㄊㄨㄟˋ' }, { l: '清澈', r: '混濁', lz: 'ㄑㄧㄥ ㄔㄜˋ', rz: 'ㄏㄨㄣˋ ㄓㄨㄛˊ' },
      { l: '特別', r: '普通', lz: 'ㄊㄜˋ ㄅㄧㄝˊ', rz: 'ㄆㄨˇ ㄊㄨㄥ' }, { l: '消失', r: '出現', lz: 'ㄒㄧㄠ ㄕ', rz: 'ㄔㄨ ㄒㄧㄢˋ' }, { l: '困難', r: '容易', lz: 'ㄎㄨㄣˋ ㄋㄢˊ', rz: 'ㄖㄨㄥˊ ㄧˋ' }, { l: '堅強', r: '脆弱', lz: 'ㄐㄧㄢ ㄑㄧㄤˊ', rz: 'ㄘㄨㄟˋ ㄖㄨㄛˋ' }, { l: '驕傲', r: '謙虛', lz: 'ㄐㄧㄠ ㄠˋ', rz: 'ㄑㄧㄢ ㄒㄩ' },
      { l: '集中', r: '分散', lz: 'ㄐㄧ ㄓㄨㄥ', rz: 'ㄈㄣ ㄙㄢˋ' }, { l: '浪費', r: '節省', lz: 'ㄌㄤˋ ㄈㄟˋ', rz: 'ㄐㄧㄝˊ ㄕㄥˇ' }, { l: '熟悉', r: '陌生', lz: 'ㄕㄡˊ ㄒㄧ', rz: 'ㄇㄛˋ ㄕㄥ' }, { l: '複雜', r: '簡單', lz: 'ㄈㄨˋ ㄗㄚˊ', rz: 'ㄐㄧㄢˇ ㄉㄢ' }, { l: '鼓勵', r: '打擊', lz: 'ㄍㄨˇ ㄌㄧˋ', rz: 'ㄉㄚˇ ㄐㄧˊ' }
    ],
    cloze: [
      { q: '老師___導我們要做一個誠實的孩子。', options: [{c:'教',z:'ㄐㄧㄠˋ'}, {c:'交',z:'ㄐㄧㄠ'}, {c:'叫',z:'ㄐㄧㄠˋ'}], a: 0 },
      { q: '這次的考試，他表現得非常___出。', options: [{c:'傑',z:'ㄐㄧㄝˊ'}, {c:'節',z:'ㄐㄧㄝˊ'}, {c:'結',z:'ㄐㄧㄝˊ'}], a: 0 },
      { q: '我們要___惜水資源，不可以浪費。', options: [{c:'珍',z:'ㄓㄣ'}, {c:'真',z:'ㄓㄣ'}, {c:'針',z:'ㄓㄣ'}], a: 0 },
      { q: '布袋戲是臺灣的傳___戲劇。', options: [{c:'統',z:'ㄊㄨㄥˇ'}, {c:'桶',z:'ㄊㄨㄥˇ'}, {c:'痛',z:'ㄊㄨㄥˋ'}], a: 0 },
      { q: '這真是一個大___奇。', options: [{c:'驚',z:'ㄐㄧㄥ'}, {c:'經',z:'ㄐㄧㄥ'}, {c:'精',z:'ㄐㄧㄥ'}], a: 0 }
    ],
        reading: [
      { t: R('既然你已經決定了，就放手去做吧。'), q: '「既然…就…」表示什麼？', options: [{c:'基於事實給建議',z:''},{c:'假設一種情況',z:''},{c:'表示轉折語氣',z:''}], a: 0 },
      { t: R('寧可自己吃虧，也不願傷害朋友。'), q: '「寧可…也不…」表示什麼？', options: [{c:'兩者中取其一',z:''},{c:'兩者都不要',z:''},{c:'兩者都要',z:''}], a: 0 },
      { t: R('與其把時間浪費在打遊戲，不如多看書。'), q: '這句話強調什麼？', options: [{c:'看書更有益',z:''},{c:'遊戲很好玩',z:''},{c:'兩者都不好',z:''}], a: 0 },
      { t: R('與其羨慕別人，不如自己努力。'), q: '這句話的意思是？', options: [{c:'靠自己最實在',z:''},{c:'多羨慕別人',z:''},{c:'努力沒有用',z:''}], a: 0 },
      { t: R('因為天氣寒冷，所以大家穿上大衣。'), q: '這是一個什麼句型？', options: [{c:'因果句',z:''},{c:'條件句',z:''},{c:'轉折句',z:''}], a: 0 }
    ]
  },
  '五年級': {
    chars: [
      {c:'裙',z:'ㄑㄩㄣˊ'}, {c:'嘈',z:'ㄘㄠˊ'}, {c:'虐',z:'ㄋㄩㄝˋ'}, {c:'蚊',z:'ㄨㄣˊ'}, {c:'募',z:'ㄇㄨˋ'}, 
      {c:'筍',z:'ㄙㄨㄣˇ'}, {c:'娛',z:'ㄩˊ'}, {c:'標',z:'ㄅㄧㄠ'}, {c:'恆',z:'ㄏㄥˊ'}, {c:'喚',z:'ㄏㄨㄢˋ'},
      {c:'塑',z:'ㄙㄨˋ'}, {c:'焚',z:'ㄈㄣˊ'}, {c:'愉',z:'ㄩˊ'}, {c:'悅',z:'ㄩㄝˋ'}, {c:'瓣',z:'ㄅㄢˋ'}
    ],
    matching: [
      { l: '短暫', r: '永恆', lz: 'ㄉㄨㄢˇ ㄓㄢˋ', rz: 'ㄩㄥˇ ㄏㄥˊ' }, { l: '忙碌', r: '空閒', lz: 'ㄇㄤˊ ㄌㄨˋ', rz: 'ㄎㄨㄥ ㄒㄧㄢˊ' }, { l: '驚奇', r: '平凡', lz: 'ㄐㄧㄥ ㄑㄧˊ', rz: 'ㄆㄧㄥˊ ㄈㄢˊ' }, { l: '創新', r: '守舊', lz: 'ㄔㄨㄤˋ ㄒㄧㄣ', rz: 'ㄕㄡˇ ㄐㄧㄡˋ' }, { l: '堅毅', r: '軟弱', lz: 'ㄐㄧㄢ ㄧˋ', rz: 'ㄖㄨㄢˇ ㄖㄨㄛˋ' },
      { l: '殘酷', r: '仁慈', lz: 'ㄘㄢˊ ㄎㄨˋ', rz: 'ㄖㄣˊ ㄘˊ' }, { l: '模糊', r: '清晰', lz: 'ㄇㄛˊ ㄏㄨˊ', rz: 'ㄑㄧㄥ ㄒㄧ' }, { l: '污染', r: '環保', lz: 'ㄨ ㄖㄢˇ', rz: 'ㄏㄨㄢˊ ㄅㄠˇ' }, { l: '拒絕', r: '接受', lz: 'ㄐㄩˋ ㄐㄩㄝˊ', rz: 'ㄐㄧㄝ ㄕㄡˋ' }, { l: '嚴格', r: '寬鬆', lz: 'ㄧㄢˊ ㄍㄜˊ', rz: 'ㄎㄨㄢ ㄙㄨㄥ' },
      { l: '貧窮', r: '富裕', lz: 'ㄆㄧㄣˊ ㄑㄩㄥˊ', rz: 'ㄈㄨˋ ㄩˋ' }, { l: '悲觀', r: '樂觀', lz: 'ㄅㄟ ㄍㄨㄢ', rz: 'ㄌㄜˋ ㄍㄨㄢ' }, { l: '集中', r: '忽視', lz: 'ㄐㄧ ㄓㄨㄥ', rz: 'ㄏㄨ ㄕˋ' }, { l: '粗糙', r: '精緻', lz: 'ㄘㄨ ㄘㄠ', rz: 'ㄐㄧㄥ ㄓˋ' }, { l: '獨立', r: '依賴', lz: 'ㄉㄨˊ ㄌㄧˋ', rz: 'ㄧ ㄌㄞˋ' }
    ],
    cloze: [
      { q: '他的成績非常___異。', options: [{c:'優',z:'ㄧㄡ'}, {c:'悠',z:'ㄧㄡ'}, {c:'幽',z:'ㄧㄡ'}], a: 0 },
      { q: '這是一個___大的計畫，需要多人合作。', options: [{c:'龐',z:'ㄆㄤˊ'}, {c:'旁',z:'ㄆㄤˊ'}, {c:'螃',z:'ㄆㄤˊ'}], a: 0 },
      { q: '他那___尚的行為，贏得了大家的讚賞。', options: [{c:'高',z:'ㄍㄠ'}, {c:'糕',z:'ㄍㄠ'}, {c:'膏',z:'ㄍㄠ'}], a: 0 },
      { q: '我們應該要___絕浪費食物。', options: [{c:'拒',z:'ㄐㄩˋ'}, {c:'具',z:'ㄐㄩˋ'}, {c:'聚',z:'ㄐㄩˋ'}], a: 0 },
      { q: '這朵花的花___掉落了。', options: [{c:'瓣',z:'ㄅㄢˋ'}, {c:'半',z:'ㄅㄢˋ'}, {c:'伴',z:'ㄅㄢˋ'}], a: 0 }
    ],
        reading: [
      { t: R('與其把錢花在奢侈品上，不如幫助別人。'), q: '「與其…不如…」是哪種句型？', options: [{c:'選擇句',z:''},{c:'假設句',z:''},{c:'條件句',z:''}], a: 0 },
      { t: R('縱使前方的路再崎嶇，我也要走下去。'), q: '「縱使…也…」可以替換為？', options: [{c:'即使…也…',z:''},{c:'因為…所以…',z:''},{c:'既然…就…',z:''}], a: 0 },
      { t: R('與其紙上談兵，不如親身實踐。'), q: '這句話的意思最接近哪一項？', options: [{c:'坐而言不如起而行',z:''},{c:'三思而後行',z:''},{c:'知足常樂',z:''}], a: 0 },
      { t: R('唯有不斷努力，才能獲得最終的勝利。'), q: '「唯有…才…」強調什麼？', options: [{c:'唯一的條件',z:''},{c:'多種選擇',z:''},{c:'相反的結果',z:''}], a: 0 },
      { t: R('他與其說是不會，不如說是不想做。'), q: '這句話認為真正的問題是？', options: [{c:'不想做',z:''},{c:'不會做',z:''},{c:'不敢做',z:''}], a: 0 }
    ]
  },
  '六年級': {
    chars: [
      {c:'艱',z:'ㄐㄧㄢ'}, {c:'難',z:'ㄋㄢˊ'}, {c:'奮',z:'ㄈㄣˋ'}, {c:'鬥',z:'ㄉㄡˋ'}, {c:'精',z:'ㄐㄧㄥ'}, 
      {c:'緻',z:'ㄓˋ'}, {c:'探',z:'ㄊㄢˋ'}, {c:'索',z:'ㄙㄨㄛˇ'}, {c:'卓',z:'ㄓㄨㄛˊ'}, {c:'越',z:'ㄩㄝˋ'},
      {c:'輝',z:'ㄏㄨㄟ'}, {c:'煌',z:'ㄏㄨㄤˊ'}, {c:'犧',z:'ㄒㄧ'}, {c:'牲',z:'ㄕㄥ'}, {c:'奉',z:'ㄈㄥˋ'}
    ],
    matching: [
      { l: '卓越', r: '平庸', lz: 'ㄓㄨㄛˊ ㄩㄝˋ', rz: 'ㄆㄧㄥˊ ㄩㄥ' }, { l: '謙虛', r: '驕傲', lz: 'ㄑㄧㄢ ㄒㄩ', rz: 'ㄐㄧㄠ ㄠˋ' }, { l: '豐沛', r: '枯竭', lz: 'ㄈㄥ ㄆㄟˋ', rz: 'ㄎㄨ ㄐㄧㄝˊ' }, { l: '開拓', r: '守舊', lz: 'ㄎㄞ ㄊㄨㄛˋ', rz: 'ㄕㄡˇ ㄐㄧㄡˋ' }, { l: '積極', r: '消極', lz: 'ㄐㄧ ㄐㄧˊ', rz: 'ㄒㄧㄠ ㄐㄧˊ' },
      { l: '輝煌', r: '黯淡', lz: 'ㄏㄨㄟ ㄏㄨㄤˊ', rz: 'ㄢˋ ㄉㄢˋ' }, { l: '犧牲', r: '獲取', lz: 'ㄒㄧ ㄕㄥ', rz: 'ㄏㄨㄛˋ ㄑㄩˇ' }, { l: '誠實', r: '虛偽', lz: 'ㄔㄥˊ ㄕˊ', rz: 'ㄒㄩ ㄨㄟˊ' }, { l: '團結', r: '分裂', lz: 'ㄊㄨㄢˊ ㄐㄧㄝˊ', rz: 'ㄈㄣ ㄌㄧㄝˋ' }, { l: '寬容', r: '計較', lz: 'ㄎㄨㄢ ㄖㄨㄥˊ', rz: 'ㄐㄧˋ ㄐㄧㄠˋ' },
      { l: '敏捷', r: '遲鈍', lz: 'ㄇㄧㄣˇ ㄐㄧㄝˊ', rz: 'ㄔˊ ㄉㄨㄣˋ' }, { l: '繁榮', r: '蕭條', lz: 'ㄈㄢˊ ㄖㄨㄥˊ', rz: 'ㄒㄧㄠ ㄊㄧㄠˊ' }, { l: '堅定', r: '動搖', lz: 'ㄐㄧㄢ ㄉㄧㄥˋ', rz: 'ㄉㄨㄥˋ ㄧㄠˊ' }, { l: '偉大', r: '渺小', lz: 'ㄨㄟˇ ㄉㄚˋ', rz: 'ㄇㄧㄠˇ ㄒㄧㄠˇ' }, { l: '讚賞', r: '批評', lz: 'ㄗㄢˋ ㄕㄤˇ', rz: 'ㄆㄧ ㄆㄧㄥˊ' }
    ],
    cloze: [
      { q: '他的生活___倒，經常熬夜。', options: [{c:'顛',z:'ㄉㄧㄢ'}, {c:'巔',z:'ㄉㄧㄢ'}, {c:'店',z:'ㄉㄧㄢˋ'}], a: 0 },
      { q: '這場比賽___人心弦，非常精彩。', options: [{c:'扣',z:'ㄎㄡˋ'}, {c:'蔻',z:'ㄎㄡˋ'}, {c:'口',z:'ㄎㄡˇ'}], a: 0 },
      { q: '面對困難，我們不能___縮。', options: [{c:'畏',z:'ㄨㄟˋ'}, {c:'餵',z:'ㄨㄟˋ'}, {c:'味',z:'ㄨㄟˋ'}], a: 0 },
      { q: '他是一位___越的領導者。', options: [{c:'卓',z:'ㄓㄨㄛˊ'}, {c:'茁',z:'ㄓㄨㄛˊ'}, {c:'濁',z:'ㄓㄨㄛˊ'}], a: 0 },
      { q: '我們要保持___虛的態度。', options: [{c:'謙',z:'ㄑㄧㄢ'}, {c:'千',z:'ㄑㄧㄢ'}, {c:'牽',z:'ㄑㄧㄢ'}], a: 0 }
    ],
        reading: [
      { t: R('與其隨波逐流，不如堅守自己的信念。'), q: '作者鼓勵我們怎麼做？', options: [{c:'堅守信念',z:''},{c:'隨波逐流',z:''},{c:'與人衝突',z:''}], a: 0 },
      { t: R('與其臨淵羨魚，不如退而結網。'), q: '這句成語告訴我們什麼道理？', options: [{c:'要付諸行動',z:''},{c:'要羨慕別人',z:''},{c:'要去抓魚',z:''}], a: 0 },
      { t: R('倘若我們不愛護環境，地球將面臨危機。'), q: '「倘若」可以換成什麼？', options: [{c:'如果',z:''},{c:'雖然',z:''},{c:'但是',z:''}], a: 0 },
      { t: R('與其期待奇蹟出現，不如腳踏實地。'), q: '這句話強調什麼態度？', options: [{c:'務實',z:''},{c:'幻想',z:''},{c:'悲觀',z:''}], a: 0 },
      { t: R('寧為玉碎，不為瓦全。'), q: '這句話表現出什麼精神？', options: [{c:'寧死不屈',z:''},{c:'苟且偷生',z:''},{c:'委曲求全',z:''}], a: 0 }
    ]
  }
};

const PRACTICE_TYPES = ['發音識字', '單字填空', '詞彙語法', '閱讀理解'];
const BOSS_TYPES = ['初級魔王', '進階魔王', '終極魔王'];
const SAVE_KEY = 'dream_academy_saves_vFINAL';

export default function App() {
  const [state, setState] = useState({ playerName: '', stars: 0 });
  const [view, setView] = useState('home');
  const [selectedGrade, setSelectedGrade] = useState('一年級');
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const [stage, setStage] = useState(1);
  const [completedPractices, setCompletedPractices] = useState([]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [matchRound, setMatchRound] = useState(0);
  const [leftActive, setLeftActive] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  
  const [isNameEntered, setIsNameEntered] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  
  // 獨立過關提示狀態，防止黑屏並給予玩家回饋
  const [showSuccessMessage, setShowSuccessMessage] = useState(null);
  const [sessionKey, setSessionKey] = useState(0); // 用來鎖定該局洗牌，防止中途亂跳
  const [hasListened, setHasListened] = useState(false);

  useEffect(() => {
    setHasListened(false);
  }, [currentIdx, selectedCategory]);

  const GAME_BG = "https://raw.githubusercontent.com/emilychen89405264-prog/for-chinese/main/BG_1.png";

  const speak = (text) => {
    if (typeof window === 'undefined') return;
    setHasListened(true);
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-TW'; u.rate = 0.8; window.speechSynthesis.speak(u);
  };

  const handleExitClick = (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    setShowExitModal(true);
  };

  const executeExit = () => {
    setShowExitModal(false);
    setIsNameEntered(false); 
    setState(p => ({ ...p, playerName: '' }));
    setSelectedCategory(null);
    setTimeout(() => setView('home'), 500); 
  };

  // 自動存檔小助手 (支援同年級進度獨立保存與舊格式自動修復)
  const autoSave = (newStars, newStage, newCompletedPractices, currentGrade) => {
    const name = state.playerName.trim();
    if (!name) return;
    const allSaves = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
    
    if (!allSaves[name]) allSaves[name] = { globalStars: 0, grades: {} };
    
    allSaves[name].globalStars = newStars;
    if(!allSaves[name].grades) allSaves[name].grades = {};
    
    allSaves[name].grades[currentGrade] = {
        stage: newStage,
        completedPractices: newCompletedPractices
    };

    localStorage.setItem(SAVE_KEY, JSON.stringify(allSaves));
  };

  // 讀取玩家進度 (兼容舊版沒有分年級的存檔)
  const loadPlayerData = (playerName, grade) => {
    const allSaves = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
    const savedData = allSaves[playerName];
    
    if (savedData) {
      // 舊版存檔相容性處理：如果沒有 grades 物件，幫他把舊進度歸類到一年級
      if (!savedData.grades) {
          savedData.grades = {};
          savedData.grades['一年級'] = {
              stage: savedData.stage || 1,
              completedPractices: savedData.completedPractices || []
          };
          savedData.globalStars = savedData.stars || 0;
          localStorage.setItem(SAVE_KEY, JSON.stringify(allSaves));
      }

      setState(p => ({ ...p, stars: savedData.globalStars || 0 }));
      const gradeData = savedData.grades[grade] || { stage: 1, completedPractices: [] };
      setStage(gradeData.stage);
      setCompletedPractices(gradeData.completedPractices);
      return true; // 老玩家
    } else {
      setState(p => ({ ...p, stars: 0 }));
      setStage(1);
      setCompletedPractices([]);
      return false; // 新玩家
    }
  };

  const handleLogin = () => {
    const name = state.playerName.trim();
    if (!name) return;
    const isOldPlayer = loadPlayerData(name, selectedGrade);
    if (isOldPlayer) {
        alert(`歡迎回來，${name}！已為您載入進度。`);
    } else {
        alert(`歡迎新冒險者，${name}！`);
    }
    setIsNameEntered(true);
    setView('map');
  };

  const saveGame = (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    autoSave(state.stars, stage, completedPractices, selectedGrade);
    alert('✅ 冒險進度已存檔成功！');
    confetti({ particleCount: 30 });
  };

  const handleGradeSelect = (grade) => {
    setSelectedGrade(grade);
    loadPlayerData(state.playerName.trim(), grade);
    setView('level-detail');
  };

  const handleCategoryClick = (cat) => {
    if (PRACTICE_TYPES.includes(cat)) {
      if (completedPractices.includes(cat)) {
        alert('✅ 本階段已完成此練習！請挑戰其他項目或準備打魔王。');
        return;
      }
      setSelectedCategory(cat);
      setCurrentIdx(0);
      setMatchRound(0);
      setLeftActive(null);
      setMatchedPairs([]);
      setShowSuccessMessage(null);
      setSessionKey(Date.now()); // 產生新的會話鎖，鎖定本次隨機題目
      setView('battle');
    } else {
      const bossIdx = BOSS_TYPES.indexOf(cat) + 1;
      if (bossIdx < stage) {
        alert('🎉 這個魔王已經被你打敗囉！繼續往下一階段前進吧！');
        return;
      }
      if (bossIdx > stage) {
        alert('🔒 你必須先打敗前面的魔王才能挑戰他！');
        return;
      }
      if (completedPractices.length < 4) {
        alert('⚠️ 需先完成畫面上方【四個練習題】，累積足夠實力才能挑戰魔王喔！');
        return;
      }
      setSelectedCategory(cat);
      setCurrentIdx(0);
      setShowSuccessMessage(null);
      setSessionKey(Date.now()); // 產生新的會話鎖
      setView('battle');
    }
  };

  // --- 戰鬥畫面的邏輯改為在主組件內直接運算，防止 React 重繪當機 ---

  // 完全隨機抽題與選項洗牌邏輯 (綁定 sessionKey，只有進入關卡那瞬間會洗牌)
  const questions = useMemo(() => {
    if (view !== 'battle' || !selectedCategory || selectedCategory === '詞彙語法') return [];
    
    const data = GRADE_DATA[selectedGrade];
    // 隨機選出 5 個不重複的生字與閱讀題
    const shuffledChars = shuffleArray(data.chars).slice(0, 5);
    const shuffledReading = shuffleArray(data.reading).slice(0, 5);
    const shuffledCloze = shuffleArray(data.cloze || []).slice(0, 5);

    const makeOptions = (item, isStroke = false) => {
       let w1c = isStroke ? 'ㄉㄚˋ' : '人';
       let w2c = isStroke ? 'ㄒㄧㄠˇ' : '大';
       if (isStroke) {
           if (item.z === w1c) w1c = 'ㄊㄧㄢ';
           if (item.z === w2c) w2c = 'ㄉㄧˋ';
       } else {
           if (item.c === w1c) w1c = '天';
           if (item.c === w2c) w2c = '地';
       }
       
       const wrong1 = isStroke ? { c: w1c, z: '' } : { c: w1c, z: w1c === '人' ? 'ㄖㄣˊ' : 'ㄊㄧㄢ' };
       const wrong2 = isStroke ? { c: w2c, z: '' } : { c: w2c, z: w2c === '大' ? 'ㄉㄚˋ' : 'ㄉㄧˋ' };
       
       const correct = isStroke ? { c: item.z, z: '' } : { c: item.c, z: item.z };
       const opts = shuffleArray([correct, wrong1, wrong2]); // 選項隨機打亂
       const aIdx = opts.findIndex(o => o.c === correct.c);
       return { opts, aIdx };
    };

    if (selectedCategory === '發音識字') {
      return shuffledChars.map(item => {
          const { opts, aIdx } = makeOptions(item);
          return { type: 'audio', c: item.c, z: item.z, options: opts, correctAnswer: aIdx };
      });
    }
    if (selectedCategory === '單字填空') {
      return shuffledCloze.map(item => {
          const opts = shuffleArray(item.options);
          const correctOpt = item.options[item.a];
          const aIdx = opts.findIndex(o => o.c === correctOpt.c);
          return { ...item, type: 'cloze', options: opts, correctAnswer: aIdx };
      });
    }
    if (selectedCategory === '閱讀理解') {
        return shuffledReading.map(r => {
           // 閱讀題的選項也洗牌
           const opts = shuffleArray(r.options);
           const correctOpt = r.options[r.a];
           const aIdx = opts.findIndex(o => o.c === correctOpt.c);
           return {...r, type:'reading', options: opts, a: aIdx };
        });
    }
    if (selectedCategory.includes('魔王')) {
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
    }
    return [];
  }, [selectedCategory, selectedGrade, sessionKey]);

  // 詞彙語法隨機抽取 2 輪
  const currentMatchingSet = useMemo(() => {
      if (view !== 'battle' || selectedCategory !== '詞彙語法') return { lefts: [], rights: [] };
      const data = GRADE_DATA[selectedGrade];
      const pool = shuffleArray(data.matching).slice(0, 5);
      const leftsWithId = pool.map((item, idx) => ({ ...item, uniqueId: idx }));
      const shuffledRights = shuffleArray([...leftsWithId]);
      return { lefts: leftsWithId, rights: shuffledRights };
  }, [selectedGrade, matchRound, selectedCategory, sessionKey]);

  const q = questions[currentIdx];
  const writerRef = useRef(null);

  // 完美解決黑屏：過關後先跳出恭喜畫面，由玩家手動點擊確認才切換畫面，不讓 React 當機
  const finishBattle = (latestStars) => {
    confetti({ particleCount: 150 });
    if (selectedCategory.includes('魔王')) {
      if (stage >= 3) {
        setShowSuccessMessage({
          title: '🏆 終極通關！',
          desc: '太厲害了！你已通關本年級所有挑戰！',
          btnText: '回到關卡選單',
          onConfirm: () => {
            autoSave(latestStars, stage, completedPractices, selectedGrade);
            setView('level-detail');
          }
        });
      } else {
        const nextStage = stage + 1;
        setShowSuccessMessage({
          title: '🎉 恭喜擊敗魔王！',
          desc: `即將晉級第 ${nextStage} 階段，題目已更新！`,
          btnText: '前往下一階段',
          onConfirm: () => {
            setStage(nextStage);
            setCompletedPractices([]);
            autoSave(latestStars, nextStage, [], selectedGrade);
            setView('level-detail');
          }
        });
      }
    } else {
      const isLast = !completedPractices.includes(selectedCategory) && completedPractices.length === 3;
      const newPractices = completedPractices.includes(selectedCategory) ? completedPractices : [...completedPractices, selectedCategory];
      
      setCompletedPractices(newPractices);
      autoSave(latestStars, stage, newPractices, selectedGrade);

      setShowSuccessMessage({
        title: '✅ 完成練習！',
        desc: isLast ? '獲得星星獎勵！\n🌟 實力集滿！魔王挑戰已解鎖！' : '獲得星星獎勵！繼續挑戰其他項目吧！',
        btnText: '回到關卡選單',
        onConfirm: () => {
          setView('level-detail');
        }
      });
    }
  };



  const handleAnswer = (i) => {
    if (q?.type === 'audio' && !hasListened) {
      alert('請先點擊上方按鈕「聽發音」再作答唷！');
      return;
    }
    const isCorrect = (q?.type === 'reading') ? i === q.a : i === q.correctAnswer;
    if (isCorrect) {
      confetti({ particleCount: 30 }); 
      const newStars = state.stars + 20;
      setState(p => ({ ...p, stars: newStars }));
      
      if (currentIdx < questions.length - 1) {
          setTimeout(() => setCurrentIdx(c => c + 1), 600);
      } else {
          // 等待最後一題的煙火放完再顯示過關彈窗
          setTimeout(() => finishBattle(newStars), 1200);
      }
    } else {
      alert('答錯了，沒關係，再試一次');
    }
  };

  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center overflow-hidden font-sans text-white">
      <div className="relative w-full max-w-full max-h-full aspect-video shadow-2xl">
        <AnimatePresence mode="wait">
          {!isNameEntered ? (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://raw.githubusercontent.com/emilychen89405264-prog/for-chinese/main/Homepage.png')` }}>
              <input type="text" placeholder="輸入冒險者姓名..." value={state.playerName} onChange={(e) => setState(p => ({...p, playerName: e.target.value}))} onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="absolute top-[41%] left-[43%] -translate-x-1/2 -translate-y-1/2 w-[22%] h-[8%] bg-transparent text-white text-center text-4xl font-black border-b-2 border-white/0 outline-none placeholder:text-white/0 transition-all focus:border-yellow-400/50" />
              <div onClick={handleLogin} className="absolute bottom-[18%] left-[50%] -translate-x-1/2 w-[22%] h-[12%] cursor-pointer z-50 rounded-full hover:bg-white/0 transition-all" title="開始冒險" />
            </motion.div>
          ) : (
            <motion.div key="game-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
              
              {/* 年級選單 (維持乾淨底圖) */}
              {view === 'map' && (
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://raw.githubusercontent.com/emilychen89405264-prog/for-chinese/main/Level.png')` }}>
                  
{['一年級', '二年級', '三年級', '四年級', '五年級', '六年級'].map((grade, i) => (
  <div key={grade} 
       style={{ 
         // 當 i >= 3 時，額外加上 5% 的距離
         left: `${13 + (i * 13.4) + (i >= 3 ? 7 : 0)}%`, 
         top: '48%' 
       }}
       onClick={() => handleGradeSelect(grade)}
       className="absolute w-[12%] h-[26%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-40 rounded-[2rem] hover:bg-white/0 transition-all shadow-[inset_0_0_20px_rgba(255,255,255,0)] hover:shadow-[inset_0_0_20px_rgba(255,255,255,0.0)]"
       title={`進入${grade}`} />
))}

                  <div onClick={saveGame} className="absolute bottom-[8%] left-[60%] -translate-x-1/2 w-[14%] h-[10%] cursor-pointer z-40 rounded-xl hover:bg-white/0 transition-all" title="儲存進度" />
                  <div onClick={handleExitClick} className="absolute bottom-[8%] left-[40%] -translate-x-1/2 w-[14%] h-[10%] cursor-pointer z-40 rounded-xl hover:bg-red-500/0 transition-all" title="離開冒險" />

                  {/* 退出確認彈窗 */}
                  {showExitModal && (
                    <div className="absolute inset-0 bg-black/0 z-[9999] flex items-center justify-center backdrop-blur-sm">
                      <div className="bg-[#1e293b] p-10 rounded-[30px] border-[6px] border-slate-600 shadow-2xl flex flex-col items-center">
                        <h2 className="text-4xl font-black text-yellow-400 mb-8 tracking-widest">確定要退出冒險嗎？</h2>
                        <p className="text-xl text-white mb-10 font-bold">離開前記得先點選左下角「存檔」喔！</p>
                        <div className="flex gap-8">
                          <button onClick={() => setShowExitModal(false)} className="px-8 py-4 bg-slate-600 text-white rounded-2xl border-4 border-slate-500 font-black text-2xl hover:bg-slate-500 active:scale-95 transition-all">繼續玩</button>
                          <button onClick={executeExit} className="px-8 py-4 bg-red-600 text-white rounded-2xl border-4 border-red-500 font-black text-2xl hover:bg-red-500 active:scale-95 transition-all">確定退出</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 關卡細節頁面 (第三層，維持乾淨底圖) */}
              {view === 'level-detail' && (
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://raw.githubusercontent.com/emilychen89405264-prog/for-chinese/main/Mainpage.png')` }}>
                  <button onClick={() => setView('map')} className="absolute top-4 left-4 z-[100] bg-black/60 p-2 rounded-full border border-white/4 hover:scale-110 transition-all cursor-pointer"><ChevronLeft size={30}/></button>
                  
                  {/* 第三層右上角的手動存檔按鈕 */}
                  <button onClick={saveGame} className="absolute top-4 right-4 z-[100] bg-green-600/100 p-2 rounded-full border border-white/0 hover:scale-110 transition-all cursor-pointer flex items-center gap-2 px-4 font-bold shadow-lg"><Save size={24}/> 存檔</button>

                  <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-black/80 px-10 py-3 rounded-full border-0 border-orange-500 text-3xl font-black flex items-center gap-4 shadow-xl">
                    <span>{selectedGrade}</span>
                    <span className="text-blue-400">第 {stage} 階段</span>
                  </div>
                  
                  {PRACTICE_TYPES.map((cat, i) => {
                    const isCompleted = completedPractices.includes(cat);
                    return (
                      <div key={cat} style={{ left: `${16.5 + (i*23.2)}%`, top: '51%' }}
                           onClick={() => handleCategoryClick(cat)}
                           className={`absolute w-[18%] h-[26%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-40 rounded-full transition-all flex flex-col items-center justify-center font-black pb-4
                            ${isCompleted ? 'bg-green-500/0 border-0 border-green-400 scale-95' : 'hover:bg-white/0 hover:shadow-[0_0_20px_rgba(255,255,255,0.0)]'}`} 
                           title={isCompleted ? '已完成' : `進入${cat}`}>
                          {isCompleted && <div className="bg-green-500/100 rounded-full p-2 border-2 border-white animate-bounce shadow-lg mt-auto"><Star fill="White" size={30}/></div>}
                      </div>
                    );
                  })}

                  {BOSS_TYPES.map((m, i) => {
                    const bossStage = i + 1;
                    const isUnlocked = stage === bossStage && completedPractices.length === 4;
                    const isPassed = stage > bossStage;
                    
                    return (
                      <div key={m} style={{ left: `${27.5 + (i*23)}%`, top: '80%' }}
                           onClick={() => handleCategoryClick(m)}
                           className={`absolute w-[15%] h-[15%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-40 rounded-full transition-all flex flex-col items-center justify-center font-black
                            ${isPassed ? 'bg-green-900/0 border-0 border-green-500 opacity-50' : 
                              isUnlocked ? 'animate-pulse hover:bg-red-500/0 shadow-[0_0_30px_rgba(255,0,0,0.8)] border-0 border-red-500' : 
                              'bg-black/60 opacity-60'}`} 
                           title={isPassed ? '已擊敗' : isUnlocked ? '準備挑戰！' : '需先完成練習'}>
                           
                           {isPassed && <div className="text-white-100 drop-shadow-lg flex flex-col items-center"><Trophy size={60}/>已擊敗</div>}
                           {isUnlocked && <Lock size={60} className="text-red-400 drop-shadow-md mb-2" />}
                           {(!isPassed && !isUnlocked) && (
                             <div className="bg-black/3 px-4 py-2 rounded-xl border-0 border-red-500 flex flex-col items-center"><Lock size={40} className="text-red-600 mb-1"/><span className="text-red-600 font-black text-sm tracking-widest">待解鎖</span></div>
                           )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 第四層 戰鬥畫面 (僅此層引入 BG_1) */}
              {view === 'battle' && (
                <div className="absolute inset-0 flex flex-col bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url('${GAME_BG}')` }}>
                  <div className="flex justify-between p-4 bg-black/0 z-50">
                     <button onClick={() => setView('level-detail')} className="text-white flex items-center gap-2 bg-white/0 px-4 py-2 rounded-xl border border-white/2 hover:bg-white/0"><ChevronLeft /> 放棄返回</button>
                     <div className="text-yellow-400 font-black text-2xl drop-shadow-lg flex items-center gap-2"><Star fill="#facc15" size={24}/> {state.stars}</div>
                  </div>
                  <div className="flex-1 flex items-center justify-center p-4">
                    <div className="bg-[#1e293b]/40 p-8 rounded-[40px] border-0 border-slate-700 w-full max-w-5xl max-h-[85vh] shadow-2xl overflow-y-auto relative flex flex-col justify-center">
                      
                      {/* 成功過關提示彈窗 (由玩家點擊確認退出，防黑屏) */}
                      {showSuccessMessage ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in zoom-in duration-500 my-auto">
                           <CheckCircle size={100} className="text-green-400 drop-shadow-lg animate-bounce" />
                           <h1 className="text-5xl font-black text-yellow-400">{showSuccessMessage.title}</h1>
                           <p className="text-2xl text-white whitespace-pre-line text-center">{showSuccessMessage.desc}</p>
                           <button onClick={showSuccessMessage.onConfirm} className="px-10 py-5 bg-orange-600 text-white rounded-full font-black text-3xl border-0 border-black hover:bg-orange-500 hover:scale-105 active:scale-95 transition-all shadow-xl mt-8">
                             {showSuccessMessage.btnText}
                           </button>
                        </div>
                      ) : selectedCategory === '詞彙語法' ? (
                        <div className="space-y-6">
                          <div className="text-center">
                            <h2 className="text-4xl font-black text-orange-400 mb-2">詞彙配對 (第 {matchRound + 1} / 2 輪)</h2>
                            <p className="text-slate-400 font-bold italic">尋找正確的配對組合</p>
                          </div>
                          <div className="grid grid-cols-2 gap-12">
                            <div className="space-y-4">
                              {currentMatchingSet.lefts.map((p) => (
                                <button key={p.uniqueId} onClick={() => !matchedPairs.includes(p.uniqueId) && setLeftActive(p.uniqueId)}
                                        className={`w-full py-6 rounded-2xl border-2 transition-all flex justify-center ${matchedPairs.includes(p.uniqueId) ? 'opacity-10 bg-green-900 grayscale cursor-default' : leftActive === p.uniqueId ? 'border-yellow-400 bg-slate-700 scale-105' : 'border-slate-600 bg-slate-800 hover:scale-105'}`}>
                                  <VerticalRuby c={p.l} z={p.lz} fontSize="text-5xl" />
                                </button>
                              ))}
                            </div>
                            <div className="space-y-4">
                              {currentMatchingSet.rights.map((p, i) => (
                                <button key={i} onClick={() => { 
                                          if(leftActive === p.uniqueId) { 
                                              speak(p.r); 
                                              setMatchedPairs(prev => [...prev, leftActive]); 
                                              setLeftActive(null); 
                                              if(matchedPairs.length === 4) { 
                                                  confetti({particleCount:100}); 
                                                  setTimeout(() => {
                                                      if (matchRound < 1) {
                                                          setMatchRound(1); 
                                                          setMatchedPairs([]);
                                                      } else {
                                                          const newStars = state.stars + 20;
                                                          setState(st => ({ ...st, stars: newStars }));
                                                          finishBattle(newStars);
                                                      }
                                                  }, 1500); 
                                              } 
                                          } else setLeftActive(null); 
                                        }}
                                        className={`w-full py-6 rounded-2xl border-5 border-slate-600 bg-slate-800 transition-all flex justify-center ${matchedPairs.includes(p.uniqueId) ? 'invisible' : 'hover:border-yellow-400 active:scale-95 hover:scale-105'}`}>
                                  <VerticalRuby c={p.r} z={p.rz} fontSize="text-5xl" />
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="absolute top-4 right-8 text-slate-500 font-mono text-xl font-bold">第 {currentIdx + 1} / 5 題 ({selectedCategory})</div>
                          
                          {/* 單字填空題排版 */}
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
                          )}

                          {/* 發音題與閱讀理解排版 */}
                          {q?.type !== 'cloze' && (
                            <>
                              {q?.type === 'audio' && (
                                <div className="flex flex-col items-center gap-8 py-4">
                                  <button onClick={() => speak(q.c)} className="w-32 h-32 bg-orange-500 rounded-full flex items-center justify-center text-white hover:scale-110 shadow-2xl border-4 border-white animate-pulse"><Volume2 size={60} /></button>
                                  <h2 className="text-3xl font-black text-white">聽一聽，找正確的字</h2>
                                </div>
                              )}
                              
                              {/* 閱讀理解排版縮小化，保證視窗完整顯示不超出 */}
                              {q?.type === 'reading' && (
                                <div className="w-full space-y-4 mb-4 flex flex-col items-center mt-2">
                                  <div className="bg-slate-800 p-4 rounded-3xl border-4 border-slate-600 flex flex-wrap justify-center items-center gap-3 w-full shadow-inner max-h-[160px] overflow-y-auto">
                                    {q.t.map((item, idx) => <VerticalRuby key={idx} c={item.c} z={item.z} fontSize="text-3xl" />)}
                                  </div>
                                  <div className="bg-yellow-500/90 p-4 rounded-2xl border-2 border-yellow-500 w-full text-center shadow-md">
                                    <p className="text-3xl font-black text-slate-900 tracking-wider">❓ {q.q}</p>
                                  </div>
                                </div>
                              )}

                              <div className="grid grid-cols-3 gap-8 w-full max-w-4xl pb-2 mt-4">
                                {(q?.options || []).map((opt, i) => (
                                  <button key={i} onClick={() => handleAnswer(i)}
                                          className="w-full py-8 px-4 rounded-[30px] border-4 border-slate-600 bg-slate-800 hover:border-yellow-400 transition-all flex flex-col items-center gap-6 group shadow-xl active:scale-95">
                                    <span className="w-12 h-12 bg-slate-900 rounded-full flex-shrink-0 flex items-center justify-center text-yellow-400 font-black text-2xl border-2 border-yellow-400/30 shadow-inner group-hover:border-yellow-400">{i+1}</span>
                                    <div className="flex-1 flex justify-center items-center">
                                      <VerticalRuby c={opt.c} z={opt.z} fontSize={q.type === 'reading' ? "text-3xl" : "text-6xl"} />
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
