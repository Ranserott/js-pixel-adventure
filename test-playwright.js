const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('🌐 Opening page...');
  await page.goto('http://localhost:3000');
  
  // Wait for content to load
  await page.waitForLoadState('networkidle');
  
  // Check page title
  const title = await page.title();
  console.log('📄 Title:', title);
  
  // Check for main elements
  const header = await page.$('.logo h1');
  if (header) {
    const headerText = await header.textContent();
    console.log('✅ Header found:', headerText);
  }
  
  // Check for modules
  const modules = await page.$$('.module-card');
  console.log('📚 Modules found:', modules.length);
  
  // Check for errors in console
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  // Test clicking on first module
  if (modules.length > 0) {
    console.log('🖱️ Clicking first module...');
    await modules[0].click();
    await page.waitForTimeout(500);
    
    // Check lessons
    const lessons = await page.$$('.lesson-item');
    console.log('📖 Lessons found:', lessons.length);
    
    // Click first lesson
    if (lessons.length > 0) {
      console.log('🖱️ Clicking first lesson...');
      await lessons[0].click();
      await page.waitForTimeout(500);
      
      // Check theory tab
      const theoryTab = await page.$('.tab');
      if (theoryTab) {
        console.log('✅ Theory tab found');
      }
      
      // Click challenge tab
      const tabs = await page.$$('.tab');
      if (tabs.length > 1) {
        await tabs[1].click();
        await page.waitForTimeout(500);
        console.log('💻 Challenge tab clicked');
        
        // Check code input
        const codeInput = await page.$('.code-input');
        if (codeInput) {
          console.log('✅ Code input found');
          
          // Type some code
          await codeInput.fill('let nombre = "Ana";');
          console.log('⌨️ Code typed');
        }
        
        // Click run button
        const runBtn = await page.$('.run-btn');
        if (runBtn) {
          await runBtn.click();
          await page.waitForTimeout(1000);
          console.log('▶️ Run button clicked');
          
          // Check for test results
          const testResults = await page.$$('.test-item');
          console.log('🧪 Test results:', testResults.length);
        }
      }
    }
  }
  
  // Report errors
  if (errors.length > 0) {
    console.log('❌ Console errors:', errors);
  } else {
    console.log('✅ No console errors');
  }
  
  console.log('✨ Test completed successfully!');
  
  await browser.close();
})();
