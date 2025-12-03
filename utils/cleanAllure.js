const fs = require('fs');
const path = require('path');

const allureResultsDir = path.join(__dirname, '..', 'allure-results');

function cleanAllureResults() {
  try {
    if (fs.existsSync(allureResultsDir)) {
      const files = fs.readdirSync(allureResultsDir);
      
      files.forEach(file => {
        const filePath = path.join(allureResultsDir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          fs.rmSync(filePath, { recursive: true, force: true });
        } else {
          fs.unlinkSync(filePath);
        }
      });
      
      console.log('✅ Allure results cleaned successfully');
      return true;
    } else {
      console.log('ℹ️  Allure results directory does not exist, creating it...');
      fs.mkdirSync(allureResultsDir, { recursive: true });
      return true;
    }
  } catch (error) {
    console.error('❌ Error cleaning Allure results:', error.message);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  cleanAllureResults();
}

module.exports = { cleanAllureResults };

