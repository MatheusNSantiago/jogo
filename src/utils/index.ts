export function cloneArray(array: any[]) {
  return array.map((item) => ({ ...item }));
}

export function useAnimation(
  scene: Phaser.Scene,
  action: string,
  textureID: string,
  opts: { loop?: boolean; frameRate?: number } = {}
): Phaser.Animations.Animation {
  const key = `${textureID}-${action}`;

  if (scene.anims.exists(key)) return scene.anims.get(key);

  const json = scene.cache.json.get(`${textureID}-json`);
  var frames = [];
  for (const texture of json["textures"]) {
    for (const frame of texture["frames"]) {
      if (frame.filename.startsWith(action)) {
        frames.push(frame.filename);
      }
    }
  }

  const frameNames = scene.anims.generateFrameNames(textureID, {
    start: 0,
    end: frames.length - 1,
    zeroPad: 3,
    prefix: `${action}/${action}_`,
    suffix: ".png",
  });

  const animation = scene.anims.create({
    key: key,
    frames: frameNames,
    frameRate: opts.frameRate ?? 25,
    repeat: opts.loop == undefined ? -1 : opts.loop ? -1 : 0,
  });


  return animation || scene.anims.get(key);
}

export function loadAnimation(
  scene: Phaser.Scene,
  key: string,
  folderPath: string
) {
  scene.load.multiatlas(key, `${folderPath}/${key}.json`, folderPath);
  scene.load.json(`${key}-json`, `${folderPath}/${key}.json`);
}
