import os
import requests
from flask import Flask, render_template, jsonify, request
from dotenv import load_dotenv

app = Flask(__name__, static_folder='static', template_folder='templates')
load_dotenv()
git_token = os.environ.get('GIT_TOKEN')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/read-repo', methods=['POST'])
def read_repo():
    data = request.get_json()
    repo_url = data.get('repoUrl')
    print(repo_url)

    if not repo_url:
        return jsonify({"message": "Repository URL is required"}), 400

    try:
        api_url = convert_to_api_url(repo_url)
        repo_structure = build_repo_structure(api_url)
        return jsonify(repo_structure)

    except requests.exceptions.RequestException as e:
        return jsonify({"message": str(e)}), 400
    except ValueError as ve:
        return jsonify({"message": str(ve)}), 400
    except KeyError:
        return jsonify({"message": "Error retrieving repository contents. Please check the URL and try again."}), 400
    except Exception as ex:
        return jsonify({"message": str(ex)}), 400

def convert_to_api_url(repo_url):
    if repo_url.endswith('.git'):
        repo_url = repo_url[:-4]

    url_parts = repo_url.split('/')
    if len(url_parts) < 5:
        raise ValueError("Invalid GitHub repository URL format")

    username = url_parts[3]
    repo = url_parts[4]
    return f"https://api.github.com/repos/{username}/{repo}/contents/"

def build_repo_structure(api_url):
    headers = {
        'Authorization': f'token {git_token}',
        'Accept': 'application/vnd.github.v3+json'
    }
    response = requests.get(api_url, headers=headers)

    if response.status_code != 200:
        raise requests.exceptions.RequestException(f"Failed to fetch repository contents. Status code: {response.status_code}")

    contents = response.json()
    return parse_contents(contents)

def parse_contents(contents):
    repo_structure = []
    for item in contents:
        if item['type'] == 'dir':
            subdir_url = item['url']
            headers = {
                'Authorization': f'token {git_token}',
                'Accept': 'application/vnd.github.v3+json'
            }
            subdir_contents = requests.get(subdir_url, headers=headers).json()
            children = parse_contents(subdir_contents)
            repo_structure.append({
                'name': item['name'],
                'type': 'dir',
                'children': children
            })
        else:
            repo_structure.append({
                'name': item['name'],
                'type': 'file',
                'download_url': item['download_url']
            })
    return repo_structure

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)




# if isinstance(file_data, list):
        #     return jsonify({"message": "The URL points to a directory, not a file."}), 400
        
        # vuln_content = base64.b64decode(file_data['content']).decode('utf-8')
    
        # response = client.chat.completions.create(
        #     model="gpt-4o",
        #     messages=[{
        #         "role": "system",
        #         "content":
        #         '''As a professional penetration tester, your task is to analyze the given insecure code provided 
        #         by the user and identify potential vulnerabilities.
        #         \nPlease follow the steps outlined below:
        #         \nStep 1 - Carefully review the code, identify any potential 
        #         security vulnerabilities and also mention the line number where the vulnerability is present. 
        #         Provide a numbered list of the identified issues, 
        #         explaining why each one poses a security risk.
        #         \nStep 2 - For each of the vulnerabilities identified at Step 1, provide an example of how 
        #         the existing code could be modified to mitigate the security risk. Use code blocks to clearly 
        #         differentiate the secure code from the rest of your explanations.'''
        #     }, {
        #         "role": "user",
        #         "content": vuln_content
        #     }],
        #     temperature=0.7,
        #     top_p=1)
        
        # completion_message = response.choices[0].message.content
        # print(completion_message)

        # temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".txt")
        # with open(temp_file.name, 'w', encoding='utf-8') as f:
        #     f.write(completion_message)

        # return send_file(temp_file.name, as_attachment=True, download_name='Secure_Code.txt')

    