#!/usr/bin/env node

const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
const rm = require('rimraf');
const ProgressBar = require('cli-progress');

const arguments = process.argv;
if (arguments.length < 3) {
  throw new Error('Please input image path.');
}

const imageNameWithExtension = path.basename(arguments[arguments.length - 1]);

const imageName = imageNameWithExtension.split('.')[0];
const imageType = imageNameWithExtension.split('.')[1];

const imagePath = path.resolve('./', imageNameWithExtension);
let imageOutPath = path.resolve(`./${imageNameWithExtension}.out`);

if (!fs.existsSync(imagePath)) {
  throw new Error('The image not exists!');
}
if (fs.existsSync(imageOutPath)) {
  rm.sync(imageOutPath);
}
fs.mkdirSync(imageOutPath);

const size = (point, start, end) => {
  return { point, multiple: { start, end } };
}
const imageSize = [
  size(20, 1, 3),
  size(29, 1, 3),
  size(40, 1, 3),
  size(60, 2, 3),
  size(76, 1, 2),
  size(83.5, 2, 2),
  size(1024, 1, 1)
];

// 计算总图片数量
const total = imageSize.map(size => size.multiple.end - size.multiple.start + 1).reduce((a, b) => a + b, 0);

// 设置进度条
const bar = new ProgressBar.Bar({}, ProgressBar.Presets.shades_classic);
bar.start(total, 0);

const image = sharp(imagePath);

for (let i = 0; i < imageSize.length; i ++) {
  const size = imageSize[i];
  const { point, multiple } = size;

  for (let j = multiple.start; j <= multiple.end; j ++) {
    image
      .resize(point * j, point * j)
      .toFile(`${imageOutPath}/${imageName}-${point}@${j}x.${imageType}`);

    // 修改进度条
    bar.increment();
  }
}

// 完成进度条
bar.stop();