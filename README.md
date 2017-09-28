# The Ticketmaster Developer Network

Home to the [Ticketmaster Developer Portal](http://developer.ticketmaster.com/).

## Installation

1. [Install Ruby](http://rubyinstaller.org/)
2. Install Gem 'github-pages' `gem install 'github-pages'`
3. Clone portal:  `git clone https://git.tmaws.io/dev-portal/Ticketmaster-Developer-Portal.git`
4. Go to the root directory.
5. Build Jekyll: `jekyll build`
5. Run srver: `npm start`

## Alternative running method

After you done steps 1-4 from **Installation**, to run project you can use next method:

1. Install Gulp globally `npm install --global gulp`
2. [Install Sass globally](http://sass-lang.com/install)
3. Run the project `gulp`
This method will rebuild you sass files with source-maps.

## Setup dev environment

1. [Install NodeJS with NPM](https://nodejs.org/uk/)

## Building Frontend

1. Install project dependencies `npm install`
2. Launch project `npm start`

While developing, you will probably rely mostly on `npm start`; however, there are additional scripts at your disposal:

|`npm run <script>`|Description|
|------------------|-----------|
|`start`|Serves your app at `localhost:4000`. Jekyll will be enabled in development.|
|`webpack`|Build bundle for API Explorer V2 and watches for changes to re-run build.|
|`build`|Build bundle for API Explorer V2 and compress by uglify plugin.|
|`test`|Runs unit tests with JEST and generates a coverage report and watches for changes to re-run tests.|
|`lint`|Lint `.js` (from `/scripts/` fodler) and `.scss` files.|
|`es-lint`|Lint all `.js` files from folder `/scripts/`.|
|`sass-lint`|Lint `.scss` files.|

## Contributions

To contribute to the dev portal, please make sure you fork your changes and submit a pull request and we'll be happy to consider it for merge. Here are the areas in which we welcome contributions:

* Documentation
* Events
* Copy typos and bugs
* Missing content

### Steps to contribute
1. Fork the `master` branch
2. Develop in feature branch locally
3. Push the branch to gitlab server. Gitlab-ci will create a new pipeline and will start jobs  automatically
4. Make sure the all tests are green and the CI is passed successfully
5. Create a merge request to `dev-portal/Ticketmaster-Developer-Portal/dev` branch

After the merge request will be merged by Developer Portal team the functionality will appear on staging environment https://developer-portal.staging.ticketmaster.com/
If everything is good, your changes will come to production with the next release.

## Support

For support, please find us on [Twitter](http://www.twitter.com/tmastertech) and/or file a bug in Github's issues.
