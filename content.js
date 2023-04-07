function getProblemInfo() {
    const problemTitle = document.querySelector("div.css-v3d350 h1").innerText;
    const problemURL = window.location.href;
    return { problemTitle, problemURL };
  }
  
  function getCodeSolution() {
    const codeEditor = document.querySelector(".CodeMirror");
    const codeContent = codeEditor.CodeMirror.getValue();
    return codeContent;
  }
  
  async function pushSolutionToGitHub(githubToken, repo, problemTitle, problemURL, codeSolution) {
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${problemTitle}.md`;
  
    const fileContent = `
  # [${problemTitle}](${problemURL})
  
  \`\`\`
  ${codeSolution}
  \`\`\`
  `;
  
    const base64Content = btoa(unescape(encodeURIComponent(fileContent)));
  
    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Authorization": `token ${githubToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: `Add solution for ${problemTitle}`,
        content: base64Content
      })
    });
  
    return response.ok;
  }
  
  function checkSubmitButton() {
    const submitButton = document.querySelector("button[title='Submit']");
    if (!submitButton) return;
  
    submitButton.addEventListener("click", async () => {
      const { problemTitle, problemURL } = getProblemInfo();
      const codeSolution = getCodeSolution();
  
      // Get user's GitHub token and repo from local storage
      chrome.storage.local.get(["githubToken", "githubRepo"], async (data) => {
        const { githubToken, githubRepo } = data;
        if (!githubToken || !githubRepo) return;
  
        const success = await pushSolutionToGitHub(githubToken, githubRepo, problemTitle, problemURL, codeSolution);
        if (success) {
          console.log("Solution pushed to GitHub successfully!");
        } else {
          console.error("Failed to push solution to GitHub.");
        }
      });
    });
  }
  
  checkSubmitButton();