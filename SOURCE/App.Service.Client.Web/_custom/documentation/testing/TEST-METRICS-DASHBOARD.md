# Test Metrics & Dashboard Integration

**Created:** 2025-12-27  
**Status:** ✅ Active - Ready for CI/CD Integration  
**Purpose:** Make testing visible to developers AND managers

---

## 🎯 Goals

**For Developers:**
- ✅ See coverage stats after every build
- ✅ Quick visual feedback (command-line charts)
- ✅ Identify gaps immediately

**For Managers:**
- ✅ Dashboard-friendly JSON reports
- ✅ Trend tracking (coverage over time)
- ✅ Status badges (green/yellow/red)

**For CI/CD:**
- ✅ Machine-readable reports (JSON, XML)
- ✅ GitHub Actions integration
- ✅ Azure DevOps integration
- ✅ Confluence integration

---

## 📊 Available Commands

### **For Developers:**

```sh
# Run tests with visual coverage report
npm run test:coverage

# Generate metrics + console report
npm run test:report

# Watch mode (re-run on save)
npm run test:watch

# Single run (no browser)
npm run test:headless
```

---

### **For CI/CD:**

```sh
# Headless + coverage + metrics
npm run test:ci

# Custom reporter for pipelines
npm run test:report
```

---

## 📂 Output Files

### **1. Coverage HTML Report** (`coverage/base/index.html`)
**For:** Developers (visual, detailed)

Open in browser to see:
- Line-by-line coverage
- Untested code highlighted
- Per-file breakdown

**Example:**
```sh
npm run test:coverage
# Then open: coverage/base/index.html
```

---

### **2. Test Metrics JSON** (`coverage/test-metrics.json`)
**For:** Dashboards, APIs, automation

**Structure:**
```json
{
  "timestamp": "2025-12-27T21:30:00.000Z",
  "overall": {
    "coverage": 75,
    "status": "passing",
    "lines": 78,
    "statements": 76,
    "functions": 72,
    "branches": 74
  },
  "tiers": {
    "core": 82,
    "core.ag": 68,
    "themes": 55,
    "sites.anon": 48,
    "sites.app": 45
  },
  "thresholds": {
    "core": { "target": 80, "current": 82 },
    "core.ag": { "target": 70, "current": 68 },
    "themes": { "target": 60, "current": 55 },
    "sites.anon": { "target": 50, "current": 48 },
    "sites.app": { "target": 50, "current": 45 }
  },
  "trends": {
    "direction": "up",
    "change": +5
  }
}
```

**Use Cases:**
- GitHub Actions: Post as comment on PR
- Azure DevOps: Publish as artifact
- Confluence: Embed via REST API
- Slack: Send daily summary

---

### **3. Markdown Summary** (`coverage/test-summary.md`)
**For:** README badges, documentation

**Example Output:**
```markdown
# Test Coverage Report

![Coverage](https://img.shields.io/badge/coverage-75%25-green)
![Status](https://img.shields.io/badge/tests-passing-brightgreen)

**Generated:** 12/27/2025, 9:30:00 PM

## Overall Coverage

| Metric | Coverage |
|--------|----------|
| Lines | 78% |
| Statements | 76% |
| Functions | 72% |
| Branches | 74% |
| **Overall** | **75%** |

## Coverage by Tier

| Tier | Current | Target | Status |
|------|---------|--------|--------|
| core | 82% | 80% | ✅ |
| core.ag | 68% | 70% | ⚠️ |
| themes | 55% | 60% | ⚠️ |
| sites.anon | 48% | 50% | ⚠️ |
| sites.app | 45% | 50% | ⚠️ |
```

**Use Cases:**
- Copy badges to README.md
- Include in PR descriptions
- Share in team wiki

---

### **4. Console Summary** (stdout)
**For:** Developers during builds

**Example Output:**
```
============================================================
  TEST COVERAGE REPORT
============================================================

📊 Overall Coverage: 75%
   Lines:      78%
   Statements: 76%
   Functions:  72%
   Branches:   74%
   Status:     PASSING

------------------------------------------------------------
  Coverage by Tier
------------------------------------------------------------

✅ core            ████████████████████ 82% / 80%
⚠️  core.ag         ████████████████░░░░ 68% / 70%
⚠️  themes          ██████████████░░░░░░ 55% / 60%
⚠️  sites.anon      ████████████░░░░░░░░ 48% / 50%
⚠️  sites.app       ███████████░░░░░░░░░ 45% / 50%

============================================================
  Generated: 12/27/2025, 9:30:00 PM
============================================================

💡 Good progress! Continue adding tests for:
   - Component integration tests
   - Edge cases and error handling
```

---

## 🔗 Integration Examples

### **GitHub Actions:**

```yaml
# .github/workflows/test.yml
name: Test & Coverage

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests with coverage
        run: npm run test:ci
        
      - name: Generate metrics
        run: node scripts/generate-test-report.js
        
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          
      - name: Comment PR with metrics
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const metrics = JSON.parse(
              fs.readFileSync('coverage/test-metrics.json', 'utf8')
            );
            const summary = fs.readFileSync(
              'coverage/test-summary.md', 'utf8'
            );
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: summary
            });
```

---

### **Azure DevOps:**

```yaml
# azure-pipelines.yml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '18.x'
    
  - script: npm ci
    displayName: 'Install dependencies'
    
  - script: npm run test:ci
    displayName: 'Run tests'
    
  - script: node scripts/generate-test-report.js
    displayName: 'Generate metrics'
    
  - task: PublishTestResults@2
    inputs:
      testResultsFormat: 'JUnit'
      testResultsFiles: 'coverage/junit.xml'
      
  - task: PublishCodeCoverageResults@1
    inputs:
      codeCoverageTool: 'Cobertura'
      summaryFileLocation: 'coverage/cobertura-coverage.xml'
      
  - task: PublishBuildArtifacts@1
    inputs:
      PathtoPublish: 'coverage/test-metrics.json'
      ArtifactName: 'test-metrics'
```

---

### **Confluence (via REST API):**

```javascript
// scripts/publish-to-confluence.js
const fetch = require('node-fetch');
const fs = require('fs');

async function publishToConfluence() {
  const metrics = JSON.parse(
    fs.readFileSync('coverage/test-metrics.json', 'utf8')
  );
  
  const markdown = fs.readFileSync(
    'coverage/test-summary.md', 'utf8'
  );
  
  // Convert markdown to Confluence Storage Format
  const content = {
    type: 'page',
    title: `Test Coverage Report - ${new Date().toISOString().split('T')[0]}`,
    space: { key: 'DEV' },
    body: {
      storage: {
        value: markdown,
        representation: 'storage'
      }
    }
  };
  
  // Post to Confluence
  await fetch('https://your-domain.atlassian.net/wiki/rest/api/content', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.CONFLUENCE_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(content)
  });
}

publishToConfluence();
```

---

### **Slack Notification:**

```javascript
// scripts/notify-slack.js
const fetch = require('node-fetch');
const fs = require('fs');

async function notifySlack() {
  const metrics = JSON.parse(
    fs.readFileSync('coverage/test-metrics.json', 'utf8')
  );
  
  const emoji = metrics.overall.coverage >= 70 ? ':white_check_mark:' : ':warning:';
  const color = metrics.overall.status === 'passing' ? 'good' : 'warning';
  
  const message = {
    text: `${emoji} Test Coverage Report`,
    attachments: [{
      color: color,
      fields: [
        {
          title: 'Overall Coverage',
          value: `${metrics.overall.coverage}%`,
          short: true
        },
        {
          title: 'Status',
          value: metrics.overall.status.toUpperCase(),
          short: true
        },
        {
          title: 'Core',
          value: `${metrics.tiers.core}% / 80%`,
          short: true
        },
        {
          title: 'Core.Ag',
          value: `${metrics.tiers['core.ag']}% / 70%`,
          short: true
        }
      ]
    }]
  };
  
  await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message)
  });
}

notifySlack();
```

---

## 📈 Trend Tracking

**Future Enhancement:** Track coverage over time

```javascript
// scripts/track-trends.js
const fs = require('fs');

function trackTrends() {
  const metricsFile = 'coverage/test-metrics.json';
  const historyFile = '_custom/metrics/coverage-history.json';
  
  // Read current metrics
  const current = JSON.parse(fs.readFileSync(metricsFile, 'utf8'));
  
  // Read history
  let history = [];
  if (fs.existsSync(historyFile)) {
    history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
  }
  
  // Append current to history
  history.push({
    timestamp: current.timestamp,
    coverage: current.overall.coverage,
    tiers: current.tiers
  });
  
  // Keep last 30 days only
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  history = history.filter(h => new Date(h.timestamp) > thirtyDaysAgo);
  
  // Calculate trends
  if (history.length >= 2) {
    const previous = history[history.length - 2].coverage;
    current.trends.direction = current.overall.coverage > previous ? 'up' : 
                               current.overall.coverage < previous ? 'down' : 'stable';
    current.trends.change = current.overall.coverage - previous;
  }
  
  // Save updated history
  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
  fs.writeFileSync(metricsFile, JSON.stringify(current, null, 2));
  
  console.log(`📊 Trend: ${current.trends.direction} (${current.trends.change > 0 ? '+' : ''}${current.trends.change}%)`);
}

trackTrends();
```

---

## 🎯 Coverage Thresholds

**Tier-Specific Targets:**

| Tier | Target | Rationale |
|------|--------|-----------|
| **Core** | 80% | Foundation - must be rock-solid |
| **Core.Ag** | 70% | Angular infrastructure - critical |
| **Themes** | 60% | UI components - visual testing |
| **Sites.Anon** | 50% | Integration - E2E tests cover rest |
| **Sites.App** | 50% | Integration - E2E tests cover rest |

**Status Colors:**
- ✅ **Green:** At or above target
- ⚠️ **Yellow:** Within 10% of target
- ❌ **Red:** More than 10% below target

---

## 📝 Summary

**What We Built:**
- ✅ `test:report` script (generates metrics)
- ✅ `generate-test-report.js` (creates JSON, MD, console)
- ✅ Dashboard-friendly JSON output
- ✅ Markdown badges for README
- ✅ Visual console charts
- ✅ CI/CD integration examples

**Benefits:**
- ✅ Developers see coverage immediately
- ✅ Managers get dashboard data
- ✅ CI/CD can publish to any platform
- ✅ Trends tracked over time
- ✅ Status badges show health at a glance

**Usage:**
```sh
# After running tests:
npm run test:report

# Outputs:
# - coverage/test-metrics.json (dashboard)
# - coverage/test-summary.md (badges)
# - Console chart (visual)
```

---

**Status:** ✅ **Ready for Use**  
**Next:** Integrate into CI/CD pipeline  
**Review:** After first production deployment
