# Secure Code Generation Application

This application demonstrates secure code generation using Python. The project structure includes the main application file, static resources and templates

## Project Structure

- `main.py`: The main application file.
- `static/`: Directory containing static resources like CSS, JavaScript, images, etc.
- `templates/`: Directory containing HTML templates for the application.

## Prerequisites

- Python 3.x installed on your machine.
- `pip` for managing Python packages.
- An active OpenAI API Key

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

3. **Set your OpenAI API key**:
    You need to have an active OpenAI API key to run the application. Set it as an environment variable:
    ```sh
    export OPENAI_API_KEY='your-openai-api-key'
    ```
    On Windows, use:
    ```sh
    set OPENAI_API_KEY='your-openai-api-key'
    ```

   If the above method doesn't work, try the method mentioned below:

   Create a `.env` file in the root directory of the project and add your API key:
    ```sh
    echo "OPENAI_API_KEY=your-openai-api-key" > .env
    ```

4. **Load environment variables**:(Optional: only if you're using the second method)
    Ensure that your application is set up to load environment variables from the `.env` file. You can use the `python-dotenv` package for this purpose:
    ```sh
    pip install python-dotenv
    ```

    In your `main.py`, add the following code to load the environment variables:
    ```python
    from dotenv import load_dotenv
    import os

    load_dotenv()

    openai_api_key = os.getenv('OPENAI_API_KEY')
    ```

5. **Run the application**:
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
