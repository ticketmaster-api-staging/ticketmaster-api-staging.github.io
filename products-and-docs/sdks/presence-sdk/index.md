---
layout: documentation-single
categories:
- documentation
- sdks
- presence-sdk

title: Presence SDK

excerpt: The Ticketmaster Presence SDK provides a simple way to add Ticketmaster features in your 3rd party iOS and Android apps
keywords: SDK, Presence, Ticket Management, iOS, Android
---

{% capture iOS_whatyouneed %}

To integrate the Presence SDK in your application, you will need PresenceSDK.framework and iOSExperienceSDK.framework.

## Release Notes Version 1.5.0

### Requirements for using Swift 4.0.0 build

- To build, you must use XCode 9.0.0 and the iOS 11.0 SDK
- Minimum iOS 9.0, supported through iOS 11

### Requirements for using Swift 3.1 build

- To build, you must use XCode 8.3.3 and the iOS 10.3 SDK
- Minimum iOS 9.0, supported through iOS 10.3.3

### General Requirements
- Only Portrait Orientation Supported.

### What’s New?
- Created a Sample App for clients and integrators to easily demo the SDK.
- Added local in-app notifications to alert user if tickets could not be refreshed.
- Identity Host Login to enable future support of social logins, such as Facebook.
- Updated the access token to be valid for 15 minute minimum.
- Added a new getMemberInfo() method that can be used to fetch logged in member information.
- Fixed event time to be displayed in event's timezone.
- Minor UI Improvements and bug fixes.

{% endcapture %}

{% capture Android_whatyouneed %}

To integrate Presence sdk in your application, you will need the following aar file:

-	PresenceSDK-release-1.5.\*.\*.aar

Supported API levels

-	API level 16 ~ 26

## Release Notes Version 1.5.0

### Requirements

-	Supported API level 16 ~ 26.
- Only Portrait Orientation Supported.

### What’s New?
- Created a Sample App for clients and integrators to easily demo the SDK.
- Updated Experience SDK version to 5.0.3 that includes loading spinner fix.
- Added local in-app notifications to alert user if tickets could not be refreshed.
- Identity Host Login to enable future support of social logins, such as Facebook.
- Added a new getMemberInfo() method that can be used to fetch logged in member information.
- Fixed an issue related to empty screen being displayed (due to device no-network) on the app launch when user already has cached information.
- Fixed a crash during cancel transfer flow.
- Fixed a crash that could occur during seat selection in posting and transfer flow.
- Experience SDK deep link removed to no longer force the app selection prompt for links.
- Minor bug fixes and improvements in ticket caching logic and counters.

{% endcapture %}

{% capture iOS_guides %}
<div class="col-xs-12 col-sm-12 col-md-9 col-lg-10 comntent">
    <div class="tutorials-article">
                <a href="/products-and-docs/sdks/presence-sdk/iOS/index.html"><img src="/assets/img/tutorial/presenceSDKSampleApp/presenceSampleApp.png" class="image" alt="iOS Presence SDK Reference and Integration Guide"></a>
            <div class="announcement">
                <h3><a href="/products-and-docs/sdks/presence-sdk/iOS/index.html">iOS Presence SDK Reference and Integration Guide</a></h3>
                <p>Integrating the Presence SDK into your iOS app is fast and simple.</p>
                <a class="button button-blue" href="/products-and-docs/sdks/presence-sdk/iOS/index.html">Learn more</a>
              </div>            
        </div>
</div>
{% endcapture %}



{% capture android_guides %}
<div class="col-xs-12 col-sm-12 col-md-9 col-lg-10 comntent">
    <div class="tutorials-article">
                <a href="/products-and-docs/sdks/presence-sdk/android/index.html"><img src="/assets/img/tutorial/presenceSDKSampleApp/presenceSampleApp.png" class="image" alt="Android Presence SDK Reference and Integration Guide"></a>
            <div class="announcement">
                <h3><a href="/products-and-docs/sdks/presence-sdk/android/index.html">Android Presence SDK Reference and Integration Guide</a></h3>
                <p>Integrating the Presence SDK into your Android app is fast and simple.</p>
                <a class="button button-blue" href="/products-and-docs/sdks/presence-sdk/android/index.html">Learn more</a>
            </div>            
        </div>
</div>
{% endcapture %}


{% capture iOS_changelog %}
### Changes(01/31/2018 Release 1.5.0)
- Created a Sample App for clients and integrators to easily demo the SDK.
- Added local in-app notifications to alert user if tickets could not be refreshed.
- Identity Host Login to enable future support of social logins, such as Facebook.
- Updated the access token to be valid for 15 minute minimum.
- Added a new getMemberInfo() method that can be used to fetch logged in member information.
- Fixed event time to be displayed in event's timezone.
- Minor UI Improvements and bug fixes.

### Changes(01/09/2018 Release 1.4.1)
- Add new method for fetching the access token for Host and Archtics.
- Add Experience SDK SSO Pinless Feature to disable pin prompt within add, return, and upgrade buttons.
- Upgrade to Experience iOS SDK v4.9.3 for Swift 3.1 and Experience iOS SDK v5.0.5 for Swift 4.0.0 to allow access to certain Experience Swift objects.
- Updated `onLoginSuccessful()` PresenceLoginDelegate method to return accessToken from the specified backend.
- Updated `onLoginCancelled()` PresenceLoginDelegate method to return the backend name associated with a callback event.
- Bug fixes and performance enhancements.

### Changes (12/05/2017 Release 1.4.0)
- Added support for prefetching all tickets in background so barcodes are accessible even in offline mode.
- Added support for VIP color and text.
- Added option to choose between Dark and Light theme for the SDK that works together with configured branding color.
- Added few more delegate methods for the Login flow to have function parity between iOS and Android SDK.
- Added a new method for accessing SDK's version number.
- Made Add to Wallet button more accessible by making it available on both front and back of ticket card.
- Made some overall improvements and fixed some critical bugs.

### Changes (11/21/17 Release 1.3.1)
- Fixed experience sdk integration issues.
- Fixed crash while adding a credit card for Host.

### Changes (11/6/17 Release 1.3.0)
- Experience SDK Integration.
- Improved Login Screen for the SDK.
- Support for iPhone X screen size.
- Added refresh button for fans with no tickets
- Added support for honoring custom tint color for navigation bar configured via UIAppearance.
- Bug fixes for adding Mastercard as refund card and other UI issues.


### Changes (10/16/17 Release 1.2.0)

-	Added support for entering verification code for linking TMR account for Archtics.
-	Fixed seat description selection for posting flow for Archtics.
-	Separated the login flow from main SDK so it can just be used for login and fetching valid access token. 

### Changes (10/5/17 Release 1.1.1)

-	Added support for choosing between different payout methods during Resale flow for Archtics.

### Changes (09/29/17 Release 1.1.0)

-	Added support for Apigee and made integration with SDK much simpler.
-	Added support for seat selection in Transfer and Resale flow.
-	Added support for pre-fetching Apple Wallet Passes
-	Added 3 new helper methods for checking login status
-	Fixed few minor issues in the SDK

### Changes (09/15/17 Release 1.0.8)

-	Switched to XCode 9 and Swift 4.

### Changes (09/13/17 Release 1.0.7)

-	Fixed couple of issues related to accepting terms of use if user has not accepted it yet.
-	Cancel Transfer option is immediately available after initiating a transfer.
-	Scan Barcode option is immediately available after canceling transfer if barcode is available.
-	Added a configuration parameter in the SDK to select new accounts manager flow for resetting password and creating account on main login screen.
-	Added SDK version number on the main login screen.

### Changes (09/5/17 Release 1.0.6)

-	Fixed the issue related to not able to post multiple tickets for resale at the same time.
-	Removed ticket price information from the Ticket Details View since that information is not provided.
-	Fixed an issue related to ‘Cancel’ button not appearing on Login screen in some cases.
-	Fixed an issue related to automatic scrolling to ticket card which has been successfully posted for resale.
-	Fixed the appearance of login button on Events List View when the current logged in account does not have any tickets.

### Changes (08/24/17 Release 1.0.5)

-	Updated the main login screen and added a button for user to create new account or reset password.
-	Fixed a bug related to SDK hanging during the login flow.

### Changes (08/22/17 Release 1.0.4)

-	Added some safety checks to avoid some crashes during Login flow.
-	Handled case for events that don’t have date and have TBD or some date override text.

### Changes (08/18/17 Release 1.0.3)

-	Fixed issue related to grouping of ticket card when multiple tickets are transferred together.
-	Fixed another issue related to missing tickets from Transfer Group Selection View.

### Changes (08/17/17 Release 1.0.2)

-	Fixed issue related to missing tickets from Transfer Group Selection View.

### Changes (08/11/17 Release 1.0.1)

-	Added support to Add to Apple Wallet for ticket passes.
-	Added support for html tags in Accept Terms of Use screen.
-	Fixed couple of bugs while Adding and Editing deposit account.
-	Fixed issue related to handling of “Session Expired” error.
{% endcapture %}

{% capture Android_changelog %}
### Changes(01/31/2018 Release 1.5.0)
- Created a Sample App for clients and integrators to easily demo the SDK.
- Updated Experience SDK version to 5.0.3 that includes loading spinner fix.
- Added local in-app notifications to alert user if tickets could not be refreshed.
- Identity Host Login to enable future support of social logins, such as Facebook.
- Added a new getMemberInfo() method that can be used to fetch logged in member information.
- Fixed an issue related to empty screen being displayed (due to device no-network) on the app launch when user already has cached information.
- Fixed a crash during cancel transfer flow.
- Fixed a crash that could occur during seat selection in posting and transfer flow.
- Experience SDK deep link removed to no longer force the app selection prompt for links.
- Minor bug fixes and improvements in ticket caching logic and counters.

### Changes (01/09/2018 Release 1.4.1)
- Add new method for fetching the access token for Host and Archtics.
- Add Experience SDK SSO Pinless Feature to disable pin prompt within add, return, and upgrade buttons.
- Bug fixes and performance enhancements.

### Changes (12/05/2017 Release 1.4.0)
- Added support for prefetching all tickets in background so barcodes are accessible even in offline mode.
- Added support for VIP color and text.
- Added option to choose between Dark and Light theme for the SDK that works together with configured branding color.
- Added support for API level 26 (Android 8.0).
- Added a new method for accessing SDK's version number.
- Made Add to Android Pay button more accessible by making it available on both front and back of ticket card.
- Fixed the background color of Event List View and made it opaque.
- Made some overall improvements and fixed some critical bugs.

### Changes (11/21/2017 Release 1.3.1)
- Fixed experience sdk integration issues.
- Fixed experience button menu missing after second time the ticket view is visited.

### Changes (11/06/2017 Release 1.3.0)
- Experience sdk integration
- Android wallet support
- Main login entry screen change
- Fixed potential resource naming collision issue with client projects. All presence sdk resources are named with “presence_sdk_” prefix.
- Bug fixes for master card and branding coloring support for action bar


### Changes (10/16/2017 Release 1.2.0)

- Added support for entering verification code for linking TMR account for
- Fixed seat description selection for posting flow for Archtics
- Fixed intermittent logout issue
- Separated the login flow from main SDK so it can just be used for login and fetching valid access token.
- Fixed other in-field issues

### Changes (10/05/2017 Release 1.1.1)

-	Added support for choosing between different payout methods during Resale flow for Archtics.

### Changes (09/29/2017 Release 1.1.0)

-	Added support for Apigee and made integration with SDK much simpler.
-	Added support for seat selection in Transfer and Resale flow.
-	Added 3 new helper methods for checking login status
-	Fixed few minor issues in the SDK.

### Changes (09/13/2017 Release 1.0.0)

-	Resolved login issue of getting stuck in log-in screen after logging in and clicking “authorize” button.
-	Resolved login issue of getting 401 status when clicking on an event
-	Handled session expiry error
-	Fixed crashlytics crashes
-	Fixed crash due to multiple loading of TmxMainView
-	Fixed missing seats at group selection view in transfer/resale flow
-	Fixed in-field crash/issues
-	Fixed edit resale operation with 4 digit price
-	Added forgot password on log-in UI (08/24/2017)
-	Fixed duplicate ticket card in listing pending state (09/05/2017)
-	Added price breakdown in ticket details (09/05/2017)
-	Supported upsell items (09/05/2017)
-	Fixed payment account delete operation failure in concurrent log-in scenario (09/05/2017)
-	Restored barcode immediately after resale/transfer cancel (09/12/2017)
-	Fix to automatically refresh the event list view once user logs in to second server (09/12/2017)
-	Bundle and unbundle multi tickets resale or transfer operations (09/12/2017)
-	Added support for password recovery for teams still on old account manager (09/13/2017)

{% endcapture %}

{% capture iOS_sdk %}
[Download](/products-and-docs/sdks/presence/ios/PresenceSDK+ExperienceSDK-Swift4.0.0-Version1_5_0.zip) Presence SDK iOS - Swift 4.0.0 .

[Download](/products-and-docs/sdks/presence/ios/PresenceSDK+ExperienceSDK-Swift3.1-Version1_5_0.zip) Presence SDK iOS - Swift 3.1.
{% endcapture %}

{% capture Android_sdk %}
[Download](/products-and-docs/sdks/presence/android/Android Presence SDK - Version 1_5_0 .zip)  Presence SDK Android.
{% endcapture %}

{: .article}
# Presence SDK 

The Ticketmaster Presence SDK provides a simple way to add Ticketmaster features in your 3rd party iOS and Android apps
{: .lead .article}

## SDK
{: .article }

<div class="col-lg-12 config-block">
<form accept-charset="UTF-8" class="main-widget-config-form common_tabs" method="post" autocomplete="off">

    <!--Use for mobile devices 'Go' button-->
    <button type="submit" class="hidden"></button>

    <ul class="nav nav-tabs" data-tabs="tabs">
        <li class="active">
            <a href="#sdk-ios" data-toggle="tab" aria-expanded="true">iOS</a>
        </li>
        <li class="">
            <a id="js_styling_nav_tab" href="#sdk-android" data-toggle="tab" aria-expanded="false">Android</a>
        </li>
    </ul>

    <div class="tab-content" style="padding-top: 0px;">
        <!-- iOS Tab -->
        <div class="tab-pane fade active in" id="sdk-ios">
          {{ iOS_sdk | markdownify }}          
        </div>
        
        <!-- Android Tab -->
        <div class="tab-pane fade" id="sdk-android">
          {{ Android_sdk | markdownify }}
        </div>

    </div>

</form>
</div>

## Sample App
{: .article }

The Sample App empowers clients and integrators to easily demo the newest version of the Presence SDK on their Mobile Phones.

Check out new features, understand expected functionality, and even experiment with color schemes to customize the SDK for your particular app: no developer resources required!

<div class="col-lg-12 config-block">
<form accept-charset="UTF-8" class="main-widget-config-form common_tabs" method="post" autocomplete="off">

    <!--Use for mobile devices 'Go' button-->
    <button type="submit" class="hidden"></button>

    <ul class="nav nav-tabs" data-tabs="tabs">
        <li class="active">
            <a href="#sampleapp-ios" data-toggle="tab" aria-expanded="true">iOS</a>
        </li>
        <li class="">
            <a id="js_styling_nav_tab" href="#sampleapp-android" data-toggle="tab" aria-expanded="false">Android</a>
        </li>
    </ul>

    <div class="tab-content" style="padding-top: 0px;">
        <!-- iOS Tab -->
        <div class="tab-pane fade active in" id="sampleapp-ios">
          {{ iOS_sampleapp | markdownify }} 
          <a class="button button-blue" href="/products-and-docs/tutorials/sample-apps/presenceSDK_sampleApp/iOS/">Learn more and Download</a>     
        </div>
        
        <!-- Android Tab -->
        <div class="tab-pane fade" id="sampleapp-android">
          {{ Android_sampleapp | markdownify }}
          <a class="button button-blue" href="/products-and-docs/tutorials/sample-apps/presenceSDK_sampleApp/android/">Learn more and Download</a>
        </div>

    </div>
</form>
</div>

## What You Need
{: .article }

<div class="col-lg-12 config-block">
<form accept-charset="UTF-8" class="main-widget-config-form common_tabs" method="post" autocomplete="off">

    <!--Use for mobile devices 'Go' button-->
    <button type="submit" class="hidden"></button>

    <ul class="nav nav-tabs" data-tabs="tabs">
        <li class="active">
            <a href="#whatyouneed-ios" data-toggle="tab" aria-expanded="true">iOS</a>
        </li>
        <li class="">
            <a id="js_styling_nav_tab" href="#whatyouneed-android" data-toggle="tab" aria-expanded="false">Android</a>
        </li>
    </ul>

    <div class="tab-content" style="padding-top: 0px;">
        <!-- iOS Tab -->
        <div class="tab-pane fade active in" id="whatyouneed-ios">
					{{ iOS_whatyouneed | markdownify }}          
        </div>
        
        <!-- Android Tab -->
        <div class="tab-pane fade" id="whatyouneed-android">
					{{ Android_whatyouneed | markdownify }}
        </div>

    </div>
</form>
</div>


## Reference and Integration Guides
Here you can learn how to integrate the Presence SDK into your application. In addition, you will find a reference guide for methods to customize your integration, analytics, and release information for when you app is ready to be publish to the Apple App or Google Play store.
{: .lead .article}
<div class="col-lg-12 config-block">
<form accept-charset="UTF-8" class="main-widget-config-form common_tabs" method="post" autocomplete="off">

    <!--Use for mobile devices 'Go' button-->
    <button type="submit" class="hidden"></button>

    <ul class="nav nav-tabs" data-tabs="tabs">
        <li class="active">
            <a href="#guides_ios" data-toggle="tab" aria-expanded="true">iOS</a>
        </li>
        <li class="">
            <a id="js_styling_nav_tab" href="#guides_android" data-toggle="tab" aria-expanded="false">Android</a>
        </li>
    </ul>

    <div class="tab-content" style="padding-top: 0px;">
        <!-- iOS Tab -->
        <div class="tab-pane fade active in" id="guides_ios">
          {{ iOS_guides | markdownify }}          
        </div>
        
        <!-- Android Tab -->
        <div class="tab-pane fade" id="guides_android">
          {{ android_guides | markdownify }}
        </div>

    </div>

</form>
</div>


## Change log
{: .article }

<div class="col-lg-12 config-block">
<form accept-charset="UTF-8" class="main-widget-config-form common_tabs" method="post" autocomplete="off">

    <!--Use for mobile devices 'Go' button-->
    <button type="submit" class="hidden"></button>

    <ul class="nav nav-tabs" data-tabs="tabs">
        <li class="active">
            <a href="#changelog-ios" data-toggle="tab" aria-expanded="true">iOS</a>
        </li>
        <li class="">
            <a id="js_styling_nav_tab" href="#changelog-android" data-toggle="tab" aria-expanded="false">Android</a>
        </li>
    </ul>

    <div class="tab-content" style="padding-top: 0px;">
        <!-- iOS Tab -->
        <div class="tab-pane fade active in" id="changelog-ios">
					{{ iOS_changelog | markdownify }}          
        </div>
        
        <!-- Android Tab -->
        <div class="tab-pane fade" id="changelog-android">
					{{ Android_changelog | markdownify }}
        </div>

    </div>
</form>
</div>

<script>
  (function(){
      $(document).ready(function(){
        $('.nav.nav-tabs').on('click', 'li', function(e) {
            var tabIndex = $(this).index();
            var scrollTop = $(this).offset().top;
            $('.nav.nav-tabs li').removeClass('active');
            $('.tab-pane.fade.active.in').removeClass('active in');
            $('.nav.nav-tabs').each(function(i){
            $('.nav.nav-tabs').eq(i).find('li').eq(tabIndex).addClass('active');
            $('.nav.nav-tabs').eq(i).next().children('.tab-pane').eq(tabIndex).addClass('active in');
          });
        });
      });
   }());
</script>


