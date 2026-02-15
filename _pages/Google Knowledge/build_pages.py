def build_tool_rss_page(tool):
    tool_encoded = "-".join(tool.lower().split())

    with open(folder + "\\google-docs.xml") as f:
        page_content = f.read()

    page_content = page_content.replace('Google Docs', tool).replace('google-docs',tool_encoded)

    with open(f"{folder}\{tool_encoded}.xml", 'w+') as f:
        f.write(page_content)

tools = [
    "AppSheet", 
    "BigQuery", 
    "Gemini", 
    "Gmail", 
    "Google AI", 
    "Google Analytics", 
    # "Google Apps Script", 
    "Google Calendar", 
    "Google Chat", 
    "Google Drive", 
    "Google Forms", 
    "Google Keep", 
    "Google Meet", 
    "Google Sheets", 
    "Google Slides", 
    "Google Tasks", 
    "Google Voice", 
    "Google Workspace", 
    "Google Workspace Studio", 
    "NotebookLM"
]

for tool in tools:
    build_tool_rss_page(tool)