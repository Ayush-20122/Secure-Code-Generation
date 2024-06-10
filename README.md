# Secure Code Generation Application

This application demonstrates secure code generation using Python. The project structure includes the main application file, static resources and templates

## Project Structure

- `main.py`: The main application file.
- `static/`: Directory containing static resources like CSS, JavaScript, images, etc.
- `templates/`: Directory containing HTML templates for the application.

## Prerequisites

- Python 3.x installed on your machine.
- `pip` for managing Python packages.

## Setup Instructions

1. **Create a virtual environment** (recommended):
    ```sh
    python -m venv venv
    source venv/bin/activate   # On Windows, use `venv\Scripts\activate`
    ```

2. **Install required packages**:
    You may manually install the necessary packages, using the command given below:
    ```sh
    pip install Flask openai requests
    ```

    If there are additional dependencies, you can install them similarly. For example:
    ```sh
    pip install <package-name>
    ```

3. **Run the application**:
    ```sh
    python main.py
    ```

## Usage

1. Run the `main.py` file, a URL will be displayed in the output.

2. Navigate to the URL in your web browser as indicated by the output of `main.py` (usually `http://127.0.0.1:5000` or similar).

3. Interact with the application through the provided web interface.

## Project Details

### `main.py`

This file contains the main logic for running the application. Ensure all required packages are installed before running this script.

### `static/`

Contains all static files like CSS, JavaScript, and image files used by the HTML templates.

### `templates/`

Contains HTML template files which define the structure of web pages rendered by the application.
