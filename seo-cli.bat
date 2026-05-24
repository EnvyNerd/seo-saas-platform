@echo off
set "SCRIPT_DIR=%~dp0"
"%SCRIPT_DIR%backend\venv\Scripts\python.exe" "%SCRIPT_DIR%backend\cli.py" %*
