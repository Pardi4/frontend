import re

with open('src/app/pages/admin.component.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Add AdminErrorsComponent import
if 'AdminErrorsComponent' not in content:
    content = content.replace("import { FormsModule } from '@angular/forms';", "import { FormsModule } from '@angular/forms';\nimport { AdminErrorsComponent } from './admin-errors.component';")
    content = content.replace("imports: [CommonModule, FormsModule],", "imports: [CommonModule, FormsModule, AdminErrorsComponent],")

# Add errors to AdminTab
content = content.replace("type AdminTab = 'users' | 'purchases' | 'bugs' | 'support' | 'cache' | 'parser' | 'system';", "type AdminTab = 'users' | 'purchases' | 'bugs' | 'support' | 'cache' | 'parser' | 'system' | 'errors';")
content = content.replace("const ADMIN_TAB_IDS: AdminTab[] = ['users', 'purchases', 'bugs', 'support', 'cache', 'parser', 'system'];", "const ADMIN_TAB_IDS: AdminTab[] = ['users', 'purchases', 'bugs', 'support', 'cache', 'parser', 'system', 'errors'];")

# Add errors to ADMIN_COPY
content = content.replace("systemHint: 'health',", "systemHint: 'health',\n    errors: 'Client errors',\n    errorsHint: 'frontend',")
content = content.replace("systemHint: 'zdrowie',", "systemHint: 'zdrowie',\n    errors: 'Błędy klienta',\n    errorsHint: 'frontend',")

# Add tab group definition for errors
content = content.replace("{ id: 'system', label: 'System', short: 'SY' }", "{ id: 'system', label: 'System', short: 'SY' },\n        { id: 'errors', label: 'Errors', short: 'ER' }")

# Add errors tab in HTML
# Find the end of system tab:
system_end = content.find("</section>", content.find("*ngIf=\"activeTab() === 'system'\""))
if system_end != -1:
    # Need to find the end of the system tab properly by counting <section> and </section>
    system_start = content.find("<section class=\"admin-panel glass\" *ngIf=\"activeTab() === 'system'\">")
    
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
                content = content[:end_pos] + "\n\n            <app-admin-errors *ngIf=\"activeTab() === 'errors'\" [api]=\"api.bind(this)\"></app-admin-errors>" + content[end_pos:]
                break
        elif tag.startswith('<section'):
            depth += 1
        pos = match.end()

with open('src/app/pages/admin.component.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Added errors tab successfully.")
