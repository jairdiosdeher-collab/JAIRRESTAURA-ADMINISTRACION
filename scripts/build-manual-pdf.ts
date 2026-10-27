import fs from 'node:fs';
import path from 'node:path';
import { generateUserManualPdfDoc } from '../src/utils/manualPdfGenerator';

async function main() {
  console.log('Generating vector A4 User Manual PDF...');
  const doc = generateUserManualPdfDoc();
  const pdfArrayBuffer = doc.output('arraybuffer');
  const buffer = Buffer.from(pdfArrayBuffer);

  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const targetPath = path.join(publicDir, 'Manual_Usuario_JAIRRESTAURA_Consultorio_Digital.pdf');
  fs.writeFileSync(targetPath, buffer);
  console.log(`Saved User Manual PDF (${(buffer.length / 1024).toFixed(1)} KB) to ${targetPath}`);
}

main().catch((err) => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
