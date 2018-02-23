---
layout: documentation-single
categories:
- documentation
- sdks
- presence-sdk-integrate
- android

title: Android Presence SDK Reference and Integration Guide

img: "/assets/img/tutorial/presenceSDKSampleApp/presenceSampleApp.png"

link: "/products-and-docs/sdks/presence-sdk/android/index.html"

announcement: "Integrating the Presence SDK into your Android app is fast and simple."

tags: 
  - PresenceSDK
  - Android

excerpt: Demo the newest version of the Presence SDK!
---

# Android Presence SDK Integration Guide
## Download
[Download](/products-and-docs/sdks/presence/android/Android Presence SDK - Version 1_5_0 .zip)  Presence SDK Android.

## What You Need
To integrate Presence SDK in your application, you will need the latest release of the Presence SDK for Android (.aar).

### Requirements

- Supported API level 16 ~ 26.
- Only Portrait Orientation Supported.

## Importing The SDK
Follow these simple steps to integrate and configure the SDK.
{: .lead .article}

Step 1. Drop Presence sdk file in your application project libs folder

Step 2. Import it through “File -> New -> New Module -> Import .JAR / .AAR package”. Specify and locate the Presence sdk aar file.

![PresenceSDK Android Step 1](/assets/img/products-and-docs/PresenceSDK-Android-Step-1.png)

![PresenceSDK Android Step 2](/assets/img/products-and-docs/PresenceSDK-Android-Step-1-2.png)

Step 3. Go to your app module build gradle file and set the name of each aar file as compile dependencies as follows:

{% highlight java %}
compile project(':PresenceSDK-release-1.5.0.0')
{% endhighlight %}

Step 4. Add the following dependencies in the same place as step #3:

{% highlight java %}
compile 'com.android.support:cardview-v7:25.3.1'
compile 'com.android.support:appcompat-v7:25.3.1'
compile 'com.android.support:support-v4:25.3.1'
compile 'com.android.support:recyclerview-v7:25.3.1'
compile 'com.android.support:design:25.3.1'
compile 'com.android.volley:volley:1.0.0'
compile 'com.google.code.gson:gson:2.4'
compile 'com.squareup.picasso:picasso:2.5.2'
compile 'com.romandanylyk:pageindicatorview:0.0.5'
compile 'com.google.zxing:core:3.2.1'
compile 'com.android.support:percent:25.3.1'
compile 'org.apache.httpcomponents:httpclient-android:4.3.5.1'
{% endhighlight %}

After adding them, the build gradle dependencies will look similar to the one shown as below:

![PresenceSDK Android Step 4](/assets/img/products-and-docs/PresenceSDK-Android-Step-1-4.png)

Step 5. Add tools:replace for theme and label in AndroidManifest.xml file as follow:

{% highlight html %}
<application
android:allowBackup="true"
android:icon="@mipmap/ic_launcher"
android:label="@string/app_name"
android:roundIcon="@mipmap/ic_launcher_round"
android:supportsRtl="true"
android:testOnly="false"
android:theme="@style/AppTheme"
tools:replace="android:theme, android:label">

{% endhighlight %}

Step 6. Create a configurePresenceSDK() method inside your activity class. In this method, the account credentials and branding color will be configured. Call method `launchPresenceSDK`, to be discussed in step 7, inside the `onPresenceSdkConfigSuccessful` listener method.

{% highlight java %}
private void configurePresenceSDK() {
  PresenceSDK.getPresenceSDK(getApplicationContext()).setConfig(consumerKey /*Consumer key provided on dev portal*/, 
    displayName /*your team display name */, 
    useNewAccountManager, /*true/false for choosing between new or old account manager, by default it will choose old accounts manager */
    new PresenceSdkConfigListener () {
    @Override
    public void onPresenceSdkConfigSuccessful() {
      launchPresenceSDK();
    }

    @Override
    public void onPresenceSdkConfigFailed(String errorMessge) {
      log.e(TAG,”Error configuring presence sdk”);
    }
  });


  // Configure your branding color for the SDK
  //opaque red
  PresenceSDK.getPresenceSDK(getApplicationContext()).setBrandingColor(
  Color.parseColor("#ffff0000"));
}

{% endhighlight %}

**NOTE:**

1. Be aware that you need to pass application context object (not activity context) to PresenceSDK.getPresenceSDK() method. If it is not an application context, the presence sdk might reject and throw a runtime exception with a message to bring it to developer’s attention.

2. To get consumer key please create an account on [https://developer.ticketmaster.com](https://developer.ticketmaster.com) and register your app and it will generate a consumer key that can be used in the above method. Before you can use Presence SDK you will have to provide the generated consumer key together with consumer secret and redirect URI to Presence SDK support team so we can configure your app on our end!


Step 7.  Create launchPresenceSDK() method inside the same activity class. In this method, you will implement a login listener and start the presence sdk. 

**NOTE:** Guide to setting up a framelayout (`R.id.presenceSDK`) used in the example below can be found under **Setting up the views** section.

{% highlight java %}
private void launchPresenceSDK() {
  PresenceSDK.getPresenceSDK(getApplicationContext()).start(this,
    R.id.presenceSDK /*the id of the framelayout defined in activity layout where you want to load PresenceSDK UI fragment */
    , new TMLoginListener() {
        @Override
        public void onLoginSuccessful(TMLoginApi.BackendName backendName, String accessToken) {
          Log.i(TAG, "Inside onLoginSuccessful");
        }

        @Override
        public void onLoginFailed(TMLoginApi.BackendName backendName, String errorMessage) {
          Log.i(TAG, "Inside onLoginFailed");
        }

        @Override
        public void onLoginCancelled(TMLoginApi.BackendName backendName) {
          Log.i(TAG, "Inside onLoginCancelled");
        }

        @Override
        public void onLoginMethodUsed(TMLoginApi.BackendName backendName, TMLoginApi.LoginMethod method) {
          Log.i(TAG, "Inside onLoginMethodUsed");
        }

        @Override
        public void onLoginForgotPasswordClicked(TMLoginApi.BackendName backendName) {
          Log.i(TAG, "Inside onLoginForgotPasswordClicked");
        }

        @Override
        public void onCacheCleared() {
          Log.i(TAG, "Inside onCacheCleared");
        }

        @Override
        public void onMemberUpdated(@Nullable TMLoginApi.MemberInfo member) {
          Log.i(TAG, "Inside onMemberUpdated");
        }

        @Override
        public void onLogoutSuccessful(TMLoginApi.BackendName backendName) {
          Log.i(TAG, "Inside onLogoutSuccessful")
        }

        @Override
        public void onLogoutAllSuccessful() {
          Log.i(TAG, "Inside onLogoutAllSuccessful")
        }
		  });
}

{% endhighlight %}

**NOTE:** 

You need to have a hosting activity layout where you need to add a 	framelayout to hold Presence sdk entry 	fragment. So, you will need to use the 	correct id of the framelayout specified in PresenceSDK.start() method. See code 	comment above.

Step 8. Create configureExperienceSDK() method inside the same activity class. In this method, you will configure about experience sdk.
	
Here is the sample code about how to set experience sdk wrapper object and set it to presence sdk.

{% highlight java %}
private void configureExperienceSDK() {
  // specify these parameters to integrate ExperienceSDK
  // and pass them into PresenceSDK
  // this will NOT crash if no ExperienceSDK lib provided
  // presenceSDK.start() will check the availability of ExperienceSDK lib
  // setSsoSigningKey() is optional, allows to use Pinless Feature
  // to disable pin prompt within add, return, and upgrade buttons.
  ExperienceConfiguration wrapper = new ExperienceConfiguration.Builder()
    .setAppId("yourAppId")
    .setAppName("yourAppName")
    .setApiKey("yourApiKey")
    .setAppSource("yourAppSource")
    .setSubdomain("subdomainForYourApp")
    .setSsoSigningKey("yourSsoSigningKey")
    .setDevServers(false)
    .build();
  
    // presenceSDK is an class property 
    // presenceSDK = PresenceSDK.getPresenceSDK(getApplicationContext())
    presenceSDK.setExperienceConfiguration(wrapper);
}
{% endhighlight %}

Step 9. Call the configurePresenceSDK() and configureExperienceSDK() methods in the activity class onCreate() method.

{% highlight java %}
@Override
protected void onCreate(Bundle savedInstanceState) {
  super.onCreate(savedInstanceState);
  // set layout where you want to load presence sdk login entry view
  setContentView(R.layout.activity_main); 
  // configure experience sdk
  configureExperienceSDK();
// call configure presence sdk method
  configurePresenceSDK();
}

{% endhighlight %}

This will load the entry fragment (UI shown below) where a login screen will be prompted to users to choose Ticketmaster or Team Account to login. 

![PresenceSDK Android Step 7](/assets/img/products-and-docs/PresenceSDK-Android-Step-1-7.png)

Step 10. Define the “AppTheme” style in styles.xml as follows:

{% highlight html %}
<style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
{% endhighlight %}

Step 11: Try to build and compile. At this point, it should be compiled without errors.


## Setting Up the Views

### Configuring Your Layout View

Specify a layout view in your desired layout file, for now this layout should fill the whole screen
The ID for this layout will be referenced in the next step

{% highlight java %}
<android.support.constraint.ConstraintLayout
  android:id="@+id/presenceSDKView"
  android:layout_width="0dp"
  android:layout_height="0dp"
  android:layout_marginBottom="0dp"
  android:layout_marginEnd="0dp"
  android:layout_marginStart="0dp"
  android:layout_marginTop="0dp"
  app:layout_constraintBottom_toBottomOf="parent"
  app:layout_constraintEnd_toEndOf="parent"
  app:layout_constraintStart_toStartOf="parent"
  app:layout_constraintTop_toTopOf="parent"/>
{% endhighlight %}


# Android Presence SDK Reference Guide
## Specifying a Branding Color
Presence sdk clients can set their own branding theme color by defining this color value in their application resource “colors.xml” file:

{% highlight html %}
<color name="presence_sdk_color_branding">#FFAA81</color>
{% endhighlight %}

The defined color will be displayed on all action buttons, action bars and ticket details page. If the above color variable is not defined in the client’s apk project, Tmx sdk will use a default color.

Also, there is a way to change the color at run time.

{% highlight java %}
presenceSDK.getPresenceSDK(this).setBrandingColor(Color.parseColor("#ffff0000")); 
{% endhighlight %}

The defined color will be displayed on all action buttons, action bars and ticket details page. If the above color variable is not defined in the client’s apk project, Tmx sdk will use a default color.

### Configure Team Theme
Configure your team's theme as `PresenceSdkTheme.Light` (default) or `PresenceSdkTheme.Dark`. The theme configuration lets PresenceSDK
know how to setup various UI elements to contrast with branding color. For example, if branding 
color is in the dark color spectrum, a `Light` theme configuration will color various UI elements white.
This will allow crucial UI element to be visible to the user.
{% highlight java %}
/**
* Method to set content color of UI elements with branding background color
* @param theme - light theme uses white color, dark theme uses black color
*/
public void setTheme(PresenceSdkTheme theme)
{% endhighlight %}

## Logout Methods
You can implement log out functionality on your UI with by calling these API:

{% highlight java %}
// TM logout
PresenceSDK.getPresenceSDK(context).logOutHost();
// Team logout 
PresenceSDK.getPresenceSDK(context).logOutTeam();
// logout both
PresenceSDK.getPresenceSDK(context).logOut();
{% endhighlight %}

## Check Login Status
Presence SDK also provides some helper methods for checking if user is logged into any of the supported services.

{% highlight java %}
// Method to check if user is logged in any of the service  i.e Host or Accounts  Manger
PresenceSDK.getPresenceSDK(context).isLoggedIn();
// Method to check if user is logged in Host
PresenceSDK.getPresenceSDK(context).isLoggedIntoHost();
// Method to check if user is logged in Accounts Manager
PresenceSDK.getPresenceSDK(context).isLoggedIntoTeam();
{% endhighlight%}

## Global Methods
{% highlight java %}
  // This method returns version number of the SDK as a String.
  public String getVersionNumber()

  /**
  * To get access token for a particular backend specified.
  * guarantee that it will not expires in 15 min
  * @param backendName       Backend type (Host or Archtics)
  * @param loginListener     TMLoginListener object to call back about login
  * status and access token, if successful result. Cannot be null.
  */
  public void getAccessToken(@NonNull TMLoginApi.BackendName backendName, 
                                @NonNull TMLoginListener loginListener)
{% endhighlight %}


## Analytics
Presence SDK provides support for tracking user activity via its Analytics module.

For tracking user activity in the Presence SDK a separate class PresenceEventAnalytics is provided that lists all the user actions that are notified via local broadcast manager notifications together with the payload data.

Notification Events – You can observe these notifications to receive updates from Presence SDK.

{% highlight java %}
public static final class Action {

  /////////////////////////////////////////////////////////////////////////////////////////
  // UI events (Start)
  /////////////////////////////////////////////////////////////////////////////////////////
  public static final String ACTION_MYTICKETSCREENSHOWED = "com.ticketmaster.presencesdk.eventanalytic.action.MYTICKETSCREENSHOWED";
  public static final String ACTION_MANAGETICKETSCREENSHOWED = "com.ticketmaster.presencesdk.eventanalytic.action.MANAGETICKETSCREENSHOWED";
  public static final String ACTION_ADDPAYMENTINFOSCREENSHOWED = "com.ticketmaster.presencesdk.eventanalytic.action.ADDPAYMENTINFOSCREENSHOWED";
  public static final String ACTION_REVIEWPOSTINGSCREENSHOWED = "com.ticketmaster.presencesdk.eventanalytic.action.REVIEWPOSTINGSCREENSHOWED";
  public static final String ACTION_POSTINGCONFIRMATIONSCREENSHOWED = "com.ticketmaster.presencesdk.eventanalytic.action.POSTINGCONFIRMATIONSCREENSHOWED";
  public static final String ACTION_CANCELPOSTINGSCREENSHOWED = "com.ticketmaster.presencesdk.eventanalytic.action.CANCELPOSTINGSCREENSHOWED";
  public static final String ACTION_CANCELPOSTINGCONFIRMSCREENSHOWED = "com.ticketmaster.presencesdk.eventanalytic.action.CANCELPOSTINGCONFIRMSCREENSHOWED";
  public static final String ACTION_MYTICKETBARCODESCREENSHOWED = "com.ticketmaster.presencesdk.eventanalytic.action.MYTICKETBARCODESCREENSHOWED";
  public static final String ACTION_TICKETDETAILSSCREENSHOWED = "com.ticketmaster.presencesdk.eventanalytic.action.TICKETDETAILSSCREENSHOWED";
  public static final String ACTION_TICKETSTUBIMAGESHARED = "com.ticketmaster.presencesdk.eventanalytic.action.TICKETSTUBIMAGESHARED";

  /////////////////////////////////////////////////////////////////////////////////////////
  // UI events (End)
  /////////////////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////////////////////////
  // Business operation events (Start)
  /////////////////////////////////////////////////////////////////////////////////////////
  public static final String ACTION_TRANSFERINITIATED = "com.ticketmaster.presencesdk.eventanalytic.action.TRANSFERINITIATED";
  public static final String ACTION_TRANSFERCANCELLED = "com.ticketmaster.presencesdk.eventanalytic.action.TRANSFERCANCELLED";
  public static final String ACTION_TRANSFERACCEPTED = "com.ticketmaster.presencesdk.eventanalytic.action.TRANSFERACCEPTED";
  public static final String ACTION_RESALEINITIATED = "com.ticketmaster.presencesdk.eventanalytic.action.RESALEINITIATED";
  public static final String ACTION_RESALECANCELLED = "com.ticketmaster.presencesdk.eventanalytic.action.RESALECANCELLED";
  public static final String ACTION_RESALEUPDATED = "com.ticketmaster.presencesdk.eventanalytic.action.RESALEEDITED";
  /////////////////////////////////////////////////////////////////////////////////////////
  // Business operation events (End)
  /////////////////////////////////////////////////////////////////////////////////////////
}
{% endhighlight %}

Payload Data for the Notifications – Only relevant information is sent out with the notification.

{% highlight java %}
public static final class Data {

  // general data for event details, and ticket details
  public static final String EVENT_ID = "event_id";
  public static final String EVENT_NAME = "event_name";
  public static final String EVENT_DATE = "event_date";
  public static final String EVENT_IMAGE_URL = "event_image_url";
  public static final String EVENT_ORDER_ID = "event_order_id";
  public static final String VENUE_NAME = "venue_name";
  public static final String VENUE_ID = "venu_id";
  public static final String CURRENT_TICKET_COUNT = "current_ticket_count";
  public static final String EVENT_ARTIST_NAME = "artist_name";
  public static final String EVENT_ARTIST_ID = "artist_id";

  // data for transfer initiate event
  public static final String INITIATE_TRANSFER_TICKET_COUNT = "initiate_transfer_ticket_count";
  public static final String INITIATE_TRANSFER_TICKET_FACEVALUE = "initiate_transfer_ticket_facevalue";
  public static final String INITIATE_TRANSFER_TICKET_SERIALIZABLE = "initiate_transfer_ticket_serializable";

  // data for transfer cancel event
  public static final String CANCEL_TRANSFER_ID = "cancel_transfer_id";
  public static final String CANCEL_TRANSFER_ORDER_ID = "cancel_transfer_order_id";


  // data for resale initiate event
  public static final String INITIATE_RESALE_TICKET_COUNT = "initiate_resale_ticket_count";
  public static final String INITIATE_RESALE_PRICE = "initiate_resale_price";
  public static final String INITIATE_RESALE_TICKET_SERIALIZABLE = "initiate_resale_ticket_serializable";

  // data for resale update event
  public static final String UPDATE_RESALE_PRICE = "update_resale_price";
  public static final String UPDATE_RESALE_POSTING_ID = "update_resale_posting_id";

  // data for resale initiate and update events
  public static final String RESALE_BUYER_FEES = "resale_buyer_fees";
  public static final String RESALE_ORIGINAL_FACE_VALUE = "resale_original_face_value";
  public static final String RESALE_SELLER_PAYOUT = "resale_seller_payout";
  public static final String RESALE_SELLER_FEES = "resale_seller_fees";

  // data for resale cancel event
  public static final String CANCEL_RESALE_POSTING_ID = "cancel_resale_posting_id";

  //data for sharing image
  public static final String SHARE_TICKET_IMAGE_DIR = "share_ticket_image_path";
  public static final String SHARE_TICKET_IMAGE_FILENAME = "share_ticket_image_filename";
  public static final String SHARE_TICKET_EVENT_ID = "share_ticket_event_id";
  public static final String SHARE_TICKET_EVENT_NAME = "share_ticket_event_name";
}
{% endhighlight %}

## Analytics Usage

If you want to track ACTION_MANAGETICKETSCREENSHOWED event, you should register a local broadcast listener as below:

{% highlight java %}
IntentFilter analyticEventFilter = new IntentFilter();
analyticEventFilter.addAction(PresenceEventAnalytics.Action.ACTION_MYTICKETSCREENSHOWED);
LocalBroadcastManager.getInstance(MainActivity.this).registerReceiver(mAnalyticEventReceiver, analyticEventFilter);
{% endhighlight %}

You can implement receiver mAnalyticsEventReceiver as follows:

{% highlight java %}
private BroadcastReceiver mAnalyticEventReceiver = new BroadcastReceiver() {
  @Override
  public void onReceive(Context context, Intent intent) {

    if (PresenceEventAnalytics.Action.ACTION_MYTICKETSCREENSHOWED.equals(intent.getAction())) {
      Toast.makeText(MainActivity.this, "Analytic Event: My tickets screen showed.", Toast.LENGTH_LONG).show();
    }
  }
};
{% endhighlight %}


## Release
No additional actions required.

