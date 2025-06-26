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
  data_string: () => jsPsych.data.get().csv()
};

let completedTrials = 10;

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

  for (let i = 0; i < 10; i++) {
    let trial_sketch;

    if ((blockIndex === 0 || blockIndex === 1) && i === 0) {
      trial_sketch = sfm_cw;
    } else if ((blockIndex === 2 || blockIndex === 3) && i === 0) {
      trial_sketch = sfm_ccw;
    } else {
      trial_sketch = sfm_neutral;
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
      choices: ['<img src="CCW.png" alt="反時計回り" width="200">',
                '<img src="CW.png" alt="時計回り" width="200">'],
      margin_vertical: '15px',
      data: {
        task: 'response',
        block: blockIndex,
        trial_in_block: i,
        stimulus_type:
          (blockIndex === 0 || blockIndex === 1) && i === 0
            ? 'sfm_cw'
            : (blockIndex === 2 || blockIndex === 3) && i === 0
            ? 'sfm_ccw'
            : 'sfm_neutral',
      },
    });


    trials.push({
      type: jsPsychHtmlKeyboardResponse,
      stimulus: '',
      choices: "NO_KEYS",
      trial_duration: 1000,
    });
  }

  // 휴식 화면 추가
  trials.push({
    type: jsPsychHtmlButtonResponse,
    stimulus: function () {
      let progressBarWidth = (completedTrials / 80) * 100;
      return `
        <p>10試行が終了しました。休憩が必要な場合は、ここでお取りください。</p>
        <p>準備ができたら、ボタンを押して次に進んでください。</p>
        <p style="margin-top: 20px;">${completedTrials} / 80 回が完了しました。</p>
        <div style="width: 80%; height: 20px; border: 1px solid #000; margin: 10px auto; background-color: #eee;">
          <div style="width: ${progressBarWidth}%; height: 100%; background-color: #4caf50;"></div>
        </div>
      `;
    },
    choices: ['次へ'],
    on_finish: function () {
      completedTrials += 10;
    }
  });

  return trials;
}

// ---------------- 타임라인 구성 ----------------

const block_order = jsPsych.randomization.shuffle([0, 1, 2, 3, 4, 5, 6, 7]);
let timeline = [];

// 지시문
timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
      <div style="margin-bottom: 40px; text-align: center; max-width: 800px;">
        <p>これから画面中央に複数の小さな四角形がランダムに配置され、2秒間、左右方向に動きます。</p>
        <p>動きを見て、シリンダが回転しているように見えた場合は、見えた回転方向をボタンで選択してください。</p>
        <p>時計回りに見えた場合は「時計回り」、反時計回りに見えた場合は「反時計回り」のボタンを押してください。</p>
        <p>ご協力いただける場合は、任意のキーを押して実験を開始してください。</p>
      </div>
      <img src="CW.png" alt="回転方向の例" style="margin: 40px; width: 200px;">',
      <img src="CCW.png" alt="回転方向の例" style="margin: 40px; width: 200px;">,
    </div>`,
});

// 각 block 삽입
for (let i = 0; i < block_order.length; i++) {
  timeline.push(...makeBlock(block_order[i]));
}

// 종료 메시지
timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>以上で実験は終了です。</p>
    <p>任意のキーを押して、データの保存が完了するまでしばらくお待ちください。</p>
    <p>ご協力ありがとうございました。</p>`,
});

// 데이터 저장
timeline.push(save_data);

// 실행
jsPsych.run(timeline);
