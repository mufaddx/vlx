# Run once in Cursor Terminal:  powershell -ExecutionPolicy Bypass -File scripts\push-github.ps1
Set-Location $PSScriptRoot\..

if (-not (Test-Path .git)) {
  git init
}

git add .
git status

# Abort if secrets staged
$staged = git diff --cached --name-only
if ($staged -match '(^|/)\.env$') {
  Write-Error ".env is staged. Unstage it: git reset HEAD .env"
  exit 1
}

$pending = git status --porcelain
if ($pending) {
  git commit -m "Add VIDLIX web app with Railway and LiveKit setup."
}

git branch -M main
git remote remove origin 2>$null
git remote add origin https://github.com/mufaddx/vlx.git
git push -u origin main
