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
        <p>これから画面上に複数の小さい四角形が現れ、2秒間、左右に動きます。</p>
        <p>その動きからシリンダが回転するように見えましたら、見えた回転の方向をボダンで回答してもらいます。</p>
        <p>回る方向が時計回りでしたら「時計回り」、反時計回りでしたら「反時計回り」ボダンを押してください。</p>
        <p>ご協力いただける場合には、任意のキーを入力して、実験を開始してください。</p>
      </div>
      <img src="CwCCw2.png" ...
     alt="回転方向の例"
     style="margin: 40px; width: 400px;">
    </div>
  `,
};

// 注視点（十字マーク）
let fixation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<div style="font-size:32px;">+</div>`,
  choices: "NO_KEYS",
  trial_duration: 1500, // by Fischer & Whitney (2014), 1.5秒
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
  stimulus: '<div style="margin-bottom:10px;">どちらに回転しているように見えましたか？</div>',
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
  trial_duration: 1500,
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
