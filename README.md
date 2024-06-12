# Create repo action

Action that creates repo either empty or from a template. Can authorize with a PAT or a GitHub App.

## Build

`ncc build index.js`

## Example workflow

Workflow to create a repo

```yaml create-repo.yaml
name: Create repo from issue submission
on:
  issue:
    types:
      - opened
jobs:
  AddGroups:
    runs-on: ubuntu-latest
    jobs:
      - name: Checkout
        uses: actions/checkout@v4

      # Extract info from issue template
      - uses: stefanbuck/github-issue-parser@v3
        id: issue-parser
        with:
          template-path: .github/ISSUE_TEMPLATE/create-repo.yaml

      - name: Sync Groups
        uses: jcantosz/create-repo-action@main
        with:
          pat: ${{ secrets.PAT }}
          # The org to create the repo in
          org: ${{ steps.issue-parser.outputs.issueparser_org }}
          # The repo name to create
          repo: ${{ steps.issue-parser.outputs.issueparser_repo }}
          # Repo description
          description: "Repo created from ${{ github.server_url }}/${{ github.repository }}/issues/${{ github.event.issue.number }}"
          # Repo visibility
          visibility: private
          # Org of the repo template to use
          repo_template_org: ${{ steps.issue-parser.outputs.issueparser_repo-template-org }}
          # Repo name of the repo template to use
          repo_template_repo: ${{ steps.issue-parser.outputs.issueparser_repo-template-repo }}
          # Include all branches from the template?
          include_all_branches: true
```

## Parameters

| Parameter            | Description                                                                            | Default                                                 | Required | Note                                                         |
| -------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------- | -------- | ------------------------------------------------------------ |
| pat                  | The PAT used to authenticate.                                                          | `none`                                                  | `false`  |                                                              |
| app_id               | The GitHub App ID used to authenticate.                                                | `none`                                                  | `false`  |                                                              |
| app_private_key      | The GitHub App private key used to authenticate.                                       | `none`                                                  | `false`  |                                                              |
| app_installation_id  | The GitHub app installation ID used to authenticate.                                   | `none`                                                  | `false`  |                                                              |
| api_url              | GitHub API URL.                                                                        | `none`                                                  | `false`  | Change this if using GitHub Enterprise Server.               |
| org                  | The organization to create this repo in.                                               | `none`                                                  | `true`   |                                                              |
| repo                 | The name of the repo to create.                                                        | `none`                                                  | `true`   | Will fail if repo already exists                             |
| description          | The description added to he created repo                                               | `Repo created with action jcantosz/create-repo-action.` | `false`  |                                                              |
| visibility           | The visibility of the created repo. Can be: 'private', 'internal', or 'public'.        | `private`                                               | `false`  |                                                              |
| repo_template_org    | The org of the template repo, if creating from template.                               | `none`                                                  | `false`  |                                                              |
| repo_template_repo   | The name of the template repo, if creating from template.                              | `none`                                                  | `false`  |                                                              |
| include_all_branches | Whether to include all branches or not, if creating from template.                     | `none`                                                  | `false`  |                                                              |
| clone_push           | Simulates 'create from a template' by running git clone/push instead of using the API. | `none`                                                  | `false`  | Will retain all commit history. Will not show linkage in UI. |

## Sample issue template

```yaml add_entra_group.yaml
name: Create repo
description: Create a repo from a template
title: "[REPO]: "
labels: ["repository"]
body:
  - type: input
    id: org
    attributes:
      label: Repository Org
      description: "The org of the repository to create"
      placeholder: "my-org"
  - type: input
    id: repo
    attributes:
      label: Repository Name
      description: "The name of the repository to create"
      placeholder: "my-repo"
  - type: dropdown
    id: repo-template-org
    attributes:
      label: Repository Template Org
      description: "The name of the org with the repository template"
      options:
        - my-org
      default: 0
  - type: dropdown
    id: repo-template-repo
    attributes:
      label: Repository Template Repo
      description: "The name of the repo with the repository template"
      options:
        - js-template
        - ruby-template
        - java-template
      default: 0
```
