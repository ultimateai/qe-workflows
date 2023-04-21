# Qe workflows

Public repo created for those workflows under qe-umbrella. Thought for reusable workflows, but may contain any time of workflow - without bussiness logic, though. 

## The basics

1. Tests are not in public repos, but in private ones. However, with the adequate token, we can checkout to those repos and execute those tests. 


## How to debug

1. Create a new branch in this repo "qe-test-branch"
2. Create a new branch in reusable workflows "wf-test-branch"(or, if you know what you're doing, just call this workflow from a new caller workflow within your app), 
3. In "wf-test-branch" make sure to update the e2e-tests part, so that they call your branch: 
[Here](https://github.com/ultimateai/workflows/blob/main/.github/workflows/manual-deploy.yml#L290) instead of:
uses: ultimateai/qe-workflows/.github/workflows/playwright-e2e-tests.yml@0.1.0
Just modify the version, to your branch: 
uses: ultimateai/qe-workflows/.github/workflows/playwright-e2e-tests.yml@qe-test-branch

4. Finally, in the app you're using to test, update the version of the manual workflow to wf-test-branch

## Next improvements
1. Slack notification alongside staging deployment 

2. Artifact stored in gcloud bucket instead of GitHub artifacts

3. Improve Slack notification with direct link to artifact

4. Parametrize which version of the qe-workflows we want to use (branch, version…) directly from the repo

5. Parametrize sharding characteristics (project, indexes…) 

6. Simplify versioning system


