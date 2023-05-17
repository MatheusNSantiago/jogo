export function cloneArray(array: any[]) {
  return array.map((item) => ({ ...item }));
}

export function makeAnimation(
  scene: Phaser.Scene,
  action: string,
  textureID: string,
  loop = false
): Phaser.Animations.Animation {
  const key = `${textureID}-${action}`;

  if (scene.anims.exists(key)) return scene.anims.get(key);

  const json = scene.cache.json.get(`${textureID}-json`);
  var frames = [];
  for (const texture of json['textures']) {
    for (const frame of texture['frames']) {
      if (frame.filename.startsWith(action)) frames.push(frame.filename);
    }
  }
  const frameNames = scene.anims.generateFrameNames(textureID, {
    start: 0,
    end: frames.length - 1,
    zeroPad: 3,
    prefix: `${action}/${action}_`,
    suffix: '.png',
  });

  const animation = scene.anims.create({
    key: key,
    frames: frameNames,
    frameRate: 25,
    repeat: loop ? -1 : 0,
  });

  return animation || scene.anims.get(key);
}
