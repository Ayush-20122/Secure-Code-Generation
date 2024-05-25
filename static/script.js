document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submitBtn");
  submitBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const repoUrl = document.getElementById("repoUrl").value;
    const fileContentDiv = document.getElementById("fileContent");
    const fileTitleDiv = document.getElementById("fileTitle");
    const sitemapContainer = document.getElementById("sitemapContainer");
    const sitemapDiv = document.getElementById("sitemap");
    const vulnerabilitiesDiv = document.getElementById("vulnerabilities");
    const vulnerabilitiesTitleDiv = document.getElementById(
      "vulnerabilitiesTitle"
    );
    const sitemapLoading = document.getElementById("sitemapLoading");

    if (!repoUrl) {
      fileContentDiv.textContent = "Please enter a GitHub repository URL.";
      return;
    }

    sitemapLoading.style.display = "flex";

    fetchRepoContents(repoUrl)
      .then((contents) => {
        $(sitemapDiv).jstree(true).settings.core.data = contents;
        $(sitemapDiv).jstree(true).refresh();
        sitemapContainer.style.display = "block";
        fileContentDiv.textContent = "";
        fileTitleDiv.textContent = "";
        vulnerabilitiesDiv.textContent = "";
        vulnerabilitiesTitleDiv.textContent = "";
        vulnerabilitiesTitleDiv.style.display = "none";
        sitemapLoading.style.display = "none";
      })
      .catch((error) => {
        fileContentDiv.textContent = `Error: ${error.message}`;
        sitemapLoading.style.display = "none";
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
        fetchFileContent(data.node.a_attr.href, data.node.text);
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

function fetchFileContent(fileUrl, fileName) {
  const vulnerabilitiesLoading = document.getElementById(
    "vulnerabilitiesLoading"
  );
  vulnerabilitiesLoading.style.display = "flex";

  fetch(fileUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return response.text();
    })
    .then((content) => {
      const fileContentDiv = document.getElementById("fileContent");
      const fileTitleDiv = document.getElementById("fileTitle");
      const vulnerabilitiesDiv = document.getElementById("vulnerabilities");
      const vulnerabilitiesTitleDiv = document.getElementById(
        "vulnerabilitiesTitle"
      );

      fileTitleDiv.textContent = `File: ${fileName}`;
      fileContentDiv.innerHTML = `<pre><code>${escapeHtml(
        content
      )}</code></pre>`;
      hljs.highlightElement(fileContentDiv.querySelector("code"));
      hljs.lineNumbersBlock(fileContentDiv.querySelector("code"));

      vulnerabilitiesTitleDiv.textContent = "Vulnerabilities and Secure Code";
      fetchVulnerabilities(content)
        .then((vulnerabilities) => {
          vulnerabilitiesDiv.innerHTML = `<pre><code>${escapeHtml(
            vulnerabilities
          )}</code></pre>`;
          hljs.highlightElement(vulnerabilitiesDiv.querySelector("code"));
          vulnerabilitiesTitleDiv.style.display = "block";
          vulnerabilitiesLoading.style.display = "none";
        })
        .catch((error) => {
          vulnerabilitiesDiv.textContent = `Error: ${error.message}`;
          vulnerabilitiesLoading.style.display = "none";
        });
    })
    .catch((error) => {
      document.getElementById(
        "fileContent"
      ).textContent = `Error: ${error.message}`;
      vulnerabilitiesLoading.style.display = "none";
    });
}

function fetchVulnerabilities(code) {
  return new Promise((resolve, reject) => {
    fetch("/analyze-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.vulnerabilities) {
          resolve(data.vulnerabilities);
        } else {
          reject(new Error("No vulnerabilities data returned."));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function escapeHtml(unsafe) {
  if (typeof unsafe !== "string") return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
