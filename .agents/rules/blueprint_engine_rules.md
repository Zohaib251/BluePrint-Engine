# Blueprint Engine Development Rules

1. **Virtual Environment First**: All Python backend development must assume and explicitly state the use of a Virtual Environment (`venv`).
2. **Execution Logs**: Create/update a `command.txt` file with step-by-step terminal commands for any installations, specifying exactly which folder to run them in. Create a `run.txt` file containing only the final commands needed to boot up both the frontend and backend servers locally.
3. **Dependency Tracker**: If API keys or database setup are needed, update `cheezin.txt` in the root directory with clear, step-by-step instructions.
4. **Professional Documentation**: All code must include production-level inline comments and docstrings.
5. **No Fluff**: Output only the necessary code and file structures. Avoid conversational fluff.
