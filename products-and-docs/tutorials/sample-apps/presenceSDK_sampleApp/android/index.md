---
layout: documentation-single
categories:
- documentation
- tutorials
- presence-sdk-sample-app

title: Android Presence SDK Sample App

img: "/assets/img/tutorial/presenceSDKSampleApp/presenceSampleApp.png"

link: "/products-and-docs/tutorials/sample-apps/presenceSDK_sampleApp/android/index.html"

announcement: "Demo the newest version of the Presence SDK Directly on your Android device!"

tags: 
  - PresenceSDK
  - Android

excerpt: Demo the newest version of the Presence SDK!
---

{: .article }
# Android Presence SDK Sample App
<div class="col-lg-12 config-block">
	<table style="border: none;">
		<tr style="background-color: #FFFFF; border: none;">
			<td style="border: none;"><img src="/assets/img/tutorial/presenceSDKSampleApp/android_sampleapp_0.png"></td>
			<td style="border: none;"><img src="/assets/img/tutorial/presenceSDKSampleApp/android_sampleapp_1.png"></td>
			<td style="border: none;"><img src="/assets/img/tutorial/presenceSDKSampleApp/android_sampleapp_2.png"></td>
			<td style="border: none;"><img src="/assets/img/tutorial/presenceSDKSampleApp/android_sampleapp_3.png"></td>
		</tr>
	</table>
</div>

## Introduction
{: .article }

The Sample App empowers clients and integrators to easily demo the newest version of the Presence SDK on their Android phone.
Check out new features, understand expected functionality, and even experiment with color schemes to customize the SDK for your particular app: no developer resources required!


### Prerequisites
{: .article }
- Android Phone running Jellybean 4.1 - Oreo 8.0 (API 16 - 26)
- TM Developer Account with registered app that has been approved for Presence SDK
- Archtics Team account or Host Ticketmaster account with available event tickets in order to fully interact with the SDK's capabilities.

**Note:** To get consumer key please create an account on [https://developer.ticketmaster.com](https://developer-acct.ticketmaster.com/user/login) and register your app and it will generate a consumer key that can be used in the above method. Before you can use Presence SDK you will have to provide the generated consumer key together with consumer secret and redirect URI to Presence SDK support team so we can configure your app on our end!

### Installation
Download the sample app by clicking this link directly from your Android Phone (link will not work on otherwise).

<a class="button button-blue" href="/products-and-docs/sdks/presence/android/app-prod-debug.apk">Download and Install</a>

You must allow installation of apps from unknown sources in order to install the Sample App .apk file:
Click `Settings > Security > Unknown Sources` (Allow installation of apps from Unknown Sources)
Install the app by clicking `Downloads > Open the Android-PresenceSDK APK > Install`

### Sample App Notes
Before you begin, you will need to log in to the developer portal and copy the Consumer Key for your app: [https://developer-acct.ticketmaster.com/user/login](https://developer-acct.ticketmaster.com/user/login)

Then you can proceed to open the recently downloaded PSDK Sample App.

Enter your 32-character Consumer Key from the developer portal and click Submit.

Enter a Team name (27 characters or less recommend).

Select if you are using New Account Manager or Classic Account Manager.
Click Next.

Configure your branding color by entering a hex code (E.g. black `000000`, red `FF0000`, Yellow `FFFF00`, Green `008000`, Blue `0000FF`).

Select a color theme for your text (light theme should be selected with darker branding colors, while dark theme should be selected with lighter branding colors).

If you have an Experience account and want to demo the Experience SDK functionality, select Yes to enter your Experience credentials. **Note:** Experience SDK only supports Android Lollipop 5.0 - Oreo 8.0 (API level 20-26)

Now you can log into this version of the SDK and manage your real tickets! 

**Sample App only supports saving one profile at this time.**