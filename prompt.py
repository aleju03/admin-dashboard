import os

def generate_prompt(root_dir='src'):
    """
    Generate a prompt with the project structure first in XML <ProjectDirectories> tag, 
    followed by the contents of .js files within the <codeFiles> tag.
    """
    # Collect the directory structure and file names
    dir_structure = ['<ProjectDirectories>']
    file_contents = ['<codeFiles>']
    
    excluded_files = {'index.js', 'reportWebVitals.js', 'setupTests.js', 'App.test.js'}

    for root, dirs, files in os.walk(root_dir):
        # Ignore hidden directories and files
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        files = [f for f in files if not f.startswith('.') and f not in excluded_files]        
        
        # Get the relative path to the root
        relative_root = os.path.relpath(root, start=root_dir)
        
        # Add the directory and its files to the structure
        indent_level = relative_root.count(os.sep)
        indent = ' - ' * (indent_level + 1)
        dir_structure.append(indent[:-3] + os.path.basename(root) + '/')
        
        for file in files:
            if file.endswith('.js'):
                # Add the file name to the directory structure
                dir_structure.append(f"{indent}{file}")
                
                # Add the file content to the file contents section
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as content_file:
                    content = content_file.read()
                    file_contents.append('`' + file + ':`')
                    file_contents.append('```')
                    file_contents.append(content)
                    file_contents.append('```')

    # Close the XML tags
    dir_structure.append('</ProjectDirectories>')
    file_contents.append('</codeFiles>')

    # Join the directory structure and file contents
    full_prompt = "\n".join(dir_structure) + "\n\n" + "\n".join(file_contents)

    # Path to Desktop
    desktop_path = 'C:\\Users\\aleji\\OneDrive\\Desktop'
    output_file_path = os.path.join(desktop_path, 'codebase.txt')

    # Write the full prompt to a .ini file on the desktop
    with open(output_file_path, 'w', encoding='utf-8') as prompt_file:
        prompt_file.write(full_prompt)

    print(f"Prompt has been written to {output_file_path}")

# Run the function to generate the prompt
if __name__ == "__main__":
    generate_prompt()