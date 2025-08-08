#!/bin/bash

# List of UI components that are actively used in the project
USED_COMPONENTS=(
  "avatar.tsx"
  "badge.tsx"
  "button.tsx"
  "card.tsx"
  "input.tsx"
  "label.tsx"
  "progress.tsx"
  "tabs.tsx"
  "toast.tsx"
  "toaster.tsx"
  "use-toast.ts"
)

# Components that might be dependencies for the used components
DEPENDENCY_COMPONENTS=(
  "separator.tsx"
  "popover.tsx"
  "dropdown-menu.tsx"
  "form.tsx"
  "select.tsx"
  "toggle.tsx"
)

# Path to UI components
UI_DIR="/Users/ashwanikushwaha/Downloads/intern-dashboard/components/ui"

# Get all component files
ALL_COMPONENTS=$(ls $UI_DIR)

# Create a temporary directory for unused components
mkdir -p /Users/ashwanikushwaha/Downloads/intern-dashboard/backup/unused-ui-components

# Function to check if a component is in the used or dependency list
is_used_or_dependency() {
  local component=$1
  for used in "${USED_COMPONENTS[@]}"; do
    if [ "$used" = "$component" ]; then
      return 0
    fi
  done
  for dep in "${DEPENDENCY_COMPONENTS[@]}"; do
    if [ "$dep" = "$component" ]; then
      return 0
    fi
  done
  return 1
}

# Move unused components to backup directory
for component in $ALL_COMPONENTS; do
  if ! is_used_or_dependency "$component"; then
    echo "Moving unused component: $component"
    mv "$UI_DIR/$component" "/Users/ashwanikushwaha/Downloads/intern-dashboard/backup/unused-ui-components/"
  fi
done

echo "Cleanup complete! Unused UI components have been moved to backup/unused-ui-components/"
