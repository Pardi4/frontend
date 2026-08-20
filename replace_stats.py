import re

with open('src/app/pages/admin.component.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Add AdminStatsComponent import
if 'AdminStatsComponent' not in content:
    content = content.replace("import { AdminUsersComponent } from './admin-users.component';", "import { AdminUsersComponent } from './admin-users.component';\nimport { AdminStatsComponent } from './admin-stats.component';")
    content = content.replace("imports: [CommonModule, FormsModule, AdminErrorsComponent, AdminUsersComponent],", "imports: [CommonModule, FormsModule, AdminErrorsComponent, AdminUsersComponent, AdminStatsComponent],")

# Replace system tab
system_start = content.find("<section class=\"admin-panel glass\" *ngIf=\"activeTab() === 'system'\">")
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
                content = content[:system_start] + "<app-admin-stats *ngIf=\"activeTab() === 'system'\" [p]=\"this\"></app-admin-stats>" + content[end_pos:]
                break
        elif tag.startswith('<section'):
            depth += 1
        pos = match.end()

with open('src/app/pages/admin.component.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Replaced system tab successfully.")
