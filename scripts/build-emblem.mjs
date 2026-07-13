// Génère public/images/logo/emblem-circle.png à partir du logo officiel :
// on ne garde que l'emblème circulaire du haut (feuille + icônes + bâtiment
// + « LUMORA GROUP » gravé dans le cercle), SANS le bandeau des 5 sous-marques.
// La transparence est préservée. Rejouer après tout remplacement de Logo.png :
//   node scripts/build-emblem.mjs
//
// Le cercle occupe les ~74 % supérieurs de l'image (mesuré sur la source) ;
// en dessous commence le bandeau pleine largeur. On rogne ensuite les marges
// transparentes pour un cadrage serré sur le cercle.

import sharp from "sharp";
import path from "node:path";

const SRC = path.resolve("public/images/logo/Logo.png");
const OUT = path.resolve("public/images/logo/emblem-circle.png");

// Fraction de hauteur conservée : l'emblème se termine en pointe arrondie
// à ~73 % ; le bandeau pleine largeur démarre à 74 %. On coupe juste avant
// pour ne pas récupérer un liseré du bandeau en bas de l'emblème.
const CIRCLE_BOTTOM = 0.73;
// Seuil alpha considéré « visible » pour le rognage des marges.
const ALPHA_MIN = 24;
// Largeur cible du PNG final : l'emblème s'affiche au plus à ~460px (desktop),
// donc 920px couvre le retina 2× sans surcharger le dépôt. next/image sert
// ensuite des variantes WebP/AVIF encore plus légères.
const TARGET_W = 920;

const src = sharp(SRC);
const meta = await src.metadata();
const cropH = Math.round(meta.height * CIRCLE_BOTTOM);

// 1) Découpe la bande supérieure contenant le cercle.
const top = await sharp(SRC)
  .extract({ left: 0, top: 0, width: meta.width, height: cropH })
  .toBuffer();

// 2) Calcule la bbox du contenu opaque pour rogner les marges transparentes.
const { data, info } = await sharp(top)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
let minX = width, minY = height, maxX = -1, maxY = -1;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const alpha = data[(y * width + x) * channels + (channels - 1)];
    if (alpha > ALPHA_MIN) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
const bboxW = maxX - minX + 1;
const bboxH = maxY - minY + 1;

// 3) Rogne, redimensionne, exporte en PNG compressé (transparence conservée).
await sharp(top)
  .extract({ left: minX, top: minY, width: bboxW, height: bboxH })
  .resize({ width: TARGET_W })
  .png({ compressionLevel: 9, palette: false })
  .toFile(OUT);

const outMeta = await sharp(OUT).metadata();
console.log(
  `emblem-circle.png : ${outMeta.width}×${outMeta.height} ` +
    `(source ${meta.width}×${meta.height}, bande 0→${CIRCLE_BOTTOM}, ` +
    `bbox ${bboxW}×${bboxH})`,
);
