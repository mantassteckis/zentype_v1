import { test, expect } from '@playwright/test';

/**
 * ZenType Test Generation Debug Suite
 * Tests both Practice Tests and AI Generation functionality
 */

test.describe('ZenType Test Generation Issues', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the test page
    await page.goto('http://localhost:3000/test');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('Should load practice tests successfully', async ({ page }) => {
    console.log('🔍 Testing Practice Tests API...');
    
    // Wait for the practice tests to load
    await page.waitForTimeout(2000);
    
    // Check if practice test selector is visible
    const practiceTestSelect = page.locator('select').filter({ hasText: /Select a practice test/i }).first();
    await expect(practiceTestSelect).toBeVisible({ timeout: 10000 });
    
    // Get all options
    const options = await practiceTestSelect.locator('option').all();
    console.log(`📊 Found ${options.length} options in practice test dropdown`);
    
    // Check if there are actual test options (not just placeholder)
    const optionTexts = await Promise.all(options.map(opt => opt.textContent()));
    console.log('📝 Practice test options:', optionTexts);
    
    // Should have more than just the placeholder option
    expect(options.length).toBeGreaterThan(1);
    
    // Try to select a practice test
    if (options.length > 1) {
      await practiceTestSelect.selectOption({ index: 1 });
      console.log('✅ Successfully selected a practice test');
      
      // Check if typing area has text loaded
      await page.waitForTimeout(1000);
      const typingText = await page.locator('[class*="typing-text"]').first().textContent();
      console.log('📝 Loaded typing text preview:', typingText?.substring(0, 100) + '...');
    }
  });

  test('Should handle AI generation attempt', async ({ page }) => {
    console.log('🔍 Testing AI Generation...');
    
    // Look for AI generation inputs
    const topicInput = page.locator('input[placeholder*="topic" i], input[type="text"]').first();
    await expect(topicInput).toBeVisible({ timeout: 10000 });
    
    // Fill in AI generation form
    await topicInput.fill('Vertex AI Studio');
    console.log('✅ Filled topic input');
    
    // Select difficulty
    const difficultySelect = page.locator('select').filter({ hasText: /difficulty/i }).first();
    await difficultySelect.selectOption('Medium');
    console.log('✅ Selected Medium difficulty');
    
    // Select time limit
    const timeSelect = page.locator('select').filter({ hasText: /time/i }).first();
    await timeSelect.selectOption('60');
    console.log('✅ Selected 60s time limit');
    
    // Click generate button
    const generateButton = page.locator('button').filter({ hasText: /generate/i }).first();
    await generateButton.click();
    console.log('🚀 Clicked generate button');
    
    // Wait for either success or error
    await page.waitForTimeout(5000);
    
    // Check for modal or error message
    const modal = page.locator('[role="dialog"], [class*="modal"]').first();
    const isModalVisible = await modal.isVisible().catch(() => false);
    
    if (isModalVisible) {
      const modalText = await modal.textContent();
      console.log('⚠️ Modal appeared:', modalText?.substring(0, 200));
      
      // Check if it's the AI service unavailable modal
      if (modalText?.includes('AI service') || modalText?.includes('unavailable')) {
        console.log('❌ AI Generation failed as expected (Gemini quota issue)');
        expect(modalText).toContain('practice test');
      }
    } else {
      console.log('✅ No modal appeared - checking if test was generated');
      
      // Check if typing area has content
      const typingText = await page.locator('[class*="typing-text"]').first().textContent();
      if (typingText && typingText.length > 50) {
        console.log('✅ AI test generated successfully!');
        console.log('📝 Generated text preview:', typingText.substring(0, 100) + '...');
      }
    }
  });

  test('Should capture network errors for practice tests API', async ({ page }) => {
    console.log('🔍 Monitoring network requests for API errors...');
    
    // Set up request/response monitoring
    const apiErrors: Array<{ url: string; status: number; error: string }> = [];
    
    page.on('response', async (response) => {
      const url = response.url();
      
      // Monitor the practice tests API
      if (url.includes('/api/v1/tests')) {
        const status = response.status();
        console.log(`📡 API Response: ${url} - Status: ${status}`);
        
        if (status >= 400) {
          try {
            const body = await response.text();
            apiErrors.push({ url, status, error: body });
            console.log(`❌ API Error ${status}:`, body);
          } catch (e) {
            apiErrors.push({ url, status, error: 'Could not read response body' });
          }
        } else {
          try {
            const body = await response.json();
            console.log(`✅ API Success:`, JSON.stringify(body).substring(0, 200));
          } catch (e) {
            console.log(`✅ API Success (non-JSON response)`);
          }
        }
      }
      
      // Monitor AI generation function calls
      if (url.includes('generateAiTest') || url.includes('generateaitest')) {
        const status = response.status();
        console.log(`📡 AI Function Response: ${url} - Status: ${status}`);
        
        if (status >= 400) {
          try {
            const body = await response.text();
            console.log(`❌ AI Generation Error ${status}:`, body);
          } catch (e) {
            console.log(`❌ AI Generation Error ${status}`);
          }
        }
      }
    });
    
    // Reload the page to trigger API calls
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Wait a bit for all async calls
    await page.waitForTimeout(3000);
    
    // Report findings
    if (apiErrors.length > 0) {
      console.log('❌ Found API errors:', apiErrors);
    } else {
      console.log('✅ No API errors detected');
    }
  });

  test('Should check console errors', async ({ page }) => {
    console.log('🔍 Monitoring console for errors...');
    
    const consoleErrors: Array<{ type: string; message: string }> = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push({ type: msg.type(), message: msg.text() });
        console.log('❌ Console Error:', msg.text());
      }
    });
    
    page.on('pageerror', (error) => {
      consoleErrors.push({ type: 'pageerror', message: error.message });
      console.log('❌ Page Error:', error.message);
    });
    
    // Reload to capture all errors
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Report findings
    if (consoleErrors.length > 0) {
      console.log(`❌ Found ${consoleErrors.length} console errors`);
      consoleErrors.forEach((err, i) => {
        console.log(`  ${i + 1}. [${err.type}] ${err.message}`);
      });
    } else {
      console.log('✅ No console errors detected');
    }
  });
});
