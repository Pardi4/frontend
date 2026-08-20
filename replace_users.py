import re

with open('src/app/pages/admin.component.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Add AdminUsersComponent import
if 'AdminUsersComponent' not in content:
    content = content.replace("import { AdminErrorsComponent } from './admin-errors.component';", "import { AdminErrorsComponent } from './admin-errors.component';\nimport { AdminUsersComponent } from './admin-users.component';")
    content = content.replace("imports: [CommonModule, FormsModule, AdminErrorsComponent],", "imports: [CommonModule, FormsModule, AdminErrorsComponent, AdminUsersComponent],")

# Replace users tab
system_start = content.find("<section class=\"admin-panel glass\" *ngIf=\"activeTab() === 'users'\">")
if system_start != -1:
    depth = 0
    tag_regex = re.compile(r'<\/?section[^>]*>')
    pos = system_start
    while True:
        match = tag_regex.search(content, pos)
        if not match:
            break
        tag = match.group(0)
        if tag.startswith('</section'):
            depth -= 1
            if depth == 0:
                end_pos = match.end()
                content = content[:system_start] + "<app-admin-users *ngIf=\"activeTab() === 'users'\" [p]=\"this\"></app-admin-users>" + content[end_pos:]
                break
        elif tag.startswith('<section'):
            depth += 1
        pos = match.end()

with open('src/app/pages/admin.component.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Replaced users tab successfully.")
