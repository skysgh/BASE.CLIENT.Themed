#!/usr/bin/env node

/**
 * Copy Test Metrics to Assets
 * 
 * Copies generated test metrics (JSON, coverage) to assets/data
 * so they can be displayed in the app itself (dogfooding!)
 * 
 * Usage:
 *   node scripts/copy-metrics-to-assets.js
 * 
 * Or via npm:
 *   npm run metrics:copy
 */

const fs = require('fs');
const path = require('path');

// Paths
const coverageDir = path.join(__dirname, '../coverage');
const assetsDataDir = path.join(__dirname, '../src/assets/data/quality');
const distAssetsDataDir = path.join(__dirname, '../dist/base/browser/assets/data/quality');

// Source files
const metricsJson = path.join(coverageDir, 'test-metrics.json');
const summaryMd = path.join(coverageDir, 'test-summary.md');
const coverageSummaryJson = path.join(coverageDir, 'base', 'coverage-summary.json');

console.log('📊 Copying test metrics to assets...\n');

/**
 * Ensure directory exists
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
}

/**
 * Copy file if it exists
 */
function copyFileIfExists(source, dest) {
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, dest);
    console.log(`✅ Copied: ${path.basename(source)} → ${dest}`);
    return true;
  } else {
    console.warn(`⚠️  Source not found: ${source}`);
    return false;
  }
}

/**
 * Generate build info
 */
function generateBuildInfo() {
  return {
    buildTime: new Date().toISOString(),
    buildNumber: process.env.BUILD_NUMBER || 'local',
    gitBranch: process.env.GIT_BRANCH || 'main',
    gitCommit: process.env.GIT_COMMIT || 'unknown',
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development'
  };
}

/**
 * Main execution
 */
try {
  // Ensure target directories exist
  ensureDir(assetsDataDir);
  
  let copiedCount = 0;
  
  // Copy test metrics JSON
  if (copyFileIfExists(metricsJson, path.join(assetsDataDir, 'test-metrics.json'))) {
    copiedCount++;
  }
  
  // Copy test summary markdown
  if (copyFileIfExists(summaryMd, path.join(assetsDataDir, 'test-summary.md'))) {
    copiedCount++;
  }
  
  // Copy coverage summary
  if (copyFileIfExists(coverageSummaryJson, path.join(assetsDataDir, 'coverage-summary.json'))) {
    copiedCount++;
  }
  
  // Generate and save build info
  const buildInfo = generateBuildInfo();
  const buildInfoPath = path.join(assetsDataDir, 'build-info.json');
  fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));
  console.log(`✅ Generated: build-info.json → ${buildInfoPath}`);
  copiedCount++;
  
  // Create master quality.json combining all data
  if (fs.existsSync(metricsJson) && fs.existsSync(coverageSummaryJson)) {
    const metrics = JSON.parse(fs.readFileSync(metricsJson, 'utf8'));
    const coverage = JSON.parse(fs.readFileSync(coverageSummaryJson, 'utf8'));
    
    const qualityData = {
      ...buildInfo,
      metrics,
      coverage: coverage.total,
      timestamp: new Date().toISOString()
    };
    
    const qualityJsonPath = path.join(assetsDataDir, 'quality.json');
    fs.writeFileSync(qualityJsonPath, JSON.stringify(qualityData, null, 2));
    console.log(`✅ Generated: quality.json (master file) → ${qualityJsonPath}`);
    copiedCount++;
  }
  
  console.log(`\n✅ Success! Copied ${copiedCount} files to assets/data/quality/`);
  console.log(`📊 Metrics available at: /assets/data/quality/quality.json\n`);
  
  // Also copy to dist if it exists (post-build)
  if (fs.existsSync(path.join(__dirname, '../dist'))) {
    ensureDir(distAssetsDataDir);
    
    // Copy all files from assets to dist
    const files = fs.readdirSync(assetsDataDir);
    files.forEach(file => {
      const src = path.join(assetsDataDir, file);
      const dest = path.join(distAssetsDataDir, file);
      copyFileIfExists(src, dest);
    });
    
    console.log(`✅ Also copied to dist folder for production build\n`);
  }
  
  process.exit(0);
  
} catch (error) {
  console.error('❌ Error copying metrics:', error.message);
  console.error(error.stack);
  process.exit(1);
}
