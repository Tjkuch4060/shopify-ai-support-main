#!/bin/bash

# 🔗 AI Support Bot Landing Page - GitHub Repository Setup Script
# Run this after GitHub authentication is complete

set -e  # Exit on any error

echo "🔗 Setting up GitHub repository for AI Support Bot Landing Page..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Default repository name
REPO_NAME="ai-support-bot"

# Step 1: Check if setup_github_environment was run
print_status "Checking GitHub authentication..."

# The setup_github_environment tool should have been called first
# This script assumes authentication is already configured

# Step 2: Check git status
print_status "Checking git repository status..."

if [ ! -d ".git" ]; then
    print_error "Not a git repository. This should not happen - git was initialized earlier."
    exit 1
fi

# Check if we have commits
if ! git log --oneline -1 >/dev/null 2>&1; then
    print_error "No commits found. This should not happen - commits were made earlier."
    exit 1
fi

print_success "Git repository is ready with commits"

# Step 3: Check if remote origin exists
if git remote get-url origin >/dev/null 2>&1; then
    EXISTING_REMOTE=$(git remote get-url origin)
    print_warning "Remote origin already exists: $EXISTING_REMOTE"
    
    echo "Do you want to:"
    echo "1. Push to existing remote"
    echo "2. Update remote URL"
    echo "3. Exit and configure manually"
    read -p "Choose option (1-3): " choice
    
    case $choice in
        1)
            print_status "Pushing to existing remote..."
            ;;
        2)
            print_status "Please update the remote URL manually:"
            echo "git remote set-url origin https://github.com/USERNAME/REPO.git"
            exit 0
            ;;
        3)
            print_status "Exiting. Configure remote manually."
            exit 0
            ;;
        *)
            print_error "Invalid choice. Exiting."
            exit 1
            ;;
    esac
else
    print_warning "No remote origin configured."
    print_status "You need to add your GitHub repository as origin:"
    echo ""
    echo "If you created a new repository, run:"
    echo "git remote add origin https://github.com/USERNAME/$REPO_NAME.git"
    echo ""
    echo "If you're using an existing repository, run:"
    echo "git remote add origin https://github.com/USERNAME/EXISTING-REPO.git"
    echo ""
    echo "Then run: git push -u origin main"
    exit 0
fi

# Step 4: Push to GitHub
print_status "Pushing code to GitHub..."

# Check if main branch exists on remote
if git ls-remote --heads origin main | grep -q main; then
    print_status "Main branch exists on remote. Pushing updates..."
    git push origin main
else
    print_status "First push to remote. Setting upstream..."
    git push -u origin main
fi

if [ $? -eq 0 ]; then
    print_success "Code pushed to GitHub successfully!"
    
    # Get the repository URL for display
    REPO_URL=$(git remote get-url origin | sed 's/\.git$//')
    echo ""
    echo "🔗 Repository: $REPO_URL"
    echo "🌿 Branch: main"
    echo "📝 Commits: $(git rev-list --count HEAD)"
    echo ""
else
    print_error "Failed to push to GitHub"
    exit 1
fi

# Step 5: Summary and next steps
echo "🎉 GitHub Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📁 Repository: $REPO_URL"
echo "🔧 Local commits: $(git rev-list --count HEAD)"
echo "📊 Files tracked: $(git ls-files | wc -l)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
print_success "Ready for Cloudflare Pages deployment!"
echo ""
print_status "Next steps:"
echo "  1. Run Cloudflare deployment: ./deploy.sh"
echo "  2. Or connect GitHub to Cloudflare Pages for auto-deployment"
echo "  3. Configure custom domain (optional)"
echo ""