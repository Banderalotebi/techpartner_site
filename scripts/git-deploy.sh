#!/bin/bash

# 🔄 Git & Deploy Automation Script
# =================================
# Automates the complete git push and deployment process

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}================================${NC}"
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

# Check if there are uncommitted changes
check_git_status() {
    if [[ -n $(git status --porcelain) ]]; then
        return 0  # There are changes
    else
        return 1  # No changes
    fi
}

# Auto commit and push
auto_commit_push() {
    local commit_message="$1"
    local branch="${2:-main}"
    
    print_header "Git Operations"
    
    # Check if there are changes to commit
    if ! check_git_status; then
        print_warning "No changes to commit"
        return 0
    fi
    
    echo "Current git status:"
    git status --short
    echo ""
    
    # If no commit message provided, prompt for one
    if [ -z "$commit_message" ]; then
        echo "Enter commit message (or press Enter for auto-generated message):"
        read -r commit_message
        
        if [ -z "$commit_message" ]; then
            commit_message="Auto-deploy: $(date '+%Y-%m-%d %H:%M:%S')"
        fi
    fi
    
    # Add all changes
    echo "Adding all changes..."
    git add .
    
    # Commit changes
    echo "Committing changes..."
    git commit -m "$commit_message"
    
    # Push to remote
    echo "Pushing to remote repository..."
    git push origin "$branch"
    
    print_success "Git operations completed"
    echo "Commit: $commit_message"
    echo "Branch: $branch"
}

# Full automation: commit, push, and deploy
full_deploy() {
    local commit_message="$1"
    local environment="${2:-production}"
    local branch="${3:-main}"
    
    print_header "Full Deployment Pipeline"
    
    # Step 1: Git operations
    auto_commit_push "$commit_message" "$branch"
    
    # Step 2: Wait for GitHub Actions (if using automatic deployment)
    print_header "Checking GitHub Actions"
    echo "GitHub Actions will automatically deploy your changes to $environment"
    echo "You can monitor the deployment at:"
    echo "https://github.com/$(git remote get-url origin | sed 's/.*github.com[:/]\([^.]*\).*/\1/')/actions"
    
    # Step 3: Optional manual deployment
    echo ""
    read -p "Do you want to deploy manually now? (y/N): " manual_deploy
    
    if [[ $manual_deploy =~ ^[Yy]$ ]]; then
        # Use the deployment script
        if [ "$environment" = "staging" ]; then
            ./scripts/deploy.sh staging
        else
            ./scripts/deploy.sh production
        fi
    else
        print_success "Deployment will be handled by GitHub Actions"
    fi
}

# Quick push without deployment
quick_push() {
    local commit_message="$1"
    auto_commit_push "$commit_message"
    print_success "Changes pushed to repository"
}

# Interactive mode
interactive_mode() {
    print_header "Interactive Deployment Mode"
    
    echo "Choose an option:"
    echo "1. Quick push (commit + push only)"
    echo "2. Full deploy to staging (commit + push + deploy staging)"
    echo "3. Full deploy to production (commit + push + deploy production)"
    echo "4. Commit and push to specific branch"
    echo "5. Exit"
    
    read -p "Enter your choice (1-5): " choice
    
    case $choice in
        1)
            read -p "Enter commit message: " msg
            quick_push "$msg"
            ;;
        2)
            read -p "Enter commit message: " msg
            full_deploy "$msg" "staging"
            ;;
        3)
            read -p "Enter commit message: " msg
            full_deploy "$msg" "production"
            ;;
        4)
            read -p "Enter commit message: " msg
            read -p "Enter branch name: " branch
            auto_commit_push "$msg" "$branch"
            ;;
        5)
            echo "Goodbye!"
            exit 0
            ;;
        *)
            print_error "Invalid choice"
            interactive_mode
            ;;
    esac
}

# Show current status
show_status() {
    print_header "Repository Status"
    
    echo "Current branch: $(git branch --show-current)"
    echo "Remote URL: $(git remote get-url origin)"
    echo ""
    
    echo "Git status:"
    git status --short
    echo ""
    
    echo "Recent commits:"
    git log --oneline -5
    echo ""
    
    echo "GitHub Actions status:"
    echo "Check: https://github.com/$(git remote get-url origin | sed 's/.*github.com[:/]\([^.]*\).*/\1/')/actions"
}

# Show help
show_help() {
    echo -e "${BLUE}Git & Deploy Automation Script${NC}"
    echo ""
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Commands:"
    echo "  push [message]              Quick push with optional commit message"
    echo "  deploy [message] [env]      Full deploy (commit + push + deploy)"
    echo "  staging [message]           Deploy to staging environment"
    echo "  production [message]        Deploy to production environment"
    echo "  branch [message] [branch]   Commit and push to specific branch"
    echo "  status                      Show repository status"
    echo "  interactive                 Interactive mode"
    echo "  help                        Show this help"
    echo ""
    echo "Examples:"
    echo "  $0 push \"Fix order flow bug\"                    # Quick push"
    echo "  $0 deploy \"Add new feature\" staging            # Deploy to staging"
    echo "  $0 production \"Release v2.1\"                  # Deploy to production"
    echo "  $0 branch \"Feature work\" feature-branch       # Push to feature branch"
    echo "  $0 interactive                                   # Interactive mode"
}

# Main script logic
case "${1:-interactive}" in
    "push")
        quick_push "$2"
        ;;
    "deploy")
        full_deploy "$2" "${3:-production}"
        ;;
    "staging")
        full_deploy "$2" "staging"
        ;;
    "production")
        full_deploy "$2" "production"
        ;;
    "branch")
        auto_commit_push "$2" "$3"
        ;;
    "status")
        show_status
        ;;
    "interactive")
        interactive_mode
        ;;
    "help"|*)
        show_help
        ;;
esac
