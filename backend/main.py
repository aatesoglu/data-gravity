import os
import shutil
import subprocess
import uuid
import json
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_DIR = "temp_uploads"
os.makedirs(TEMP_DIR, exist_ok=True)

@app.get("/")
async def root():
    return {"message": "Data Gravity Backend is running", "status": "online"}

@app.post("/analyze")
async def analyze_data(file: UploadFile = File(...)):
    # Create unique filename
    file_id = str(uuid.uuid4())
    file_extension = file.filename.split(".")[-1] if "." in file.filename else "csv"
    # Use absolute path for temp file to ensure R finds it
    temp_file_path = os.path.abspath(os.path.join(TEMP_DIR, f"{file_id}.{file_extension}"))

    try:
        # Save uploaded file
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Determine absolute path for R script
        # Assuming stats.R is in the same directory as main.py
        current_dir = os.path.dirname(os.path.abspath(__file__))
        r_script_path = os.path.join(current_dir, "stats.R")

        # Execute R script
        # Using absolute path since R is not in system PATH
        r_executable = r"C:\Program Files\R\R-4.5.2\bin\Rscript.exe"
        if not os.path.exists(r_executable):
            # Fallback to just "Rscript" if the hardcoded path is wrong (e.g. diff machine)
            r_executable = "Rscript"

        # Debug command
        print(f"DEBUG: Running command: {[r_executable, r_script_path, temp_file_path]}")

        # Execute R script
        result = subprocess.run(
            [r_executable, r_script_path, temp_file_path],
            capture_output=True,
            text=True,
            check=False 
        )

        if result.returncode != 0:
            print(f"R Error Output: {result.stderr}")
            print(f"R Stdout: {result.stdout}")
            raise HTTPException(status_code=500, detail=f"R execution failed: {result.stderr}")

        # Parse R output
        try:
            r_output = json.loads(result.stdout)
            return r_output
        except json.JSONDecodeError:
             print(f"R Output Parse Error. Raw: {result.stdout}")
             raise HTTPException(status_code=500, detail="Failed to parse R output")

    except Exception as e:
        print(f"Server Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

