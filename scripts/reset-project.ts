import fs from 'node:fs';
import path from 'node:path';

// Get the new project name from command line arguments
const newProjectName = process.argv[2];

if (!newProjectName) {
  console.error('Please provide a new project name as an argument');
  console.error('Usage: node scripts/rename-project.js <new-project-name>');
  process.exit(1);
}

const { name: oldProjectName, packageJsonPaths } = getCurrentProjectConfig();

// Function to recursively find all files in a directory
function findFiles(dir: string, excludeDirs: string[] = []) {
  let results: string[] = [];
  const list = fs.readdirSync(dir);

  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    // Skip excluded directories
    if (stat.isDirectory() && excludeDirs.includes(file)) {
      continue;
    }

    if (stat.isDirectory()) {
      results = results.concat(findFiles(filePath, excludeDirs));
    } else {
      results.push(filePath);
    }
  }

  return results;
}

// Function to update file content
function updateFileContent(filePath: string, oldName: string, newName: string) {
  try {
    // Skip binary files and large files
    const stat = fs.statSync(filePath);
    if (stat.size > 1024 * 1024) {
      // Skip files larger than 1MB
      return false;
    }

    // Skip files with these extensions
    const skipExtensions = [
      '.png',
      '.jpg',
      '.jpeg',
      '.gif',
      '.svg',
      '.ico',
      '.woff',
      '.woff2',
      '.ttf',
      '.eot',
      '.lock',
    ];
    if (skipExtensions.some((ext) => filePath.endsWith(ext))) {
      return false;
    }

    const content = fs.readFileSync(filePath, 'utf8');

    // Check if the file contains the old project name
    if (!content.includes(oldName)) {
      return false;
    }

    // Replace all occurrences of the old project name with the new one
    let newContent = content.replace(new RegExp(oldName, 'g'), newName);

    // Reset the version to 0.0.0
    if (packageJsonPaths.includes(filePath)) {
      const json = JSON.parse(newContent);
      json.version = '0.0.0';
      newContent = JSON.stringify(json, null, 2);
    }
    // Empty the CHANGELOG.md file
    if (filePath === 'CHANGELOG.md') {
      newContent = '';
    }

    // Write the updated content back to the file
    fs.writeFileSync(filePath, newContent, 'utf8');

    return true;
  } catch (error) {
    // If there's an error (e.g., binary file), skip the file
    return false;
  }
}

// Main function
function resetProject(newProjectName: string) {
  console.log(
    `Resetting project from "${oldProjectName}" to "${newProjectName}"...`,
  );

  // Find all files in the project, excluding node_modules, .git, and other build directories
  const excludeDirs = ['node_modules', '.git', 'dist', 'build', '.turbo'];
  const files = findFiles('.', excludeDirs);

  let updatedFiles = 0;

  // Update each file
  for (const file of files) {
    const updated = updateFileContent(file, oldProjectName, newProjectName);
    if (updated) {
      console.log(`Updated: ${file}`);
      updatedFiles++;
    }
  }

  console.log(`\nProject reset successfully! Updated ${updatedFiles} files.`);
  console.log('\nNext steps:');
  console.log(
    '1. Review the changes to ensure everything was updated correctly',
  );
  console.log('2. Run "pnpm install" to update the node_modules symlinks');
  console.log('3. Commit the changes');
}

function getCurrentProjectConfig() {
  const rootPackageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const packageJsonPaths = getPackageJsonPaths();
  return {
    name: rootPackageJson.name,
    packageJsonPaths,
  };
}

function getMonorepoWorkspaces() {
  let workspaces: string[] = [];
  const workspacesFolders: string[] = [];
  
  // First try to get workspaces from package.json
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (packageJson.workspaces) {
    workspaces = packageJson.workspaces;
  } else {
    const yaml = fs.readFileSync('pnpm-workspace.yaml', 'utf8');
    const workspace = yaml.match(/packages:\s*\n((\s*-\s*"[^"]+"\s*\n)+)/);
    if (workspace) {
      workspaces = workspace[1]
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.match(/-\s*"([^"]+)"/)?.[1]) as string[];
    }
  }
  for (const workspace of workspaces) {
    const workspaceGlob = workspace.replace('/*', '');
    const workspaceDirs = fs.readdirSync(workspaceGlob, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => `${workspaceGlob}/${dirent.name}`);
    workspacesFolders.push(...workspaceDirs);
  }
  return workspacesFolders;
}

function getPackageJsonPaths() {
  const workspaceFolders = getMonorepoWorkspaces();
  const packageJsonPaths = ['package.json'];

  for (const folder of workspaceFolders) {
    if (fs.existsSync(`${folder}/package.json`)) {
      packageJsonPaths.push(`${folder}/package.json`);
    }
  }

  return packageJsonPaths;
}

resetProject(newProjectName);

// console.log(getCurrentProjectConfig());