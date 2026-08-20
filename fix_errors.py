import re

with open('src/app/pages/admin.component.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Make api method public instead of private
content = content.replace("private async api(", "public async api(")

# Add errors to labels, hints, titles, descriptions
content = content.replace("system: 'system'", "system: 'system',\n      errors: 'errors'")
content = content.replace("system: 'systemHint'", "system: 'systemHint',\n      errors: 'errorsHint'")
content = content.replace("system: 'systemTitle'", "system: 'systemTitle',\n      errors: 'errors'")
content = content.replace("system: 'systemDescription'", "system: 'systemDescription',\n      errors: 'errorsHint'")


with open('src/app/pages/admin.component.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed compiler errors.")
