import os

target_string = 'navbar-footer.css?v=updated'
replacement_string = 'navbar-footer.css'
root_dir = r'c:\Users\sitih\.gemini\antigravity\scratch\strata_project\pages'

print(f"Scanning {root_dir}...")

for subdir, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(subdir, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if target_string in content:
                    new_content = content.replace(target_string, replacement_string)
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated: {filepath}")
            except Exception as e:
                print(f"Error processing {filepath}: {e}")

print("Done.")
