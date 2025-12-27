/**
 * Test Metrics Report Generator
 * 
 * Generates dashboard-friendly reports from Karma test results and coverage data.
 * 
 * Outputs:
 * - JSON report (for dashboards: GitHub, Azure DevOps, Confluence)
 * - Markdown summary (for README badges)
 * - Console summary (for developers)
 * 
 * Usage:
 * npm run test:report
 * 
 * Then check:
 * - coverage/test-metrics.json (dashboard data)
 * - coverage/test-summary.md (markdown badges)
 * - Console output (developer summary)
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

const COVERAGE_DIR = path.join(__dirname, '..', 'coverage', 'base');
const LCOV_FILE = path.join(COVERAGE_DIR, 'lcov.info');
const SUMMARY_JSON = path.join(COVERAGE_DIR, 'coverage-summary.json');
const METRICS_OUTPUT = path.join(COVERAGE_DIR, '..', 'test-metrics.json');
const MARKDOWN_OUTPUT = path.join(COVERAGE_DIR, '..', 'test-summary.md');

// ============================================================================
// HELPERS
// ============================================================================

function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

function readJsonFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.warn(`⚠️  Could not read ${filePath}:`, error.message);
    return null;
  }
}

function getCoveragePercentage(summary) {
  if (!summary || !summary.total) return 0;
  
  const { lines, statements, functions, branches } = summary.total;
  
  return {
    lines: lines.pct || 0,
    statements: statements.pct || 0,
    functions: functions.pct || 0,
    branches: branches.pct || 0,
    overall: Math.round(
      (lines.pct + statements.pct + functions.pct + branches.pct) / 4
    )
  };
}

function getCoverageByTier(summary) {
  if (!summary) return {};
  
  const tiers = {
    core: { lines: 0, count: 0 },
    'core.ag': { lines: 0, count: 0 },
    themes: { lines: 0, count: 0 },
    'sites.anon': { lines: 0, count: 0 },
    'sites.app': { lines: 0, count: 0 }
  };

  for (const [filePath, data] of Object.entries(summary)) {
    if (filePath === 'total') continue;

    // Determine tier from file path
    let tier = 'unknown';
    if (filePath.includes('/core/') && !filePath.includes('/core.ag/')) {
      tier = 'core';
    } else if (filePath.includes('/core.ag/')) {
      tier = 'core.ag';
    } else if (filePath.includes('/themes/')) {
      tier = 'themes';
    } else if (filePath.includes('/sites.anon/')) {
      tier = 'sites.anon';
    } else if (filePath.includes('/sites.app/')) {
      tier = 'sites.app';
    }

    if (tiers[tier]) {
      tiers[tier].lines += data.lines.pct || 0;
      tiers[tier].count++;
    }
  }

  // Calculate averages
  const result = {};
  for (const [tier, data] of Object.entries(tiers)) {
    result[tier] = data.count > 0 ? Math.round(data.lines / data.count) : 0;
  }

  return result;
}

function getPassFailStatus(percentage, threshold) {
  if (percentage >= threshold) return 'passing';
  if (percentage >= threshold - 10) return 'warning';
  return 'failing';
}

function getBadgeColor(percentage) {
  if (percentage >= 80) return 'brightgreen';
  if (percentage >= 60) return 'green';
  if (percentage >= 40) return 'yellow';
  if (percentage >= 20) return 'orange';
  return 'red';
}

// ============================================================================
// MAIN LOGIC
// ============================================================================

function generateReport() {
  console.log('\n📊 Generating Test Metrics Report...\n');

  // Check if coverage exists
  if (!fileExists(SUMMARY_JSON)) {
    console.error('❌ Coverage data not found. Run tests with --code-coverage first.');
    process.exit(1);
  }

  // Read coverage summary
  const coverageSummary = readJsonFile(SUMMARY_JSON);
  const coverage = getCoveragePercentage(coverageSummary);
  const coverageByTier = getCoverageByTier(coverageSummary);

  // Build metrics object
  const metrics = {
    timestamp: new Date().toISOString(),
    overall: {
      coverage: coverage.overall,
      status: getPassFailStatus(coverage.overall, 70),
      lines: coverage.lines,
      statements: coverage.statements,
      functions: coverage.functions,
      branches: coverage.branches
    },
    tiers: coverageByTier,
    thresholds: {
      core: { target: 80, current: coverageByTier.core },
      'core.ag': { target: 70, current: coverageByTier['core.ag'] },
      themes: { target: 60, current: coverageByTier.themes },
      'sites.anon': { target: 50, current: coverageByTier['sites.anon'] },
      'sites.app': { target: 50, current: coverageByTier['sites.app'] }
    },
    trends: {
      // TODO: Compare with previous run
      direction: 'stable',
      change: 0
    }
  };

  // Write JSON report (for dashboards)
  fs.writeFileSync(METRICS_OUTPUT, JSON.stringify(metrics, null, 2));
  console.log(`✅ JSON metrics: ${METRICS_OUTPUT}`);

  // Generate markdown summary
  const markdown = generateMarkdown(metrics);
  fs.writeFileSync(MARKDOWN_OUTPUT, markdown);
  console.log(`✅ Markdown summary: ${MARKDOWN_OUTPUT}`);

  // Console output (for developers)
  printConsoleReport(metrics);

  return metrics;
}

function generateMarkdown(metrics) {
  const { overall, tiers, thresholds } = metrics;
  
  const overallBadge = `![Coverage](https://img.shields.io/badge/coverage-${overall.coverage}%25-${getBadgeColor(overall.coverage)})`;
  const statusBadge = `![Status](https://img.shields.io/badge/tests-${overall.status}-${overall.status === 'passing' ? 'brightgreen' : 'yellow'})`;

  let md = `# Test Coverage Report\n\n`;
  md += `${overallBadge} ${statusBadge}\n\n`;
  md += `**Generated:** ${new Date(metrics.timestamp).toLocaleString()}\n\n`;

  md += `## Overall Coverage\n\n`;
  md += `| Metric | Coverage |\n`;
  md += `|--------|----------|\n`;
  md += `| Lines | ${overall.lines}% |\n`;
  md += `| Statements | ${overall.statements}% |\n`;
  md += `| Functions | ${overall.functions}% |\n`;
  md += `| Branches | ${overall.branches}% |\n`;
  md += `| **Overall** | **${overall.coverage}%** |\n\n`;

  md += `## Coverage by Tier\n\n`;
  md += `| Tier | Current | Target | Status |\n`;
  md += `|------|---------|--------|--------|\n`;
  
  for (const [tier, threshold] of Object.entries(thresholds)) {
    const current = threshold.current;
    const target = threshold.target;
    const status = current >= target ? '✅' : current >= target - 10 ? '⚠️' : '❌';
    md += `| ${tier} | ${current}% | ${target}% | ${status} |\n`;
  }

  md += `\n## Thresholds\n\n`;
  md += `- **Core:** 80% (foundation must be solid)\n`;
  md += `- **Core.Ag:** 70% (Angular infrastructure)\n`;
  md += `- **Themes:** 60% (UI components)\n`;
  md += `- **Sites.Anon:** 50% (integration)\n`;
  md += `- **Sites.App:** 50% (integration)\n\n`;

  md += `---\n\n`;
  md += `*Generated by test:report script*\n`;

  return md;
}

function printConsoleReport(metrics) {
  const { overall, tiers, thresholds } = metrics;

  console.log('\n' + '='.repeat(60));
  console.log('  TEST COVERAGE REPORT');
  console.log('='.repeat(60) + '\n');

  console.log(`📊 Overall Coverage: ${overall.coverage}%`);
  console.log(`   Lines:      ${overall.lines}%`);
  console.log(`   Statements: ${overall.statements}%`);
  console.log(`   Functions:  ${overall.functions}%`);
  console.log(`   Branches:   ${overall.branches}%`);
  console.log(`   Status:     ${overall.status.toUpperCase()}`);

  console.log('\n' + '-'.repeat(60));
  console.log('  Coverage by Tier');
  console.log('-'.repeat(60) + '\n');

  for (const [tier, threshold] of Object.entries(thresholds)) {
    const current = threshold.current;
    const target = threshold.target;
    const status = current >= target ? '✅' : current >= target - 10 ? '⚠️' : '❌';
    const progress = Math.round((current / target) * 20); // 20 chars width
    const bar = '█'.repeat(progress) + '░'.repeat(20 - progress);
    
    console.log(`${status} ${tier.padEnd(15)} ${bar} ${current}% / ${target}%`);
  }

  console.log('\n' + '='.repeat(60));
  console.log(`  Generated: ${new Date(metrics.timestamp).toLocaleString()}`);
  console.log('='.repeat(60) + '\n');

  // Recommendations
  if (overall.coverage < 70) {
    console.log('💡 Recommendations:');
    console.log('   - Core coverage below target (80%) - prioritize core service tests');
    console.log('   - Run: npm run test:coverage to see detailed breakdown');
    console.log('   - Focus on untested services first\n');
  } else if (overall.coverage < 80) {
    console.log('💡 Good progress! Continue adding tests for:');
    console.log('   - Component integration tests');
    console.log('   - Edge cases and error handling\n');
  } else {
    console.log('🎉 Excellent coverage! Maintain quality by:');
    console.log('   - Adding tests for new features');
    console.log('   - Updating tests when refactoring\n');
  }
}

// ============================================================================
// EXECUTE
// ============================================================================

try {
  generateReport();
} catch (error) {
  console.error('❌ Error generating report:', error.message);
  process.exit(1);
}
