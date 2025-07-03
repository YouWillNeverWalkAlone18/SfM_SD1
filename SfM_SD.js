var jsPsych = initJsPsych({
  on_finish: function () {
    jsPsych.data.displayData();
  }
});
// イメージ配置順ランダム
const image_order = jsPsych.randomization.shuffle(["CW", "CCW"]);

// イメージ対応値
const label_map = {
  "CW": 1,
  "CCW": 0
};

const subject_id = jsPsych.randomization.randomID(10);
const filename = `${subject_id}.csv`;

const save_data = {
  type: jsPsychPipe,
  action: "save",
  experiment_id: "IZ6AZ6fDV83W",
  filename: filename,
  data_string: () => jsPsych.data.get().csv()
};

let completedTrials = 5; // 初期値を5に設定

// ========== sfm_neutral ==========
let sfm_neutral = function (p) {
  let rects = [];
  let numRects = 400;
  let R = 170;
  let rectWidth = 8;
  let rectHeight = 8;
  let omega = 0.025;
  let colors = [];

  p.setup = function () {
    p.createCanvas(800, 600);
    for (let i = 0; i < numRects; i++) {
      let angle = p.random(p.TWO_PI);
      let y = p.random(-200, 200);
      let isBlack = i < numRects / 2;
      colors[i] = isBlack ? p.color(40) : p.color(210);
      rects.push({
        angle: angle,
        y: y,
        phase: p.random(p.TWO_PI)
      });
    }
    p.shuffle(colors, true);
    p.noStroke();
  };

  p.draw = function () {      
    p.background(100);
    p.translate(p.width / 2, p.height / 2);
    for (let i = 0; i < numRects; i++) {
      let r = rects[i];
      let angle = r.angle + p.frameCount * omega;
      let x = R * p.cos(angle);
      let y = r.y;
      let distanceFromCenter = Math.abs(x);
      let visibleWidth = p.map(distanceFromCenter, 160, 180, rectWidth, 0);
      visibleWidth = p.constrain(visibleWidth, 0, rectWidth);
      let adjustedX = x > 0 ? x - (rectWidth - visibleWidth) / 2 : x + (rectWidth - visibleWidth) / 2;
      p.fill(colors[i]);
      p.rect(adjustedX, y - rectHeight / 2, visibleWidth, 8);
    }
  };
};

// ========== sfm_cw ==========
let sfm_cw = function (p) {
  let rects = [];
  let numRects = 400;
  let R = 170;
  let baseSize = 8;
  let omega = 0.025;
  let colors = [];

  p.setup = function () {
    p.createCanvas(800, 600);
    for (let i = 0; i < numRects; i++) {
      let angle = p.random(p.TWO_PI);
      let y = p.random(-200, 200);
      let isBlack = i < numRects / 2;
      colors[i] = isBlack ? p.color(40) : p.color(210);
      rects.push({
        angle: angle,
        y: y,
        phase: p.random(p.TWO_PI),
        prevX: R * p.cos(angle),
        currentScale: 1.0
      });
    }
    p.shuffle(colors, true);
    p.noStroke();
  };

  p.draw = function () {
    p.background(100);
    p.translate(p.width / 2, p.height / 2);

    let backgroundRects = [];
    let foregroundRects = [];

    for (let i = 0; i < numRects; i++) {
      let r = rects[i];
      let angle = r.angle + p.frameCount * omega;
      let x = R * p.cos(angle);
      let vel = x - r.prevX;
      r.prevX = x;

      let y = r.y;

      let maxScale = 1.3;
      let minScale = 0.7;
      let distanceRatio = p.abs(x) / R;

       if (vel < 0) {
      // 왼쪽 방향 → 전면: 더 커짐
      r.currentScale = p.map(distanceRatio, 1, 0, minScale, maxScale) * 1.3;
    } else {
      // 오른쪽 방향 → 후면: 점점 작아짐
      let shrink = p.map(distanceRatio, 1, 0, 1.0, 0.7);
      r.currentScale *= shrink;
      r.currentScale = p.constrain(r.currentScale, minScale, maxScale);
    }
      let alpha = vel < 0 ? 255 : 150; // 
      let rectSize = baseSize * r.currentScale;

      let distanceFromCenter = p.abs(x);
      let visibleWidth = p.map(distanceFromCenter, 160, 180, rectSize, 0);
      visibleWidth = p.constrain(visibleWidth, 0, rectSize);

      let adjustedX = x > 0
        ? x - (rectSize - visibleWidth) / 2
        : x + (rectSize - visibleWidth) / 2;

      let obj = {
        x: adjustedX,
        y: y - rectSize / 2,
        size: visibleWidth,
        col: colors[i],
        alpha: alpha
      };

      if (vel < 0) {
        foregroundRects.push(obj);
      } else {
        backgroundRects.push(obj);
      }
    }

    for (let r of backgroundRects) {
      p.fill(p.red(r.col), p.green(r.col), p.blue(r.col), r.alpha);
      p.rect(r.x, r.y, r.size, r.size);
    }

    for (let r of foregroundRects) {
      p.fill(p.red(r.col), p.green(r.col), p.blue(r.col), r.alpha);
      p.rect(r.x, r.y, r.size, r.size);
    }
  };
};

// ========== sfm_ccw ==========
let sfm_ccw = function (p) {
  let rects = [];
  let numRects = 400;
  let R = 170;
  let baseSize = 8;
  let omega = 0.025;
  let colors = [];

  p.setup = function () {
    p.createCanvas(800, 600);
    for (let i = 0; i < numRects; i++) {
      let angle = p.random(p.TWO_PI);
      let y = p.random(-200, 200);
      let isBlack = i < numRects / 2;
      colors[i] = isBlack ? p.color(40) : p.color(210);
      rects.push({
        angle: angle,
        y: y,
        phase: p.random(p.TWO_PI),
        prevX: R * p.cos(angle),
        currentScale: 1.0
      });
    }
    p.shuffle(colors, true);
    p.noStroke();
  };

  p.draw = function () {
    p.background(100);
    p.translate(p.width / 2, p.height / 2);

    let backgroundRects = [];
    let foregroundRects = [];

    for (let i = 0; i < numRects; i++) {
      let r = rects[i];
      let angle = r.angle + p.frameCount * omega;
      let x = R * p.cos(angle);
      let vel = x - r.prevX;
      r.prevX = x;

      let y = r.y;

      let maxScale = 1.3;
      let minScale = 0.7;
      let distanceRatio = p.abs(x) / R;

      if (vel > 0) {
        r.currentScale = p.map(distanceRatio, 1, 0, minScale, maxScale) * 1.3;
      } else {
        let shrink = p.map(distanceRatio, 1, 0, 1.0, 0.7);
        r.currentScale *= shrink;
        r.currentScale = p.constrain(r.currentScale, minScale, maxScale);
      }

      let alpha = vel > 0 ? 255 : 150;
      let rectSize = baseSize * r.currentScale;

      let distanceFromCenter = p.abs(x);
      let visibleWidth = p.map(distanceFromCenter, 160, 180, rectSize, 0);
      visibleWidth = p.constrain(visibleWidth, 0, rectSize);

      let adjustedX = x > 0
        ? x - (rectSize - visibleWidth) / 2
        : x + (rectSize - visibleWidth) / 2;

      let obj = {
        x: adjustedX,
        y: y - rectSize / 2,
        size: visibleWidth,
        col: colors[i],
        alpha: alpha
      };

      if (vel > 0) {
        foregroundRects.push(obj);
      } else {
        backgroundRects.push(obj);
      }
    }

    for (let r of backgroundRects) {
      p.fill(p.red(r.col), p.green(r.col), p.blue(r.col), r.alpha);
      p.rect(r.x, r.y, r.size, r.size);
    }

    for (let r of foregroundRects) {
      p.fill(p.red(r.col), p.green(r.col), p.blue(r.col), r.alpha);
      p.rect(r.x, r.y, r.size, r.size);
    }
  };
};

  
function makeBlock(blockIndex) {
  let trials = [];

  for (let i = 0; i < 5; i++) { // 블럭당 시행 수 10에서 5로 변경
    let trial_sketch;

    if (blockIndex < 4 && i === 0) { // 最初の４ブロックの初期試行：時計回り
      trial_sketch = sfm_cw;
    } else if (blockIndex >= 4 && blockIndex < 8 && i === 0) { // 次の４ブロックの初期試行：反時計回り
      trial_sketch = sfm_ccw;
    } else {
      trial_sketch = sfm_neutral;  // 残りのブロックは全て中立刺激
    }

    trials.push({
      type: jsPsychHtmlKeyboardResponse,
      stimulus: `<div style="font-size:32px;">+</div>`,
      choices: "NO_KEYS",
      trial_duration: 1000,
    });

    trials.push({
      type: jsPsychP5,
      sketch: trial_sketch,
      trial_duration: 2000,
    });

    trials.push({
      type: jsPsychHtmlButtonResponse,
      stimulus: '<div style="margin-bottom:10px;">\
       <p>どちらに回転しているように見えましたか？</p>\
       <p>回転方向が途中で変わったり、はっきりとわからない場合は、</p>\
       <p>より強く感じた回転方向を回答してください。</p>\
　　　</div>',
      choices: function () {
  return image_order.map(label =>
    `<img src="${label}.png" alt="${label === 'CW' ? '時計回り' : '反時計回り'}" width="200">`
  );
},
      margin_vertical: '15px',
      data: {
        task: 'response',
        block: blockIndex,
        trial_in_block: i,
        stimulus_type:
          blockIndex < 4 && i === 0
            ? 'sfm_cw'
            : blockIndex >= 4 && blockIndex < 8 && i === 0
            ? 'sfm_ccw'
            : 'sfm_neutral',
      },
      on_finish: function(data) {
  const chosen_label = image_order[data.response];
  const chosen_value = label_map[chosen_label];

  data.chosen_label = chosen_label;
  data.chosen_value = chosen_value;

  // 🔹 전체 실험에서 몇 번째 response trial인지 저장 (전체 흐름 분석용)
  data.trial_index_global = jsPsych.data.get().filter({task: 'response'}).count();

  // take 'chosen_value' from prev.trial in same block
  if (data.trial_in_block > 0) {
    const previous_trial = jsPsych.data.get().filter({
      task: 'response',
      block: data.block,
      trial_in_block: data.trial_in_block - 1
    }).values()[0]; // only first

    if (previous_trial) {
      const prev_value = previous_trial.chosen_value;
      data.Continue = (prev_value === chosen_value) ? 1 : 0;

    } else {
      data.Continue = null;
    }
  } else {
    data.Continue = null; 
  }
},
  });

    trials.push({
      type: jsPsychHtmlKeyboardResponse,
      stimulus: '',
      choices: "NO_KEYS",
      trial_duration: 1000,
    });
  }

  // Resting
  trials.push({
    type: jsPsychHtmlButtonResponse,
    stimulus: function () {
      let progressBarWidth = (completedTrials / 80) * 100;
      return `
        <p>5試行が終了しました。休憩が必要な場合は、ここでお取りください。</p>
        <p>準備ができたら、ボタンを押して次に進んでください。</p>
        <p style="margin-top: 20px;">${completedTrials} / 80 回が完了しました。</p>
        <div style="width: 80%; height: 20px; border: 1px solid #000; margin: 10px auto; background-color: #eee;">
          <div style="width: ${progressBarWidth}%; height: 100%; background-color: #4caf50;"></div>
        </div>
      `;
    },
    choices: ['次へ'],
    on_finish: function () {
      completedTrials += 5;
    }
  });

  return trials;
}

// ---------------- timeline ----------------

const block_order = jsPsych.randomization.shuffle([...Array(16).keys()]); // 0-15のブロック順をランダム化
let timeline = [];

// page1: intro
timeline.push({
  type: jsPsychHtmlButtonResponse,
  stimulus: function () {
  return `
    <div style="max-width: 800px; margin: 0 auto; font-size: 16px; line-height: 1.6; text-align: left;">
      <h3>研究に関するご説明</h3>
      <p>
        本研究は、立命館大学総合心理学部・高橋康介ゼミのCHANG GIJOONGが実施する卒業研究です。<br>
        研究の概要は
        <a href="https://youwillneverwalkalone18.github.io/SfM_SD1" target="_blank">こちら</a> からご覧いただけます。<br>
        本研究に関するお問い合わせ先は
        <a href="cp0175ii@ed.ritsumei.ac.jp">cp0175ii@ed.ritsumei.ac.jp</a> までメールにてお願いします。
      </p>

       <!-- 하나의 스크롤 박스로 통합된 부분 -->
      <div style="border: 1px solid #aaa; padding: 10px; height: 250px; overflow-y: auto; margin-bottom: 20px; text-align: left;">

        <p><strong>研究の目的について</strong><br>
        本研究は、視覚的知覚に関する心理的メカニズムを理解することを目的としています。<br>
        実験では、画面上に提示される視覚刺激に対して反応していただきます。</p>
        
        <p><strong>実験の手続き</strong><br>
        所要時間は普通に実施した場合には長くて10分程度の見込みです <br>
       （ゆっくりやっていただいた場合には、もう少し時間がかかる可能性もあります）。<br>
        画面上に画像や動画が提示され、それに対する反応を求めます。一部の試行では曖昧な刺激が表示され、判断が難しいことがあります。</p> 

        <p><strong>危険性・不快感について</strong><br>
        疲労を除けば、身体的な危険性や不快感はありません。<br>
        ただし、本実験では、奥行きのある複数の点が回転して見えるような視覚刺激を用います。<br>
        そのため、動いている視覚刺激によって気分が悪くなったことがある方や、視覚的な違和感（めまい・酔いなど）を感じやすい方は、参加をお控えいただくことをおすすめします。<br>
        また、実験中に気分が悪くなった場合は、すぐに中止していただいて構いません。</p>

        <p><strong>調査の内容について</strong><br>
        この実験では、画面上に文や画像が提示されます。表示に従って、キーボードやマウスを使って所定の反応をしていただきます。</p>

        <p><strong>得られたデータの取り扱いについて</strong><br>
        得られた回答データは国内外の学会や論文で発表することがありますが、データは統計的な処理などを行いますので、個人が特定されることはありません。<br>
        また、本実験により得られたデータは将来の研究のため個人が特定されないかたちでオープンデータとして扱います。</p>

        <p><strong>参加と中止について</strong><br>
        本研究へのご協力は、参加者の皆様の自由意思に委ねられており、研究にご協力頂けない場合でも不利益につながることはありません。<br>
        また、ご本人の申し出があれば、いつでもデータは廃棄します。但しデータが匿名化されている場合、既に好評された場合などにはデータの廃棄はできません。<br>
        参加に同意したとしても、皆様の申し出により不利益を受けることなくいつでも同意を撤回することができます。</p>
      </div>

      <hr style="margin: 30px 0;">

      <h3>この実験に関するご説明</h3>
      <p>
        実験に興味を持っていただきありがとうございます。<br>
        実験では、画面中央に複数の小さな四角形がランダムに配置され、2秒間、左右方向に動きます。<br>
        動きを見て、円筒が回転しているように見えた場合は、見えた回転方向をボタンで選択してください。<br>
        時計回りに見えた場合は「時計回り」、反時計回りに見えた場合は「反時計回り」のボタンを押してください。<br>
        回転方向が途中で変わったり、はっきりとわからない場合は、より強く感じた回転方向を回答してください。<br>
        これまでの説明を読んだうえで、実験への参加を見合わせたり、開始後に中止したりすることも可能です。
      </p>

      <p style="text-align:left; font-weight:bold; margin-top: 30px;">
        実験への参加に同意いただける場合には、下の「次へ」ボタンを押してください。
      </p>
    </div>
  `;
},
 choices: ['次へ'],
});

// === page2: button.intro ===
timeline.push({
  type: jsPsychHtmlButtonResponse,
  stimulus: function () {
    const image_html = `
      <div style="display: flex; justify-content: center; gap: 40px; margin-top: 20px; margin-bottom: 20px;">
        ${image_order.map(label => `<img src="${label}.png" alt="${label}" width="200">`).join('')}
      </div>`;

    return `
      <div style="max-width: 800px; margin: 0 auto; font-size: 16px; line-height: 1.6; text-align: left;">
        <p>回転方向を選択するためのボタンは、以下のように画面に表示されます。</p>
        <p>実験への参加に同意される場合は、下の「次へ」ボタンを押してください。</p>
        <p>ボタンを押すと、ただちに実験が始まります。</p>
        ${image_html}
      </div>
    `;
  },
  choices: ['次へ']
});

// making block
for (let i = 0; i < block_order.length; i++) {
  timeline.push(...makeBlock(block_order[i]));
}

// end
timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>以上で実験は終了です。</p>
    <p><strong>任意のキーを押して、データの保存が完了するまでしばらくお待ちください。</strong></p>
    <p>ご協力ありがとうございました。</p>`,
});

timeline.push(save_data);

jsPsych.run(timeline);
