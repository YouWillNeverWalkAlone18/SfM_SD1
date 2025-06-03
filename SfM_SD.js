var jsPsych = initJsPsych({
  on_finish: function () {
    jsPsych.data.displayData();
  }           
});

const subject_id = jsPsych.randomization.randomID(10);
const filename = `${subject_id}.csv`;
            
              const save_data = {
                type: jsPsychPipe,
                action: "save",
                experiment_id: "IZ6AZ6fDV83W",
                filename: filename,
                data_string: ()=>jsPsych.data.get().csv()
              };

// sketch.js を jsPsych のスケッチに変換
let sfm_sketch = function (p) {
  let rects = [];
  let numRects = 350;
  let R = 155;
  let rectWidth = 8;
  let omega = 0.025;
  let colors = [];

  p.setup = function () {
    p.createCanvas(600, 600);
    for (let i = 0; i < numRects; i++) {
      let angle = p.random(p.TWO_PI);
      let y = p.random(50, 450);
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
      let y = r.y - p.height / 2;
      let distanceFromCenter = Math.abs(x);
      let visibleWidth = p.map(distanceFromCenter, 150, 160, rectWidth, 0);
      visibleWidth = p.constrain(visibleWidth, 0, rectWidth);
      let adjustedX = x > 0 ? x - (rectWidth - visibleWidth) / 2 : x + (rectWidth - visibleWidth) / 2;
      p.fill(colors[i]);
      p.rect(adjustedX, y, visibleWidth, 8);
    }
  };
};

// 教示文
let instructions = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
     <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
      <div style="margin-bottom: 40px; text-align: center; max-width: 800px;">
        <p>この研究は、□□□□□□□の研究を行うことで○○○○の仕組みを解明することを目的としています。</p>
        <p>実験開始前にこの説明書をお読みいただき、ご協力いただける場合には、任意のキーを入力して、実験を開始します。</p>
      </div>
      <img src="https://raw.githubusercontent.com/YouWillNeverWalkAlone18/SfM_SD1/main/CwCCw2.png" 
           alt="参考画像" 
           style="width: 300px; height: 200px;">
    </div>
  `,
};

// 注視点（十字マーク）
let fixation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<div style="font-size:32px;">+</div>`,
  choices: "NO_KEYS",
  trial_duration: 1000,
};

// sfm刺激提示（2秒）
let sfm_trial = {
  type: jsPsychP5,
  sketch: sfm_sketch,
  trial_duration: 2000,
};

// 反応画面
let response_trial = {
  type: jsPsychHtmlButtonResponse,
  stimulus: '<div style="margin-bottom:10px;">回転方向はどちらでしたか？</div>',
  choices: ['反時計回り', '時計回り'],
  margin_vertical: '15px',
  data: {
    task: 'response',
  }
};

// インターバル（1秒）
let iti = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  choices: "NO_KEYS",
  trial_duration: 1000,
};

// 終了メッセージ
let end_message = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p>以上で実験は終わりです。ご協力ありがとうございました。</p>',
};

// 1試行セット
let trial_procedure = {
  timeline: [fixation, sfm_trial, response_trial, iti],
  repetitions: 10,
};
                  
// 実行タイムライン
jsPsych.run([instructions, trial_procedure, end_message, save_data]);
