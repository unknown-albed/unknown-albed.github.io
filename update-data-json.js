const fs = require('fs');
const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const owner = 'unknown-albed'; // replace with your GitHub username
const repo = 'unknown-albed.github.io'; // replace with your repository name
const path = 'data.json'; // path to the file in the repository

async function updateDataJson(question, answer) {
  try {
    // Get the current data.json content
    const { data: { content, sha } } = await octokit.repos.getContent({
      owner,
      repo,
      path
    });

    // Decode the base64 content
    const data = JSON.parse(Buffer.from(content, 'base64').toString());

    // Add new Q&A
    data.push({ question, answer });

    // Encode the updated content to base64
    const updatedContent = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');

    // Update the data.json file in the repository
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: 'Update data.json with new Q&A',
      content: updatedContent,
      sha
    });

    console.log('data.json updated successfully');
  } catch (error) {
    console.error('Error updating data.json:', error);
  }
}

// Read question and answer from command line arguments
const [,, question, answer] = process.argv;
updateDataJson(question, answer);
