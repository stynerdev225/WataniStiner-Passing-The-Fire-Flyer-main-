const puppeteer = require('puppeteer');

async function generatePDF() {
  // Launch browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport size
  await page.setViewport({ width: 1200, height: 800 });
  
  // Navigate to your local development server or Vercel URL
  // Replace with your actual Vercel URL
  await page.goto('http://localhost:3000', { 
    waitUntil: 'networkidle2',
    timeout: 60000 
  });
  
  // Wait for images to load
  await page.waitForTimeout(3000);
  
  // Generate PDF
  const pdf = await page.pdf({
    path: 'passing-the-fire-flyer.pdf',
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0.5in',
      right: '0.5in',
      bottom: '0.5in',
      left: '0.5in'
    },
    preferCSSPageSize: true,
    displayHeaderFooter: false,
  });
  
  await browser.close();
  console.log('PDF generated successfully as passing-the-fire-flyer.pdf');
}

generatePDF().catch(console.error);
