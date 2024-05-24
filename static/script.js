document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submitBtn");
  submitBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const repoUrl = document.getElementById("repoUrl").value;
    const fileContentDiv = document.getElementById("fileContent");
    const sitemapContainer = document.getElementById("sitemapContainer");
    const sitemapDiv = document.getElementById("sitemap");
    const loadingBar = document.getElementById("loadingBar");

    if (!repoUrl) {
      fileContentDiv.textContent = "Please enter a GitHub repository URL.";
      return;
    }

    loadingBar.style.display = "block";

    fetchRepoContents(repoUrl)
      .then((contents) => {
        $(sitemapDiv).jstree(true).settings.core.data = contents;
        $(sitemapDiv).jstree(true).refresh();
        sitemapContainer.style.display = "block";
        fileContentDiv.textContent = "";
        loadingBar.style.display = "none";
      })
      .catch((error) => {
        fileContentDiv.textContent = `Error: ${error.message}`;
        loadingBar.style.display = "none";
      });
  });

  $("#sitemap")
    .jstree({
      core: {
        data: [],
        themes: {
          dots: true,
          icons: true,
        },
      },
      plugins: ["wholerow", "types"],
      types: {
        file: {
          icon: "jstree-icon jstree-file",
        },
        dir: {
          icon: "jstree-icon jstree-folder",
        },
      },
    })
    .on("select_node.jstree", function (e, data) {
      if (data.node.type === "file") {
        fetchFileContent(data.node.a_attr.href);
      }
    });
});

function fetchRepoContents(repoUrl) {
  return new Promise((resolve, reject) => {
    fetch("/read-repo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ repoUrl }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        resolve(createTreeData(data));
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function createTreeData(contents) {
  return contents.map((item) => {
    if (item.type === "dir") {
      return {
        text: item.name,
        children: createTreeData(item.children),
        type: "dir",
      };
    } else {
      return {
        text: item.name,
        a_attr: { href: item.download_url, target: "_blank" },
        type: "file",
      };
    }
  });
}

function fetchFileContent(fileUrl) {
  fetch(fileUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return response.text();
    })
    .then((content) => {
      const fileContentDiv = document.getElementById("fileContent");
      fileContentDiv.innerHTML = `<pre><code>${escapeHtml(
        content
      )}</code></pre>`;
      hljs.highlightElement(fileContentDiv.querySelector("code"));
    })
    .catch((error) => {
      document.getElementById(
        "fileContent"
      ).textContent = `Error: ${error.message}`;
    });
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
