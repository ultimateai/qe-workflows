# Add project name here

Add project description here.

## Quick start

1. Authenticate your user with Google Cloud `gcloud auth login`
2. run `npm run artifactregistry-login:local` to authenticate with the artifact repository and persist credentials for npm.
3. Install the dependencies with `npm install`
4. Copy `.env.example` as `.env` and get missing values from vault
5. Run `npm run test` to make sure everything is ok
6. Run the application `npm run dev`

## How to debug

1. To debug create debug config in webstorm with following config

-   `attach to Node.js/Chrome`
-   host `localhost`
-   Port `9229`
-   Attach to `Chrome or Node.js > 6.3 started with --inspect`

2. Start the service with `npm run devDebug`

## Scripts

-   `dev`: Run the application in development mode
-   `devDebug`: Run the application in development mode with remote debugging enabled
-   `start`: Run the application in production mode (prefer not to do that in development)
-   `test`: Run the test suite (not implemented yet)
-   `lint`: Lint the codebase
-   `lintFix`: Lint and fix the codebase

## CI/CD

The build and deployment process are triggered by Github Actions. Inside .github folder you will find:

-   `deploy-branch-to-dev.yml`: This action will deploy your code on whichever selected branch, to development environment. 
-   `open-pr.yml`: This action will happen whenever you open a PR against main, and it will do some basic checks - npm i, npm test, docker build
-   `merged-pr.yml`: TThis action will happen whenever you successfully merge a PR into main, and will bump the release on your repo, build and push the image with the updated tag and, finally, automatically deploy to development environment (as long as your app exists in k8s-manifest repo!). Note on bumping version: Bumping will be major (1.0.0-->2.0.0), minor(1.0.0-->1.1.0) or patch(1.0.0-->1.0.1) depending on the wording of your _SQUASED_ commit. If using any other merge method, wording is taken from _last_ commit. Default behaviour is patch. 
Additionally, you have the option to choose a file to be version-bumped (for the moment package.json or version.txt) and, if you want, to have your changelog automatically bumped too. 
-   `manual-deploy.yml`: This action will deploy the latest release to a selected environment. If deploying to staging, optionally, testim suites can also be launched. In case of doubts, contact your QA team. 
-   `rollback.yml`: This action will deploy the selected version to the choosen environment. Only chapter leads can deploy a specific version. For a deployment in production to be successful, the version should already be deployed in staging. 
-   `lint-pr.yml`: This action will happen whenever you open, edit or sync a PR - it will mainly verify the PR so that it looks like:
```
feat(ui): https://ultimateai.atlassian.net/browse/PLT-000 some explanation of the work you've done.
^    ^    ^
|    |    |__ Subject
|    |_______ Scope
|____________ Type
```


Called workflows can be found in [central-workflows-repository](https://github.com/ultimateai/workflows)

### How to enable CI/CD

1. Make sure there `k8s-manifests` are ready for this application!
2. Check all inputs from all files inside .github/workflows. Ask if there's something you don't understand. 
> ⚠️ **PLEASE update app_squad parameter** in [`manual-deploy.yaml`](./.github/workflows/manual-deploy.yml), [`deploy-branch-to-dev.yaml`](./.github/workflows/deploy-branch-to-dev.yml), [`rollback.yaml`](./.github/workflows/rollback.yml)  and [`merged-pr.yaml`](./.github/workflows/merged-pr.yml)  
> ⚠️ **PLEASE update initial_release parameter to latest image version, if your repository already existed in bitbucket or had a different CI/CD system** in [`merged-pr.yaml`](./.github/workflows/merged-pr.yml)

## Tech

##### Basics

-   [Typescript](https://www.npmjs.com/package/typescript)
-   [TS-Node](https://github.com/TypeStrong/ts-node)
-   [Express](https://npmjs.com/package/express)
-   [dotenv](https://www.npmjs.com/package/dotenv)
-   [mongoose](https://www.npmjs.com/package/mongoose)
-   [reflect-metadata](https://www.npmjs.com/package/reflect-metadata)

##### Validation

-   [Class-validator](https://www.npmjs.com/package/class-validator)
-   [Class-transformer](https://www.npmjs.com/package/class-transformer)
-   [envalid](https://www.npmjs.com/package/envalid)

##### Request handling

-   [Cookie parser](https://www.npmjs.com/package/cookie-parser)
-   [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

##### Security

-   [helmet](https://www.npmjs.com/package/helmet)
-   [hpp](https://www.npmjs.com/package/hpp)

##### Testing

-   [jest](https://www.npmjs.com/package/jest)
-   [ts-jest](https://www.npmjs.com/package/ts-jest)

##### Formatting

-   [prettier](https://prettier.io/)

## How to use locally

For local development server token validation is not enabled, here are some examples of requests we can send to the
service:

