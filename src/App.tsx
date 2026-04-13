/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HanziWriter from 'hanzi-writer';
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
    reading: [
      { t: R('小貓最愛吃鮮魚', 'ㄒㄧㄠˇ ㄇㄠ ㄗㄨㄟˋ ㄞˋ ㄔ ㄒㄧㄢ ㄩˊ'), q: '請問小貓最喜歡吃什麼？', options: [{c:'青菜',z:'ㄑㄧㄥ ㄘㄞˋ'},{c:'鮮魚',z:'ㄒㄧㄢ ㄩˊ'},{c:'水果',z:'ㄕㄨㄟˇ ㄍㄨㄛˇ'}], a:1 },
      { t: R('天氣變冷要穿衣', 'ㄊㄧㄢ ㄑㄧˋ ㄅㄧㄢˋ ㄌㄥˇ ㄧㄠˋ ㄔㄨㄢ ㄧ'), q: '天氣變冷了，出門要穿什麼？', options: [{c:'外套',z:'ㄨㄞˋ ㄊㄠˋ'},{c:'泳衣',z:'ㄩㄥˇ ㄧ'},{c:'短褲',z:'ㄉㄨㄢˇ ㄎㄨˋ'}], a:0 },
      { t: R('妹妹在房間畫畫', 'ㄇㄟˋ ㄇㄟ˙ ㄗㄞˋ ㄈㄤˊ ㄐㄧㄢ ㄏㄨㄚˋ ㄏㄨㄚˋ'), q: '妹妹現在正在做什麼呢？', options: [{c:'唱歌',z:'ㄔㄤˋ ㄍㄜ'},{c:'畫畫',z:'ㄏㄨㄚˋ ㄏㄨㄚˋ'},{c:'跳舞',z:'ㄊㄧㄠˋ ㄨˇ'}], a:1 },
      { t: R('草地看起來綠油油', 'ㄘㄠˇ ㄉㄧˋ ㄎㄢˋ ㄑㄧˇ ㄌㄞˊ ㄌㄩˋ ㄧㄡˊ ㄧㄡˊ'), q: '請問草地是什麼顏色的？', options: [{c:'紅色',z:'ㄏㄨㄥˊ ㄙㄜˋ'},{c:'綠色',z:'ㄌㄩˋ ㄙㄜˋ'},{c:'藍色',z:'ㄌㄢˊ ㄙㄜˋ'}], a:1 },
      { t: R('小鳥拍著翅膀飛', 'ㄒㄧㄠˇ ㄋㄧㄠˇ ㄆㄞ ㄓㄜ˙ ㄔˋ ㄅㄤˇ ㄈㄟ'), q: '小鳥是用什麼在天上飛翔？', options: [{c:'翅膀',z:'ㄔˋ ㄅㄤˇ'},{c:'雙腳',z:'ㄕㄨㄤ ㄐㄧㄠˇ'},{c:'尾巴',z:'ㄨㄟˇ ㄅㄚ'}], a:0 },
      { t: R('晚上月亮圓又大', 'ㄨㄢˇ ㄕㄤˋ ㄩㄝˋ ㄌㄧㄤˋ ㄩㄢˊ ㄧㄡˋ ㄉㄚˋ'), q: '什麼時候可以看到圓圓的月亮？', options: [{c:'白天',z:'ㄅㄞˊ ㄊㄧㄢ'},{c:'晚上',z:'ㄨㄢˇ ㄕㄤˋ'},{c:'中午',z:'ㄓㄨㄥ ㄨˇ'}], a:1 },
      { t: R('吃東西前要洗手', 'ㄔ ㄉㄨㄥ ㄒㄧ ㄑㄧㄢˊ ㄧㄠˋ ㄒㄧˇ ㄕㄡˇ'), q: '吃東西之前，我們應該先做什麼？', options: [{c:'睡覺',z:'ㄕㄨㄟˋ ㄐㄧㄠˋ'},{c:'洗手',z:'ㄒㄧˇ ㄕㄡˇ'},{c:'跑步',z:'ㄆㄠˇ ㄅㄨˋ'}], a:1 },
      { t: R('見面說聲大家好', 'ㄐㄧㄢˋ ㄇㄧㄢˋ ㄕㄨㄛ ㄕㄥ ㄉㄚˋ ㄐㄧㄚ ㄏㄠˇ'), q: '這是一句什麼樣的話？', options: [{c:'罵人',z:'ㄇㄚˋ ㄖㄣˊ'},{c:'問候',z:'ㄨㄣˋ ㄏㄡˋ'},{c:'哭泣',z:'ㄎㄨ ㄑㄧˋ'}], a:1 },
      { t: R('一年總共有四季', 'ㄧˋ ㄋㄧㄢˊ ㄗㄨㄥˇ ㄍㄨㄥˋ ㄧㄡˇ ㄙˋ ㄐㄧˋ'), q: '一年總共有幾個季節？', options: [{c:'兩個',z:'ㄌㄧㄤˇ ㄍㄜ˙'},{c:'三個',z:'ㄙㄢ ㄍㄜ˙'},{c:'四個',z:'ㄙˋ ㄍㄜ˙'}], a:2 },
      { t: R('我最愛在書房讀書', 'ㄨㄛˇ ㄗㄨㄟˋ ㄞˋ ㄗㄞˋ ㄕㄨ ㄈㄤˊ ㄉㄨˊ ㄕㄨ'), q: '說話的人喜歡做什麼？', options: [{c:'看書',z:'ㄎㄢˋ ㄕㄨ'},{c:'玩球',z:'ㄨㄢˊ ㄑㄧㄡˊ'},{c:'吃麵',z:'ㄔ ㄇㄧㄢˋ'}], a:0 },
      { t: R('小豬和羊一起種田', 'ㄒㄧㄠˇ ㄓㄨ ㄏㄢˋ ㄧㄤˊ ㄧˋ ㄑㄧˇ ㄓㄨㄥˋ ㄊㄧㄢˊ'), q: '小豬和羊一起做什麼？', options: [{c:'種田',z:'ㄓㄨㄥˋ ㄊㄧㄢˊ'},{c:'唱歌',z:'ㄔㄤˋ ㄍㄜ'},{c:'跑步',z:'ㄆㄠˇ ㄅㄨˋ'}], a:0 },
      { t: R('地瓜吃起來甜甜的', 'ㄉㄧˋ ㄍㄨㄚ ㄔ ㄑㄧˇ ㄌㄞˊ ㄊㄧㄢˊ ㄊㄧㄢˊ ㄉㄜ˙'), q: '地瓜吃起來的味道如何？', options: [{c:'酸酸的',z:'ㄙㄨㄢ ㄙㄨㄢ ㄉㄜ˙'},{c:'甜甜的',z:'ㄊㄧㄢˊ ㄊㄧㄢˊ ㄉㄜ˙'},{c:'苦苦的',z:'ㄎㄨˇ ㄎㄨˇ ㄉㄜ˙'}], a:1 },
      { t: R('大家一起拔蘿蔔', 'ㄉㄚˋ ㄐㄧㄚ ㄧˋ ㄑㄧˇ ㄅㄚˊ ㄌㄨㄛˊ ㄅㄛ˙'), q: '大家在拔什麼？', options: [{c:'青菜',z:'ㄑㄧㄥ ㄘㄞˋ'},{c:'蘿蔔',z:'ㄌㄨㄛˊ ㄅㄛ˙'},{c:'蘋果',z:'ㄆㄧㄥˊ ㄍㄨㄛˇ'}], a:1 },
      { t: R('剪刀可以剪紙', 'ㄐㄧㄢˇ ㄉㄠ ㄎㄜˇ ㄧˇ ㄐㄧㄢˇ ㄓˇ'), q: '剪刀用來做什麼？', options: [{c:'剪紙',z:'ㄐㄧㄢˇ ㄓˇ'},{c:'切菜',z:'ㄑㄧㄝ ㄘㄞˋ'},{c:'跑步',z:'ㄆㄠˇ ㄅㄨˋ'}], a:0 },
      { t: R('我們開心去上學', 'ㄨㄛˇ ㄇㄣ˙ ㄎㄞ ㄒㄧㄣ ㄑㄩˋ ㄕㄤˋ ㄒㄩㄝˊ'), q: '我們開心地去哪裡？', options: [{c:'公園',z:'ㄍㄨㄥ ㄩㄢˊ'},{c:'上學',z:'ㄕㄤˋ ㄒㄩㄝˊ'},{c:'睡覺',z:'ㄕㄨㄟˋ ㄐㄧㄠˋ'}], a:1 }
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
    reading: [
      { t: R('撐開來是小屋頂', 'ㄔㄥ ㄎㄞ ㄌㄞˊ ㄕˋ ㄒㄧㄠˇ ㄨ ㄉㄧㄥˇ'), q: '這句話指的是什麼物品？', options: [{c:'帽子',z:'ㄇㄠˋ ㄗ˙'},{c:'雨傘',z:'ㄩˇ ㄙㄢˇ'},{c:'書本',z:'ㄕㄨ ㄅㄣˇ'}], a:1 },
      { t: R('跟世界打招呼', 'ㄍㄣ ㄕˋ ㄐㄧㄝˋ ㄉㄚˇ ㄓㄠ ㄏㄨ'), q: '這句話表示在做什麼動作？', options: [{c:'打架',z:'ㄉㄚˇ ㄐㄧㄚˋ'},{c:'睡覺',z:'ㄕㄨㄟˋ ㄐㄧㄠˋ'},{c:'問候',z:'ㄨㄣˋ ㄏㄡˋ'}], a:2 },
      { t: R('樹上貼滿了葉子', 'ㄕㄨˋ ㄕㄤˋ ㄊㄧㄝ ㄇㄢˇ ㄌㄜ˙ ㄧㄝˋ ㄗ˙'), q: '樹上有什麼東西？', options: [{c:'花朵',z:'ㄏㄨㄚ ㄉㄨㄛˇ'},{c:'葉子',z:'ㄧㄝˋ ㄗ˙'},{c:'果實',z:'ㄍㄨㄛˇ ㄕˊ'}], a:1 },
      { t: R('我喜歡我的房間', 'ㄨㄛˇ ㄒㄧˇ ㄏㄨㄢ ㄨㄛˇ ㄉㄜ˙ ㄈㄤˊ ㄐㄧㄢ'), q: '主角最喜歡哪裡？', options: [{c:'房間',z:'ㄈㄤˊ ㄐㄧㄢ'},{c:'教室',z:'ㄐㄧㄠˋ ㄕˋ'},{c:'公園',z:'ㄍㄨㄥ ㄩㄢˊ'}], a:0 },
      { t: R('大家為他拍手', 'ㄉㄚˋ ㄐㄧㄚ ㄨㄟˋ ㄊㄚ ㄆㄞ ㄕㄡˇ'), q: '大家做了什麼來鼓勵他？', options: [{c:'生氣',z:'ㄕㄥ ㄑㄧˋ'},{c:'拍手',z:'ㄆㄞ ㄕㄡˇ'},{c:'大哭',z:'ㄉㄚˋ ㄎㄨ'}], a:1 },
      { t: R('天空藍藍白雲朵朵', 'ㄊㄧㄢ ㄎㄨㄥ ㄌㄢˊ ㄌㄢˊ ㄅㄞˊ ㄩㄣˊ ㄉㄨㄛˇ ㄉㄨㄛˇ'), q: '天空中有什麼？', options: [{c:'烏雲',z:'ㄨ ㄩㄣˊ'},{c:'彩虹',z:'ㄘㄞˇ ㄏㄨㄥˊ'},{c:'白雲',z:'ㄅㄞˊ ㄩㄣˊ'}], a:2 },
      { t: R('猴子把帽子戴頭上', 'ㄏㄡˊ ㄗ˙ ㄅㄚˇ ㄇㄠˋ ㄗ˙ ㄉㄞˋ ㄊㄡˊ ㄕㄤˋ'), q: '猴子拿了什麼東西？', options: [{c:'鞋子',z:'ㄒㄧㄝˊ ㄗ˙'},{c:'衣服',z:'ㄧ ㄈㄨˊ'},{c:'帽子',z:'ㄇㄠˋ ㄗ˙'}], a:2 },
      { t: R('冰屋是冰磚做的', 'ㄅㄧㄥ ㄨ ㄕˋ ㄅㄧㄥ ㄓㄨㄢ ㄗㄨㄛˋ ㄉㄜ˙'), q: '冰屋是用什麼做成的？', options: [{c:'木頭',z:'ㄇㄨˋ ㄊㄡˊ'},{c:'石頭',z:'ㄕˊ ㄊㄡˊ'},{c:'冰磚',z:'ㄅㄧㄥ ㄓㄨㄢ'}], a:2 },
      { t: R('秋天去果園摘果子', 'ㄑㄧㄡ ㄊㄧㄢ ㄑㄩˋ ㄍㄨㄛˇ ㄩㄢˊ ㄓㄞ ㄍㄨㄛˇ ㄗ˙'), q: '秋天去果園做什麼？', options: [{c:'種田',z:'ㄓㄨㄥˋ ㄊㄧㄢˊ'},{c:'摘果子',z:'ㄓㄞ ㄍㄨㄛˇ ㄗ˙'},{c:'玩水',z:'ㄨㄢˊ ㄕㄨㄟˇ'}], a:1 },
      { t: R('勇敢面對挑戰', 'ㄩㄥˇ ㄍㄢˇ ㄇㄧㄢˋ ㄉㄨㄟˋ ㄊㄧㄠˇ ㄓㄢˋ'), q: '該如何面對挑戰？', options: [{c:'逃跑',z:'ㄊㄠˊ ㄆㄠˇ'},{c:'勇敢',z:'ㄩㄥˇ ㄍㄢˇ'},{c:'哭泣',z:'ㄎㄨ ㄑㄧˋ'}], a:1 },
      { t: R('爺爺出謎語給我猜', 'ㄧㄝˊ ㄧㄝ˙ ㄔㄨ ㄇㄧˊ ㄩˇ ㄍㄟˇ ㄨㄛˇ ㄘㄞ'), q: '爺爺出了什麼給我猜？', options: [{c:'作業',z:'ㄍㄨㄥ ㄎㄜˋ'},{c:'謎語',z:'ㄇㄧˊ ㄩˇ'},{c:'考卷',z:'ㄎㄠˇ ㄐㄩㄢˋ'}], a:1 },
      { t: R('這本書圖畫很精彩', 'ㄓㄜˋ ㄅㄣˇ ㄕㄨ ㄊㄨˊ ㄏㄨㄚˋ ㄏㄣˇ ㄐㄧㄥ ㄘㄞˇ'), q: '這本書的圖畫如何？', options: [{c:'精彩',z:'ㄐㄧㄥ ㄘㄞˇ'},{c:'很醜',z:'ㄏㄣˇ ㄔㄡˇ'},{c:'無聊',z:'ㄨˊ ㄌㄧㄠˊ'}], a:0 },
      { t: R('小光抓著頭裝猴子', 'ㄒㄧㄠˇ ㄍㄨㄤ ㄓㄨㄚ ㄓㄜ˙ ㄊㄡˊ ㄓㄨㄤ ㄏㄡˊ ㄗ˙'), q: '小光假裝成什麼動物？', options: [{c:'老虎',z:'ㄌㄠˇ ㄏㄨˇ'},{c:'猴子',z:'ㄏㄡˊ ㄗ˙'},{c:'小狗',z:'ㄒㄧㄠˇ ㄍㄡˇ'}], a:1 },
      { t: R('小樹苗排好隊', 'ㄒㄧㄠˇ ㄕㄨˋ ㄇㄧㄠˊ ㄆㄞˊ ㄏㄠˇ ㄉㄨㄟˋ'), q: '誰排好隊了？', options: [{c:'小樹苗',z:'ㄒㄧㄠˇ ㄕㄨˋ ㄇㄧㄠˊ'},{c:'小學生',z:'ㄒㄧㄠˇ ㄒㄩㄝˊ ㄕㄥ'},{c:'小鳥',z:'ㄒㄧㄠˇ ㄋㄧㄠˇ'}], a:0 },
      { t: R('小青怕黑不敢睡', 'ㄒㄧㄠˇ ㄑㄧㄥ ㄆㄚˋ ㄏㄟ ㄅㄨˋ ㄍㄢˇ ㄕㄨㄟˋ'), q: '小青怕什麼？', options: [{c:'怕水',z:'ㄆㄚˋ ㄕㄨㄟˇ'},{c:'怕黑',z:'ㄆㄚˋ ㄏㄟ'},{c:'怕高',z:'ㄆㄚˋ ㄍㄠ'}], a:1 }
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
    reading: [
      { t: R('石虎長得好像貓', 'ㄕˊ ㄏㄨˇ ㄓㄤˇ ㄉㄜ˙ ㄏㄠˇ ㄒㄧㄤˋ ㄇㄠ'), q: '石虎長得像什麼動物？', options: [{c:'小狗',z:'ㄒㄧㄠˇ ㄍㄡˇ'},{c:'獅子',z:'ㄕ ㄗ˙'},{c:'小貓',z:'ㄒㄧㄠˇ ㄇㄠ'}], a:2 },
      { t: R('大家去操場踢足球', 'ㄉㄚˋ ㄐㄧㄚ ㄑㄩˋ ㄘㄠ ㄔㄤˇ ㄊㄧ ㄗㄨˊ ㄑㄧㄡˊ'), q: '大家在操場做什麼？', options: [{c:'睡覺',z:'ㄕㄨㄟˋ ㄐㄧㄠˋ'},{c:'踢足球',z:'ㄊㄧ ㄗㄨˊ ㄑㄧㄡˊ'},{c:'看書',z:'ㄎㄢˋ ㄕㄨ'}], a:1 },
      { t: R('愛玉是透明的甜品', 'ㄞˋ ㄩˋ ㄕˋ ㄊㄡˋ ㄇㄧㄥˊ ㄉㄜ˙ ㄊㄧㄢˊ ㄆㄧㄣˇ'), q: '愛玉是什麼顏色的？', options: [{c:'透明的',z:'ㄊㄡˋ ㄇㄧㄥˊ ㄉㄜ˙'},{c:'黑色的',z:'ㄏㄟ ㄙㄜˋ ㄉㄜ˙'},{c:'紅色的',z:'ㄏㄨㄥˊ ㄙㄜˋ ㄉㄜ˙'}], a:0 },
      { t: R('我們一起去海邊潛水', 'ㄨㄛˇ ㄇㄣ˙ ㄧˋ ㄑㄧˇ ㄑㄩˋ ㄏㄞˇ ㄅㄧㄢ ㄑㄧㄢˊ ㄕㄨㄟˇ'), q: '我們去海邊做什麼？', options: [{c:'爬山',z:'ㄆㄚˊ ㄕㄢ'},{c:'潛水',z:'ㄑㄧㄢˊ ㄕㄨㄟˇ'},{c:'滑雪',z:'ㄏㄨㄚˊ ㄒㄩㄝˇ'}], a:1 },
      { t: R('枯木是大飯店', 'ㄎㄨ ㄇㄨˋ ㄕˋ ㄉㄚˋ ㄈㄢˋ ㄉㄧㄢˋ'), q: '課文把枯木比喻成什麼？', options: [{c:'大飯店',z:'ㄉㄚˋ ㄈㄢˋ ㄉㄧㄢˋ'},{c:'大石頭',z:'ㄉㄚˋ ㄕˊ ㄊㄡˊ'},{c:'遊樂園',z:'ㄧㄡˊ ㄌㄜˋ ㄩㄢˊ'}], a:0 },
      { t: R('竹節蟲假裝是樹枝', 'ㄓㄨˊ ㄐㄧㄝˊ ㄔㄨㄥˊ ㄐㄧㄚˇ ㄓㄨㄤ ㄕˋ ㄕㄨˋ ㄓ'), q: '竹節蟲假裝成什麼來保命？', options: [{c:'花朵',z:'ㄏㄨㄚ ㄉㄨㄛˇ'},{c:'樹枝',z:'ㄕㄨˋ ㄓ'},{c:'葉子',z:'ㄧㄝˋ ㄗ˙'}], a:1 },
      { t: R('醫生伯伯穿白袍', 'ㄧ ㄕㄥ ㄅㄛˊ ㄅㄛ˙ ㄔㄨㄢ ㄅㄞˊ ㄆㄠˊ'), q: '醫生伯伯穿什麼顏色的衣服？', options: [{c:'黑色',z:'ㄏㄟ ㄙㄜˋ'},{c:'白色',z:'ㄅㄞˊ ㄙㄜˋ'},{c:'紅色',z:'ㄏㄨㄥˊ ㄙㄜˋ'}], a:1 },
      { t: R('北極熊的毛是透明的', 'ㄅㄟˇ ㄐㄧˊ ㄒㄩㄥˊ ㄉㄜ˙ ㄇㄠˊ ㄕˋ ㄊㄡˋ ㄇㄧㄥˊ ㄉㄜ˙'), q: '北極熊的毛其實是什麼顏色？', options: [{c:'白色',z:'ㄅㄞˊ ㄙㄜˋ'},{c:'透明',z:'ㄊㄡˋ ㄇㄧㄥˊ'},{c:'黑色',z:'ㄏㄟ ㄙㄜˋ'}], a:1 },
      { t: R('小鳥一飛沖天', 'ㄒㄧㄠˇ ㄋㄧㄠˇ ㄧˋ ㄈㄟ ㄔㄨㄥ ㄊㄧㄢ'), q: '小鳥怎麼飛？', options: [{c:'一飛沖天',z:'ㄧˋ ㄈㄟ ㄔㄨㄥ ㄊㄧㄢ'},{c:'慢慢走',z:'ㄇㄢˋ ㄇㄢˋ ㄗㄡˇ'},{c:'跌倒',z:'ㄉㄧㄝˊ ㄉㄠˇ'}], a:0 },
      { t: R('三峽老街有很多紅磚', 'ㄙㄢ ㄒㄧㄚˊ ㄌㄠˇ ㄐㄧㄝ ㄧㄡˇ ㄏㄣˇ ㄉㄨㄛ ㄏㄨㄥˊ ㄓㄨㄢ'), q: '三峽老街有什麼特別的建築？', options: [{c:'紅磚',z:'ㄏㄨㄥˊ ㄓㄨㄢ'},{c:'冰屋',z:'ㄅㄧㄥ ㄨ'},{c:'大樓',z:'ㄉㄚˋ ㄌㄡˊ'}], a:0 },
      { t: R('地球的眼淚是鹹的', 'ㄉㄧˋ ㄑㄧㄡˊ ㄉㄜ˙ ㄧㄢˇ ㄌㄟˋ ㄕˋ ㄒㄧㄢˊ ㄉㄜ˙'), q: '地球的眼淚指的是什麼？', options: [{c:'海洋',z:'ㄏㄞˇ ㄧㄤˊ'},{c:'河水',z:'ㄏㄜˊ ㄕㄨㄟˇ'},{c:'雨水',z:'ㄩˇ ㄕㄨㄟˇ'}], a:0 },
      { t: R('雲朵像一隻恐龍', 'ㄩㄣˊ ㄉㄨㄛˇ ㄒㄧㄤˋ ㄧˋ ㄓ ㄎㄨㄥˇ ㄌㄨㄥˊ'), q: '雲朵看起來像什麼？', options: [{c:'兔子',z:'ㄊㄨˋ ㄗ˙'},{c:'恐龍',z:'ㄎㄨㄥˇ ㄌㄨㄥˊ'},{c:'小雞',z:'ㄒㄧㄠˇ ㄐㄧ'}], a:1 },
      { t: R('下課十分鐘很熱鬧', 'ㄒㄧㄚˋ ㄎㄜˋ ㄕˊ ㄈㄣ ㄓㄨㄥ ㄏㄣˇ ㄖㄜˋ ㄋㄠˋ'), q: '下課時間的氣氛如何？', options: [{c:'安靜',z:'ㄢ ㄐㄧㄥˋ'},{c:'熱鬧',z:'ㄖㄜˋ ㄋㄠˋ'},{c:'恐怖',z:'ㄎㄨㄥˇ ㄅㄨˋ'}], a:1 },
      { t: R('我們立下班級公約', 'ㄨㄛˇ ㄇㄣ˙ ㄌㄧˋ ㄒㄧㄚˋ ㄅㄢ ㄐㄧˊ ㄍㄨㄥ ㄩㄝ'), q: '我們訂了什麼來管理自己？', options: [{c:'遊戲',z:'ㄧㄡˊ ㄒㄧˋ'},{c:'公約',z:'ㄍㄨㄥ ㄩㄝ'},{c:'菜單',z:'ㄘㄞˋ ㄉㄢ'}], a:1 },
      { t: R('留住今天的太陽', 'ㄌㄧㄡˊ ㄓㄨˋ ㄐㄧㄣ ㄊㄧㄢ ㄉㄜ˙ ㄊㄞˋ ㄧㄤˊ'), q: '主角想和誰比賽？', options: [{c:'月亮',z:'ㄩㄝˋ ㄌㄧㄤˋ'},{c:'星星',z:'ㄒㄧㄥ ㄒㄧㄥ'},{c:'太陽',z:'ㄊㄞˋ ㄧㄤˊ'}], a:2 }
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
    reading: [
      { t: R('蔡倫發明了造紙術', 'ㄘㄞˋ ㄌㄨㄣˊ ㄈㄚ ㄇㄧㄥˊ ㄌㄜ˙ ㄗㄠˋ ㄓˇ ㄕㄨˋ'), q: '中國古代的蔡倫發明了什麼？', options: [{c:'火藥',z:'ㄏㄨㄛˇ ㄧㄠˋ'},{c:'指南針',z:'ㄓˇ ㄋㄢˊ ㄓㄣ'},{c:'造紙術',z:'ㄗㄠˋ ㄓˇ ㄕㄨˋ'}], a:2 },
      { t: R('九蛙疊像在日月潭', 'ㄐㄧㄡˇ ㄨㄚ ㄉㄧㄝˊ ㄒㄧㄤˋ ㄗㄞˋ ㄖˋ ㄩㄝˋ ㄊㄢˊ'), q: '九蛙疊像在哪裡？', options: [{c:'嘉明湖',z:'ㄐㄧㄚ ㄇㄧㄥˊ ㄏㄨˊ'},{c:'日月潭',z:'ㄖˋ ㄩㄝˋ ㄊㄢˊ'},{c:'太魯閣',z:'ㄊㄞˋ ㄌㄨˇ ㄍㄜˊ'}], a:1 },
      { t: R('嘉明湖是天使的眼淚', 'ㄐㄧㄚ ㄇㄧㄥˊ ㄏㄨˊ ㄕˋ ㄊㄧㄢ ㄕˇ ㄉㄜ˙ ㄧㄢˇ ㄌㄟˋ'), q: '嘉明湖的美稱是什麼？', options: [{c:'天使眼淚',z:'ㄊㄧㄢ ㄕˇ ㄧㄢˇ ㄌㄟˋ'},{c:'藍色寶石',z:'ㄌㄢˊ ㄙㄜˋ ㄅㄠˇ ㄕˊ'},{c:'綠色珍珠',z:'ㄌㄩˋ ㄙㄜˋ ㄓㄣ ㄓㄨ'}], a:0 },
      { t: R('奶奶為我煮排骨粥', 'ㄋㄞˇ ㄋㄞ˙ ㄨㄟˋ ㄨㄛˇ ㄓㄨˇ ㄆㄞˊ ㄍㄨˇ ㄓㄡ'), q: '奶奶煮了什麼給我吃？', options: [{c:'牛肉麵',z:'ㄋㄧㄡˊ ㄖㄡˋ ㄇㄧㄢˋ'},{c:'排骨粥',z:'ㄆㄞˊ ㄍㄨˇ ㄓㄡ'},{c:'蛋炒飯',z:'ㄉㄢˋ ㄔㄠˇ ㄈㄢˋ'}], a:1 },
      { t: R('布袋戲是傳統戲劇', 'ㄅㄨˋ ㄉㄞˋ ㄒㄧˋ ㄕˋ ㄔㄨㄢˊ ㄊㄨㄥˇ ㄒㄧˋ ㄐㄩˋ'), q: '哪一種是臺灣的傳統戲劇？', options: [{c:'布袋戲',z:'ㄅㄨˋ ㄉㄞˋ ㄒㄧˋ'},{c:'電影',z:'ㄉㄧㄢˋ ㄧㄥˇ'},{c:'動畫',z:'ㄉㄨㄥˋ ㄏㄨㄚˋ'}], a:0 },
      { t: R('小飛魚是蘭嶼的特色', 'ㄒㄧㄠˇ ㄈㄟ ㄩˊ ㄕˋ ㄌㄢˊ ㄩˇ ㄉㄜ˙ ㄊㄜˋ ㄙㄜˋ'), q: '小飛魚是哪裡的特色？', options: [{c:'澎湖',z:'ㄆㄥˊ ㄏㄨˊ'},{c:'金門',z:'ㄐㄧㄣ ㄇㄣˊ'},{c:'蘭嶼',z:'ㄌㄢˊ ㄩˇ'}], a:2 },
      { t: R('蝴蝶從蛹裡蛻變出來', 'ㄏㄨˊ ㄉㄧㄝˊ ㄘㄨㄥˊ ㄩㄥˇ ㄌㄧˇ ㄊㄨㄟˋ ㄅㄧㄢˋ ㄔㄨ ㄌㄞˊ'), q: '蝴蝶是從什麼蛻變出來的？', options: [{c:'蛹',z:'ㄩㄥˇ'},{c:'石頭',z:'ㄕˊ ㄊㄡˊ'},{c:'葉子',z:'ㄧㄝˋ ㄗ˙'}], a:0 },
      { t: R('他靠自己努力站起來', 'ㄊㄚ ㄎㄠˋ ㄗˋ ㄐㄧˇ ㄋㄨˇ ㄌㄧˋ ㄓㄢˋ ㄑㄧˇ ㄌㄞˊ'), q: '力克胡哲怎麼克服困難？', options: [{c:'靠自己',z:'ㄎㄠˋ ㄗˋ ㄐㄧˇ'},{c:'放棄',z:'ㄈㄤˋ ㄑㄧˋ'},{c:'大哭',z:'ㄉㄚˋ ㄎㄨ'}], a:0 },
      { t: R('半夜去水圳等配水', 'ㄅㄢˋ ㄧㄝˋ ㄑㄩˋ ㄕㄨㄟˇ ㄗㄨㄣˋ ㄉㄥˇ ㄆㄟˋ ㄕㄨㄟˇ'), q: '以前乾旱時他們半夜去哪裡？', options: [{c:'便利商店',z:'ㄅㄧㄢˋ ㄌㄧˋ ㄕㄤ ㄉㄧㄢˋ'},{c:'水圳',z:'ㄕㄨㄟˇ ㄗㄨㄣˋ'},{c:'公園',z:'ㄍㄨㄥ ㄩㄢˊ'}], a:1 },
      { t: R('康乃馨是最常見的母親花', 'ㄎㄤ ㄋㄞˇ ㄒㄧㄣ ㄕˋ ㄗㄨㄟˋ ㄔㄤˊ ㄐㄧˋ ㄉㄜ˙ ㄇㄨˇ ㄑㄧㄣ ㄏㄨㄚ'), q: '最常見的母親花是哪一種？', options: [{c:'玫瑰',z:'ㄇㄟˊ ㄍㄨㄟ'},{c:'百合',z:'ㄅㄞˇ ㄏㄜˊ'},{c:'康乃馨',z:'ㄎㄤ ㄋㄞˇ ㄒㄧㄣ'}], a:2 },
      { t: R('野貓在屋頂上喵喵叫', 'ㄧㄝˇ ㄇㄠ ㄗㄞˋ ㄨ ㄉㄧㄥˇ ㄕㄤˋ ㄇㄧㄠ ㄇㄧㄠ ㄐㄧㄠˋ'), q: '野貓在哪裡叫？', options: [{c:'樹上',z:'ㄕㄨˋ ㄕㄤˋ'},{c:'屋頂上',z:'ㄨ ㄉㄧㄥˇ ㄕㄤˋ'},{c:'車底',z:'ㄔㄜ ㄉㄧˇ'}], a:1 },
      { t: R('苗栗的𪹚龍活動', 'ㄇㄧㄠˊ ㄌㄧˋ ㄉㄜ˙ ㄅㄤˋ ㄌㄨㄥˊ ㄏㄨㄛˊ ㄉㄨㄥˋ'), q: '苗栗元宵節的傳統活動是什麼？', options: [{c:'放天燈',z:'ㄈㄤˋ ㄊㄧㄢ ㄉㄥ'},{c:'𪹚龍',z:'ㄅㄤˋ ㄌㄨㄥˊ'},{c:'蜂炮',z:'ㄈㄥ ㄆㄠˋ'}], a:1 },
      { t: R('小事物也能帶來大驚奇', 'ㄒㄧㄠˇ ㄕˋ ㄨˋ ㄧㄝˇ ㄋㄥˊ ㄉㄞˋ ㄌㄞˊ ㄉㄚˋ ㄐㄧㄥ ㄑㄧˊ'), q: '這課告訴我們什麼道理？', options: [{c:'小事物大驚奇',z:'ㄒㄧㄠˇ ㄕˋ ㄨˋ ㄉㄚˋ ㄐㄧㄥ ㄑㄧˊ'},{c:'買大東西',z:'ㄇㄞˇ ㄉㄚˋ ㄉㄨㄥ ㄒㄧ'},{c:'東西越貴越好',z:'ㄉㄨㄥ ㄒㄧ ㄩㄝˋ ㄍㄨㄟˋ ㄩㄝˋ ㄏㄠˇ'}], a:0 },
      { t: R('臺灣欒樹開黃花', 'ㄊㄞˊ ㄨㄢ ㄌㄨㄢˊ ㄕㄨˋ ㄎㄞ ㄏㄨㄤˊ ㄏㄨㄚ'), q: '臺灣欒樹秋天開什麼顏色的花？', options: [{c:'黃色',z:'ㄏㄨㄤˊ ㄙㄜˋ'},{c:'紅色',z:'ㄏㄨㄥˊ ㄙㄜˋ'},{c:'紫色',z:'ㄗˇ ㄙㄜˋ'}], a:0 },
      { t: R('母親花代表感恩的心', 'ㄇㄨˇ ㄑㄧㄣ ㄏㄨㄚ ㄉㄞˋ ㄅㄧㄠˇ ㄍㄢˇ ㄣ ㄉㄜ˙ ㄒㄧㄣ'), q: '母親花代表什麼意義？', options: [{c:'生氣',z:'ㄕㄥ ㄑㄧˋ'},{c:'感恩',z:'ㄍㄢˇ ㄣ'},{c:'驕傲',z:'ㄐㄧㄠ ㄠˋ'}], a:1 }
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
    reading: [
      { t: R('老師送她藍色連身裙', 'ㄌㄠˇ ㄕ ㄙㄨㄥˋ ㄊㄚ ㄌㄢˊ ㄙㄜˋ ㄌㄧㄢˊ ㄕㄣ ㄑㄩㄣˊ'), q: '老師送了什麼禮物？', options: [{c:'連身裙',z:'ㄌㄧㄢˊ ㄕㄣ ㄑㄩㄣˊ'},{c:'鞋子',z:'ㄒㄧㄝˊ ㄗ˙'},{c:'書本',z:'ㄕㄨ ㄅㄣˇ'}], a:0 },
      { t: R('蚊帳可以保護人不被蚊子叮', 'ㄨㄣˊ ㄓㄤˋ ㄎㄜˇ ㄧˇ ㄅㄠˇ ㄏㄨˋ ㄖㄣˊ ㄅㄨˊ ㄅㄟˋ ㄨㄣˊ ㄗ˙ ㄉㄧㄥ'), q: '蚊帳的功能是什麼？', options: [{c:'擋雨',z:'ㄉㄤˇ ㄩˇ'},{c:'防蚊',z:'ㄈㄤˊ ㄨㄣˊ'},{c:'保暖',z:'ㄅㄠˇ ㄋㄨㄢˇ'}], a:1 },
      { t: R('玩桌遊可以排解無聊', 'ㄨㄢˊ ㄓㄨㄛ ㄧㄡˊ ㄎㄜˇ ㄧˇ ㄆㄞˊ ㄐㄧㄝˇ ㄨˊ ㄌㄧㄠˊ'), q: '玩桌遊有什麼好處？', options: [{c:'排解無聊',z:'ㄆㄞˊ ㄐㄧㄝˇ ㄨˊ ㄌㄧㄠˊ'},{c:'很累',z:'ㄏㄣˇ ㄌㄟˋ'},{c:'會生病',z:'ㄏㄨㄟˋ ㄕㄥ ㄅㄧㄥˋ'}], a:0 },
      { t: R('商標讓顧客留下印象', 'ㄕㄤ ㄅㄧㄠ ㄖㄤˋ ㄍㄨˋ ㄎㄜˋ ㄌㄧㄡˊ ㄒㄧㄚˋ ㄧㄣˋ ㄒㄧㄤˋ'), q: '商標的功用是什麼？', options: [{c:'裝飾',z:'ㄓㄨㄤ ㄕˋ'},{c:'留下印象',z:'ㄌㄧㄡˊ ㄒㄧㄚˋ ㄧㄣˋ ㄒㄧㄤˋ'},{c:'保暖',z:'ㄅㄠˇ ㄋㄨㄢˇ'}], a:1 },
      { t: R('米老鼠在短片裡吹口哨', 'ㄇㄧˇ ㄌㄠˇ ㄕㄨˇ ㄗㄞˋ ㄉㄨㄢˇ ㄆㄧㄢˋ ㄌㄧˇ ㄔㄨㄟ ㄎㄡˇ ㄕㄠˋ'), q: '米老鼠在短片裡做什麼？', options: [{c:'吹口哨',z:'ㄔㄨㄟ ㄎㄡˇ ㄕㄠˋ'},{c:'跳舞',z:'ㄊㄧㄠˋ ㄨˇ'},{c:'畫畫',z:'ㄏㄨㄚˋ ㄏㄨㄚˋ'}], a:0 },
      { t: R('台灣製造環保塑料球衣', 'ㄊㄞˊ ㄨㄢ ㄓˋ ㄗㄠˋ ㄏㄨㄢˊ ㄅㄠˇ ㄙㄨˋ ㄌㄧㄠˋ ㄑㄧㄡˊ ㄧ'), q: '世足賽的這款球衣有什麼特色？', options: [{c:'易破',z:'ㄧˋ ㄆㄛˋ'},{c:'環保',z:'ㄏㄨㄢˊ ㄅㄠˇ'},{c:'很重',z:'ㄏㄣˇ ㄓㄨㄥˋ'}], a:1 },
      { t: R('美是一種難以言說的感動', 'ㄇㄟˇ ㄕˋ ㄧˋ ㄓㄨㄥˇ ㄋㄢˊ ㄧˇ ㄧㄢˊ ㄕㄨㄛ ㄉㄜ˙ ㄍㄢˇ ㄉㄨㄥˋ'), q: '作者認為美是什麼？', options: [{c:'昂貴',z:'ㄤˊ ㄍㄨㄟˋ'},{c:'感動',z:'ㄍㄢˇ ㄉㄨㄥˋ'},{c:'虛幻',z:'ㄒㄩ ㄏㄨㄢˋ'}], a:1 },
      { t: R('女孩存錢買蚊帳捐到非洲', 'ㄋㄩˇ ㄏㄞˊ ㄘㄨㄣˊ ㄑㄧㄢˊ ㄇㄞˇ ㄨㄣˊ ㄓㄤˋ ㄐㄩㄢ ㄉㄠˋ ㄈㄟ ㄓㄡ'), q: '凱瑟琳存錢買什麼？', options: [{c:'玩具',z:'ㄨㄢˊ ㄐㄩˋ'},{c:'蚊帳',z:'ㄨㄣˊ ㄓㄤˋ'},{c:'衣服',z:'ㄧ ㄈㄨˊ'}], a:1 },
      { t: R('桌遊能結合知識', 'ㄓㄨㄛ ㄧㄡˊ ㄋㄥˊ ㄐㄧㄝˊ ㄏㄜˊ ㄓ ㄕˋ'), q: '桌遊有什麼優點？', options: [{c:'結合知識',z:'ㄐㄧㄝˊ ㄏㄜˊ ㄓ ㄕˋ'},{c:'浪費時間',z:'ㄌㄤˋ ㄈㄟˋ ㄕˊ ㄐㄧㄢ'},{c:'破壞視力',z:'ㄆㄛˋ ㄏㄨㄞˋ ㄕˋ ㄌㄧˋ'}], a:0 },
      { t: R('黑松商標像松樹般堅毅', 'ㄏㄟ ㄙㄨㄥ ㄕㄤ ㄅㄧㄠ ㄒㄧㄤˋ ㄙㄨㄥ ㄕㄨˋ ㄅㄢ ㄐㄧㄢ ㄧˋ'), q: '黑松代表什麼精神？', options: [{c:'堅毅',z:'ㄐㄧㄢ ㄧˋ'},{c:'脆弱',z:'ㄘㄨㄟˋ ㄖㄨㄛˋ'},{c:'短暫',z:'ㄉㄨㄢˇ ㄓㄢˋ'}], a:0 },
      { t: R('白雪公主是彩色動畫', 'ㄅㄞˊ ㄒㄩㄝˇ ㄍㄨㄥ ㄓㄨˇ ㄕˋ ㄘㄞˇ ㄙㄜˋ ㄉㄨㄥˋ ㄏㄨㄚˋ'), q: '這部動畫的特色是什麼？', options: [{c:'黑白',z:'ㄏㄟ ㄅㄞˊ'},{c:'彩色',z:'ㄘㄞˇ ㄙㄜˋ'},{c:'無聲',z:'ㄨˊ ㄕㄥ'}], a:1 },
      { t: R('寶特瓶回收可以再利用', 'ㄅㄠˇ ㄊㄜˋ ㄆㄧㄥˊ ㄏㄨㄟˊ ㄕㄡ ㄎㄜˇ ㄧˇ ㄗㄞˋ ㄌㄧˋ ㄩㄥˋ'), q: '寶特瓶回收後能做什麼？', options: [{c:'再利用',z:'ㄗㄞˋ ㄌㄧˋ ㄩㄥˋ'},{c:'丟掉',z:'ㄉㄧㄡ ㄉㄧㄠˋ'},{c:'燒掉',z:'ㄕㄠ ㄉㄧㄠˋ'}], a:0 },
      { t: R('荷花花瓣落進池裡', 'ㄏㄜˊ ㄏㄨㄚ ㄏㄨㄚ ㄅㄢˋ ㄌㄨㄛˋ ㄐㄧㄣˋ ㄔˊ ㄌㄧˇ'), q: '花瓣落到哪裡？', options: [{c:'池裡',z:'ㄔˊ ㄌㄧˇ'},{c:'地上',z:'ㄉㄧˋ ㄕㄤˋ'},{c:'屋頂',z:'ㄨ ㄉㄧㄥˇ'}], a:0 },
      { t: R('動畫帶來不同的想像', 'ㄉㄨㄥˋ ㄏㄨㄚˋ ㄉㄞˋ ㄌㄞˊ ㄅㄨˋ ㄊㄨㄥˊ ㄉㄜ˙ ㄒㄧㄤˇ ㄒㄧㄤˋ'), q: '動畫能帶來什麼？', options: [{c:'想像',z:'ㄒㄧㄤˇ ㄒㄧㄤˋ'},{c:'無聊',z:'ㄨˊ ㄌㄧㄠˊ'},{c:'安靜',z:'ㄢ ㄐㄧㄥˋ'}], a:0 },
      { t: R('女孩洗淨了臉來上學', 'ㄋㄩˇ ㄏㄞˊ ㄒㄧˇ ㄐㄧㄥˋ ㄌㄜ˙ ㄌㄧㄢˇ ㄌㄞˊ ㄕㄤˋ ㄒㄩㄝˊ'), q: '克林街的女孩做了什麼改變？', options: [{c:'洗臉',z:'ㄒㄧˇ ㄌㄧㄢˇ'},{c:'唱歌',z:'ㄔㄤˋ ㄍㄜ'},{c:'畫畫',z:'ㄏㄨㄚˋ ㄏㄨㄚˋ'}], a:0 }
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
    reading: [
      { t: R('勇往直前不退縮', 'ㄩㄥˇ ㄨㄤˇ ㄓˊ ㄑㄧㄢˊ ㄅㄨˊ ㄊㄨㄟˋ ㄙㄨㄛ'), q: '這句話描述什麼精神？', options: [{c:'勇敢',z:'ㄩㄥˇ ㄍㄢˇ'},{c:'懶惰',z:'ㄌㄢˇ ㄉㄨㄛˋ'},{c:'生氣',z:'ㄕㄥ ㄑㄧˋ'}], a: 0 },
      { t: R('面對艱難的挑戰', 'ㄇㄧㄢˋ ㄉㄨㄟˋ ㄐㄧㄢ ㄋㄢˊ ㄉㄜ˙ ㄊㄧㄠˇ ㄓㄢˋ'), q: '挑戰的難度如何？', options: [{c:'簡單',z:'ㄐㄧㄢˇ ㄉㄢ'},{c:'艱難',z:'ㄐㄧㄢ ㄋㄢˊ'},{c:'輕鬆',z:'ㄑㄧㄥ ㄙㄨㄥ'}], a: 1 },
      { t: R('創造輝煌的成績', 'ㄔㄨㄤˋ ㄗㄠˋ ㄏㄨㄟ ㄏㄨㄤˊ ㄉㄜ˙ ㄔㄥˊ ㄐㄧ'), q: '成績表現如何？', options: [{c:'很差',z:'ㄏㄣˇ ㄔㄚ'},{c:'輝煌',z:'ㄏㄨㄟ ㄏㄨㄤˊ'},{c:'普通',z:'ㄆㄨˇ ㄊㄨㄥ'}], a: 1 },
      { t: R('精緻的木雕藝術', 'ㄐㄧㄥ ㄓˋ ㄉㄜ˙ ㄇㄨˋ ㄉㄧㄠ ㄧˋ ㄕㄨˋ'), q: '木雕的品質如何？', options: [{c:'精緻',z:'ㄐㄧㄥ ㄓˋ'},{c:'粗糙',z:'ㄘㄨ ㄘㄠ'},{c:'隨便',z:'ㄙㄨㄟˊ ㄅㄧㄢˋ'}], a: 0 },
      { t: R('卓越的領導才能', 'ㄓㄨㄛˊ ㄩㄝˋ ㄉㄜ˙ ㄌㄧㄥˇ ㄉㄠˇ ㄘㄞˊ ㄋㄥˊ'), q: '他的才能如何？', options: [{c:'平庸',z:'ㄆㄧㄥˊ ㄩㄥ'},{c:'卓越',z:'ㄓㄨㄛˊ ㄩㄝˋ'},{c:'很差',z:'ㄏㄣˇ ㄔㄚ'}], a: 1 },
      { t: R('積極探索未知世界', 'ㄐㄧ ㄐㄧˊ ㄊㄢˋ ㄙㄨㄛˇ ㄨㄟˋ ㄓ ㄕˋ ㄐㄧㄝˋ'), q: '探索的態度是什麼樣的？', options: [{c:'積極',z:'ㄐㄧ ㄐㄧˊ'},{c:'消極',z:'ㄒㄧㄠ ㄐㄧˊ'},{c:'害怕',z:'ㄏㄞˋ ㄆㄚˋ'}], a: 0 },
      { t: R('犧牲奉獻為大眾', 'ㄒㄧ ㄕㄥ ㄈㄥˋ ㄒㄧㄢˋ ㄨㄟˋ ㄉㄚˋ ㄓㄨㄥˋ'), q: '為大眾做了什麼？', options: [{c:'犧牲',z:'ㄒㄧ ㄕㄥ'},{c:'逃跑',z:'ㄊㄠˊ ㄆㄠˇ'},{c:'自私',z:'ㄗˋ ㄙ'}], a: 0 },
      { t: R('不斷奮鬥才能成功', 'ㄅㄨˊ ㄉㄨㄢˋ ㄈㄣˋ ㄉㄡˋ ㄘㄞˊ ㄋㄥˊ ㄔㄥˊ ㄍㄨㄥ'), q: '成功的條件是什麼？', options: [{c:'睡覺',z:'ㄕㄨㄟˋ ㄐㄧㄠˋ'},{c:'奮鬥',z:'ㄈㄣˋ ㄉㄡˋ'},{c:'運氣',z:'ㄩㄣˋ ㄑㄧˋ'}], a: 1 },
      { t: R('保持謙虛的態度', 'ㄅㄠˇ ㄔˊ ㄑㄧㄢ ㄒㄩ ㄉㄜ˙ ㄊㄞˋ ㄉㄨˋ'), q: '應該保持什麼態度？', options: [{c:'驕傲',z:'ㄐㄧㄠ ㄠˋ'},{c:'自大',z:'ㄗˋ ㄉㄚˋ'},{c:'謙虛',z:'ㄑㄧㄢ ㄒㄩ'}], a: 2 },
      { t: R('開拓新的商業市場', 'ㄎㄞ ㄊㄨㄛˋ ㄒㄧㄣ ㄉㄜ˙ ㄕㄤ ㄧㄝˋ ㄕˋ ㄔㄤˇ'), q: '他們做了什麼事？', options: [{c:'守舊',z:'ㄕㄡˇ ㄐㄧㄡˋ'},{c:'放棄',z:'ㄈㄤˋ ㄑㄧˋ'},{c:'開拓',z:'ㄎㄞ ㄊㄨㄛˋ'}], a: 2 },
      { t: R('雨水豐沛滋潤大地', 'ㄩˇ ㄕㄨㄟˇ ㄈㄥ ㄆㄟˋ ㄗ ㄖㄨㄣˋ ㄉㄚˋ ㄉㄧˋ'), q: '雨水的量如何？', options: [{c:'很少',z:'ㄏㄣˇ ㄕㄠˇ'},{c:'豐沛',z:'ㄈㄥ ㄆㄟˋ'},{c:'乾涸',z:'ㄍㄢ ㄏㄜˊ'}], a: 1 },
      { t: R('團結力量大', 'ㄊㄨㄢˊ ㄐㄧㄝˊ ㄌㄧˋ ㄌㄧㄤˋ ㄉㄚˋ'), q: '什麼東西力量大？', options: [{c:'團結',z:'ㄊㄨㄢˊ ㄐㄧㄝˊ'},{c:'分裂',z:'ㄈㄣ ㄌㄧㄝˋ'},{c:'自私',z:'ㄗˋ ㄙ'}], a: 0 },
      { t: R('目標非常清晰', 'ㄇㄨˋ ㄅㄧㄠ ㄈㄟ ㄔㄤˊ ㄑㄧㄥ ㄒㄧ'), q: '目標的狀態如何？', options: [{c:'模糊',z:'ㄇㄛˊ ㄏㄨˊ'},{c:'清晰',z:'ㄑㄧㄥ ㄒㄧ'},{c:'不知道',z:'ㄅㄨˋ ㄓ ㄉㄠˋ'}], a: 1 },
      { t: R('誠實面對自己錯誤', 'ㄔㄥˊ ㄕˊ ㄇㄧㄢˋ ㄉㄨㄟˋ ㄗˋ ㄐㄧˇ ㄘㄨㄛˋ ㄨˋ'), q: '該怎麼面對錯誤？', options: [{c:'逃避',z:'ㄊㄠˊ ㄅㄧˋ'},{c:'誠實',z:'ㄔㄥˊ ㄕˊ'},{c:'說謊',z:'ㄕㄨㄛ ㄏㄨㄤˇ'}], a: 1 },
      { t: R('學習寬容待人', 'ㄒㄩㄝˊ ㄒㄧˊ ㄎㄨㄢ ㄖㄨㄥˊ ㄉㄞˋ ㄖㄣˊ'), q: '應該學會如何待人？', options: [{c:'計較',z:'ㄐㄧˋ ㄐㄧㄠˋ'},{c:'生氣',z:'ㄕㄥ ㄑㄧˋ'},{c:'寬容',z:'ㄎㄨㄢ ㄖㄨㄥˊ'}], a: 2 }
    ]
  }
};

const PRACTICE_TYPES = ['發音識字', '筆順練習', '詞彙語法', '閱讀理解'];
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

  const GAME_BG = "https://raw.githubusercontent.com/emilychen89405264-prog/for-chinese/main/BG_1.png";

  const speak = (text) => {
    if (typeof window === 'undefined') return;
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
    if (selectedCategory === '筆順練習') {
      return shuffledChars.map(item => {
          const { opts, aIdx } = makeOptions(item, true);
          return { type: 'stroke', c: item.c, z: item.z, options: opts, correctAnswer: aIdx };
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

  useEffect(() => {
    if (view === 'battle' && q?.type === 'stroke' && writerRef.current && !showSuccessMessage) {
      writerRef.current.innerHTML = '';
      HanziWriter.create(writerRef.current, q.c, { width: 220, height: 220, strokeColor: '#fbbf24', padding: 5 }).animateCharacter();
    }
  }, [view, q, showSuccessMessage]);

  const handleAnswer = (i) => {
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
      alert('不對唷，再試一次！');
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
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://raw.githubusercontent.com/emilychen89405264-prog/for-chinese/main/mainpage.png')` }}>
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
                          
                          {/* 筆順題左右排版 */}
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
                          )}

                          {/* 發音題與閱讀理解排版 */}
                          {q?.type !== 'stroke' && (
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
                                  <div className="bg-yellow-500/80 p-3 rounded-2xl border-2 border-yellow-500/70 w-full text-center">
                                    <p className="text-x4 font-black text-black-400 tracking-wider">❓ {q.q}</p>
                                  </div>
                                </div>
                              )}

                              <div className="flex flex-col gap-3 w-full max-w-3xl pb-2 mt-2">
                                {(q?.options || []).map((opt, i) => (
                                  <button key={i} onClick={() => handleAnswer(i)}
                                          className="w-full text-left py-2 px-6 rounded-full border-4 border-slate-600 bg-slate-800 hover:border-yellow-400 transition-all flex items-center group shadow-xl active:scale-95">
                                    <div className="flex items-center gap-4 w-full justify-center">
                                      <span className="w-10 h-10 bg-slate-900 rounded-full flex-shrink-0 flex items-center justify-center text-yellow-400 font-black text-xl border-2 border-yellow-400/30 shadow-inner group-hover:border-yellow-400">{i+1}</span>
                                      <div className="flex-1 flex justify-center">
                                        <VerticalRuby c={opt.c} z={opt.z} fontSize={q.type === 'reading' ? "text-2xl" : "text-5xl"} />
                                      </div>
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