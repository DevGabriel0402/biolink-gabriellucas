import { AssessmentInput, AssessmentResult, goalLabels } from './fitnessCalculations';

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
  context.fill();
}

function drawMetric(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  label: string,
  value: string,
  accent: string
) {
  context.fillStyle = 'rgba(255,255,255,0.07)';
  roundedRect(context, x, y, width, 190, 34);
  context.fillStyle = '#9eabbc';
  context.font = '700 30px Arial';
  context.fillText(label.toUpperCase(), x + 34, y + 55);
  context.fillStyle = accent;
  context.font = '900 56px Arial';
  context.fillText(value, x + 34, y + 132);
}

function getOpaqueBounds(image: HTMLImageElement) {
  const sourceCanvas = document.createElement('canvas');
  sourceCanvas.width = image.naturalWidth;
  sourceCanvas.height = image.naturalHeight;
  const sourceContext = sourceCanvas.getContext('2d', { willReadFrequently: true });
  if (!sourceContext) return { x: 0, y: 0, width: image.naturalWidth, height: image.naturalHeight };

  sourceContext.drawImage(image, 0, 0);
  const pixels = sourceContext.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height).data;
  let minX = sourceCanvas.width;
  let minY = sourceCanvas.height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < sourceCanvas.height; y += 2) {
    for (let x = 0; x < sourceCanvas.width; x += 2) {
      if (pixels[(y * sourceCanvas.width + x) * 4 + 3] > 12) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (minX > maxX || minY > maxY) return { x: 0, y: 0, width: image.naturalWidth, height: image.naturalHeight };
  const paddingX = Math.max(8, Math.round((maxX - minX) * 0.06));
  return {
    x: Math.max(0, minX - paddingX),
    y: Math.max(0, minY - 4),
    width: Math.min(sourceCanvas.width - Math.max(0, minX - paddingX), maxX - minX + paddingX * 2),
    height: maxY - minY
  };
}

export async function createStoryCard(input: AssessmentInput, result: AssessmentResult, bodyImageSrc?: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Não foi possível criar o cartão.');

  const background = context.createLinearGradient(0, 0, 1080, 1920);
  background.addColorStop(0, '#09110f');
  background.addColorStop(0.48, '#101820');
  background.addColorStop(1, '#07090d');
  context.fillStyle = background;
  context.fillRect(0, 0, 1080, 1920);

  const glow = context.createRadialGradient(860, 180, 10, 860, 180, 520);
  glow.addColorStop(0, 'rgba(0,229,163,0.28)');
  glow.addColorStop(1, 'rgba(0,229,163,0)');
  context.fillStyle = glow;
  context.fillRect(0, 0, 1080, 800);

  context.fillStyle = '#00e5a3';
  context.font = '900 36px Arial';
  context.fillText('GABRIEL LUCAS  •  @ogabriielvieira', 70, 105);

  context.fillStyle = '#ffffff';
  context.font = '900 78px Arial';
  context.fillText('MINHA AVALIAÇÃO', 70, 245);
  context.fillText('FITNESS', 70, 330);

  context.fillStyle = '#9eabbc';
  context.font = '500 34px Arial';
  context.fillText(input.name.trim() ? `Resultado de ${input.name.trim()}` : 'Meu ponto de partida', 72, 395);

  let bodyImage: HTMLImageElement | null = null;
  if (bodyImageSrc) {
    bodyImage = await new Promise<HTMLImageElement | null>((resolve) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => resolve(null);
      image.src = bodyImageSrc;
    });
  }

  context.fillStyle = 'rgba(255,255,255,0.06)';
  roundedRect(context, 70, 465, 940, 350, 48);
  context.fillStyle = result.bmiColor;
  context.font = '900 88px Arial';
  context.fillText(String(result.bmi), 115, 625);
  context.fillStyle = '#ffffff';
  context.font = '800 34px Arial';
  context.fillText('IMC', 120, 682);
  context.fillStyle = result.bmiColor;
  context.font = '800 34px Arial';
  context.fillText(result.bmiCategory, 335, 575);
  context.fillStyle = '#9eabbc';
  context.font = '600 29px Arial';
  context.fillText(goalLabels[input.goal], 335, 635);
  context.fillText(`${input.weight} kg • ${input.height} cm`, 335, 692);

  if (bodyImage) {
    const bounds = getOpaqueBounds(bodyImage);
    const targetX = 680;
    const targetY = 480;
    const targetWidth = 305;
    const targetHeight = 325;
    const isFullFramePhoto = bounds.width >= bodyImage.naturalWidth * 0.94
      && bounds.height >= bodyImage.naturalHeight * 0.94;

    if (isFullFramePhoto) {
      const sourceAspect = bodyImage.naturalWidth / bodyImage.naturalHeight;
      const targetAspect = targetWidth / targetHeight;
      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = bodyImage.naturalWidth;
      let sourceHeight = bodyImage.naturalHeight;
      if (sourceAspect > targetAspect) {
        sourceWidth = bodyImage.naturalHeight * targetAspect;
        sourceX = (bodyImage.naturalWidth - sourceWidth) / 2;
      } else {
        sourceHeight = bodyImage.naturalWidth / targetAspect;
        sourceY = Math.max(0, (bodyImage.naturalHeight - sourceHeight) * 0.24);
      }
      context.save();
      context.beginPath();
      context.roundRect(targetX, targetY, targetWidth, targetHeight, 34);
      context.clip();
      context.drawImage(bodyImage, sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight);
      const photoShade = context.createLinearGradient(targetX, targetY, targetX, targetY + targetHeight);
      photoShade.addColorStop(0, 'rgba(0,0,0,0)');
      photoShade.addColorStop(1, 'rgba(0,0,0,0.18)');
      context.fillStyle = photoShade;
      context.fillRect(targetX, targetY, targetWidth, targetHeight);
      context.restore();
      context.strokeStyle = 'rgba(0,229,163,0.45)';
      context.lineWidth = 4;
      context.beginPath();
      context.roundRect(targetX, targetY, targetWidth, targetHeight, 34);
      context.stroke();
    } else {
      const cropHeight = Math.min(bounds.height, Math.round(bounds.height * 0.66));
      const scale = Math.min(targetWidth / bounds.width, targetHeight / cropHeight);
      const drawWidth = bounds.width * scale;
      const drawHeight = cropHeight * scale;
      context.save();
      context.shadowColor = 'rgba(0,0,0,0.55)';
      context.shadowBlur = 28;
      context.drawImage(
        bodyImage,
        bounds.x,
        bounds.y,
        bounds.width,
        cropHeight,
        targetX + (targetWidth - drawWidth) / 2,
        targetY + (targetHeight - drawHeight),
        drawWidth,
        drawHeight
      );
      context.restore();
    }
  }

  drawMetric(context, 70, 850, 450, 'Meta calórica', `${result.calories} kcal`, '#00e5a3');
  drawMetric(context, 560, 850, 450, 'Água', `${result.waterLiters} L`, '#00f2fe');
  drawMetric(context, 70, 1080, 290, 'Proteína', `${result.protein} g`, '#ffffff');
  drawMetric(context, 395, 1080, 290, 'Carbos', `${result.carbs} g`, '#ffffff');
  drawMetric(context, 720, 1080, 290, 'Gorduras', `${result.fats} g`, '#ffffff');

  context.fillStyle = '#ffffff';
  context.font = '900 46px Arial';
  context.fillText('MEU PRÓXIMO PASSO', 70, 1415);
  context.fillStyle = '#b7c0cc';
  context.font = '600 32px Arial';
  context.fillText(`${input.trainingDays} treinos por semana`, 72, 1480);
  context.fillText(`${result.steps.toLocaleString('pt-BR')} passos por dia`, 72, 1535);
  context.fillText(`${result.fiber} g de fibras por dia`, 72, 1590);

  context.fillStyle = '#00e5a3';
  roundedRect(context, 70, 1690, 940, 120, 36);
  context.fillStyle = '#06100d';
  context.font = '900 38px Arial';
  context.textAlign = 'center';
  context.fillText('FAÇA SUA AVALIAÇÃO GRATUITA', 540, 1765);
  context.textAlign = 'left';
  context.fillStyle = '#00e5a3';
  context.font = '800 30px Arial';
  context.textAlign = 'center';
  context.fillText('@ogabriielvieira', 540, 1860);
  context.fillStyle = '#768394';
  context.font = '500 22px Arial';
  context.fillText('Estimativas educativas • Não substituem avaliação profissional', 540, 1900);
  context.textAlign = 'left';

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Falha ao gerar imagem.')), 'image/png', 0.95);
  });
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
